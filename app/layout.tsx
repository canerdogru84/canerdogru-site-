import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import Analytics from "@/components/Analytics";
import "./globals.css";

const title = "Caner Doğru | Hizmet İşletmelerine Müşteri Kazanım Sistemi";
const description =
  "Reklam + Otomasyon + Takip = Tek Sistem. Hizmet işletmeleri için uçtan uca müşteri kazanım sistemi kuruyorum; hedef kitle analizinden sonra 10 iş günde kurulu. Ücretsiz Dijital Büyüme Röntgeni ile başla.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s | Caner Doğru",
  },
  description,
  applicationName: site.brand,
  authors: [{ name: site.name }],
  keywords: [
    "müşteri kazanım sistemi",
    "performans pazarlama",
    "reklam yönetimi",
    "CRM",
    "WhatsApp otomasyon",
    "Caner Doğru",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.brand,
    title,
    description,
    images: [{ url: site.assets.ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [site.assets.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBFBFD",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Poppins — tek tipografi (başlık + gövde + etiketler) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
