# Proje özeti — canerdogru-site

canerdogru.com: Caner Doğru'nun "reklam değil, müşteri kazanım sistemi" sitesi; aynı zamanda portfolyo. Next.js (App Router) + Tailwind + Framer Motion, Vercel'de. Repo `canerdogru84/canerdogru-site-`.

## Sayfa ağacı
| Yol | Ne |
|---|---|
| `/` | ana landing |
| `/rontgen` | Röntgen başvuru formu (IG bio linki) |
| `/lp/<sektor>` | yalnız Meta reklam trafiği; menüsüz, noindex; 6 sektör (`content/lp/*.json`) |
| `/sektorler/<slug>` | organik pillar sayfaları (`content/sektorler/*.md`) |
| `/blog/<slug>` | cluster yazıları (`content/blog/*.md`); blog → pillar → `/rontgen` |
| `/checklist` | 30 günlük müşteri kazanım checklist'i (PDF `public/`) |
| `/kvkk`, `/kullanim-sartlari`, `/veri-silme` | yasal sayfalar |

## İçerik akışı
Metinler Leadadmedia'da üretilir (`../../../leadadmedia/context/icerik-zinciri.md`), uyum denetiminden geçer, buraya `content/` dosyası olarak girer. Sabit teklif/KPI metinleri `lib/funnel.ts`'te tek yerden.
