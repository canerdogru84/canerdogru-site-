import Link from "next/link";
import Reveal from "../Reveal";
import { IconArrow, IconDownload } from "../icons";

export default function FinalCTA() {
  return (
    <section id="basla" className="section relative overflow-hidden bg-ink">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-signal/10 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow flex items-center justify-center gap-2 text-signal">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Başla
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h2 mt-4 text-white">
              Müşteri Kazanım Sistemini
              <br className="hidden sm:block" /> Kurmaya Hazır mısın?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead mx-auto mt-5 max-w-xl text-white/70">
              Ücretsiz Dijital Büyüme Röntgeni ile başla. 48 saat içinde 3 kayıp
              noktanı gösteriyorum.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/rontgen" className="btn-primary">
                Ücretsiz Röntgen Al
                <IconArrow className="h-4 w-4" />
              </Link>
              <Link
                href="/checklist"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[0.95rem] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                <IconDownload className="h-4 w-4" />
                Önce 30 Günlük Checklist'i indir
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
