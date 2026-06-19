import Link from "next/link";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import { site } from "../../lib/site";
import { IconCheck, IconArrow } from "../icons";

type Offer = {
  no: string;
  title: string;
  badge?: string;
  scope: string;
  benefit: string;
  includes?: string[];
  cta: { label: string; href: string; primary?: boolean; external?: boolean };
  note?: { label: string; href: string };
  featured?: boolean;
};

const offers: Offer[] = [
  {
    no: "01",
    title: "Dijital Büyüme Röntgeni",
    badge: "Ücretsiz",
    scope:
      "İşletmenin dijital varlığını tarayıp 3 kritik kayıp noktasını gösteriyorum. 48 saat içinde kişiye özel video + rapor.",
    benefit:
      "Neyi düzeltirsen en hızlı kazanç geleceğini, hiçbir taahhüt vermeden öğrenirsin.",
    cta: { label: "Ücretsiz Başvur", href: "/rontgen", primary: true },
    featured: true,
  },
  {
    no: "02",
    title: "Müşteri Kazanım Sistemi Kurulumu",
    scope:
      "Reklam altyapısı, dönüşüm sayfası, CRM, WhatsApp YZ otomasyonu, e-posta serisi — hepsi kurulu ve test edilmiş.",
    benefit:
      "Kaçan lead, geç yanıt, takipsizlik biter; reklam bütçen müşteriye dönüşmeye başlar.",
    includes: [
      "Reklam yönetimi",
      "Dönüşüm odaklı sayfa",
      "CRM kurulumu & yönetimi",
      "WhatsApp YZ müşteri temsilcisi",
      "Takip & otomasyon akışları",
      "Ölçümleme & raporlama",
    ],
    cta: { label: "Detay için Görüşme Planla", href: site.contact.whatsappHref, external: true },
  },
  {
    no: "03",
    title: "Büyüme Partnerliği",
    badge: "Aylık",
    scope: "Kampanya yönetimi, optimizasyon, A/B test, raporlama, ölçekleme.",
    benefit:
      "Sistem kurulduktan sonra her ay daha verimli; bütçen büyüdükçe sonuç da büyür.",
    cta: { label: "Detay için Görüşme Planla", href: site.contact.whatsappHref, external: true },
  },
  {
    no: "04",
    title: "AI Otomasyon Çözümleri",
    badge: "Flowlattice",
    scope:
      "WhatsApp YZ asistanı, Instagram YZ asistanı ve dahası. İşletmeni 7/24 otomatik çalışır hale getirir.",
    benefit:
      "Sen uyurken bile gelen her mesaj yanıtlanır, nitelenir, randevuya çevrilir.",
    cta: { label: "Detay için Görüşme Planla", href: site.contact.whatsappHref, external: true },
    note: { label: "flowlattice.com", href: "https://flowlattice.com" },
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="section bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Hizmetler"
          title="Hangi noktadaysan, oradan başla"
          lead="Ücretsiz röntgenle başlarız; ihtiyacına göre sistem kurulumu, büyüme partnerliği ve otomasyon devreye girer. Tek seferlik dayatma yok — basamak basamak büyürüz."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {offers.map((o, i) => (
            <Reveal key={o.no} delay={(i % 2) * 0.06}>
              <article
                className={`bp-card tick-corners flex h-full flex-col p-7 sm:p-8 ${
                  o.featured ? "ring-1 ring-signal/40" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-extrabold text-line-strong">
                    {o.no}
                  </span>
                  {o.badge && (
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-label ${
                        o.featured
                          ? "bg-signal text-white"
                          : "bg-surface text-ink-soft"
                      }`}
                    >
                      {o.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-ink">
                  {o.title}
                </h3>
                <p className="prose-body mt-3 text-[0.95rem]">{o.scope}</p>

                {o.includes && (
                  <div className="mt-5 rounded-lg border border-line bg-surface/40 p-4">
                    <p className="eyebrow-muted mb-3">Neler dahil</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {o.includes.map((it) => (
                        <li
                          key={it}
                          className="flex items-start gap-2 text-[0.85rem] text-ink-soft"
                        >
                          <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-5 flex items-start gap-2 text-[0.92rem] font-medium text-ink">
                  <IconCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-signal" />
                  {o.benefit}
                </p>

                <div className="mt-7 flex flex-1 flex-col justify-end">
                  {o.cta.external ? (
                    <a
                      href={o.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={o.cta.primary ? "btn-primary" : "btn-ghost"}
                    >
                      {o.cta.label}
                      <IconArrow className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={o.cta.href}
                      className={o.cta.primary ? "btn-primary" : "btn-ghost"}
                    >
                      {o.cta.label}
                      <IconArrow className="h-4 w-4" />
                    </Link>
                  )}
                  {o.note && (
                    <a
                      href={o.note.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-center text-xs text-muted underline-offset-2 hover:text-signal hover:underline"
                    >
                      {o.note.label} ↗
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
