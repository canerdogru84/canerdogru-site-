import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description:
    "canerdogru.com ve @canerdogrucom Instagram otomatik mesajlaşma hizmetinin kullanım şartları.",
  alternates: { canonical: "/kullanim-sartlari" },
  robots: { index: false, follow: true },
};

const SON_GUNCELLEME = "25 Ağustos 2026";

export default function KullanimSartlariPage() {
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
        <p className="eyebrow">Yasal</p>
        <h1 className="h2 mt-4">Kullanım Şartları</h1>

        <div className="prose-body mt-8 max-w-2xl space-y-8 text-[0.95rem]">
          <p>
            Bu şartlar, <strong className="text-ink">{site.domain}</strong>{" "}
            adresini ve{" "}
            <strong className="text-ink">{site.contact.instagramLabel}</strong>{" "}
            Instagram hesabındaki otomatik mesajlaşma hizmetini kullanımınızı
            düzenler. Siteyi kullanarak veya otomasyona yorum ya da mesaj yoluyla
            katılarak bu şartları kabul etmiş olursunuz.
          </p>

          <section className="space-y-3">
            <h2 className="h3 text-ink">1. Hizmetin kapsamı</h2>
            <p>Bu site ve bağlı Instagram otomasyonu üzerinden şunlar sunulur:</p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>Ücretsiz bilgilendirme içerikleri ve rehberler</li>
              <li>
                Dijital Büyüme Röntgeni adı verilen ücretsiz ön değerlendirme
                talebi
              </li>
              <li>Hizmetler hakkında bilgi ve iletişim imkânı</li>
            </ul>
            <p>
              Site üzerinden doğrudan satış veya ödeme alınmaz. Ücretli hizmetler
              ayrı bir sözleşmeyle yürütülür.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">2. Instagram otomatik mesajlaşma</h2>
            <p>
              Instagram gönderilerimden birine belirtilen anahtar kelimeyi yorum
              olarak yazdığınızda, size otomatik bir özel mesaj gönderilir. Bu
              mesaj, sizin talebiniz üzerine gönderilir.
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                Mesajlaşmayı istediğiniz an{" "}
                <strong className="text-ink">“DUR”</strong> yazarak
                durdurabilirsiniz.
              </li>
              <li>
                Otomatik cevaplar bilgilendirme amaçlıdır; kişiye özel
                danışmanlık değildir.
              </li>
              <li>
                Cevapların bir kısmı yapay zekâ desteğiyle üretilir ve hata
                içerebilir. Bağlayıcı bilgi için doğrudan iletişime geçin.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">3. İçeriklerin kullanımı</h2>
            <p>
              Sitedeki yazılar, rehberler, checklist ve şablonlar{" "}
              {site.legal.company}’ya aittir. Kişisel ve kurum içi kullanım
              serbesttir. İzinsiz olarak çoğaltılamaz, satılamaz veya kendi
              ürününüzmüş gibi yeniden yayınlanamaz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">4. Sonuç taahhüdü verilmez</h2>
            <p>
              Paylaşılan bilgiler ve sunulan hizmetler{" "}
              <strong className="text-ink">sonuç garantisi içermez.</strong>{" "}
              Pazarlama sonuçları sektöre, bütçeye, rekabete ve uygulamaya göre
              değişir. Bu sitedeki hiçbir ifade belirli bir müşteri sayısı, satış
              tutarı veya gelir vaadi olarak yorumlanamaz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">5. Sorumluluk sınırı</h2>
            <p>
              Bu sitedeki bilgiler olduğu gibi sunulur. Bilgilerin
              uygulanmasından doğabilecek doğrudan veya dolaylı zararlardan
              sorumluluk kabul edilmez. Kendi işinize dair kararları kendi
              değerlendirmenizle alırsınız.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">6. Üçüncü taraf bağlantıları</h2>
            <p>
              Sitede ve mesajlarda üçüncü taraf adreslere (Notion, form sayfaları
              gibi) bağlantı verilebilir. Bu sayfaların içeriğinden ve gizlilik
              uygulamalarından ilgili sağlayıcılar sorumludur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">7. Kişisel veriler</h2>
            <p>
              Kişisel verilerinizin işlenmesi{" "}
              <Link
                className="text-signal hover:underline"
                href={site.legal.kvkkHref}
              >
                Gizlilik Politikası
              </Link>{" "}
              kapsamındadır. Verilerinizi sildirmek için{" "}
              <Link
                className="text-signal hover:underline"
                href={site.legal.veriSilmeHref}
              >
                Veri Silme Talimatları
              </Link>{" "}
              sayfasına bakın.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">8. Değişiklikler</h2>
            <p>
              Bu şartlar güncellenebilir. Güncel sürüm her zaman bu adreste
              yayınlanır ve yayınlandığı tarihten itibaren geçerlidir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">9. Uygulanacak hukuk</h2>
            <p>
              Bu şartlara Türkiye Cumhuriyeti hukuku uygulanır. Uyuşmazlıklarda
              İstanbul mahkemeleri ve icra daireleri yetkilidir.
            </p>
          </section>

          <div className="border-t border-line pt-6 text-[13px] text-muted">
            <p>
              İletişim:{" "}
              <a
                className="text-signal hover:underline"
                href={`mailto:${site.contact.email}`}
              >
                {site.contact.email}
              </a>
            </p>
            <p className="mt-1">Son güncelleme: {SON_GUNCELLEME}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
