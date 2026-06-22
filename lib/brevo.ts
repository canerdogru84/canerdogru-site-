/**
 * Brevo (eski Sendinblue) entegrasyonu — server-side.
 * ---------------------------------------------------
 * FAIL-SOFT: BREVO_API_KEY yoksa veya Brevo hata verirse hiçbir şey
 * patlamaz; fonksiyonlar { ok:false } döner ve çağıran route 201'i korur.
 * Kayıtların asıl yedeği Supabase'tedir — Brevo "bonus" katmandır.
 *
 * Gerekli env değişkenleri (.env.local + Vercel):
 *   BREVO_API_KEY          — Brevo > SMTP & API > API Keys
 *   BREVO_SENDER_EMAIL     — doğrulanmış gönderen e-postası (Senders)
 *   BREVO_SENDER_NAME      — (ops.) görünen ad, varsayılan "Caner Doğru"
 *   BREVO_LIST_CHECKLIST   — checklist abonelerinin liste ID'si (sayı)
 *   BREVO_LIST_RONTGEN     — röntgen başvurularının liste ID'si (sayı)
 */

import { site } from "@/lib/site";

const API = "https://api.brevo.com/v3";

type Result = { ok: boolean; error?: string };

function apiKey(): string | null {
  return process.env.BREVO_API_KEY || null;
}

export function isBrevoEnabled(): boolean {
  return !!apiKey();
}

function sender() {
  return {
    name: process.env.BREVO_SENDER_NAME || site.name,
    email: process.env.BREVO_SENDER_EMAIL || site.contact.email,
  };
}

async function brevoFetch(path: string, body: unknown): Promise<Result> {
  const key = apiKey();
  if (!key) return { ok: false, error: "BREVO_API_KEY yok" };

  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    // 2xx → başarı. Brevo "contact already exists" durumunda updateEnabled
    // ile 204 döndürür; create'te 201.
    if (res.ok) return { ok: true };

    const detail = await res.json().catch(() => ({}));
    return {
      ok: false,
      error: `${res.status} ${detail?.code || ""} ${detail?.message || ""}`.trim(),
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "fetch hatası" };
  }
}

/** Telefonu E.164'e (+90XXXXXXXXXX) çevirmeye çalışır; emin değilse null. */
function toE164TR(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("90")) return `+${d}`;
  if (d.length === 11 && d.startsWith("0")) return `+90${d.slice(1)}`;
  if (d.length === 10) return `+90${d}`;
  return null;
}

type ContactInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  listId?: number;
};

/**
 * Kişiyi listeye ekler/günceller. SMS (telefon) geçersiz formatlıysa
 * tüm isteğin reddedilmemesi için onsuz bir kez daha dener.
 */
export async function upsertContact(input: ContactInput): Promise<Result> {
  if (!isBrevoEnabled()) return { ok: false, error: "disabled" };

  const attributes: Record<string, string> = {};
  if (input.firstName) attributes.FIRSTNAME = input.firstName;
  if (input.lastName) attributes.LASTNAME = input.lastName;

  const sms = input.phone ? toE164TR(input.phone) : null;
  if (sms) attributes.SMS = sms;

  const base = {
    email: input.email,
    attributes,
    listIds: input.listId ? [input.listId] : undefined,
    updateEnabled: true,
  };

  const first = await brevoFetch("/contacts", base);
  if (first.ok) return first;

  // SMS yüzünden reddedilmiş olabilir → SMS'siz tekrar dene.
  if (sms) {
    const { SMS, ...rest } = attributes;
    void SMS;
    return brevoFetch("/contacts", { ...base, attributes: rest });
  }
  return first;
}

/** Checklist indirme linkli, siteyle uyumlu hoş geldin e-postası. */
export async function sendChecklistEmail(input: {
  email: string;
  name?: string;
}): Promise<Result> {
  if (!isBrevoEnabled()) return { ok: false, error: "disabled" };

  const downloadUrl = `${site.url}${site.assets.checklistPdf}`;
  const firstName = input.name?.split(" ")[0] || "Merhaba";

  return brevoFetch("/smtp/email", {
    sender: sender(),
    to: [{ email: input.email, name: input.name || input.email }],
    subject: "Checklist'in hazır 📋 — 30 Günlük Müşteri Kazanım Sistemi",
    htmlContent: checklistEmailHtml({ firstName, downloadUrl }),
  });
}

/* ----------------------------- E-posta HTML ----------------------------- */
/* E-posta güvenli: tablo düzeni + inline stiller. Marka renkleri lib/site
   ile aynı (ink #0B1B3A, signal #0D6EFD, copper #C2784F). */
function checklistEmailHtml({
  firstName,
  downloadUrl,
}: {
  firstName: string;
  downloadUrl: string;
}): string {
  const rontgenUrl = `${site.url}/rontgen`;
  return `<!doctype html>
<html lang="tr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3F5F9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FBFBFD;border-radius:16px;overflow:hidden;border:1px solid #E5E8EF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="height:4px;background:#0D6EFD;"></td></tr>
        <tr><td style="padding:36px 36px 8px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0D6EFD;font-weight:700;">Caner Doğru</p>
          <h1 style="margin:0;font-size:24px;line-height:1.25;color:#0B1B3A;font-weight:800;">Checklist'in hazır, ${firstName}.</h1>
        </td></tr>
        <tr><td style="padding:16px 36px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#3A465F;">
            <strong style="color:#0B1B3A;">30 Günlük Müşteri Kazanım Sistemi</strong> checklist'ini aşağıdaki butondan indirebilirsin. Saklaman için bir kopyasını da buraya bıraktım.
          </p>
        </td></tr>
        <tr><td style="padding:28px 36px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="border-radius:10px;background:#0D6EFD;">
              <a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Checklist'i İndir (PDF)</a>
            </td>
          </tr></table>
          <p style="margin:12px 0 0;font-size:12px;color:#6B7280;">Buton çalışmazsa: <a href="${downloadUrl}" style="color:#0D6EFD;">${downloadUrl}</a></p>
        </td></tr>
        <tr><td style="padding:24px 36px;"><div style="height:1px;background:#E5E8EF;"></div></td></tr>
        <tr><td style="padding:0 36px 8px;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#3A465F;">
            Bu 30 günü <strong style="color:#C2784F;">10 iş gününe</strong> indirebiliriz. Ücretsiz Dijital Büyüme Röntgeni'nde işletmeni inceleyip nereden başlayacağını birlikte çıkarıyoruz.
          </p>
          <p style="margin:16px 0 0;">
            <a href="${rontgenUrl}" style="font-size:15px;font-weight:700;color:#0D6EFD;text-decoration:none;">Ücretsiz Röntgen Al →</a>
          </p>
        </td></tr>
        <tr><td style="padding:28px 36px 32px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#6B7280;">
            Bu e-postayı, <a href="${site.url}" style="color:#6B7280;">${site.domain}</a> üzerinden checklist talep ettiğin için aldın. İstemediğin bir e-posta ise yok sayabilirsin.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
