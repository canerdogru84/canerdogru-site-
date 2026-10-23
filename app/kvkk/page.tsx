import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Kişisel verilerin korunması hakkında aydınlatma metni.",
  robots: { index: false, follow: true },
};

const SON_GUNCELLEME = "23 Ekim 2026";

export default function KvkkPage() {
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
        <h1 className="h2 mt-4">KVKK Aydınlatma Metni</h1>
        <p className="mt-3 text-sm text-muted">Son güncelleme: {SON_GUNCELLEME}</p>

        <div className="prose-body mt-8 max-w-2xl space-y-8 text-[0.95rem]">
          <p>
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (“KVKK”) uyarınca kişisel verilerinizi nasıl işlediğimi açıklar.
          </p>

          <section className="space-y-3">
            <h2 className="h3 text-ink">1. Veri sorumlusu</h2>
            <p>
              <strong className="text-ink">{site.legal.unvan}</strong> ·
              canerdogru.com
              <br />
              Balat Mah. Avşa Sok. İpekoğulları 2 Apt. No:8 D:7, Nilüfer /
              Bursa
              <br />
              E-posta:{" "}
              <a
                className="text-signal hover:underline"
                href={`mailto:${site.contact.email}`}
              >
                {site.contact.email}
              </a>{" "}
              · Telefon: {site.contact.phoneLabel}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">2. Hangi verilerinizi alıyorum?</h2>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                <strong className="text-ink">Röntgen formu:</strong> ad soyad,
                telefon, e-posta, web sitesi, Instagram kullanıcı adı, aylık
                reklam bütçesi aralığı.
              </li>
              <li>
                <strong className="text-ink">Randevu (cal.com):</strong> ad,
                e-posta, telefon, randevu tarihi ve saati; hatırlatmaya
                verdiğiniz “Evet / Başka saat / İptal” yanıtı.
              </li>
              <li>
                <strong className="text-ink">Yazışmalar:</strong> WhatsApp,
                e-posta ve Instagram mesajlarınız.
              </li>
              <li>
                <strong className="text-ink">Checklist kaydı:</strong> ad,
                e-posta.
              </li>
              <li>
                <strong className="text-ink">
                  Sitede ölçüm (yalnız çerezleri kabul ederseniz):
                </strong>{" "}
                IP adresi, tarayıcı bilgisi, Meta çerez tanımlayıcıları.
              </li>
              <li>
                <strong className="text-ink">
                  Görüşme kaydı (yalnız izninizle):
                </strong>{" "}
                ses kaydı ve yazıya dökümü.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">
              3. Ne için ve hangi dayanakla işliyorum?
            </h2>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                Başvurunuzu yanıtlamak, Röntgen raporunu hazırlayıp göndermek,
                randevunuzu oluşturup 24 ve 2 saat önce hatırlatmak:{" "}
                <em>talebinizin yerine getirilmesi</em> (KVKK m.5/2-c).
              </li>
              <li>
                Teklif, sözleşme ve fatura işlemleri:{" "}
                <em>sözleşmenin ifası ve yasal yükümlülük</em> (m.5/2-c,
                m.5/2-ç).
              </li>
              <li>
                Kampanya ve bilgilendirme iletileri (e-posta, SMS, WhatsApp):
                yalnız formdaki kutuyu işaretlerseniz,{" "}
                <em>açık rızanızla</em>.
              </li>
              <li>
                Meta piksel ölçümü ve görüşme kaydı:{" "}
                <em>açık rızanızla</em>; vermezseniz yapılmaz.
              </li>
              <li>
                Güvenlik ve hataların giderilmesi: <em>meşru menfaat</em>{" "}
                (m.5/2-f).
              </li>
            </ul>
            <p>
              Pazarlama izni vermemeniz Röntgen raporunuzu veya başvuru
              yanıtınızı etkilemez.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">
              4. Verilerinizi kimlerle paylaşıyorum?
            </h2>
            <p>
              Verilerinizi satmam. Hizmeti sunmak için şu sağlayıcıları
              kullanırım: Supabase (kayıt; Frankfurt, Almanya), Brevo (e-posta),
              cal.com (randevu), Meta / WhatsApp / Instagram (mesajlaşma ve
              izniniz varsa ölçüm), Notion (iç takip), Telegram (bildirim),
              Modal (otomatik hatırlatma altyapısı), Google Drive (rapor
              saklama), Fireflies (izninizle görüşme dökümü), Anthropic ve
              Apify (herkese açık web ve Instagram içeriğiyle Röntgen analizi).
              Yasal olarak yetkili kurumlar talep ederse mevzuata uygun şekilde
              paylaşılabilir.
            </p>
            <p>
              Bu sağlayıcıların bir kısmı Türkiye dışında bulunduğu için
              verileriniz yurt dışına aktarılabilir (KVKK m.9).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">5. Ne kadar süre saklıyorum?</h2>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                Başvuru ve randevu kayıtları: son iletişimden itibaren{" "}
                <strong className="text-ink">2 yıl</strong>.
              </li>
              <li>
                Röntgen için toplanan ham web ve Instagram verisi: yaklaşık 90
                gün; hazırlanan rapor saklanır.
              </li>
              <li>Fatura ve muhasebe kayıtları: yasal süre.</li>
              <li>
                Görüşme kaydı: <strong className="text-ink">1 yıl</strong>.
              </li>
            </ul>
            <p>Süre dolunca verileri silerim veya anonim hale getiririm.</p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">6. Haklarınız</h2>
            <p>
              KVKK m.11 uyarınca verilerinizin işlenip işlenmediğini öğrenme,
              bilgi isteme, işleme amacını öğrenme, aktarıldığı kişileri
              bilme, düzeltme veya silme isteme, bunların aktarılan kişilere
              bildirilmesini isteme, otomatik analiz sonucuna itiraz etme ve
              zarar halinde tazminat isteme haklarınız vardır. Pazarlama iznini
              ve çerez onayını istediğiniz an geri alabilirsiniz. Instagram’dan
              yazıştıysanız{" "}
              <Link className="text-signal hover:underline" href="/veri-silme">
                veri silme sayfasına
              </Link>{" "}
              bakabilirsiniz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">7. Başvuru</h2>
            <p>
              <a
                className="text-signal hover:underline"
                href={`mailto:${site.contact.email}?subject=KVKK%20Ba%C5%9Fvurusu`}
              >
                {site.contact.email}
              </a>{" "}
              adresine, konu satırına “KVKK Başvurusu” yazarak ve kimliğinizi
              doğrulayacak bilgiyle yazın. Talebinizi{" "}
              <strong className="text-ink">en geç 30 gün içinde</strong>{" "}
              yanıtlarım. Yanıtı yetersiz bulursanız Kişisel Verileri Koruma
              Kurulu’na şikâyet edebilirsiniz.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
