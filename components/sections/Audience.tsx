import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import { IconCheck } from "../icons";

const fit = [
  "İşini büyütmeye karar vermiş",
  "Sistemli ilerlemek isteyen",
  "Takibe ve CRM'e açık",
  "Uzun vadeli düşünen, sabırlı",
];

const notFit = [
  "Tek seferlik hızlı sonuç bekleyen",
  "Sürece güvenmeyen",
  "Takip ve kayıt istemeyen",
  "Anında satış garantisi arayan",
];

const sectors = [
  "Koçluk & Danışmanlık",
  "Fitness & Stüdyo",
  "Düğün & Organizasyon",
  "Dil Okulu & Eğitim",
  "Mobilya & Showroom",
];

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export default function Audience() {
  return (
    <section id="kimler" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Kimlerle Çalışırım"
          title="Bu sistem kime göre?"
          lead="Herkese uygun değil — ve bu iyi bir şey. Sistem, doğru zihniyetle çalışınca en iyi sonucu veriyor. İşte kısa bir uygunluk testi:"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Sana göre */}
          <Reveal>
            <div className="bp-card tick-corners h-full p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-signal/10 text-signal">
                  <IconCheck className="h-4 w-4" />
                </span>
                <h3 className="font-display text-lg font-semibold text-ink">
                  Bu sistem sana göre
                </h3>
              </div>
              <ul className="mt-6 space-y-4">
                {fit.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
                    <span className="text-[0.95rem] leading-relaxed text-ink-soft">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Sana göre değil */}
          <Reveal delay={0.08}>
            <div className="tick-corners h-full rounded-xl border border-line bg-surface/50 p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-copper/10 text-copper">
                  <Cross className="h-4 w-4" />
                </span>
                <h3 className="font-display text-lg font-semibold text-ink">
                  Bu sistem sana göre değil
                </h3>
              </div>
              <ul className="mt-6 space-y-4">
                {notFit.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Cross className="mt-0.5 h-5 w-5 shrink-0 text-copper/70" />
                    <span className="text-[0.95rem] leading-relaxed text-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Örnek sektörler — mono şerit */}
        <Reveal>
          <div className="mt-10 rounded-xl border border-line bg-white p-5 sm:p-6">
            <p className="eyebrow-muted">
              Örnek çalıştığım alanlar{" "}
              <span className="normal-case text-muted/70">— kısıt değil, örnek</span>
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {sectors.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-[11px] uppercase tracking-label text-ink-soft"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
