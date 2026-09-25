/**
 * İÇERİK KATMANI
 * --------------
 * `content/blog/*.md` ve `content/sektorler/*.md` dosyalarını build sırasında okur.
 * Dosyalar Leadadmedia içerik motorunda üretilir; künye (frontmatter) biçimi oradan gelir.
 *
 * Mimari (outputs/seo/ay1-blog-seo-mimarisi.md):
 *   sektör sayfası = PILLAR   → /sektorler/<slug>
 *   blog yazısı    = CLUSTER  → /blog/<slug>
 *   blog → pillar → /rontgen  (blog doğrudan /rontgen'e göndermez)
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const KOK = process.cwd();
const BLOG_DIZIN = path.join(KOK, "content/blog");
const SEKTOR_DIZIN = path.join(KOK, "content/sektorler");

/** Sektör anahtarı → URL slug'ı. İçerik dosyalarındaki `sektor` alanıyla eşleşir. */
export const SEKTOR_SLUG: Record<string, string> = {
  "kocluk-danismanlik": "kocluk-danismanlik",
  "cilt-bakimi-guzellik": "cilt-bakimi",
  "mobilya-showroom": "mobilya-showroom",
  "dil-okulu": "dil-okullari",
  "pilates-fitness": "pilates-fitness",
  gayrimenkul: "gayrimenkul",
};

/** Sektörün insan okunur adı — listelerde ve breadcrumb'da. */
export const SEKTOR_AD: Record<string, string> = {
  "kocluk-danismanlik": "Koçluk / Danışmanlık",
  "cilt-bakimi": "Cilt Bakımı / Güzellik",
  "mobilya-showroom": "Mobilya / Showroom",
  "dil-okullari": "Dil Okulları",
  "pilates-fitness": "Pilates / Fitness",
  gayrimenkul: "Gayrimenkul",
};

export type SSS = { soru: string; cevap: string };

export type Yazi = {
  slug: string;
  baslik: string;
  aciklama: string;
  anahtarKelime: string;
  yanKelimeler: string[];
  sektorSlug: string;
  sektorAd: string;
  okumaSuresi: string;
  /** İlk paragraf — GEO cevap bloğu. AI aramanın alıntıladığı birim. */
  ozet: string;
  html: string;
  sss: SSS[];
};

export type SektorSayfasi = {
  slug: string;
  ad: string;
  baslik: string;
  aciklama: string;
  pillarKelime: string;
  yanKelimeler: string[];
  html: string;
  /** "Final CTA" bloğu — sayfanın sonunda ayrı kutuda gösterilir. */
  ctaHtml: string;
  sss: SSS[];
};

/* ------------------------------------------------------------------ */
/* Yardımcılar                                                         */
/* ------------------------------------------------------------------ */

function dizi(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    return v.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * "## Sık sorulan sorular" bölümünü gövdeden ayırır.
 * Her `### Soru?` başlığı + ardındaki ilk paragraf bir SSS maddesidir.
 * Bu biçim içerik motorunda garanti altına alındı (20/20 blog, 6/6 sektör).
 */
function sssAyikla(govde: string): { govde: string; sss: SSS[] } {
  // Blog: "## Sık sorulan sorular" · Sektör sayfası: "## 7. SSS"
  const bas = govde.search(/^##\s+(?:\d+\.\s*)?(?:Sık sorulan sorular|SSS)\b.*$/im);
  if (bas === -1) return { govde, sss: [] };

  const sonrasi = govde.slice(bas);
  // Bölüm bir sonraki `## ` başlığında ya da `---` ayracında biter
  const bitis = sonrasi.slice(1).search(/^(##\s+(?!#)|---\s*$)/m);
  const bolum = bitis === -1 ? sonrasi : sonrasi.slice(0, bitis + 1);
  const kalan = govde.slice(0, bas) + (bitis === -1 ? "" : sonrasi.slice(bitis + 1));

  // `### Soru?` başlıklarına böl; her parçanın ilk paragrafı cevaptır.
  // (JS regex `\Z` desteklemez — bu yüzden lookahead yerine split kullanılıyor.)
  const sss: SSS[] = [];
  const parcalar = bolum.split(/^###\s+/m).slice(1);
  for (const parca of parcalar) {
    const satirSonu = parca.indexOf("\n");
    if (satirSonu === -1) continue;
    const soru = parca.slice(0, satirSonu).trim();
    const govdeParca = parca.slice(satirSonu + 1).trim();
    const cevap = govdeParca.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim();
    if (soru && cevap) sss.push({ soru, cevap });
  }
  return { govde: kalan, sss };
}

/** Markdown'ın ilk gerçek paragrafı — GEO cevap bloğu. */
function ilkParagraf(govde: string): string {
  const satirlar = govde.split(/\n\s*\n/);
  for (const p of satirlar) {
    const t = p.trim();
    if (!t || t.startsWith("#") || t.startsWith(">") || t.startsWith("|")) continue;
    return t.replace(/[*_`[\]]/g, "").replace(/\((?:https?:)?\/\/[^)]*\)/g, "").replace(/\s+/g, " ").trim();
  }
  return "";
}

function htmlUret(govde: string): string {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(govde) as string;
}


/**
 * Sektör sayfası markdown'ı brief'in blok yapısını taşıyor:
 *   "## 1. HERO", "## 2. TEŞHİS — bu sayfada ne anlatılıyor", "## 9. FİNAL CTA" …
 * Bunlar ÜRETİM İÇİ etiketler, okuyucuya gösterilmez. Burada:
 *   • numaralar atılır, ham etiketler okunabilir başlığa çevrilir
 *   • "İlgili yazılar" bloğu gövdeden ÇIKARILIR — şablon gerçek kartları basıyor
 *   • "Final CTA" bloğu ayrılır ve sayfanın sonunda kutu olarak gösterilir
 * Kaynak .md dosyalarına dokunulmaz; dönüşüm build sırasında yapılır.
 */
/**
 * Türkçe farkındalıklı anahtar üretimi.
 * JS'in toLowerCase'i "I"yı "ı" yapmaz, "İ"yi birleşik noktalı "i̇" yapar —
 * bu yüzden "NASIL ÇALIŞIR" gibi başlıklar düz regex'le eşleşmiyordu.
 * NFD ile ayrıştırıp birleşik işaretleri atıyor, sonra Türkçe harfleri ASCII'ye indiriyoruz.
 */
function anahtarla(t: string): string {
  return t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .trim();
}

/** Ham blok etiketi → okuyucuya gösterilecek başlık. `null` = başlık hiç basılmaz. */
const BASLIK_ESLEME: [RegExp, string | null][] = [
  [/^hero\b/, null], // hero'nun başlığı yok — giriş metninin kendisi
  [/^teshis\b/, "Teşhis"],
  [/^kayip hesabi\b/, "Kayıp hesabı"],
  [/^nasil calis/, "Nasıl çalışıyor"],
  [/^kimler icin\b/, "Kimler için, kimler için değil"],
  [/^anti[- ]?garanti\b/, "Sistem garantilidir, sonuç garanti edilmez"],
];

function blokBasliklariniDuzelt(md: string): { govde: string; ctaHtml: string } {
  const satirlar = md.split("\n");
  const cikti: string[] = [];
  const cta: string[] = [];
  let atlaniyor = false; // "İlgili yazılar" — şablon gerçek kartları basıyor
  let ctaIcinde = false;

  for (const satir of satirlar) {
    const m = satir.match(/^##\s+(?:\d+\.\s*)?(.+?)\s*$/);
    if (m) {
      const ham = m[1].trim();
      const k = anahtarla(ham);

      atlaniyor = /^ilgili yazi/.test(k);
      ctaIcinde =
        /^final cta\b/.test(k) ||
        /^simdi ne yapmali/.test(k) ||
        /^bir sonraki adim/.test(k);
      if (atlaniyor || ctaIcinde) continue;

      let yeni: string | null = ham;
      for (const [desen, karsilik] of BASLIK_ESLEME) {
        if (desen.test(k)) {
          yeni = karsilik;
          break;
        }
      }
      if (yeni) cikti.push(`## ${yeni}`);
      continue;
    }
    if (atlaniyor) continue;
    if (ctaIcinde) cta.push(satir);
    else cikti.push(satir);
  }

  const govde = cikti.join("\n").replace(/(?:\s*---\s*)+$/g, "").trim();
  const ctaMd = cta.join("\n").replace(/^(?:\s*---\s*)+/g, "").trim();
  return { govde, ctaHtml: ctaMd ? htmlUret(ctaMd) : "" };
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export function tumYazilar(): Yazi[] {
  if (!fs.existsSync(BLOG_DIZIN)) return [];
  return fs
    .readdirSync(BLOG_DIZIN)
    .filter((f) => f.endsWith(".md"))
    .map((dosya) => {
      const ham = fs.readFileSync(path.join(BLOG_DIZIN, dosya), "utf8");
      const { data, content } = matter(ham);
      const { govde, sss } = sssAyikla(content);
      const sektorAnahtar = String(data.sektor ?? "");
      const sektorSlug = SEKTOR_SLUG[sektorAnahtar] ?? sektorAnahtar;
      return {
        slug: String(data.slug ?? dosya.replace(/^blog-\d+-/, "").replace(/\.md$/, "")),
        baslik: String(data.baslik ?? ""),
        aciklama: String(data.meta_aciklama ?? ""),
        anahtarKelime: String(data.anahtar_kelime ?? ""),
        yanKelimeler: dizi(data.yan_kelimeler),
        sektorSlug,
        sektorAd: SEKTOR_AD[sektorSlug] ?? sektorSlug,
        okumaSuresi: String(data.okuma_suresi ?? ""),
        ozet: ilkParagraf(govde),
        html: htmlUret(govde),
        sss,
        _sira: Number(data.sira ?? data.reels_no) || 999,
      } as Yazi & { _sira: number };
    })
    .sort((a, b) => (a as any)._sira - (b as any)._sira);
}

export function yaziBul(slug: string): Yazi | undefined {
  return tumYazilar().find((y) => y.slug === slug);
}

export function sektorunYazilari(sektorSlug: string): Yazi[] {
  return tumYazilar().filter((y) => y.sektorSlug === sektorSlug);
}

/* ------------------------------------------------------------------ */
/* Sektör (pillar)                                                     */
/* ------------------------------------------------------------------ */

export function tumSektorler(): SektorSayfasi[] {
  if (!fs.existsSync(SEKTOR_DIZIN)) return [];
  const sira = ["kocluk-danismanlik", "cilt-bakimi", "mobilya-showroom", "dil-okullari", "pilates-fitness", "gayrimenkul"];
  return fs
    .readdirSync(SEKTOR_DIZIN)
    .filter((f) => f.endsWith(".md"))
    .map((dosya) => {
      const ham = fs.readFileSync(path.join(SEKTOR_DIZIN, dosya), "utf8");
      const { data, content } = matter(ham);
      const { govde: sssSonrasi, sss } = sssAyikla(content);
      const { govde, ctaHtml } = blokBasliklariniDuzelt(sssSonrasi);
      const url = String(data.url ?? "");
      const slug = url.split("/").filter(Boolean).pop() ?? dosya.replace(/^lp-/, "").replace(/\.md$/, "");
      return {
        slug,
        ad: SEKTOR_AD[slug] ?? slug,
        baslik: String(data.title ?? data.baslik ?? ""),
        aciklama: String(data.meta_description ?? data.meta_aciklama ?? ""),
        pillarKelime: String(data.pillar_kelime ?? ""),
        yanKelimeler: dizi(data.yan_kelimeler),
        html: htmlUret(govde),
        ctaHtml,
        sss,
      };
    })
    .sort((a, b) => sira.indexOf(a.slug) - sira.indexOf(b.slug));
}

export function sektorBul(slug: string): SektorSayfasi | undefined {
  return tumSektorler().find((s) => s.slug === slug);
}
