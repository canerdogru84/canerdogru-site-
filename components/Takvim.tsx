"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

/**
 * cal.com gömülü takvim — 50K+ bütçeli başvurunun SON ADIMI.
 *
 * 14 Eki 2026'dan beri resmî embed betiği (app.cal.com/embed/embed.js) kullanılır,
 * ham iframe değil. Sebep: randevu alındığında `bookingSuccessfulV2` olayını
 * yakalamak gerekiyor — lead ancak o anda "başvuru" sayılır (LeadForm → onRandevu),
 * piksel Lead olayı da o anda atılır. Betik useEffect içinde yüklendiği için
 * Next hydration'a karışmaz (eski React paketindeki sorun buydu).
 *
 * Ön doldurma: ad, e-posta, telefon (+90 E.164 — aksi hâlde cal.com ülkeyi
 * tahmin edip Almanya açıyordu) ve `metadata[...]` alanları. Metadata cal.com
 * webhook'unda `payload.metadata` olarak geri gelir; /api/randevu bu alanlardan
 * basvurular satırını kurar. Anahtar adları orada okunanla aynı olmalı.
 *
 * `site.calcomEvent` boşsa güvenli bir "dönüyorum" mesajına düşer.
 */
export type TakvimMeta = Record<string, string>;

type CalApi = ((...args: unknown[]) => void) & { ns?: Record<string, CalApi>; q?: unknown[] };
declare global {
  interface Window {
    Cal?: CalApi;
  }
}

const NS = "rontgen";

function calYukle() {
  if (typeof window === "undefined" || window.Cal) return;
  // cal.com'un resmî yükleyici parçası (Embed Snippet Generator çıktısı, sadeleştirilmiş)
  const C = window as Window & { Cal?: CalApi };
  const d = document;
  const p = (a: CalApi, ar: IArguments | unknown[]) => {
    a.q = a.q || [];
    a.q.push(ar);
  };
  const cal: CalApi = function (this: unknown) {
    const ar = arguments;
    const self = C.Cal as CalApi & { loaded?: boolean };
    if (!self.loaded) {
      self.ns = {};
      self.q = self.q || [];
      d.head.appendChild(d.createElement("script")).src = "https://app.cal.com/embed/embed.js";
      self.loaded = true;
    }
    if (ar[0] === "init") {
      const api: CalApi = function () {
        p(api, arguments);
      };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        self.ns![namespace] = self.ns![namespace] || api;
        p(self.ns![namespace], ar);
        p(self, ["initNamespace", namespace]);
      } else p(self, ar);
      return;
    }
    p(self, ar);
  } as CalApi;
  C.Cal = cal;
}

export default function Takvim({
  ad,
  eposta,
  telefon,
  meta,
  onRandevu,
}: {
  ad?: string;
  eposta?: string;
  /** E.164 (+90...) — lib/telefon e164TR ile üretilir */
  telefon?: string;
  /** cal.com metadata[...] — webhook'ta payload.metadata olarak döner */
  meta?: TakvimMeta;
  /** Randevu alındı (bookingSuccessfulV2) */
  onRandevu?: (randevu: { uid?: string; startTime?: string }) => void;
}) {
  const kutu = useRef<HTMLDivElement>(null);
  const kuruldu = useRef(false);
  const onRandevuRef = useRef(onRandevu);
  onRandevuRef.current = onRandevu;

  useEffect(() => {
    if (!site.calcomEvent || !kutu.current || kuruldu.current) return;
    kuruldu.current = true;
    calYukle();
    const Cal = window.Cal!;
    Cal("init", NS, { origin: "https://app.cal.com" });
    const ns = Cal.ns![NS];

    const config: Record<string, string> = { layout: "month_view", theme: "light" };
    if (ad) config.name = ad;
    if (eposta) config.email = eposta;
    // cal.com'daki alan "Telefon numarası (SMS bildirimleri)" → kimliği smsReminderNumber.
    // attendeePhoneNumber bu etkinlikte yok; ikisini de vermek zararsız.
    if (telefon) {
      config.smsReminderNumber = telefon;
      config.attendeePhoneNumber = telefon;
    }
    for (const [k, v] of Object.entries(meta || {})) {
      if (v) config[`metadata[${k}]`] = v;
    }

    ns("inline", { elementOrSelector: kutu.current, calLink: site.calcomEvent, config });
    ns("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view" });
    ns("on", {
      action: "bookingSuccessfulV2",
      callback: (e: { detail?: { data?: { uid?: string; startTime?: string } } }) => {
        const data = e?.detail?.data || {};
        onRandevuRef.current?.({ uid: data.uid, startTime: data.startTime });
      },
    });
    // Bilerek temizlenmiyor: başarı ekranı tek seferlik; iframe kaldırılırsa
    // kullanıcı randevu ortasında kalır.
  }, [ad, eposta, telefon, meta]);

  if (!site.calcomEvent) {
    return (
      <p className="prose-body mx-auto mt-3 max-w-md text-[0.95rem]">
        Başvurun bana düştü. 24 saat içinde görüşme saatleriyle dönüyorum.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-line">
      <div ref={kutu} className="min-h-[680px] w-full" />
    </div>
  );
}
