import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Govde, Kart, Kirinti, SSSListesi, Schema } from "@/components/Icerik";
import { site } from "@/lib/site";
import { tumSektorler, sektorBul, sektorunYazilari } from "@/lib/icerik";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tumSektorler().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = sektorBul(slug);
  if (!s) return {};
  return {
    title: s.baslik,
    description: s.aciklama,
    keywords: [s.pillarKelime, ...s.yanKelimeler].filter(Boolean),
    alternates: { canonical: `/sektorler/${s.slug}` },
    openGraph: {
      title: s.baslik,
      description: s.aciklama,
      url: `${site.url}/sektorler/${s.slug}`,
      type: "website",
    },
  };
}

export default async function SektorSayfasi({ params }: Props) {
  const { slug } = await params;
  const s = sektorBul(slug);
  if (!s) notFound();

  const yazilar = sektorunYazilari(s.slug);
  const url = `${site.url}/sektorler/${s.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.pillarKelime || s.ad,
      serviceType: "Müşteri kazanım sistemi kurulumu ve reklam yönetimi",
      description: s.aciklama,
      url,
      areaServed: { "@type": "Country", name: "Türkiye" },
      provider: {
        "@type": "ProfessionalService",
        name: site.brand,
        url: site.url,
      },
      audience: { "@type": "BusinessAudience", name: s.ad },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: site.url },
        { "@type": "ListItem", position: 2, name: "Sektörler", item: `${site.url}/sektorler` },
        { "@type": "ListItem", position: 3, name: s.ad, item: url },
      ],
    },
    ...(s.sss.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.sss.map((q) => ({
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
                { ad: "Sektörler", href: "/sektorler" },
                { ad: s.ad },
              ]}
            />

            <header className="mt-6 max-w-3xl">
              <Reveal>
                <p className="eyebrow">{s.ad}</p>
              </Reveal>
            </header>

            <div className="mt-8 max-w-3xl">
              <Govde html={s.html} />
              <SSSListesi sss={s.sss} />
            </div>

            {yazilar.length > 0 && (
              <section className="mt-20 border-t border-line pt-14">
                <Reveal>
                  <p className="eyebrow">Bu sektörden yazılar</p>
                  <h2 className="h3 mt-3 text-ink">
                    Tek tek nerede kaybediyorsunuz?
                  </h2>
                </Reveal>
                <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {yazilar.map((y, i) => (
                    <Reveal key={y.slug} delay={i * 0.04}>
                      <Kart
                        href={`/blog/${y.slug}`}
                        baslik={y.baslik}
                        ozet={y.ozet}
                        altBilgi={y.okumaSuresi ? `${y.okumaSuresi} okuma` : undefined}
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            )}

            {/* Sayfanın kendi kapanış metni — sektöre özel, markdown'dan gelir */}
            <Reveal delay={0.08}>
              <div className="mt-16 max-w-3xl rounded-2xl border border-line bg-surface/60 p-7 sm:p-9">
                <h2 className="h3 text-ink">Bir sonraki adım</h2>
                {s.ctaHtml ? (
                  <div
                    className="icerik mt-4 [&>*:first-child]:mt-0"
                    dangerouslySetInnerHTML={{ __html: s.ctaHtml }}
                  />
                ) : (
                  <p className="prose-body mt-3">
                    Sitenizi ve Instagram&apos;ınızı inceleyip nerede müşteri
                    kaybettiğinizi gösteriyorum. Ücretsiz.
                  </p>
                )}
                <Link href="/rontgen" className="btn-primary mt-6">
                  Ücretsiz Röntgen Al
                </Link>
              </div>
            </Reveal>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
