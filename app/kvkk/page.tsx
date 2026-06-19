import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Kişisel verilerin korunması hakkında aydınlatma metni.",
  robots: { index: false, follow: true },
};

export default function KvkkPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="container-x flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Ana sayfa">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-label text-muted hover:text-ink"
          >
            ← Ana sayfa
          </Link>
        </div>
      </header>

      <main className="container-x py-16 sm:py-20">
        <p className="eyebrow">Yasal</p>
        <h1 className="h2 mt-4">KVKK Aydınlatma Metni</h1>

        {/* TODO: Gerçek KVKK metninizi buraya yerleştirin. Aşağısı yer tutucudur. */}
        <div className="prose-body mt-8 max-w-2xl space-y-4 text-[0.95rem]">
          <p>
            <strong className="text-ink">{site.legal.company}</strong> olarak,
            6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında
            veri sorumlusu sıfatıyla, web sitemiz üzerinden ilettiğiniz kişisel
            verilerinizi aşağıda açıklanan kapsamda işlemekteyiz.
          </p>
          <p className="rounded-lg border border-dashed border-line-strong bg-surface/60 p-4 text-[12px] text-muted">
            [ Bu bölüm yer tutucudur. Avukatınız/danışmanınızla hazırladığınız
            nihai KVKK aydınlatma metnini <code>app/kvkk/page.tsx</code> içine
            yerleştirin. ]
          </p>
          <p>
            İletişim: <a className="text-signal hover:underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
