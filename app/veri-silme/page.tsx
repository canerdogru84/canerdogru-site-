import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veri Silme Talimatları",
  description:
    "Instagram üzerinden iletişime geçtiğinizde saklanan bilgilerin nasıl sildirileceği.",
  alternates: { canonical: "/veri-silme" },
  robots: { index: false, follow: true },
};

const SON_GUNCELLEME = "25 Ağustos 2026";

export default function VeriSilmePage() {
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
        <h1 className="h2 mt-4">Verilerinizi Nasıl Sildirirsiniz?</h1>

        <div className="prose-body mt-8 max-w-2xl space-y-8 text-[0.95rem]">
          <p>
            Bu sayfa, Instagram üzerinden benimle iletişime geçtiğinizde saklanan
            bilgilerin nasıl silineceğini açıklar.
          </p>

          <section className="space-y-3">
            <h2 className="h3 text-ink">Hangi bilgiler saklanıyor?</h2>
            <p>
              Instagram gönderilerimden birine yorum yazdığınızda veya bana
              doğrudan mesaj gönderdiğinizde şunlar kaydedilir:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                Instagram kullanıcı adınız ve Instagram tarafından verilen hesap
                numaranız
              </li>
              <li>Yazdığınız yorumun metni</li>
              <li>Aramızda geçen mesajların içeriği</li>
              <li>Mesajlaşmanın tarih ve saati</li>
            </ul>
            <p>
              Bu bilgiler yalnızca size cevap verebilmek, aynı mesajı iki kez
              göndermemek ve sorularınızı yanıtlayabilmek için kullanılır.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">Bu bilgiler ne kadar süre saklanıyor?</h2>
            <p>
              Son mesajlaşmanızdan itibaren{" "}
              <strong className="text-ink">12 ay</strong>. Bu sürenin sonunda
              kayıtlar kendiliğinden silinir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">Nasıl sildiririm?</h2>
            <p>Üç yoldan biriyle talep edebilirsiniz:</p>
            <ol className="ml-5 list-decimal space-y-2">
              <li>
                <strong className="text-ink">Instagram’dan:</strong>{" "}
                <a
                  className="text-signal hover:underline"
                  href={site.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.contact.instagramLabel}
                </a>{" "}
                hesabına <strong className="text-ink">“VERİLERİMİ SİL”</strong>{" "}
                yazın.
              </li>
              <li>
                <strong className="text-ink">E-posta ile:</strong>{" "}
                <a
                  className="text-signal hover:underline"
                  href={`mailto:${site.contact.email}?subject=Veri%20silme%20talebi`}
                >
                  {site.contact.email}
                </a>{" "}
                adresine, Instagram kullanıcı adınızı belirterek yazın.
              </li>
              <li>
                <strong className="text-ink">
                  Mesajlaşmayı durdurmak için:
                </strong>{" "}
                Instagram’da <strong className="text-ink">“DUR”</strong> yazmanız
                yeterli. Bu, otomatik mesajları durdurur; kayıtlarınızı da silmek
                isterseniz yukarıdaki iki yoldan birini kullanın.
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">Ne kadar sürede siliniyor?</h2>
            <p>
              Talebiniz{" "}
              <strong className="text-ink">en geç 30 gün içinde</strong>{" "}
              karşılanır ve işlem tamamlandığında size bilgi verilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">Silinince ne olur?</h2>
            <p>
              Yukarıda sayılan tüm kayıtlar kalıcı olarak silinir. Instagram’daki
              yorumunuz ve mesajlarınız Instagram’ın kendi sistemlerinde kalır —
              onları Instagram uygulamasından kendiniz silebilirsiniz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="h3 text-ink">Yasal dayanak</h2>
            <p>
              Bu haklarınız 6698 sayılı Kişisel Verilerin Korunması Kanunu
              kapsamındadır. Ayrıntılı bilgi:{" "}
              <Link
                className="text-signal hover:underline"
                href={site.legal.kvkkHref}
              >
                Gizlilik Politikası
              </Link>
              .
            </p>
          </section>

          <div className="border-t border-line pt-6 text-[13px] text-muted">
            <p>Veri sorumlusu: {site.legal.company}</p>
            <p className="mt-1">
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
