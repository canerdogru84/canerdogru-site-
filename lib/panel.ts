import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Müşteri paneli — oturumlu Supabase istemcisi (Server Component / Route Handler).
 * Anon key + kullanıcı çerezi; RLS müşteriyi yalnız kendi satırlarıyla sınırlar
 * (bkz. leadadmedia/sql/s20-musteri-panel.sql). service_role burada HİÇ kullanılmaz.
 */
export async function getPanelClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const store = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Component içinde çerez yazılamaz; proxy.ts tazeler.
        }
      },
    },
  });
}

// ---- Veri tipleri (view sütunlarıyla birebir) ----
export type KpiAd = { kod: "k1" | "k2" | "k3" | "k4"; ad: string; kaynak: "sistem" | "firma" };

export type PanelMusteri = {
  id: string;
  isletme_adi: string;
  sektor: string;
  ort_siparis_degeri_tl: number | null;
  kpi_adlari: KpiAd[];
  kpi_hedefleri: Partial<Record<"k1" | "k2" | "k3" | "k4", number>>;
  panel_aktif: boolean;
  panel_sekmeler: string[];
};

export type HaftalikOzet = {
  musteri_id: string;
  hafta: string;
  harcama_tl: number;
  harcama_meta: number | null;
  harcama_google: number | null;
  gosterim: number;
  tik: number;
  talep: number;
  randevu: number;
  satis: number;
  tutar_tl: number;
  randevu_kaynak: "firma" | "sistem";
  k1_talep_maliyeti_tl: number | null;
  k2_ilk_donus_dk: number | null;
  k3_talep_randevu: number | null;
  k4_randevu_satis: number | null;
  mesai_disi_talep: number | null;
};

export type KacanPara = {
  musteri_id: string;
  talep_id: string;
  gelis_at: string;
  kanal: string;
  durum: string;
  mesai_disi: boolean;
  kacak_tipi: "bekleyen_talep" | "no_show" | "takipsiz_teklif" | null;
  masada_kalan_tl: number;
};

export type Bayrak = { olcut: string; sebep: string; sahip: "firma" | "caner"; aksiyon: string; tarih: string };

export type HaftalikNot = {
  hafta_baslangic: string;
  ozet: string | null;
  yapilanlar: string[];
  gelecek_hafta: string[];
  sizden_tek_istek: string | null;
  bayraklar: Bayrak[];
  kart_notlari: Partial<Record<"k1" | "k2" | "k3" | "k4", string>>;
};

export type KurulumAdimi = {
  sira: number;
  kalem: string;
  durum: "bekliyor" | "sizden_bekleniyor" | "devam" | "tamam";
  sizden_ne: string | null;
  bitis_at: string | null;
};

// ---- Yardımcılar ----
export const tl = (n: number | null | undefined) =>
  n == null ? "—" : `${Math.round(n).toLocaleString("tr-TR")} TL`;
export const yuzde = (n: number | null | undefined) => (n == null ? "—" : `%${Math.round(n * 100)}`);
export const dk = (n: number | null | undefined) =>
  n == null ? "—" : n >= 120 ? `${Math.round(n / 60)} sa` : `${Math.round(n)} dk`;

export function haftaEtiketi(iso: string) {
  const b = new Date(iso + "T00:00:00");
  const s = new Date(b);
  s.setDate(b.getDate() + 6);
  const f = (d: Date) => d.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  return `${f(b)} – ${f(s)} ${s.getFullYear()}`;
}

/** Kart yönü: hedef varsa hedefe göre, yoksa yalnız geçen haftaya göre (renk gri). */
export function kartDurumu(
  kod: KpiAd["kod"],
  simdi: number | null,
  onceki: number | null,
  hedef?: number
): { renk: "gri" | "iyi" | "orta" | "kotu"; ok: string } {
  if (simdi == null) return { renk: "gri", ok: "veri yok" };
  // k1 (maliyet) ve k2 (süre) düşük iyi; k3/k4 yüksek iyi
  const dusukIyi = kod === "k1" || kod === "k2";
  let ok = "→";
  if (onceki != null && onceki !== 0) {
    const fark = simdi - onceki;
    if (kod === "k3" || kod === "k4") ok = fark === 0 ? "→" : `${fark > 0 ? "↑" : "↓"} ${Math.abs(Math.round(fark * 100))} puan`;
    else ok = fark === 0 ? "→" : `${fark > 0 ? "↑" : "↓"} %${Math.abs(Math.round((fark / onceki) * 100))}`;
  }
  if (hedef == null) return { renk: "gri", ok };
  const oran = dusukIyi ? hedef / simdi : simdi / hedef; // 1 = hedefte
  const renk = oran >= 1 ? "iyi" : oran >= 0.85 ? "orta" : "kotu";
  return { renk, ok };
}
