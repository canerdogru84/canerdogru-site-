# canerdogru.com

Caner Doğru — "reklam değil, müşteri kazanım sistemi" landing page'i.
Next.js (App Router) + Tailwind CSS + Framer Motion. Tasarım yönü: **Blueprint / Sistem Mimarisi**.

## Hızlı başlangıç

```bash
npm install
cp .env.local.example .env.local   # Supabase değerlerini girin (aşağıya bakın)
npm run dev                        # http://localhost:3000
```

## Sayfalar

- `/` — 9 bölümlük ana landing (Hero → Problem → Sistem → Kimler → Süreç → Hizmetler → Güven → SSS → Form)
- `/rontgen` — odaklı, tek-amaçlı başvuru formu (Instagram bio linki buraya)
- `/kvkk` — KVKK metni (yer tutucu — gerçek metni girin)

## Düzenlemeniz gereken tek dosya: `lib/site.ts`

Tüm gerçek bilgiler burada toplandı:

- **İletişim**: telefon, e-posta, Instagram, WhatsApp linki
- **Görseller**: `assets.logo`, `assets.portrait`, `assets.ogImage`
  - Dosyaları `public/` içine koyun (ör. `public/logo.svg`, `public/caner.jpg`, `public/og.png`)
  - Sonra `lib/site.ts` içindeki yolları güncelleyin
  - `logo`/`portrait` `null` bırakılırsa zarif yedekler (wordmark / blueprint slot) gösterilir
- **KVKK linki** ve **bütçe seçenekleri** de buradadır

## Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje açın.
2. **SQL Editor** → `supabase/schema.sql` içeriğini yapıştırıp çalıştırın
   (leads tablosu + sadece-insert RLS policy oluşturur).
3. **Project Settings → API**'den şu iki değeri `.env.local`'a girin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...        # anon (public) key
   ```
4. `npm run dev` → `/rontgen`'de formu test edin. Kayıtlar Supabase
   **Table Editor → leads**'te görünür.

### Güvenlik notu

- **service_role key kullanılmaz ve client'a hiçbir zaman konmaz.**
- Form gönderimi server-side route handler (`app/api/lead/route.ts`) üzerinden
  gider; anon key yalnızca server'da okunur.
- RLS açık; anon rolü **sadece insert** yapabilir, satırları okuyamaz.
- Bütçe eşiği (50.000 TL altı) hem client'ta hem server'da doğrulanır.

leads alanları: `ad_soyad`, `telefon`, `eposta`, `web_sitesi`, `reklam_butcesi`, `kaynak`.

## Vercel'e deploy

1. Repoyu GitHub'a push edin, Vercel'de import edin.
2. **Environment Variables**'a `NEXT_PUBLIC_SUPABASE_URL` ve `SUPABASE_ANON_KEY` ekleyin.
3. Deploy. Domaini (`canerdogru.com`) Vercel'de bağlayın.

## Tasarım sistemi (özet)

- **Renk**: kağıt `#FBFBFD` · mürekkep/lacivert `#0B1B3A` · sinyal mavisi `#0D6EFD` · gri `#6B7280` · bakır vurgu `#C2784F`
- **Tipografi**: Cabinet Grotesk (başlık) · Switzer (gövde) · JetBrains Mono (veri etiketleri) — Inter kullanılmadı
- **İmza öğesi**: scroll'da çizilen canlı sistem şeması (`components/PipelineFlow.tsx`)
- Tokenlar `tailwind.config.ts` + `app/globals.css` içinde.
