import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { tumFunnellar, funnelBul, SABIT } from "@/lib/funnel";

/**
 * REKLAM FUNNEL SAYFASI — /lp/<sektor>
 *
 * Yalnız Meta reklamından gelen trafik için. Organik /sektorler/<x> sayfasıyla
 * aynı sektörü anlatır ama farklı iş yapar: DÖNÜŞÜM.
 *
 * Bilerek OLMAYANLAR: Nav, Footer, blog bağlantısı, sosyal ikon, fiyat.
 * Sayfadan çıkan tek yol form. Her ek bağlantı dönüşümü sızdırır.
 *
 * noindex KODDA SABİT — elle eklenen etiket değil, unutulamaz.
 * Aynı içerik organik sayfada indeksli; burası Google'a kapalı, kopya riski yok.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tumFunnellar().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const f = funnelBul(slug);
  if (!f) return {};
  return {
    title: f.meta.title,
    description: f.meta.description,
    robots: { index: false, follow: false },
    alternates: { canonical: `/sektorler/${slug}` }, // otorite organik sayfaya
    openGraph: { title: f.meta.title, description: f.meta.description, type: "website" },
  };
}

export default async function FunnelSayfasi({ params }: Props) {
  const { slug } = await params;
  const f = funnelBul(slug);
  if (!f) notFound();

  const kaynak = `lp-${f.slug}`;

  return (
    <main className="min-h-screen">
      {/* Üst çubuk — logo + tek eylem. Menü YOK. */}
      <header className="border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link href="/" aria-label="Ana sayfa" className="shrink-0">
            <Logo />
          </Link>
          <a href="#form" className="btn-primary !px-5 !py-2.5 text-sm">
            Ücretsiz Röntgen Al
          </a>
        </div>
      </header>

      {/* 1 — HERO + FORM: reklam kancasıyla birebir aynı başlık */}
      <section className="section !pt-14 sm:!pt-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <Reveal>
              <p className="eyebrow">{f.sektorAd}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1 mt-4 text-ink">{f.hero.baslik}</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead mt-6 max-w-xl">{f.hero.altBaslik}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 flex items-center gap-2 text-[13px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                {SABIT.guvenSatiri}
              </p>
            </Reveal>
          </div>
          <div id="form">
            <Reveal y={24}>
              <h2 className="h3 mb-4 text-ink">{f.hero.formBaslik}</h2>
              {/* Kimlik şeridi — formu kimin aldığını göstermek doldurma direncini düşürür */}
              <div className="mb-5 flex items-center gap-3">
                <Image
                  src={SABIT.kimlik.foto}
                  alt={SABIT.kimlik.ad}
                  width={44}
                  height={44}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
                <p className="text-[13px] leading-snug text-muted">
                  {SABIT.kimlik.formYani}
                  <br />
                  <span className="font-medium text-ink">{SABIT.kimlik.ad}</span>
                </p>
              </div>
              <LeadForm source={kaynak} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 — TEŞHİS: "bu ben miyim?" */}
      <section className="section bg-surface/60">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Teşhis</p>
            <h2 className="h2 mt-4 max-w-2xl">{f.teshis.baslik}</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {f.teshis.belirtiler.map((b, i) => (
              <Reveal key={b.baslik} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <p className="eyebrow-muted">Belirti {i + 1}</p>
                  <h3 className="h3 mt-3 text-ink">{b.baslik}</h3>
                  <p className="prose-body mt-3 text-[0.95rem]">{b.metin}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <p className="lead mt-10 max-w-2xl font-medium text-ink">
              {SABIT.teshisKapanis}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 — KAYIP HESABI: tek rakam */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="rounded-2xl border border-line bg-white p-8 sm:p-12">
              <p className="eyebrow">Kayıp hesabı</p>
              <p className="h1 mt-4 text-signal">{f.kayip.rakam}</p>
              <p className="lead mt-4 max-w-2xl">{f.kayip.aciklama}</p>
              {f.kayip.kaynak && (
                <p className="mt-4 text-[12.5px] text-muted">Kaynak: {f.kayip.kaynak}</p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — NASIL ÇALIŞIYOR: 3 adım, teknik anlatım yok */}
      <section className="section bg-surface/60">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Nasıl çalışıyor</p>
            <h2 className="h2 mt-4 max-w-2xl">Üç adım, tek sistem</h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {(
              [
                ["01", SABIT.nasil.rontgen, f.nasil.rontgen],
                ["02", SABIT.nasil.kurulum, f.nasil.kurulum],
                ["03", SABIT.nasil.partnerlik, f.nasil.partnerlik],
              ] as const
            ).map(([no, sabit, ornek], i) => (
              <Reveal key={no} as="li" delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <p className="eyebrow-muted">{no}</p>
                  <h3 className="h3 mt-3 text-ink">{sabit.baslik}</h3>
                  <p className="prose-body mt-3 text-[0.95rem]">{sabit.alt}</p>
                  <p className="mt-4 border-t border-line pt-4 text-[0.92rem] text-ink-soft">
                    <span className="font-medium text-ink">Sizde: </span>
                    {ornek}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — DÜRÜSTLÜK: sosyal kanıt yerine — en kritik blok */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="rounded-2xl border-2 border-signal/20 bg-signal/[0.03] p-8 sm:p-12">
              <p className="eyebrow">Açık konuşalım</p>
              <h2 className="h2 mt-4 max-w-2xl">{SABIT.antiGaranti.baslik}</h2>
              <p className="lead mt-5 max-w-2xl">{SABIT.antiGaranti.metin}</p>
              <p className="prose-body mt-6 max-w-2xl border-t border-signal/15 pt-6">
                {f.durustluk.mevzuat}
              </p>
              {/* İmza — bu blok kişisel bir duruş; imzasız görüş pazarlama metni gibi okunur */}
              <div className="mt-7 flex items-center gap-3">
                <Image
                  src={SABIT.kimlik.foto}
                  alt={SABIT.kimlik.ad}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <p className="text-[13px] leading-snug text-muted">
                  <span className="font-medium text-ink">{SABIT.kimlik.ad}</span>
                  <br />
                  {SABIT.kimlik.imzaAlt}
                </p>
              </div>
              <p className="mt-7 text-[0.95rem] font-medium text-ink">{SABIT.kitlik}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — KİMLER İÇİN / DEĞİL: eşik rakamı YAZILMAZ */}
      <section className="section bg-surface/60">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-line bg-white p-7">
              <p className="eyebrow">Kimler için</p>
              <ul className="mt-5 space-y-3">
                {f.kimler.uygun.map((m) => (
                  <li key={m} className="flex gap-3 text-[0.95rem] text-ink-soft">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-line bg-white p-7">
              <p className="eyebrow-muted">Kimler için değil</p>
              <ul className="mt-5 space-y-3">
                {f.kimler.uygunDegil.map((m) => (
                  <li key={m} className="flex gap-3 text-[0.95rem] text-ink-soft">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" aria-hidden />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — RÖNTGEN'DE NE VAR */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Röntgen'de ne bakıyorum</p>
            <h2 className="h2 mt-4 max-w-2xl">Üç yere, sizinle birlikte</h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {f.rontgende.map((m, i) => (
              <Reveal key={m} as="li" delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <p className="eyebrow-muted">{String(i + 1).padStart(2, "0")}</p>
                  <p className="prose-body mt-3 text-[0.95rem]">{m}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.15}>
            <p className="prose-body mt-8 max-w-2xl">{SABIT.rontgendeSabit}</p>
          </Reveal>
        </div>
      </section>

      {/* 8 — SSS: son itirazlar */}
      <section className="section bg-surface/60">
        <div className="container-x max-w-3xl">
          <Reveal>
            <p className="eyebrow">Sık sorulanlar</p>
          </Reveal>
          <dl className="mt-8 space-y-7">
            {[...f.sss, SABIT.sssGaranti].map((s, i) => (
              <Reveal key={s.soru} delay={i * 0.04}>
                <div>
                  <dt className="font-semibold text-ink">{s.soru}</dt>
                  <dd className="prose-body mt-2 text-[0.95rem]">{s.cevap}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 9 — FORM (tekrar) + kıtlık */}
      <section className="section">
        <div className="container-x max-w-2xl">
          <Reveal>
            <p className="eyebrow">Başvuru</p>
            <h2 className="h2 mt-4">{f.hero.formBaslik}</h2>
            <p className="lead mt-4">{SABIT.formAltBaslik}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <LeadForm source={kaynak} />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-center text-[13px] text-muted">{SABIT.kitlik}</p>
          </Reveal>
        </div>
      </section>

      {/* Alt bilgi — yasal zorunluluk, başka bağlantı yok */}
      <footer className="border-t border-line py-8">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-muted">
          <span>© {new Date().getFullYear()} {site.brand}</span>
          <span className="flex gap-4">
            <Link href={site.legal.kvkkHref} className="hover:text-ink">KVKK</Link>
            <Link href={site.legal.kullanimSartlariHref} className="hover:text-ink">Kullanım şartları</Link>
          </span>
        </div>
      </footer>
    </main>
  );
}
