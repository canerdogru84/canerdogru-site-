"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const HATALAR: Record<string, string> = {
  yetkisiz: "Bu e-posta için açılmış bir panel bulunamadı. Panelinizi açan kişiyle iletişime geçin.",
  gecersiz: "Bağlantının süresi dolmuş ya da kullanılmış. Yeni bir bağlantı isteyin.",
};

export default function GirisFormu({ hata }: { hata?: string }) {
  const [email, setEmail] = useState("");
  const [durum, setDurum] = useState<"bos" | "gonderiliyor" | "hata">("bos");
  const [mesaj, setMesaj] = useState<string | null>(hata ? HATALAR[hata] ?? null : null);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setDurum("gonderiliyor");
    setMesaj(null);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setDurum("hata");
      setMesaj("Panel şu an yapılandırılmamış.");
      return;
    }
    const sb = createBrowserClient(url, key);
    // shouldCreateUser: false → yalnız önceden eklenmiş (panel_kullanicilari) e-postalar girer.
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setDurum("hata");
      setMesaj(/not allowed|signups/i.test(error.message) ? HATALAR.yetkisiz : "Bağlantı gönderilemedi. Biraz sonra tekrar deneyin.");
      return;
    }
    window.location.href = "/panel/giris?gonderildi=1";
  }

  return (
    <form onSubmit={gonder} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-xs font-medium tracking-label uppercase text-muted">E-posta</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ad@isletmeniz.com"
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-signal"
        />
      </label>
      {mesaj && <p className="text-sm text-[#d6443c]">{mesaj}</p>}
      <button
        type="submit"
        disabled={durum === "gonderiliyor"}
        className="w-full rounded-xl bg-signal px-4 py-3 font-medium text-white transition hover:bg-signal-ink disabled:opacity-60"
      >
        {durum === "gonderiliyor" ? "Gönderiliyor…" : "Giriş bağlantısı gönder"}
      </button>
    </form>
  );
}
