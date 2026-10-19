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
  // Ayrı, işaretsiz onay kutusu (TR-41). false ise pazarlama dizisine alınmaz (sql/s18).
  const pazarlama_izni = body.pazarlama_izni === true;
  // Çerez reddi/seçimsiz: Meta eşleştirme sinyalleri (IP, UA, fbp, fbc) hiç yazılmaz,
  // n8n 02 CAPI yalnız cerez_izni=true satırı gönderir (20 Eki 2026, KVKK).
  const cerez_izni = body.cerez_izni === true;
  // utm_content — hangi reklam kreatifinin getirdiği (örn. TOFU-MOB-1).
  // Sektör `kaynak` alanında; bu alan sektörün İÇİNDEKİ açıyı ayırır.
  const reklam_kodu = clean(body.reklam_kodu, 60);
  // Geliş kanalı: UTM üçlüsü + ilk dış referrer. UTM'siz gelişi (Google, ChatGPT,
  // Instagram profili) ayıran tek sinyal referrer. Sınıflandırma sql/s15 görünümünde.
  const utm_source = clean(body.utm_source, 60);
  const utm_medium = clean(body.utm_medium, 60);
  const utm_campaign = clean(body.utm_campaign, 100);
  const ilk_referrer = clean(body.ilk_referrer, 300);
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
  // Röntgen incelenecek varlık ister: web sitesi ya da Instagram'dan en az biri.
  // İstemci de kontrol eder; burası doğrudan API çağrısı / eski sekme için son kapı.
  if (!web_sitesi && !instagram) {
    return NextResponse.json(
      { error: "Web sitesi ya da Instagram kullanıcı adından en az birini yazın." },
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
    pazarlama_izni,
    kaynak,
    reklam_kodu: reklam_kodu || null,
    utm_source: utm_source || null,
    utm_medium: utm_medium || null,
    utm_campaign: utm_campaign || null,
    ilk_referrer: ilk_referrer || null,
    // Boş UTM + boş referrer artık "doğrudan giriş" demek, "bilinmiyor" değil.
    kanal_izlendi: true,
    event_id: event_id || null,
    event_source_url: req.headers.get("referer") || null,
    cerez_izni,
    client_ip_address: cerez_izni ? ip : null,
    client_user_agent: cerez_izni ? req.headers.get("user-agent") || null : null,
    fbp: cerez_izni ? cookieOku("_fbp") : null,
    fbc: cerez_izni ? cookieOku("_fbc") : null,
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
