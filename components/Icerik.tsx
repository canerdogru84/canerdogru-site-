import Link from "next/link";
import type { SSS } from "@/lib/icerik";

/* ------------------------------------------------------------------ */
/* Kırıntı yolu (breadcrumb)                                           */
/* ------------------------------------------------------------------ */

export function Kirinti({ ogeler }: { ogeler: { ad: string; href?: string }[] }) {
  return (
    <nav aria-label="Konum" className="text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {ogeler.map((o, i) => (
          <li key={o.ad} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="text-line-strong">
                /
              </span>
            )}
            {o.href ? (
              <Link href={o.href} className="transition-colors hover:text-ink">
                {o.ad}
              </Link>
            ) : (
              <span className="text-ink-soft">{o.ad}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Markdown gövdesi                                                    */
/* ------------------------------------------------------------------ */

export function Govde({ html }: { html: string }) {
  return <div className="icerik" dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ------------------------------------------------------------------ */
/* SSS — görünür liste (schema ayrıca JSON-LD olarak basılır)          */
/* ------------------------------------------------------------------ */

export function SSSListesi({ sss }: { sss: SSS[] }) {
  if (!sss.length) return null;
  return (
    <section className="mt-16 border-t border-line pt-12">
      <h2 className="h3 text-ink">Sık sorulan sorular</h2>
      <dl className="mt-7 space-y-7">
        {sss.map((s) => (
          <div key={s.soru}>
            <dt className="font-semibold text-ink">{s.soru}</dt>
            <dd className="prose-body mt-2 text-[0.98rem]">{s.cevap}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

export function Schema({ veri }: { veri: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // İçerik build sırasında kendi dosyalarımızdan üretiliyor; dış girdi yok.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Kart — blog ve sektör listelerinde ortak                            */
/* ------------------------------------------------------------------ */

export function Kart({
  href,
  ustBaslik,
  baslik,
  ozet,
  altBilgi,
}: {
  href: string;
  ustBaslik?: string;
  baslik: string;
  ozet: string;
  altBilgi?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_14px_34px_-22px_rgba(11,27,58,0.35)] sm:p-7"
    >
      {ustBaslik && <p className="eyebrow">{ustBaslik}</p>}
      <h3 className="h3 mt-3 text-ink transition-colors group-hover:text-signal">
        {baslik}
      </h3>
      <p className="prose-body mt-3 line-clamp-4 text-[0.95rem]">{ozet}</p>
      {altBilgi && (
        <p className="mt-5 text-[12.5px] text-muted">{altBilgi}</p>
      )}
    </Link>
  );
}
