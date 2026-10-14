import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Brevo işlem e-postası webhook'u → public.eposta_olaylari (14 Eki 2026).
 *
 * Brevo'dan giden her mailin (Röntgen PDF, cal.com linki, hoş geldin serisi,
 * elle gönderilenler) gönderildi/açıldı/tıklandı/geri döndü olayı Supabase'e
 * düşer; v_basvuru_eposta görünümü başvuruyla e-posta adresinden eşleştirir.
 *
 * Brevo tarafı: Transactional → Settings → Webhooks → yeni; URL
 * https://canerdogru.com/api/brevo-olay?anahtar=<BREVO_WEBHOOK_SECRET>
 * Brevo imza göndermediği için doğrulama URL'deki anahtarla yapılır.
 * Tablo: leadadmedia/sql/s26-eposta-olaylari.sql. Yazma servis anahtarıyla
 * (tabloda politika yok, anon yazamaz).
 */

function clean(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

type BrevoOlay = Record<string, unknown>;

function satir(o: BrevoOlay) {
  const tags = Array.isArray(o.tags) ? (o.tags as unknown[]).map(String) : [];
  const ts = typeof o.ts_event === "number" ? new Date(o.ts_event * 1000).toISOString() : null;
  const tarih = clean(o.date, 40);
  return {
    olay: clean(o.event, 40) || "bilinmiyor",
    eposta: clean(o.email, 160).toLowerCase(),
    konu: clean(o.subject) || null,
    etiket: clean(o.tag, 80) || tags[0] || null,
    mesaj_id: clean(o["message-id"], 200) || null,
    link: clean(o.link, 500) || null,
    olay_at: ts || (tarih ? new Date(tarih).toISOString() : null),
    ham: o,
  };
}

export async function POST(req: Request) {
  const gizli = process.env.BREVO_WEBHOOK_SECRET || "";
  const anahtar = new URL(req.url).searchParams.get("anahtar") || "";
  if (!gizli || anahtar !== gizli) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const servis = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !servis) {
    console.error("[brevo-olay] Supabase servis anahtarı yok");
    return NextResponse.json({ error: "Yapılandırılmadı." }, { status: 503 });
  }

  let govde: unknown;
  try {
    govde = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz gövde." }, { status: 400 });
  }
  // Brevo tek olay ya da (toplu modda) dizi gönderebilir
  const olaylar = (Array.isArray(govde) ? govde : [govde]) as BrevoOlay[];
  const satirlar = olaylar.map(satir).filter((s) => s.eposta);
  if (!satirlar.length) return NextResponse.json({ ok: true, atlandi: "bos" });

  const sb = createClient(url, servis, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await sb.from("eposta_olaylari").insert(satirlar);
  // 23505 = aynı olay zaten var (Brevo yeniden denedi) → başarı say
  if (error && error.code !== "23505") {
    console.error("[brevo-olay insert]", error.message);
    return NextResponse.json({ error: "Kayıt sorunu." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, yazilan: satirlar.length });
}
