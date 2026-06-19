import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import ChecklistForm from "@/components/ChecklistForm";
import Reveal from "@/components/Reveal";
import { IconCheck } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "30 Günlük Müşteri Kazanım Sistemi — Ücretsiz Rehber",
  description:
    "Hizmet işletmeleri için adım adım kurulum checklist'i. 6 faz, 30 gün, 150+ kontrol noktası. E-postanla ücretsiz indir.",
  alternates: { canonical: "/checklist" },
  openGraph: {
    title: "30 Günlük Müşteri Kazanım Sistemi — Ücretsiz Rehber",
    description:
      "6 faz, 30 gün, 150+ kontrol noktası. Hizmet işletmeleri için adım adım kurulum checklist'i.",
    url: `${site.url}/checklist`,
  },
};

const inside = [
  "Hedef kitle analizi",
  "Karşı konulmaz teklif kurgusu",
  "Landing page + CRM + WhatsApp altyapısı",
  "Reklam metni + kreatif",
  "KPI dashboard",
];

export default function ChecklistPage() {
  return (
    <div className="min-h-screen">
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
        <div className="container-x grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          {/* Sol — vaat + içindekiler */}
          <div className="lg:pr-4">
            <Reveal>
              <p className="eyebrow flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Ücretsiz Rehber
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1 mt-5 !text-[clamp(2rem,1.4rem+2.6vw,3.1rem)]">
                30 Günlük Müşteri
                <br />
                <span className="text-signal">Kazanım Sistemi</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lead mt-6 max-w-md">
                Hizmet işletmeleri için adım adım kurulum checklist&apos;i.{" "}
                <strong className="font-semibold text-ink">
                  6 faz, 30 gün, 150+ kontrol noktası.
                </strong>
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="eyebrow-muted mt-9">İçinde ne var</p>
            </Reveal>
            <ul className="mt-4 space-y-2.5">
              {inside.map((it, i) => (
                <Reveal as="li" key={it} delay={0.18 + i * 0.05}>
                  <div className="flex items-start gap-3 text-[0.95rem] text-ink-soft">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal/10 text-signal">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    {it}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Sağ — form */}
          <Reveal y={28}>
            <ChecklistForm />
          </Reveal>
        </div>
      </main>
    </div>
  );
}
