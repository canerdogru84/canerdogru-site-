"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Mevcut = { randevu: number | null; satis: number | null; tutar_tl: number | null } | null;

export default function RakamFormu({ musteriId, hafta, mevcut, etiketRandevu, etiketSatis }: {
  musteriId: string; hafta: string; mevcut: Mevcut; etiketRandevu: string; etiketSatis: string;
}) {
  const [randevu, setRandevu] = useState(mevcut?.randevu?.toString() ?? "");
  const [satis, setSatis] = useState(mevcut?.satis?.toString() ?? "");
  const [tutar, setTutar] = useState(mevcut?.tutar_tl?.toString() ?? "");
  const [durum, setDurum] = useState<"bos" | "kaydediliyor" | "tamam" | "hata">("bos");
  const [hata, setHata] = useState<string | null>(null);

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setDurum("kaydediliyor"); setHata(null);
    const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const satir = { musteri_id: musteriId, hafta_baslangic: hafta, randevu: Number(randevu), satis: Number(satis), tutar_tl: tutar === "" ? null : Number(tutar), kaynak: "panel" };
    const { error } = await sb.from("panel_haftalik_firma").upsert(satir, { onConflict: "musteri_id,hafta_baslangic" });
    if (error) { setDurum("hata"); setHata("Kaydedilemedi. Biraz sonra tekrar deneyin ya da bize yazın."); return; }
    setDurum("tamam");
  }

  const alan = "mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-signal";
  return (
    <form onSubmit={kaydet} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium">{etiketRandevu}</span>
        <span className="block text-xs text-muted">Geçen hafta kaç tane gerçekleşti? Yoksa 0.</span>
        <input type="number" min={0} required value={randevu} onChange={(e) => setRandevu(e.target.value)} className={alan} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">{etiketSatis}</span>
        <span className="block text-xs text-muted">Bunların kaçı satışa / üyeliğe döndü?</span>
        <input type="number" min={0} required value={satis} onChange={(e) => setSatis(e.target.value)} className={alan} />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Toplam tutar (TL, isteğe bağlı)</span>
        <span className="block text-xs text-muted">Getiri hesabı için; boş bırakırsanız ortalama değerinizle tahmin ederiz.</span>
        <input type="number" min={0} value={tutar} onChange={(e) => setTutar(e.target.value)} className={alan} />
      </label>
      {hata && <p className="text-sm text-[#d6443c]">{hata}</p>}
      {durum === "tamam" ? (
        <div className="rounded-xl bg-[#eef7f1] p-4 text-sm text-[#1a6e42]">Kaydedildi. Teşekkürler — <a href="/panel" className="underline">Özet sayfasına dön</a>.</div>
      ) : (
        <button type="submit" disabled={durum === "kaydediliyor"} className="w-full rounded-xl bg-signal px-4 py-3 font-medium text-white transition hover:bg-signal-ink disabled:opacity-60">
          {durum === "kaydediliyor" ? "Kaydediliyor…" : mevcut ? "Güncelle" : "Kaydet"}
        </button>
      )}
    </form>
  );
}
