import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Kart, Kirinti, Schema } from "@/components/Icerik";
import { site } from "@/lib/site";
import { tumYazilar, tumSektorler } from "@/lib/icerik";

const baslik = "Blog — Müşteri Nerede Kayboluyor";
const aciklama =
  "Hizmet işletmelerinin müşterisini nerede kaybettiğine dair yazılar. Altı sektör, gerçek veri, uygulanabilir adımlar.";

export const metadata: Metadata = {
  title: baslik,
  description: aciklama,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: baslik,
    description: aciklama,
    url: `${site.url}/blog`,
    type: "website",
  },
};

export default function BlogSayfasi() {
  const yazilar = tumYazilar();
  const sektorler = tumSektorler();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: baslik,
    description: aciklama,
    url: `${site.url}/blog`,
    publisher: { "@type": "ProfessionalService", name: site.brand, url: site.url },
    blogPost: yazilar.map((y) => ({
      "@type": "BlogPosting",
      headline: y.baslik,
      description: y.aciklama,
      url: `${site.url}/blog/${y.slug}`,
    })),
  };

  return (
    <>
      <Schema veri={schema} />
      <Nav />
      <main className="pt-[72px]">
        <section className="section">
          <div className="container-x">
            <Kirinti ogeler={[{ ad: "Ana sayfa", href: "/" }, { ad: "Blog" }]} />
            <SectionHeading
              className="mt-6"
              eyebrow="Blog"
              title="Müşteri nerede kayboluyor"
              lead="Çoğu işletme müşteri bulamadığını sanıyor; oysa gelen ilgi cevaplanmadan ölüyor. Bu yazılar altı sektörde bunun nerede olduğunu ve ne yapılacağını anlatıyor."
            />

            {/* Sektör kısayolları — pillar sayfalarına iç bağlantı */}
            <Reveal delay={0.05}>
              <nav aria-label="Sektöre göre" className="mt-10 flex flex-wrap gap-2">
                {sektorler.map((s) => (
                  <a
                    key={s.slug}
                    href={`/sektorler/${s.slug}`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-[13px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {s.ad}
                  </a>
                ))}
              </nav>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {yazilar.map((y, i) => (
                <Reveal key={y.slug} delay={Math.min(i, 8) * 0.03}>
                  <Kart
                    href={`/blog/${y.slug}`}
                    ustBaslik={y.sektorAd}
                    baslik={y.baslik}
                    ozet={y.ozet}
                    altBilgi={y.okumaSuresi ? `${y.okumaSuresi} okuma` : undefined}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
