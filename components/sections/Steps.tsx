import Link from "next/link";
import Reveal from "../Reveal";
import { IconArrow } from "../icons";

const steps = [
  {
    n: "1",
    title: "Röntgen",
    body: "Ücretsiz başvuru yap. 48 saat içinde işletmenin 3 kayıp noktasını raporluyorum.",
    tag: "ücretsiz · 48 saat",
  },
  {
    n: "2",
    title: "Kurulum",
    body: "Hedef kitle bilgilerini gönder. 10 iş günde sistemin hazır.",
    tag: "10 iş günü",
  },
  {
    n: "3",
    title: "Büyüme",
    body: "Sistem çalışıyor, sen büyüyorsun. Aylık optimizasyon + raporlama.",
    tag: "aylık",
  },
];

export default function Steps() {
  return (
    <section id="surec" className="section bg-ink text-white">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="eyebrow flex items-center gap-2 text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Süreç
          </p>
          <h2 className="h2 mt-4 text-white">
            3 Adımda Müşteri Kazanım Sistemi
          </h2>
          <p className="lead mt-5 text-white/70">
            Karmaşık görünen şey, net bir sürece oturuyor. Risk almadan
            başlıyoruz: önce ücretsiz röntgen, sonra kurulum, sonra büyüme.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="flex h-full flex-col bg-ink p-7 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl font-extrabold text-signal">
                    {s.n}
                  </span>
                  <span className="text-[10px] uppercase tracking-label text-white/40">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex justify-center">
            <Link href="/rontgen" className="btn-primary">
              Ücretsiz Röntgen ile Başla
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
