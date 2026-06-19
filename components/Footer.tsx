import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/lib/site";
import { IconInstagram, IconLinkedIn, IconWhatsApp } from "./icons";

const socials = [
  { href: site.contact.instagram, label: "Instagram", Icon: IconInstagram },
  { href: site.contact.linkedin, label: "LinkedIn", Icon: IconLinkedIn },
  { href: site.contact.whatsappHref, label: "WhatsApp", Icon: IconWhatsApp },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Hizmet işletmeleri için reklam değil, uçtan uca müşteri kazanım
              sistemleri kuruyorum.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-signal/40 hover:bg-signal/5 hover:text-signal"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow-muted mb-4">İletişim</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="text-ink-soft transition-colors hover:text-signal"
                >
                  {site.contact.phoneLabel}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-ink-soft transition-colors hover:text-signal"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-soft transition-colors hover:text-signal"
                >
                  {site.contact.instagramLabel}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow-muted mb-4">Sayfa</p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/rontgen"
                  className="text-ink-soft transition-colors hover:text-signal"
                >
                  Dijital Büyüme Röntgeni
                </Link>
              </li>
              <li>
                <Link
                  href="/checklist"
                  className="text-ink-soft transition-colors hover:text-signal"
                >
                  30 Günlük Checklist
                </Link>
              </li>
              <li>
                <Link
                  href={site.legal.kvkkHref}
                  className="text-ink-soft transition-colors hover:text-signal"
                >
                  KVKK Aydınlatma Metni
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] uppercase tracking-label text-muted">
            © {site.name} · {site.domain}
          </p>
          <p className="text-xs text-muted">Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
