import type { Metadata } from "next";
import Logo from "@/components/Logo";
import GirisFormu from "@/components/panel/GirisFormu";

export const metadata: Metadata = {
  title: "Panel girişi",
  robots: { index: false, follow: false },
};

export default async function GirisSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string; gonderildi?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
          <h1 className="font-display text-xl font-semibold text-ink">Ölçüm paneliniz</h1>
          <p className="mt-2 text-sm text-muted">
            Şifre yok. E-posta adresinizi yazın, size tek tıklık bir giriş bağlantısı gönderelim.
          </p>
          {sp.gonderildi ? (
            <div className="mt-6 rounded-xl bg-surface p-4 text-sm text-ink">
              Bağlantı gönderildi. Gelen kutunuzu (ve gereksiz klasörünü) kontrol edin; bağlantı 1 saat geçerli.
            </div>
          ) : (
            <GirisFormu hata={sp.hata} />
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Panel yalnız size açılan ölçümleri gösterir; sonuç vaadi içermez.
        </p>
      </div>
    </main>
  );
}
