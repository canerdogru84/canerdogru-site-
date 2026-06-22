import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";
import { upsertContact, sendChecklistEmail } from "@/lib/brevo";

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

  const isim = clean(body.isim, 120);
  const eposta = clean(body.eposta, 160);

  if (isim.length < 2) {
    return NextResponse.json({ error: "Lütfen adınızı girin." }, { status: 422 });
  }
  if (!emailRe.test(eposta)) {
    return NextResponse.json(
      { error: "Lütfen geçerli bir e-posta adresi girin." },
      { status: 422 }
    );
  }

  // Asıl yedek: Supabase 'checklist_subscribers'. Brevo (liste + e-posta)
  // bonus katman — aşağıda best-effort olarak tetiklenir.
  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Form altyapısı henüz yapılandırılmadı. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from("checklist_subscribers")
    .insert({ isim, eposta, kaynak: "checklist" });

  if (error) {
    console.error("[checklist insert]", error.message);
    return NextResponse.json(
      { error: "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  // Brevo: listeye ekle + hoş geldin e-postası. Hata olursa logla, akışı bozma.
  const listId = Number(process.env.BREVO_LIST_CHECKLIST) || undefined;
  const [contact, mail] = await Promise.all([
    upsertContact({ email: eposta, firstName: isim, listId }),
    sendChecklistEmail({ email: eposta, name: isim }),
  ]);
  if (!contact.ok && contact.error !== "disabled")
    console.error("[checklist brevo contact]", contact.error);
  if (!mail.ok && mail.error !== "disabled")
    console.error("[checklist brevo email]", mail.error);

  return NextResponse.json({ ok: true }, { status: 201 });
}
