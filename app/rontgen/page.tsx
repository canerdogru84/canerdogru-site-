import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import {
  IconCheck,
  IconShield,
  IconGlobe,
  IconInstagram,
  IconStar,
  IconTarget,
} from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ücretsiz Dijital Büyüme Röntgeni",
  description:
    "İşletmenin dijital varlığını tarayıp 3 kritik kayıp noktasını gösteriyorum. 48 saat, kişiye özel, ücretsiz.",
  alternates: { canonical: "/rontgen" },
  openGraph: {
    title: "Ücretsiz Dijital Büyüme Röntgeni | Caner Doğru",
    description:
      "İşletmenin dijital varlığını tarayıp 3 kritik kayıp noktasını gösteriyorum. 48 saat, kişiye özel, ücretsiz.",
    url: `${site.url}/rontgen`,
  },
};

const checks = [
  { Icon: IconGlobe, title: "Web sitesi", desc: "hız · mobil · SEO" },
  { Icon: IconInstagram, title: "Instagram", desc: "etkileşim · bio · içerik" },
  { Icon: IconStar, title: "Google & itibar", desc: "yorumlar · görünürlük" },
  { Icon: IconTarget, title: "Reklam varlığı", desc: "mesaj kalitesi · hedefleme" },
];

const delivers = [
  "3 kritik kayıp noktası — öncelik sırasıyla",
  "Kişiye özel video rapor (5-7 dk)",
  "Detaylı analiz raporu",
  "Hemen yapabileceğin 2-3 ücretsiz iyileştirme",
];

export default function RontgenPage() {
  return (
    <div className="min-h-screen">
      {/* Sade üst bar — dikkat dağıtmayan tek-amaçlı sayfa */}
      <header className="border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="container-x flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Ana sayfa">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-label text-muted transition-colors hover:text-ink"
          >
            ← Ana sayfa
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="bp-grid bp-grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="container-x grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Sol — vaat + ne kontrol/ne teslim */}
          <div className="lg:pr-4">
            <Reveal>
              <p className="eyebrow flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Ücretsiz · 48 saat · Kişiye özel
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1 mt-5 !text-[clamp(2.2rem,1.5rem+3vw,3.4rem)]">
                Dijital Büyüme
                <br />
                <span className="text-signal">Röntgeni</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead mt-6 max-w-md">
                İşletmenin dijital varlığını tarayıp 3 kritik kayıp noktasını
                gösteriyorum. 48 saat, kişiye özel, ücretsiz.
              </p>
            </Reveal>

            {/* Ne kontrol ediyorum */}
            <Reveal delay={0.15}>
              <p className="eyebrow-muted mt-9">Ne kontrol ediyorum</p>
            </Reveal>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {checks.map((c, i) => {
                const { Icon } = c;
                return (
                  <Reveal as="div" key={c.title} delay={0.18 + i * 0.05}>
                    <div className="bp-card flex h-full items-start gap-3 p-4">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <p className="text-[0.92rem] font-semibold text-ink">
                          {c.title}
                        </p>
                        <p className="mt-0.5 text-[12px] text-muted">{c.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Ne teslim ediyorum */}
            <Reveal delay={0.2}>
              <p className="eyebrow-muted mt-8">Ne teslim ediyorum</p>
            </Reveal>
            <ul className="mt-4 space-y-2.5">
              {delivers.map((d, i) => (
                <Reveal as="li" key={d} delay={0.22 + i * 0.05}>
                  <div className="flex items-start gap-3 text-[0.95rem] text-ink-soft">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal/10 text-signal">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    {d}
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.35}>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-2 text-ink-soft">
                <IconShield className="h-4 w-4 text-signal" />
                <span className="text-[10px] uppercase tracking-label">
                  DMI PRO Sertifikalı
                </span>
              </div>
            </Reveal>
          </div>

          {/* Sağ — tek amaç: form */}
          <div>
            <Reveal y={28}>
              <LeadForm source="rontgen" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-center text-xs leading-relaxed text-muted">
                Satış baskısı yok. Teşhis koyuyorum, karar sizin. Haftada sınırlı
                sayıda röntgen yapıyorum.
              </p>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
