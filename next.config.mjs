/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Kısa organik linkler: biyografide/DM'de temiz görünür, UTM'yi site ekler.
  // Geçici (307) — hedef değişirse Instagram'daki link aynı kalır.
  async redirects() {
    // utm_medium "dm" → panelde ig-dm kanalı (sql/s23); biyografi "organic".
    const rontgen = (kaynak, ortam, kampanya) =>
      `/rontgen?utm_source=${kaynak}&utm_medium=${ortam}&utm_campaign=${kampanya}`;
    return [
      { source: "/ig", destination: rontgen("instagram", "organic", "bio"), permanent: false },
      { source: "/dm", destination: rontgen("instagram", "dm", "dm-bot"), permanent: false },
      { source: "/fb", destination: rontgen("messenger", "dm", "dm-bot"), permanent: false },
      { source: "/wa", destination: rontgen("whatsapp", "dm", "dm-bot"), permanent: false },
    ];
  },
};

export default nextConfig;
