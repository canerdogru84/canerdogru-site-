import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Satış motoru olay girişi → Modal `leadadmedia-olay-isle` (18 Eki 2026).
 *
 * Neden var: Modal adresi `canerdogru84--leadadmedia-olay-isle-uclar.us-east.modal.run`
 * çift tire içeriyor; Brevo'nun URL denetimi bunu "geçersiz" sayıyor. Servisler temiz
 * bir adrese yazsın diye: https://canerdogru.com/api/olay/<kaynak>
 *
 * Bu dosya DOĞRULAMA YAPMAZ, veri SAKLAMAZ, değiştirmez: gelen ham gövdeyi ve kimlik
 * başlıklarını olduğu gibi Modal'a iletir; asıl imza/şifre kontrolü, tekilleştirme ve
 * kayıt Modal'da (logic/olay.py). Modal yanıtı aynen döner → 4xx/5xx sağlayıcıya
 * yansır, sağlayıcı yeniden dener.
 *
 * Kimlik: tercih edilen yol sağlayıcının kimlik başlığı (Authorization: Bearer <şifre>,
 * cal.com için x-cal-signature-256). Başlık gönderemeyen sağlayıcı için yedek:
 * ?anahtar=<şifre> → Authorization: Bearer <şifre> olarak iletilir (URL'ler günlüğe
 * düşebilir; yalnız zorunluysa kullan).
 *
 * `site` kaynağı bilerek yok: kendi sitemizden gelen olaylar sunucu içinden Modal'a gider.
 * Env (isteğe bağlı): OLAY_ISLE_URL — varsayılan canlı Modal kökü.
 */

const KOK = "https://canerdogru84--leadadmedia-olay-isle-uclar.us-east.modal.run";
const KAYNAKLAR = new Set(["brevo", "calcom", "instantly"]);
const ILETILEN = ["authorization", "x-cal-signature-256", "content-type"];
const MAX_BAYT = 256 * 1024;

export async function POST(
  req: Request,
  ctx: { params: Promise<{ kaynak: string }> }
) {
  const { kaynak } = await ctx.params;
  if (!KAYNAKLAR.has(kaynak)) {
    return NextResponse.json({ hata: "kaynak_gecersiz" }, { status: 404 });
  }

  const ham = await req.arrayBuffer();
  if (ham.byteLength > MAX_BAYT) {
    return NextResponse.json({ hata: "govde_buyuk" }, { status: 413 });
  }

  const basliklar = new Headers();
  for (const ad of ILETILEN) {
    const v = req.headers.get(ad);
    if (v) basliklar.set(ad, v);
  }
  // Brevo "Token" kimliği Authorization'ı `Bearer x`, `Token x` ya da çıplak `x` gönderebilir;
  // Modal yalnız `Bearer x` bekler → şemayı normalleştir (şifre değeri değişmez).
  const yetki = basliklar.get("authorization");
  if (yetki) {
    const sifre = yetki.replace(/^(bearer|token)\s+/i, "").trim();
    if (sifre) basliklar.set("authorization", `Bearer ${sifre}`);
  }
  if (!basliklar.has("authorization")) {
    const anahtar = new URL(req.url).searchParams.get("anahtar");
    if (anahtar) basliklar.set("authorization", `Bearer ${anahtar}`);
  }
  if (!basliklar.has("content-type")) basliklar.set("content-type", "application/json");

  const kok = (process.env.OLAY_ISLE_URL || KOK).replace(/\/+$/, "");
  try {
    const r = await fetch(`${kok}/olay/${kaynak}`, {
      method: "POST",
      headers: basliklar,
      body: ham,
      redirect: "manual",
      signal: AbortSignal.timeout(25_000),
    });
    const metin = await r.text();
    return new NextResponse(metin, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") || "application/json" },
    });
  } catch (e) {
    // Modal'a ulaşılamadı: 2xx dönmeyiz, sağlayıcı aynı olayı tekrar yollar.
    console.error("[olay iletim]", kaynak, e instanceof Error ? e.name : "hata");
    return NextResponse.json({ hata: "iletim_basarisiz" }, { status: 502 });
  }
}
