"use client";

import { site } from "@/lib/site";

/**
 * cal.com gömülü takvim — form sonrası 50K+ bütçeli başvuru için.
 *
 * Neden iframe: cal.com'un resmi embed betiği ek bir script yüklüyor ve
 * Next 16'da hydration sırasına takılabiliyor. iframe hem daha basit hem
 * ölçüm için yeterli: randevu alınınca cal.com kendi webhook'unu atıyor
 * (n8n tarafında yakalanır), sayfada ek olay gerekmiyor.
 *
 * `site.calcomEvent` boşsa (etkinlik türü henüz açılmadıysa) bileşen güvenli
 * bir "dönüyorum" mesajına düşer — takvim yokken kırık iframe göstermez.
 */
export default function Takvim({
  ad,
  eposta,
  kaynak,
}: {
  ad?: string;
  eposta?: string;
  kaynak?: string;
}) {
  if (!site.calcomEvent) {
    return (
      <p className="prose-body mx-auto mt-3 max-w-md text-[0.95rem]">
        Başvurun bana düştü. 24 saat içinde görüşme saatleriyle dönüyorum.
      </p>
    );
  }

  const q = new URLSearchParams();
  if (ad) q.set("name", ad);
  if (eposta) q.set("email", eposta);
  if (kaynak) q.set("metadata[kaynak]", kaynak);
  // Sayfanın açık temasına uysun; gömülü görünümde cal.com'un kendi başlığı gizli
  q.set("theme", "light");
  q.set("layout", "month_view");
  const src = `https://cal.com/${site.calcomEvent}?${q.toString()}`;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-line">
      <iframe
        src={src}
        title="Röntgen görüşmesi için saat seçin"
        className="h-[680px] w-full"
        loading="eager"
        allow="payment"
      />
    </div>
  );
}
