# canerdogru-site — Proje Çalışma Talimatları

Bu dosya kısa ve kalıcı kuralları içerir. Proje bilgisi `context/` altındadır.
Claude Code bu dosyayı doğrudan okur; Codex `AGENTS.md` üzerinden buraya yönlenir.
Çakışmada `context/kararlar.md` en güncel karardır. **İçerik kararları (teklif dili, fiyat, sektör, uyum) Leadadmedia'dadır:** `../../leadadmedia/context/kararlar.md`.

## Proje bağlamını kullanma
- Her görevin başında `context/README.md` haritasını oku; "her görevde oku" dosyalarını oku.
- "hafızayı güncelle", "bağlamı denetle", "kaynakları denetle" → `proje-hafizasi` skill'i.
- "toparla" → Obsidian kaydı (çalışma alanı kökündeki kural).

## Sabit kurallar (ayrıntı `context/kurallar-ve-sinirlar.md`)
1. `main`'e push = canlı yayın (Vercel). Push ve Vercel ayarı Caner onayı ister.
2. Kamuya açık metinde "Leadadmedia" adı geçmez; marka "Caner Doğru".
3. Blog ve sektör içerikleri Leadadmedia içerik zincirinde üretilir; burada elle yazılmaz, uyum denetiminden geçmeden yayına girmez.
4. `.env.local*` dosyalarına dokunulmaz.
