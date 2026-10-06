# Bağlam haritası — canerdogru-site

Bu dosya `context/` klasörünün haritasıdır; bilgiyi tekrar etmez, nerede olduğunu ve ne zaman okunacağını söyler.
Çakışmada **`kararlar.md` en günceldir**; içerik kararlarında `../../../leadadmedia/context/kararlar.md` geçerlidir.

## Her görevde oku
- `proje-ozeti.md` — site ne için, sayfa ağacı, içerik nereden geliyor
- `kurallar-ve-sinirlar.md` — yayın, marka adı, içerik ve sır kuralları
- `kararlar.md` — siteye özgü tarihli kararlar

## Konuya göre oku
| Konu | Dosya |
|---|---|
| Kurulum, ortam değişkenleri, iletişim bilgisi tek dosyası (`lib/site.ts`) | `../README.md` |
| Reklam LP'leri (`/lp/<sektor>`), sabit teklif metinleri | `../lib/funnel.ts`, `../content/lp/*.json`; kaynak `../../../leadadmedia/outputs/landing-pages/` |
| Blog / sektör (pillar-cluster) | `../lib/icerik.ts`, `../content/blog/`, `../content/sektorler/`; mimari `../../../leadadmedia/outputs/seo/` |
| Form → Supabase | `../lib/supabase.ts`, `../supabase/schema.sql`, `../app/api/` |
| Konumlanma, teklif, sektör, uyum | `../../../leadadmedia/context/README.md` |
| Karar bekleyenler | `acik-konular.md` |

## Proje dışı bağlam
- Çalışma alanı ortak bağlamı: `../../../context/README.md`.
- Obsidian: `~/Obsidian/01 - Projeler/canerdogru-site/Kokpit - canerdogru-site.md`.

## Harita kuralları
- Yeni dosya, taşıma, yeniden adlandırma bu haritada aynı işlemde güncellenir.
- Eskiyen dosya silinmez: `../_arsiv/`'e taşınır.
