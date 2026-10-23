import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Başlangıç için Sizden İstediklerimiz",
  description:
    "Çalışmaya başladığımızda sizden beklediğim bilgi, erişim ve onayların listesi.",
  alternates: { canonical: "/sizden-istediklerimiz" },
  robots: { index: false, follow: true },
};

const SON_GUNCELLEME = "23 Ekim 2026";

const MADDELER: { baslik: string; neden: string; nasil: string }[] = [
  {
    baslik: "1. Hedef kitle formu",
    neden:
      "Reklam metinleri ve hedefleme, işinizi sizin kadar bilen biri olmadığı için sizin cevaplarınızdan çıkar.",
    nasil:
      "Ödemeden sonra size ayrıca e-postayla göndereceğim formu 3 iş günü içinde doldurmanız yeterli. Eksik kalan yer olursa size kısa bir soru gönderirim. Form gecikirse yalnız reklam metni ve yayın tarihi kayar; teknik kurulum paralel devam eder.",
  },
  {
    baslik: "2. Meta (Instagram / Facebook) erişimi",
    neden:
      "Reklamları sizin hesaplarınız üzerinden yönetebilmem için gerekli. Hesaplar her zaman sizin kalır.",
    nasil:
      "Mevcut reklam hesabınızı ve sayfanızı kullanırım. Kendi Business Manager’ımdan erişim isteği gönderirim; size Meta’dan bir bildirim ve e-posta gelir. Gelen isteği onaylamanız yeterli. Reklam hesabınız yoksa sizin işletme hesabınızda birlikte açarız.",
  },
  {
    baslik: "3. Google Ads erişimi (Google reklamı kullanılacaksa)",
    neden: "Google kampanyalarını sizin hesabınızdan kurup izleyebilmem için.",
    nasil:
      "Google Ads hesabınıza göndereceğim yönetici davetini kabul edin. Hesabınız yoksa birlikte sizin adınıza açarız.",
  },
  {
    baslik: "4. Web sitenizde ölçüm kodu",
    neden:
      "Formdan gelen başvuruyu hangi reklamın getirdiğini görebilmek için siteye bir kez ölçüm kodu (Google Tag Manager) eklenir.",
    nasil:
      "Kodu ben hazırlarım. Siteye ya sizin web sorumlunuz ekler ya da bana site yönetim erişimi verirsiniz; hangisini seçtiğinizi bana yazmanız yeterli.",
  },
  {
    baslik: "5. Alan adı (DNS) erişimi — gerekirse",
    neden:
      "Yalnızca yeni bir sayfa ya da alt alan adı bağlanacaksa gerekir; çoğu işte gerekmez.",
    nasil:
      "Gerekirse hangi kaydı ekleyeceğinizi adım adım yazarım; kendiniz ya da web sorumlunuz ekler.",
  },
  {
    baslik: "6. Reklam ödeme yöntemi",
    neden:
      "Reklam bütçesi doğrudan Meta ve Google’a ödenir; hizmet bedeline dahil değildir. Kart tanımlanmazsa reklamlar yayına girmez.",
    nasil:
      "Kendi kartınızı Meta ve Google reklam hesabınızın ödeme bölümüne siz tanımlarsınız. Kart bilginizi benimle paylaşmanıza gerek yok.",
  },
  {
    baslik: "7. Logo, görseller ve işletme bilgileri",
    neden:
      "Reklamlarda ve sayfalarda gerçek ürün ve hizmetlerinizi göstermek için.",
    nasil:
      "Logonuz, ürün ve hizmet fotoğraf/videolarınız, güncel fiyat bilginiz, onay verecek kişi ve gelen başvuruyu karşılayacak kişi.",
  },
  {
    baslik: "8. E-posta listeniz varsa",
    neden:
      "Mevcut bir listeye ileti göndermek için kişilerin izin vermiş olması gerekir; bunu birlikte kontrol etmemiz gerekir.",
    nasil:
      "Liste için size kısa bir soru listesi (izin durumu, toplanma yeri) göndereceğim. İzni belirsiz bir listeye ileti göndermem.",
  },
];

export default function SizdenIstediklerimizPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="container-x flex h-[72px] items-center justify-between">
          <Link href="/" aria-label="Ana sayfa">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-label text-muted hover:text-ink"
          >
            ← Ana sayfa
          </Link>
        </div>
      </header>

      <main className="container-x py-16 sm:py-20">
        <p className="eyebrow">Başlangıç</p>
        <h1 className="h2 mt-4">Sizden İstediklerimiz</h1>
        <p className="mt-3 text-sm text-muted">
          Son güncelleme: {SON_GUNCELLEME}
        </p>

        <div className="prose-body mt-8 max-w-2xl space-y-8 text-[0.95rem]">
          <p>
            Çalışmaya başladığımızda sizden birkaç bilgi, erişim ve onay
            bekliyorum. Aşağıdaki liste herkes için aynıdır; size ait olmayan
            maddeleri e-postamda ayrıca işaretlerim. Bunlar ne kadar hızlı
            gelirse kurulum o kadar hızlı ilerler.
          </p>

          {MADDELER.map((m) => (
            <section key={m.baslik} className="space-y-2">
              <h2 className="h3 text-ink">{m.baslik}</h2>
              <p>
                <strong className="text-ink">Neden gerekli:</strong> {m.neden}
              </p>
              <p>
                <strong className="text-ink">Nasıl:</strong> {m.nasil}
              </p>
            </section>
          ))}

          <section className="space-y-3">
            <h2 className="h3 text-ink">Takılırsanız</h2>
            <p>
              Hangi adımda takıldığınızı{" "}
              <a
                className="text-signal hover:underline"
                href={`mailto:${site.contact.email}?subject=Ba%C5%9Flang%C4%B1%C3%A7`}
              >
                {site.contact.email}
              </a>{" "}
              adresine ya da WhatsApp’tan ({site.contact.phoneLabel}) yazın;
              adım adım yardımcı olurum. Kişisel verilerinizin nasıl
              kullanıldığı için{" "}
              <Link className="text-signal hover:underline" href={site.legal.kvkkHref}>
                KVKK Aydınlatma Metni
              </Link>
              ’ne bakabilirsiniz.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
