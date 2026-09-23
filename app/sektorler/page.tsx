import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Kart, Kirinti, Schema } from "@/components/Icerik";
import { site } from "@/lib/site";
import { tumSektorler, sektorunYazilari } from "@/lib/icerik";

const baslik = "Sektörler — Hangi İşletmelerle Çalışıyorum";
const aciklama =
  "Koçluk, cilt bakımı, mobilya, dil okulu, pilates ve gayrimenkul. Her sektörün kendi acısı, kendi rakamı ve kendi müşteri kazanım sistemi var.";

export const metadata: Metadata = {
  title: baslik,
  description: aciklama,
  alternates: { canonical: "/sektorler" },
  openGraph: {
    title: baslik,
    description: aciklama,
    url: `${site.url}/sektorler`,
    type: "website",
  },
};

export default function SektorlerSayfasi() {
  const sektorler = tumSektorler();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: baslik,
    description: aciklama,
    url: `${site.url}/sektorler`,
    hasPart: sektorler.map((s) => ({
      "@type": "Service",
      name: s.ad,
      url: `${site.url}/sektorler/${s.slug}`,
      description: s.aciklama,
    })),
  };

  return (
    <>
      <Schema veri={schema} />
      <Nav />
      <main className="pt-[72px]">
        <section className="section">
          <div className="container-x">
            <Kirinti ogeler={[{ ad: "Ana sayfa", href: "/" }, { ad: "Sektörler" }]} />
            <SectionHeading
              className="mt-6"
              eyebrow="Sektörler"
              title="Her sektörün acısı aynı değil"
              lead="Altı sektörde çalışıyorum. Her biri için ayrı bir analiz yaptım: müşteri nerede kayboluyor, sahip neyi göremiyor, hangi mesaj tutuyor. Kendi sektörünüzü seçin."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sektorler.map((s, i) => {
                const yazi = sektorunYazilari(s.slug).length;
                return (
                  <Reveal key={s.slug} delay={i * 0.04}>
                    <Kart
                      href={`/sektorler/${s.slug}`}
                      baslik={s.ad}
                      ozet={s.aciklama}
                      altBilgi={yazi > 0 ? `${yazi} yazı` : undefined}
                    />
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-16 rounded-2xl border border-line bg-surface/60 p-7 sm:p-9">
                <p className="prose-body">
                  Sektörünüz listede yok mu? Sistem aynı; değişen sektörün dili ve
                  rakamları. Yine de önce bakmak isterim —{" "}
                  <a
                    href="/rontgen"
                    className="font-medium text-signal underline decoration-signal/30 underline-offset-4 hover:decoration-signal"
                  >
                    ücretsiz Dijital Büyüme Röntgeni
                  </a>{" "}
                  ile başlayabilirsiniz.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
