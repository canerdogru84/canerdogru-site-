# Kararlar — canerdogru-site

Biçim: **tarih — karar** · etkilediği yer. Değişen karar silinmez; eskisi "GEÇERSİZ (tarih)" diye işaretlenir.
İçerik, teklif ve uyum kararları burada kopyalanmaz: `../../../leadadmedia/context/kararlar.md`.

## Aktif
- **2026-10-23 — Röntgen anlatımı tek doğru (Caner):** ücretsiz; **görüşme saatini seçen** firmaya 48 saat içinde yazılı rapor (3 kritik kayıp noktası + hemen yapılabilecek 2-3 iyileştirme); 45 dk canlı görüşmede rapor ekranda birlikte geçilir, canlı görüşme haftada 10 firma. Saat seçmeyene rapor gitmez → `LeadForm.tsx` akışı (≥50K saat seçilmeden kayıt yok) aynen geçerli, değişmedi. Video gönderilmez, metinlerde geçmez. · yerine geçtiği: Leadadmedia 2026-10-13 "tek yol görüşme" maddesinin "yazılı rapor yok" dili (rapor alternatif değil, görüşmeye ek) · etki: `Services.tsx`, `Steps.tsx`, `FinalCTA.tsx`, `FAQ.tsx`, `app/rontgen/page.tsx`, `lib/funnel.ts` SABIT (`nasil.rontgen`, `rontgendeSabit`; 6 LP)
- **2026-10-06 — Evrensel proje yapısı uygulandı:** `CLAUDE.md` + `AGENTS.md` + `context/` + `.claude/skills/proje-hafizasi`.
- **2026-10-05 — LP blok 5 = KPI çerçevesi** (4 ana ölçüt, veri kaynağı etiketi, hedef rakam yok); SSS'den garanti sorusu kaldırıldı. · etki: `lib/funnel.ts`, `content/lp/*.json`
- **2026-09-30 — Ajan siteye yazmaz,** öneri diff + Caner onayı.
- **2026-09-26 — "Leadadmedia" kamuya çıkmaz.**
