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
  /** Blok 5 — sektörün mevzuatı; KPI bloğunun altında küçük not */
  durustluk: { mevzuat: string };
  /** Blok 5 — ilk görüşmede birlikte belirlenen 4 KPI. Hedef RAKAM yazılmaz (5 Eki 2026). */
  kpi: { ad: string; olcer: string; kaynak: "sistem" | "siz" }[];
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
  guvenSatiri: "Ücretsiz · 10 dakikalık form · Canlı görüşme haftada 10 firmayla sınırlı",
  teshisKapanis: "Reklamın çalışmıyorsa sorun bütçe değil, sistemsizlik.",
  nasil: {
    rontgen: { baslik: "Röntgen", alt: "Ücretsiz. Sitenizi ve Instagram'ınızı inceleyip nerede müşteri kaybettiğinizi gösteriyorum." },
    kurulum: { baslik: "Kurulum", alt: "Açılış sayfası, takip hattı ve ölçüm. 10 iş günü; süre bilgi ve erişimlerin tesliminden itibaren başlar." },
    partnerlik: { baslik: "Büyüme Partnerliği", alt: "Aylık reklam yönetimi. Her hafta aynı tabloya birlikte bakarız: kaç talep geldi, kaçı görüşmeye döndü." },
  },
  /**
   * ⚠️ "Sistem garantisi veriyorum" kalıbı 25 Eyl 2026'da BIRAKILDI.
   * Okurda "sistemi kuruyor ama sonuç almıyorsun" izlenimi bırakıyordu — yani anti-garanti
   * pozisyonu, korumak istediği güveni tam tersine çeviriyordu. Yerine sayı taahhüdü
   * reddedilir ama Caner'in neyin altına imza attığı TEK TEK sayılır.
   */
  /**
   * 5 Eki 2026: anti-garanti bloğu KPI çerçevesine dönüştü (Caner kararı). "Ne taahhüt
   * etmiyorum" yerine "neyi birlikte ölçüyoruz". Hedef rakam sayfada yazılmaz; ilk
   * görüşmede işletmenin kapasitesine göre konur. Bkz. leadadmedia/outputs/landing-pages/KPI-CERCEVESI-2026-10-05.md
   */
  kpiCerceve: {
    eyebrow: "Neyi birlikte ölçüyoruz",
    baslik: "İlk görüşmede 4 ana ölçüt belirleriz. Her hafta aynı tabloya birlikte bakarız.",
    giris: "Kaç müşteri geleceğini kimse dürüstçe söyleyemez; sonucun yarısı sizin tarafınızda. O yüzden sayı vaat etmek yerine ölçüm ve müdahale vaat ediyorum: ilk görüşmede işletmenize göre dört ana ölçüt seçeriz, hedef rakamlarını birlikte koyarız, her hafta aynı tabloda izleriz. Bu dördü sizinle birlikte baktıklarımız; altında reklam hesabı, açılış sayfası ve takip hattındaki onlarca veriyi ben izlerim. Sizin haftalık bir saatte görmeniz gereken yalnız bu dört sayı. Bir rakam düşerse sebebini bulurum; reklamda, sayfada ya da takip hattında düzeltmeyi ben yaparım ve ne değiştiğini size söylerim. Düzeltme sizin tarafınızdaysa — kapasite, fiyat, ekibin dönüş hızı — ne yapılacağını net yazarım.",
    yontem: ["Röntgen", "Kurulum · 10 iş günü", "Reklam + takip", "Haftalık KPI görüşmesi"],
    kaynakEtiket: { sistem: "Sistemden ölçülür", siz: "Haftalık görüşmede sizden" },
    altSatir: "İlk iki ana ölçüt reklam hesabından ve kurduğum takip hattından otomatik gelir. Son ikisi için her hafta sizden iki rakam alırım: kaç randevu geldi, kaçı satışa döndü. Haftalık görüşme tam bunun için var. Hedef rakamlar sayfada değil, görüşmede: sizin kapasitenize ve birim ekonominize göre konur.",
  },
  kitlik: "Her hafta 10 firmayla canlı Röntgen görüşmesi yapıyorum; kalan başvurulara yazılı rapor gönderiyorum.",
  rontgendeSabit: "Hepsi kamuya açık kaynaklardan, görüşmeden önce hazırlanır — sizden ekran, şifre ya da hesap erişimi istenmez. İki biçim: canlı görüşme (bulguları ekranda birlikte gezeriz, 30-45 dk) ya da yazılı rapor.",
  sssGaranti: {
    soru: "Kaç müşteri geleceğini söyleyebiliyor musunuz?",
    cevap: "Hayır — söyleyen kimse de söyleyemez, çünkü sonucun yarısı sizin tarafınızda: kapasiteniz, gelen mesaja dönüş hızınız, fiyatınız. Benim tarafımda olan işin tamamını taahhüt ediyorum: kurulum 10 iş gününde biter, her hafta aynı tabloya birlikte bakarız, rakam düşerse sebebini bulmak benim işim.",
  },
  formAltBaslik: "Formu doldurun; Röntgen'inizi hazırlayıp 24 saat içinde dönüyorum.",
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
