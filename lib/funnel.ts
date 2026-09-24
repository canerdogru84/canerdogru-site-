/**
 * REKLAM FUNNEL'I — içerik şeması ve okuyucu
 * -------------------------------------------
 * /lp/<sektor> sayfaları yalnız Meta reklamından gelen trafik için.
 * Organik /sektorler/<x> sayfalarından FARKLI iş yapar: menü yok, form sayfada,
 * noindex. Bkz. leadadmedia/outputs/landing-pages/REKLAM-FUNNEL-TASLAGI.md
 *
 * 1 şablon (app/lp/[slug]/page.tsx) + 6 içerik dosyası (content/lp/*.json).
 * Teklif, anti-garanti ve kıtlık cümlesi gibi SABİT metinler burada — tek yerden
 * değişir, altı sayfaya birden yansır.
 */

import fs from "node:fs";
import path from "node:path";

export type FunnelIcerik = {
  slug: string;
  sektorAd: string;
  /** Meta reklam kancasıyla BİREBİR aynı olmalı — mesaj eşleşmesi */
  hero: { baslik: string; altBaslik: string; formBaslik: string };
  /** 3 belirti — ICA S.21, sahibin kendi dili */
  teshis: { baslik: string; belirtiler: { baslik: string; metin: string }[] };
  /** Tek rakamlık kayıp hesabı — ICA birim ekonomisi */
  kayip: { rakam: string; aciklama: string; kaynak?: string };
  /** 3 adımın sektöre özel örnekleri */
  nasil: { rontgen: string; kurulum: string; partnerlik: string };
  /** Blok 5 — sektörün mevzuatı; sosyal kanıt yerine dürüstlük */
  durustluk: { mevzuat: string };
  /** Blok 6 — eşik rakamı YAZILMAZ */
  kimler: { uygun: string[]; uygunDegil: string[] };
  /** Blok 7 — Röntgen'de sektöre özel bakılan 3 şey */
  rontgende: string[];
  /** Blok 8 — 4 soru; "garanti" sorusu sabit metinden gelir, buraya yazılmaz */
  sss: { soru: string; cevap: string }[];
  meta: { title: string; description: string };
  /** false ise sayfa üretilmez (rota 404). Dosya durur; yayına almak için true yap. */
  yayinda?: boolean;
};

/** Altı sayfada da AYNI olan metinler — tek düzenleme noktası */
export const SABIT = {
  guvenSatiri: "Ücretsiz · 10 dakikalık form · Sonuç garantisi yok, sistem garantisi var",
  teshisKapanis: "Reklamın çalışmıyorsa sorun bütçe değil, sistemsizlik.",
  nasil: {
    rontgen: { baslik: "Röntgen", alt: "Ücretsiz. Sitenizi ve Instagram'ınızı inceleyip nerede müşteri kaybettiğinizi gösteriyorum." },
    kurulum: { baslik: "Kurulum", alt: "Açılış sayfası, takip hattı ve ölçüm. 10 iş günü; süre bilgi ve erişimlerin tesliminden itibaren başlar." },
    partnerlik: { baslik: "Büyüme Partnerliği", alt: "Aylık reklam yönetimi. Her hafta aynı tabloya birlikte bakarız: kaç talep geldi, kaçı görüşmeye döndü." },
  },
  antiGaranti: {
    baslik: "Sistem garantisi veriyorum, sonuç garantisi vermiyorum.",
    metin: "Size \"ayda şu kadar müşteri\" diyen kişi, o cümleyi sizin reklamınıza yazacak ve cezasını siz ödeyeceksiniz. Benim taahhüdüm sistemi kurmak ve her hafta birlikte izlemek.",
  },
  kitlik: "Her hafta 10 firmayla canlı Röntgen görüşmesi yapıyorum; diğer başvurulara yazılı rapor gönderiyorum. Başvurunuza bakıp hangisinin uygun olduğunu bildiririm.",
  rontgendeSabit: "Hepsi kamuya açık kaynaklardan, görüşmeden önce hazırlanır — sizden ekran, şifre ya da hesap erişimi istenmez. İki biçim: canlı görüşme (bulguları ekranda birlikte gezeriz, 30-45 dk) ya da yazılı rapor.",
  sssGaranti: {
    soru: "Sonuç garantisi veriyor musunuz?",
    cevap: "Hayır. Sistem garantisi veriyorum: açılış sayfası, takip hattı ve ölçüm çalışır hâlde teslim edilir ve her hafta birlikte izlenir. Kaç müşteri geleceğini kimse garanti edemez; eden kişiden uzak durun.",
  },
  formAltBaslik: "Formu doldurun; başvurunuza bakıp size hangi biçimin uygun olduğunu bildireyim.",
  /**
   * Kimlik — reklam kreatifi Caner'in yüzü ve sesiyle dönüyor; sayfa yüzsüz kalırsa
   * mesaj eşleşmesi kopar. Ayrıca müşteri referansı yokken tek güven varlığı kişinin
   * kendisi. Hero'ya KONMAZ (orası reklam kancası) — forma ve anti-garanti bloğuna konur.
   */
  kimlik: {
    ad: "Caner Doğru",
    foto: "/caner-portre.webp",
    formYani: "Röntgen görüşmesini ben yapıyorum",
    imzaAlt: "Büyüme partneri · canerdogru.com",
  },
} as const;

const DIZIN = path.join(process.cwd(), "content/lp");

/** Dosyadaki her funnel — yayında olmayanlar dahil. İç kullanım. */
function hamFunnellar(): FunnelIcerik[] {
  if (!fs.existsSync(DIZIN)) return [];
  return fs
    .readdirSync(DIZIN)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIZIN, f), "utf8")) as FunnelIcerik);
}

/**
 * Yayına girecek funnel'lar. `yayinda: false` olan sayfa ÜRETİLMEZ — rota 404 döner.
 * Sebep: sektör hazır olmadan reklam sayfası canlıda durmasın; içeriği yazılı kalsın.
 * Yayına almak için JSON'da tek satır: "yayinda": true (ya da alanı sil).
 */
export function tumFunnellar(): FunnelIcerik[] {
  return hamFunnellar().filter((f) => f.yayinda !== false);
}

export function funnelBul(slug: string): FunnelIcerik | undefined {
  return tumFunnellar().find((f) => f.slug === slug);
}
