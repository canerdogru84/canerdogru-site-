import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { upsertContact } from "@/lib/brevo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const ad_soyad = clean(body.ad_soyad, 120);
  const telefon = clean(body.telefon, 40);
  const eposta = clean(body.eposta, 160);
  const web_sitesi = clean(body.web_sitesi, 200);
  const instagram = clean(body.instagram, 80);
  const reklam_butcesi = clean(body.reklam_butcesi, 40);
  const kaynak = clean(body.kaynak, 40) || "rontgen";
  // CAPI eşleştirme verisi: tarayıcıdaki fbq('track','Lead',...,{eventID}) ile aynı id.
  // n8n [SABLON] 02 bu satırı okuyup Meta'ya sunucu tarafı olayını gönderiyor;
  // aynı event_id sayesinde Meta ikisini tek olay sayar (çift sayım yok).
  const event_id = clean(body.event_id, 64);

  // --- Doğrulama ---
  if (ad_soyad.length < 2) {
    return NextResponse.json({ error: "Lütfen ad soyad girin." }, { status: 422 });
  }
  const digits = telefon.replace(/\D/g, "");
  if (digits.length < 10) {
    return NextResponse.json(
      { error: "Lütfen geçerli bir telefon numarası girin." },
      { status: 422 }
    );
  }
  if (!emailRe.test(eposta)) {
    return NextResponse.json(
      { error: "Lütfen geçerli bir e-posta adresi girin." },
      { status: 422 }
    );
  }
  // Bütçe yalnızca bilgi amaçlı; hiçbir seçim reddedilmez.

  const supabase = getSupabaseServer();
  if (!supabase) {
    // Env değerleri girilmemiş — geliştirici için net mesaj.
    return NextResponse.json(
      {
        error:
          "Form altyapısı henüz yapılandırılmadı. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 503 }
    );
  }

  // Meta'nın kişiyi eşleştirebilmesi için gereken sinyaller. Çerezler tarayıcıdan,
  // IP ve user-agent istek başlıklarından gelir — bunlar hash'lenmeden gönderilir (Meta böyle ister).
  // Vercel arkasında gerçek IP x-forwarded-for'un İLK değeridir; sonrakiler proxy zinciri.
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieOku = (ad: string) =>
    cookieHeader.match(new RegExp("(?:^|;\\s*)" + ad + "=([^;]+)"))?.[1] || null;

  const { error } = await supabase.from("basvurular").insert({
    ad_soyad,
    telefon,
    eposta,
    web_sitesi: web_sitesi || null,
    instagram: instagram || null,
    reklam_butcesi,
    kaynak,
    event_id: event_id || null,
    event_source_url: req.headers.get("referer") || null,
    client_ip_address: ip,
    client_user_agent: req.headers.get("user-agent") || null,
    fbp: cookieOku("_fbp"),
    fbc: cookieOku("_fbc"),
  });

  if (error) {
    console.error("[lead insert]", error.message);
    return NextResponse.json(
      { error: "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  // Brevo: röntgen başvurusunu listeye ekle (e-posta gönderilmez). Best-effort.
  const listId = Number(process.env.BREVO_LIST_RONTGEN) || undefined;
  const [firstName, ...rest] = ad_soyad.split(" ");
  const contact = await upsertContact({
    email: eposta,
    firstName,
    lastName: rest.join(" ") || undefined,
    phone: telefon,
    listId,
  });
  if (!contact.ok && contact.error !== "disabled")
    console.error("[lead brevo contact]", contact.error);

  return NextResponse.json({ ok: true }, { status: 201 });
}
