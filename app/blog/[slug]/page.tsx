import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Govde, Kart, Kirinti, SSSListesi, Schema } from "@/components/Icerik";
import { site } from "@/lib/site";
import { tumYazilar, yaziBul, sektorunYazilari, sektorBul } from "@/lib/icerik";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tumYazilar().map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const y = yaziBul(slug);
  if (!y) return {};
  return {
    title: y.baslik,
    description: y.aciklama,
    keywords: [y.anahtarKelime, ...y.yanKelimeler].filter(Boolean),
    alternates: { canonical: `/blog/${y.slug}` },
    openGraph: {
      title: y.baslik,
      description: y.aciklama,
      url: `${site.url}/blog/${y.slug}`,
      type: "article",
    },
  };
}

export default async function YaziSayfasi({ params }: Props) {
  const { slug } = await params;
  const y = yaziBul(slug);
  if (!y) notFound();

  const sektor = sektorBul(y.sektorSlug);
  const kardesler = sektorunYazilari(y.sektorSlug).filter((k) => k.slug !== y.slug).slice(0, 3);
  const url = `${site.url}/blog/${y.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: y.baslik,
      description: y.aciklama,
      // GEO cevap bloğu — AI aramanın alıntıladığı birim
      abstract: y.ozet,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: "tr-TR",
      author: { "@type": "Person", name: site.name, url: site.url },
      publisher: { "@type": "ProfessionalService", name: site.brand, url: site.url },
      about: y.sektorAd,
      keywords: [y.anahtarKelime, ...y.yanKelimeler].filter(Boolean).join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: site.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
        ...(sektor
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: sektor.ad,
                item: `${site.url}/sektorler/${sektor.slug}`,
              },
            ]
          : []),
        { "@type": "ListItem", position: sektor ? 4 : 3, name: y.baslik, item: url },
      ],
    },
    ...(y.sss.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: y.sss.map((q) => ({
              "@type": "Question",
              name: q.soru,
              acceptedAnswer: { "@type": "Answer", text: q.cevap },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <Schema veri={schema} />
      <Nav />
      <main className="pt-[72px]">
        <article className="section">
          <div className="container-x">
            <Kirinti
              ogeler={[
                { ad: "Ana sayfa", href: "/" },
                { ad: "Blog", href: "/blog" },
                ...(sektor ? [{ ad: sektor.ad, href: `/sektorler/${sektor.slug}` }] : []),
              ]}
            />

            <header className="mt-6 max-w-3xl">
              <Reveal>
                <div className="flex flex-wrap items-center gap-3">
                  {sektor && (
                    <Link
                      href={`/sektorler/${sektor.slug}`}
                      className="eyebrow transition-colors hover:text-signal-ink"
                    >
                      {sektor.ad}
                    </Link>
                  )}
                  {y.okumaSuresi && (
                    <span className="text-[12.5px] text-muted">
                      {y.okumaSuresi} okuma
                    </span>
                  )}
                </div>
              </Reveal>
            </header>

            <div className="mt-7 max-w-3xl">
              <Govde html={y.html} />
              <SSSListesi sss={y.sss} />
            </div>

            {/* Cluster → pillar: blog niyeti ısıtır, sektör sayfası teklifi kurar */}
            {sektor && (
              <Reveal delay={0.06}>
                <div className="mt-16 max-w-3xl rounded-2xl border border-line bg-surface/60 p-7 sm:p-9">
                  <p className="eyebrow">Bütünü görmek için</p>
                  <h2 className="h3 mt-3 text-ink">
                    {sektor.pillarKelime || sektor.ad}
                  </h2>
                  <p className="prose-body mt-3">
                    Bu yazı tek bir parçayı anlatıyor. Sistemin tamamını —
                    hangi adım neyi çözüyor, nereden başlanıyor —{" "}
                    {sektor.ad.toLowerCase()} sayfasında topladım.
                  </p>
                  <Link
                    href={`/sektorler/${sektor.slug}`}
                    className="btn-ghost mt-6"
                  >
                    {sektor.ad} sayfasına git
                  </Link>
                </div>
              </Reveal>
            )}

            {kardesler.length > 0 && (
              <section className="mt-20 border-t border-line pt-14">
                <Reveal>
                  <p className="eyebrow">Bu konunun devamı</p>
                </Reveal>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {kardesler.map((k, i) => (
                    <Reveal key={k.slug} delay={i * 0.04}>
                      <Kart href={`/blog/${k.slug}`} baslik={k.baslik} ozet={k.ozet} />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
