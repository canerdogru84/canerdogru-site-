import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPanelClient } from "@/lib/panel";
import Logo from "@/components/Logo";
import YonetimNav from "@/components/panel/YonetimNav";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Caner'in görünümü. Yalnız panel_kullanicilari.rol='yonetici' (sql/s21). Müşteri rolü buraya düşerse /panel'e döner. */
export default async function YonetimLayout({ children }: { children: React.ReactNode }) {
  const sb = await getPanelClient();
  if (!sb) redirect("/panel/giris?hata=gecersiz");
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/panel/giris");
  const { data: rol } = await sb.from("panel_kullanicilari").select("rol").eq("user_id", auth.user.id).maybeSingle<{ rol: string }>();
  if (rol?.rol !== "yonetici") redirect("/panel");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-medium text-white">Yönetim</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <Link href="/panel" className="rounded-lg border border-line px-3 py-1.5 hover:bg-surface">Müşteri gözüyle</Link>
            <form action="/auth/cikis" method="post"><button className="rounded-lg border border-line px-3 py-1.5 hover:bg-surface">Çıkış</button></form>
          </div>
        </div>
        <YonetimNav />
      </header>
      <main className="mx-auto w-full max-w-content px-5 pb-16 pt-6 sm:px-8">{children}</main>
    </div>
  );
}
