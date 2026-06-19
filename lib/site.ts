/**
 * TEK DÜZENLEME NOKTASI
 * ----------------------
 * Gerçek iletişim bilgileri, görsel yolları ve metinler burada.
 * Sağladığınız foto/logoyu /public içine koyup yollarını aşağıda güncelleyin.
 * Telefon/e-posta/Instagram/KVKK alanlarına gerçek değerleri yazın.
 */

export const site = {
  name: "Caner Doğru",
  brand: "Caner Doğru",
  domain: "canerdogru.com",
  url: "https://canerdogru.com",

  // --- İLETİŞİM ---
  contact: {
    // E.164 + görünür biçim. tel: linki phoneHref kullanır.
    phoneHref: "+905309919484",
    phoneLabel: "+90 530 991 94 84",
    email: "info@canerdogru.com",
    instagram: "https://instagram.com/canerdogrucom",
    instagramLabel: "@canerdogrucom",
    // LinkedIn — gerçek profil URL'ni gir
    linkedin: "https://www.linkedin.com/in/canerdogru",
    // Önceden doldurulmuş mesajla WhatsApp'a yönlendirir.
    whatsappHref:
      "https://wa.me/905309919484?text=Merhaba%20Caner%2C%20Dijital%20B%C3%BCy%C3%BCme%20R%C3%B6ntgeni%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
  },

  // --- GÖRSELLER (/public içine koyun, yolları güncelleyin) ---
  assets: {
    logo: "/caner-logo.svg" as string | null, // header + footer logosu (currentColor)
    portrait: "/caner-2.png" as string | null, // Güven bölümü portresi (şeffaf cutout)
    ogImage: "/og.png", // 1200x630 sosyal paylaşım görseli (opsiyonel)
    // Checklist lead magnet — bu adlı PDF'i /public içine koyun.
    // Form gönderilince otomatik indirilir. Dosya yoksa indirme başlamaz.
    checklistPdf: "/30-gunluk-musteri-kazanim-sistemi.pdf",
  },

  // --- YASAL ---
  legal: {
    kvkkHref: "/kvkk", // KVKK metniniz hazır olunca bu sayfaya bağlayın
    company: "Caner Doğru",
  },

  // Reklam bütçesi aralıkları — bütçe filtresi (50K altı seçenek yok).
  // Seçilen değer olduğu gibi Supabase'e kaydedilir.
  budgetOptions: [
    { value: "", label: "Aylık reklam bütçenizi seçin" },
    { value: "0-50k", label: "50.000 TL altı" },
    { value: "50-100k", label: "50.000 - 100.000 TL" },
    { value: "100-250k", label: "100.000 - 250.000 TL" },
    { value: "250k-plus", label: "250.000 TL+" },
  ],
} as const;

export type NavItem = { href: string; label: string };

export const navItems: NavItem[] = [
  { href: "#problem", label: "Problem" },
  { href: "#sistem", label: "Sistem" },
  { href: "#kimler", label: "Kimlerle" },
  { href: "#surec", label: "Süreç" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#sss", label: "SSS" },
];
