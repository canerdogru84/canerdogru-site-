import Image from "next/image";
import Reveal from "../Reveal";
import { site } from "../../lib/site";
import { IconShield } from "../icons";

export default function Trust() {
  return (
    <section id="guven" className="section">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          {/* Sol — kimlik + sertifika */}
          <div>
            <Reveal>
              <div className="bp-card tick-corners overflow-hidden">
                {/* Portre — siyah zemin (cutout figür siyaha oturur) */}
                <div className="relative aspect-[4/5] bg-[#0A0B0E]">
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(115% 75% at 50% 16%, rgba(255,255,255,0.10), transparent 62%)",
                    }}
                    aria-hidden
                  />
                  <Image
                    src={site.assets.portrait || "/caner-2.png"}
                    alt={site.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex items-center justify-between border-t border-line bg-white px-5 py-4">
                  <div>
                    <p className="font-display text-base font-bold text-ink">
                      {site.name}
                    </p>
                    <p className="text-[11px] uppercase tracking-label text-muted">
                      Müşteri Kazanım Sistemleri
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/5 px-3 py-1.5 text-signal">
                    <IconShield className="h-4 w-4" />
                    <span className="text-[10px] font-medium uppercase tracking-label">
                      DMI PRO
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sağ — otorite ifadesi + sosyal kanıt slotları */}
          <div className="flex flex-col">
            <Reveal>
              <p className="eyebrow">Güven</p>
              <blockquote className="mt-4">
                <p className="font-display text-[1.6rem] font-semibold leading-snug tracking-tight text-ink sm:text-[2rem]">
                  “İşi büyütmenin yolu daha çok reklam değil, reklamı müşteriye
                  çeviren bir sistemdir. Ben o sistemi kuruyorum.”
                </p>
              </blockquote>
              <p className="mt-4 text-sm text-muted">
                — {site.name} ·{" "}
                <span className="text-ink-soft">
                  Digital Marketing Institute (DMI PRO) sertifikalı
                </span>
              </p>
            </Reveal>

            {/* DMI PRO sertifika bloğu */}
            <Reveal delay={0.1}>
              <div className="mt-8 flex items-center gap-4 rounded-xl border border-line bg-white p-5">
                <Image
                  src="/dmi-pro-rozet.png"
                  alt="DMI PRO — Certified Digital Marketing Professional rozeti"
                  width={76}
                  height={76}
                  className="h-[76px] w-[76px] shrink-0 object-contain"
                />
                <div>
                  <p className="font-display text-[0.95rem] font-bold text-ink">
                    DMI PRO
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted">
                    Certified Digital Marketing Professional
                    <br />
                    <span className="text-[12px] uppercase tracking-wide">
                      TR-NBT249372
                    </span>
                  </p>
                  <a
                    href="/dmi-pro-sertifika.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-signal underline-offset-2 hover:underline"
                  >
                    Sertifikayı gör ↗
                  </a>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}
