import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPanelClient, type PanelMusteri } from "@/lib/panel";
import PanelNav from "@/components/panel/PanelNav";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Oturum + müşteri eşlemesi. v_panel_musteri RLS ile yalnız kullanıcının müşterisini döner;
 * boş dönerse e-posta auth'ta var ama panel_kullanicilari'nda yok → yetkisiz.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sb = await getPanelClient();
  if (!sb) redirect("/panel/giris?hata=gecersiz");

  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/panel/giris");

  const { data: m } = await sb.from("v_panel_musteri").select("*").maybeSingle<PanelMusteri>();
  if (!m) redirect("/panel/giris?hata=yetkisiz");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PanelNav isletme={m.isletme_adi} sekmeler={m.panel_sekmeler} email={auth.user.email ?? ""} />
      <main className="mx-auto w-full max-w-content px-5 pb-16 pt-6 sm:px-8">{children}</main>
      <footer className="mx-auto flex w-full max-w-content flex-col gap-1 px-5 pb-8 text-xs text-muted sm:flex-row sm:justify-between sm:px-8">
        <span>Caner Doğru · canerdogru.com</span>
        <span>Bu panel ölçüm gösterir; sonuç vaadi içermez. Kötü hafta da burada görünür.</span>
      </footer>
    </div>
  );
}
