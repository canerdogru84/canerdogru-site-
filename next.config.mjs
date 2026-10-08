/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Kısa organik linkler: biyografide/DM'de temiz görünür, UTM'yi site ekler.
  // Geçici (307) — hedef değişirse Instagram'daki link aynı kalır.
  async redirects() {
    const rontgen = (kampanya) =>
      `/rontgen?utm_source=instagram&utm_medium=organic&utm_campaign=${kampanya}`;
    return [
      { source: "/ig", destination: rontgen("bio"), permanent: false },
      { source: "/dm", destination: rontgen("dm-bot"), permanent: false },
    ];
  },
};

export default nextConfig;
