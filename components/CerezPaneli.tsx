"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export const CEREZ_ANAHTAR = "lam_cerez";
export const CEREZ_OLAY = "lam-cerez-degisti";

/**
 * Çerez paneli — ölçüm ve reklam çerezleri (GA4, Meta Pixel) yalnız "Kabul et"
 * sonrası yüklenir; "Reddet" seçilirse hiç yüklenmez. Seçim localStorage'da tutulur.
 * Zorunlu olanlar (geliş kanalı, form) çerez değil sessionStorage kullanır.
 */
export default function CerezPaneli() {
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CEREZ_ANAHTAR)) setGoster(true);
    } catch {}
  }, []);

  const sec = (deger: "kabul" | "ret") => {
    try {
      localStorage.setItem(CEREZ_ANAHTAR, deger);
    } catch {}
    window.dispatchEvent(new Event(CEREZ_OLAY));
    setGoster(false);
  };

  if (!goster) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihi"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur"
    >
      <div className="container-x flex flex-col gap-3 py-4 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl leading-relaxed">
          Sitenin nasıl kullanıldığını ölçmek ve reklamların etkisini görmek için
          Google Analytics ve Meta Pixel çerezlerini yalnız onay verirseniz
          kullanıyorum. Ayrıntı:{" "}
          <Link href={site.legal.kvkkHref} className="underline underline-offset-2 hover:text-ink">
            KVKK Aydınlatma Metni
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => sec("ret")}
            className="rounded-full border border-line-strong px-4 py-2 font-medium text-ink-soft hover:text-ink"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={() => sec("kabul")}
            className="rounded-full border border-line-strong px-4 py-2 font-medium text-ink-soft hover:text-ink"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
