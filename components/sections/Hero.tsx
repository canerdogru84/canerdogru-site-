import Link from "next/link";
import Reveal from "../Reveal";
import { IconArrow, IconShield, IconDownload } from "../icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-[128px] sm:pt-[150px]">
      {/* Blueprint zemin — sönümlenen ölçüm gridi */}
      <div className="bp-grid bp-grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-signal/5 blur-3xl"
        aria-hidden
      />

      <div className="container-x grid items-center gap-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
        {/* Sol — tez */}
        <div>
          <Reveal>
            <h1 className="h1">
              Hizmet İşletmelerine
              <br />
              <span className="text-signal">Müşteri Kazanım Sistemi</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="lead mt-6 max-w-xl">
              Reklam + Otomasyon + Takip ={" "}
              <strong className="font-semibold text-ink">Tek Sistem.</strong>{" "}
              Hedef kitle analizinden sonra{" "}
              <strong className="font-semibold text-ink">10 iş günde</strong>{" "}
              kurulu.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-[11px] uppercase tracking-label text-ink-soft">
              <IconShield className="h-4 w-4 text-signal" />
              DMI PRO Sertifikalı
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/rontgen" className="btn-primary">
                Ücretsiz Röntgen Al
                <IconArrow className="h-4 w-4" />
              </Link>
              <Link href="/checklist" className="btn-ghost">
                <IconDownload className="h-4 w-4" />
                30 Günlük Checklist İndir
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Sağ — blueprint sistem önizlemesi */}
        <Reveal delay={0.2} y={28}>
          <HeroSchematic />
        </Reveal>
      </div>
    </section>
  );
}

/** Hero'da kompakt sistem önizlemesi — tam canlı şema #sistem bölümünde. */
function HeroSchematic() {
  const steps = [
    { k: "IN", label: "Reklam", v: "talep akışı" },
    { k: "AI", label: "WhatsApp YZ Temsilcisi", v: "saniyeler içinde yanıt", hot: true },
    { k: "DB", label: "CRM", v: "her aday kayıtlı" },
    { k: "RE", label: "Takip Akışı", v: "geri kazanım" },
  ];
  return (
    <div className="relative">
      <div className="bp-card tick-corners overflow-hidden shadow-card">
        {/* Başlık çubuğu */}
        <div className="flex items-center justify-between border-b border-line bg-surface/60 px-5 py-3">
          <span className="text-[11px] uppercase tracking-label text-ink-soft">
            sistem.şeması
          </span>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-label text-signal">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            canlı
          </span>
        </div>

        <div className="bp-grid space-y-0 p-5">
          {steps.map((s, i) => (
            <div key={s.k}>
              <div
                className={`flex items-center gap-4 rounded-lg border bg-white px-4 py-3.5 ${
                  s.hot ? "border-copper/40" : "border-line"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-md text-[11px] font-medium ${
                    s.hot ? "bg-copper/10 text-copper" : "bg-signal/10 text-signal"
                  }`}
                >
                  {s.k}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {s.label}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {s.v}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <span className="text-signal/60">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M5 1v8M2 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sonuç şeridi */}
        <div className="flex items-center justify-between border-t border-line bg-signal/[0.04] px-5 py-3.5">
          <span className="text-[11px] uppercase tracking-label text-muted">
            çıktı
          </span>
          <span className="text-sm font-semibold text-ink">
            Tahmin edilebilir müşteri akışı
          </span>
        </div>
      </div>
    </div>
  );
}
