import { NextResponse } from "next/server";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase";
import { upsertContact } from "@/lib/brevo";
import { e164TR } from "@/lib/telefon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * cal.com webhook → basvurular (14 Eki 2026).
 *
 * 50K+ bütçeli başvuru formda Supabase'e YAZILMAZ; kişi takvimden saat seçince
 * cal.com bu uca BOOKING_CREATED gönderir ve lead O ZAMAN oluşur. Saat seçmeden
 * çıkan kişi başvuru sayılmaz (Telegram'a düşmez, Röntgen üretilmez).
 * Form verisi (web, IG, bütçe, kaynak, UTM, reklam kodu, piksel event_id) cal.com
 * URL'sine metadata[...] olarak eklenir (components/Takvim.tsx) ve burada
 * payload.metadata'dan okunur. Eşik altı yol değişmedi: /api/lead.
 *
 * cal.com tarafı: Ayarlar → Geliştirici → Web kancaları → yeni; abone URL
 * https://canerdogru.com/api/randevu, olaylar "Rezervasyon oluşturuldu / yeniden
 * planlandı / iptal edildi", gizli anahtar = Vercel env CALCOM_WEBHOOK_SECRET.
 * İmza: x-cal-signature-256 = HMAC-SHA256(gövde).
 * Yeniden planlama → randevu_at güncellenir; iptal → randevu_durum='iptal' (lead
 * silinmez, Caner panelde görür). Flowlattice'in kancası ayrıca "toplantı bitti /
 * no-show" dinler; o Flowlattice asistan tablosu için, burada gerek yok.
 * Flowlattice'in n8n kancası (rapor-randevu) ayrı ve dokunulmadı.
 */

/**
 * Anon anahtar RLS gereği yalnız INSERT yapabilir (return=minimal); SELECT/UPDATE yok.
 * Tekrar kontrolü ve yeniden planlama/iptal güncellemesi için servis anahtarı gerekir:
 * Vercel env SUPABASE_SERVICE_ROLE_KEY (yalnız bu uçta, sunucuda; istemciye sızmaz).
 * Yoksa insert anon'la gider, güncellemeler atlanır ve loglanır.
 */
function supabaseYazici() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const servis = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && servis) {
    return {
      sb: createClient(url, servis, { auth: { persistSession: false, autoRefreshToken: false } }),
      tam: true,
    };
  }
  const sb = getSupabaseServer();
  return sb ? { sb, tam: false } : null;
}

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function imzaDogru(govde: string, imza: string | null, gizli: string): boolean {
  if (!imza) return false;
  const beklenen = createHmac("sha256", gizli).update(govde).digest("hex");
  const a = Buffer.from(beklenen, "utf8");
  const b = Buffer.from(imza.trim(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const gizli = process.env.CALCOM_WEBHOOK_SECRET || "";
  if (!gizli) {
    console.error("[randevu] CALCOM_WEBHOOK_SECRET yok — kanca reddedildi");
    return NextResponse.json({ error: "Kanca yapılandırılmadı." }, { status: 503 });
  }

  const govde = await req.text();
  if (!imzaDogru(govde, req.headers.get("x-cal-signature-256"), gizli)) {
    return NextResponse.json({ error: "İmza geçersiz." }, { status: 401 });
  }

  let body: { triggerEvent?: string; payload?: Record<string, unknown> };
  try {
    body = JSON.parse(govde);
  } catch {
    return NextResponse.json({ error: "Geçersiz gövde." }, { status: 400 });
  }
  const olay = body.triggerEvent || "";
  const p = (body.payload || {}) as {
    uid?: string;
    rescheduleUid?: string;
    startTime?: string;
    attendees?: { name?: string; email?: string; phoneNumber?: string }[];
    responses?: Record<string, { value?: unknown }>;
    metadata?: Record<string, unknown>;
  };

  // Yeniden planlama / iptal: var olan satırı güncelle (randevu_uid, yoksa e-posta ile).
  // Sütunlar sql/s24 ile açılır; yoksa 200 dön ama logla — kanca pasife düşmesin.
  if (olay === "BOOKING_RESCHEDULED" || olay === "BOOKING_CANCELLED") {
    const y = supabaseYazici();
    if (!y) return NextResponse.json({ ok: true, atlandi: "supabase-yok" });
    if (!y.tam) {
      console.error("[randevu güncelle] SUPABASE_SERVICE_ROLE_KEY yok — " + olay + " atlandı", p.uid);
      return NextResponse.json({ ok: true, atlandi: "servis-anahtari-yok" });
    }
    const supabase = y.sb;
    const eskiUid = p.rescheduleUid || p.uid || "";
    const eposta = String(p.attendees?.[0]?.email || "").toLowerCase();
    const guncelle =
      olay === "BOOKING_RESCHEDULED"
        ? { randevu_at: p.startTime || null, randevu_uid: p.uid || eskiUid, randevu_durum: "yeniden" }
        : { randevu_durum: "iptal" };
    let q = supabase.from("basvurular").update(guncelle);
    q = eskiUid ? q.eq("randevu_uid", eskiUid) : q.eq("eposta", eposta).eq("rontgen_hat", "takvim");
    const { error: gErr } = await q;
    if (gErr) console.error("[randevu güncelle]", olay, gErr.message);
    return NextResponse.json({ ok: true, olay, guncellendi: !gErr });
  }

  // cal.com "ping" testi ve diğer olaylar: 200 dön, yoksa kanca pasife düşer.
  if (olay !== "BOOKING_CREATED" || !body.payload) {
    return NextResponse.json({ ok: true, atlandi: olay || "bos" });
  }
  const meta = (p.metadata || {}) as Record<string, unknown>;
  const yanit = (k: string) => {
    const v = p.responses?.[k]?.value;
    return typeof v === "string" ? v : "";
  };
  const katilimci = p.attendees?.[0] || {};

  const ad_soyad = clean(yanit("name") || katilimci.name, 120);
  const eposta = clean(yanit("email") || katilimci.email, 160).toLowerCase();
  const telefon = e164TR(
    clean(yanit("smsReminderNumber") || yanit("attendeePhoneNumber") || katilimci.phoneNumber || meta.telefon, 40)
  );
  const web_sitesi = clean(meta.web, 200);
  const instagram = clean(meta.ig, 80);
  // Formdan gelmeyen doğrudan cal.com rezervasyonu: bant bilinmez, yine de takvim hattı.
  const reklam_butcesi = clean(meta.butce, 40) || "belirsiz";
  const kaynak = clean(meta.kaynak, 40) || "rontgen";
  const pazarlama_izni = meta.izin === "1" || meta.izin === "true";
  const reklam_kodu = clean(meta.reklam_kodu, 60);
  const utm_source = clean(meta.utm_source, 60);
  const utm_medium = clean(meta.utm_medium, 60);
  const utm_campaign = clean(meta.utm_campaign, 100);
  const ilk_referrer = clean(meta.ilk_referrer, 300);
  // Tarayıcıdaki fbq Lead olayı (LeadForm, randevu anında) ile aynı kimlik → CAPI tekilleştirme.
  const event_id = clean(meta.event_id, 64) || randomUUID();
  const event_source_url = clean(meta.sayfa, 300) || null;

  if (!ad_soyad || !eposta) {
    console.error("[randevu] ad/e-posta eksik", p.uid);
    return NextResponse.json({ ok: true, atlandi: "kimlik-eksik" });
  }

  const y = supabaseYazici();
  if (!y) {
    return NextResponse.json({ error: "Form altyapısı yapılandırılmadı." }, { status: 503 });
  }
  const supabase = y.sb;

  // cal.com kancayı yeniden deneyebilir (yalnız 2xx dışı yanıtta): aynı rezervasyon
  // uid'si zaten yazıldıysa ikinci satır açma. SELECT için servis anahtarı gerekir.
  if (y.tam && p.uid) {
    const { data: varOlan } = await supabase
      .from("basvurular")
      .select("id")
      .eq("randevu_uid", p.uid)
      .limit(1);
    if (varOlan && varOlan.length) {
      return NextResponse.json({ ok: true, tekrar: true, id: varOlan[0].id });
    }
  }

  const simdi = new Date().toISOString();
  // 14 Eki 2026: insert'ten sonra .select() YOK — anon rolünde SELECT politikası
  // olmadığı için RETURNING "row-level security" hatasıyla tüm insert'i düşürüyordu
  // (ilk canlı test). Randevu alanları satırla birlikte yazılır (sql/s24).
  const { error } = await supabase
    .from("basvurular")
    .insert({
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
      kanal_izlendi: true,
      event_id,
      event_source_url,
      // Randevu alındı → hat belli; eşik altı onay kapısı (n8n 12) bu satıra bakmaz.
      rontgen_hat: "takvim",
      hat_karar_at: simdi,
      hat_karar_veren: "calcom",
      randevu_at: p.startTime || simdi,
      randevu_uid: p.uid || null,
      randevu_durum: "olusturuldu",
    });

  if (error) {
    console.error("[randevu insert]", error.message);
    return NextResponse.json({ error: "Kayıt sırasında sorun oluştu." }, { status: 500 });
  }

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
    console.error("[randevu brevo contact]", contact.error);

  return NextResponse.json({ ok: true, uid: p.uid || null }, { status: 201 });
}
