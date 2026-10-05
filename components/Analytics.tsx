"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CEREZ_ANAHTAR, CEREZ_OLAY } from "./CerezPaneli";

/**
 * Meta Pixel + GA4 iskeleti.
 * ID'ler .env.local'a girilince otomatik aktif olur; girilmezse hiçbir şey yüklenmez.
 *   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
 * Lead event'leri form gönderiminde tetiklenir (LeadForm / ChecklistForm):
 *   fbq('track','Lead')  ·  gtag('event','generate_lead')
 * Piksel ve GA4 yalnız çerez panelinde "Kabul et" sonrası yüklenir (uyum TR-44).
 */
export default function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  const pixel = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const [izin, setIzin] = useState(false);

  useEffect(() => {
    const oku = () => {
      try {
        setIzin(localStorage.getItem(CEREZ_ANAHTAR) === "kabul");
      } catch {}
    };
    oku();
    window.addEventListener(CEREZ_OLAY, oku);
    return () => window.removeEventListener(CEREZ_OLAY, oku);
  }, []);

  return (
    <>
      {/* Geliş kanalı — ID'den bağımsız, her sayfada çalışır. Ziyaretçi Google'dan
          ana sayfaya gelip sonra /rontgen'e geçerse, forma ulaştığında ilk geliş
          bilgisi çoktan kaybolmuş olurdu. LeadForm aynı anahtarları okur (sql/s15). */}
      <Script id="gelis-kanali" strategy="afterInteractive">
        {`
          try {
            var p = new URLSearchParams(location.search), s = sessionStorage;
            if (p.get('utm_source') || p.get('utm_medium') || p.get('utm_campaign')) {
              s.setItem('lam_utm', JSON.stringify({
                utm_source: p.get('utm_source') || '',
                utm_medium: p.get('utm_medium') || '',
                utm_campaign: p.get('utm_campaign') || ''
              }));
            }
            var k = p.get('utm_content') || p.get('utm_campaign');
            if (k) s.setItem('lam_reklam_kodu', k);
            if (document.referrer && !s.getItem('lam_ilk_referrer')) {
              var r = new URL(document.referrer);
              if (r.hostname !== location.hostname) s.setItem('lam_ilk_referrer', r.origin + r.pathname);
            }
          } catch (e) {}
        `}
      </Script>

      {izin && ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga}');
            `}
          </Script>
        </>
      )}

      {izin && pixel && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixel}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
