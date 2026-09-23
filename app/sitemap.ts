import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { tumSektorler, tumYazilar } from "@/lib/icerik";

/**
 * sitemap.xml — build sırasında içerik dosyalarından üretilir.
 * Yeni bir blog/sektör dosyası eklendiğinde elle güncelleme gerekmez.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const simdi = new Date();

  const sabit: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: simdi, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/rontgen`, lastModified: simdi, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/sektorler`, lastModified: simdi, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/blog`, lastModified: simdi, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/checklist`, lastModified: simdi, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/kvkk`, lastModified: simdi, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/kullanim-sartlari`, lastModified: simdi, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/veri-silme`, lastModified: simdi, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Pillar sayfaları blogdan önce gelir (mimaride üst katman)
  const sektorler: MetadataRoute.Sitemap = tumSektorler().map((s) => ({
    url: `${site.url}/sektorler/${s.slug}`,
    lastModified: simdi,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const yazilar: MetadataRoute.Sitemap = tumYazilar().map((y) => ({
    url: `${site.url}/blog/${y.slug}`,
    lastModified: simdi,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...sabit, ...sektorler, ...yazilar];
}
