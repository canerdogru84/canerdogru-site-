"use client";

import { useState } from "react";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

const faqs = [
  {
    q: "Daha önce ajansla çalıştım, sonuç alamadım. Bu neden farklı?",
    a: "Çoğu ajans sadece reklam yönetir. Ben uçtan uca sistem kuruyorum — reklam + dönüşüm sayfası + otomasyon + takip. Fark bu.",
  },
  {
    q: "Sonuç garanti ediyor musunuz?",
    a: "Sonuç garanti etmiyorum çünkü sonuç sadece bana bağlı değil. Sistemi garanti ediyorum — 10 iş günde kurulu, test edilmiş, çalışır durumda.",
  },
  {
    q: "Ne kadar bütçe gerekiyor?",
    a: "Etkili sonuç için aylık minimum 50.000 TL reklam bütçesi öneriyorum. Sektör ve hedefe göre yukarı çıkabilir. Detaylar görüşmede netleşir.",
  },
  {
    q: "Hangi sektörlere hizmet veriyorsunuz?",
    a: "Fitness, dil okulu, düğün/organizasyon, mobilya, koçluk/danışmanlık — ve diğer hizmet sektörleri.",
  },
  {
    q: "Sözleşme süresi var mı?",
    a: "Kurulum tek seferlik. Büyüme Partnerliği aylık bazda; minimum 3 ay önerilir ama zorunlu değil.",
  },
  {
    q: "Ne kadar sürede sonuç görürüm?",
    a: "Sistem 10 iş günde kurulur. İlk lead sinyalleri genelde 2-3 hafta içinde başlar; düzenli akış 60-90 günde oturur.",
  },
  {
    q: "“Röntgen” tam olarak ne? Gerçekten ücretsiz mi?",
    a: "Evet, ücretsiz. Mevcut reklam, takip ve dönüşüm akışına bakıp paranın nerede sızdığını ve en hızlı kazancın nerede olduğunu net bir tabloyla gösteriyorum. Yola devam etmek tamamen size kalmış; bağlayıcı taahhüt yok.",
  },
  {
    q: "WhatsApp YZ müşteri temsilcisi insan yerine mi geçiyor?",
    a: "İnsanın yerini almaz, ilk teması hızlandırır: gece yarısı bile gelen mesaja saniyeler içinde yanıt verir, niteler, randevu açar. Karmaşık durumda sana devreder.",
  },
];

function Item({
  q,
  a,
  open,
  onToggle,
  id,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="font-display text-[1.05rem] font-semibold text-ink sm:text-[1.15rem]">
            {q}
          </span>
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-transform duration-300 ${
              open ? "rotate-45 border-signal bg-signal text-white" : ""
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="prose-body max-w-2xl pr-8 text-[0.95rem]">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="sss" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow="SSS"
          title="Aklınızdaki sorular"
          lead="En çok merak edilenler. Cevabını bulamadığınız bir şey varsa röntgen görüşmesinde sorabilirsiniz."
        />

        <Reveal>
          <div>
            {faqs.map((f, i) => (
              <Item
                key={i}
                id={`faq-${i}`}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
