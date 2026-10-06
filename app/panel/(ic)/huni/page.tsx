import { getPanelClient, type PanelMusteri, type HaftalikOzet, tl, yuzde, dk, haftaEtiketi } from "@/lib/panel";
import { Bos, Rozet } from "@/components/panel/Parcalar";

// Hafta hafta tablo: bu hafta / geçen / 4 hafta ortalaması / fark. Kaynak rozeti her satırda.
export default async function HuniSayfasi() {
  const sb = (await getPanelClient())!;
  const [{ data: m }, { data: haftalar }] = await Promise.all([
    sb.from("v_panel_musteri").select("*").single<PanelMusteri>(),
    sb.from("v_haftalik_ozet").select("*").order("hafta", { ascending: false }).limit(5).returns<HaftalikOzet[]>(),
  ]);
  const h = haftalar ?? [];
  const bu = h[0], gecen = h[1];
  const ort = (f: (x: HaftalikOzet) => number | null) => {
    const v = h.slice(0, 4).map(f).filter((x): x is number => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  };
  const satirlar: { ad: string; f: (x: HaftalikOzet) => number | null; fmt: (n: number | null | undefined) => string; kaynak?: "sistem" | "firma"; dusukIyi?: boolean }[] = [
    { ad: "Reklam harcaması", f: (x) => Number(x.harcama_tl), fmt: tl, kaynak: "sistem" },
    { ad: "— Meta", f: (x) => (x.harcama_meta == null ? null : Number(x.harcama_meta)), fmt: tl, kaynak: "sistem" },
    { ad: "— Google", f: (x) => (x.harcama_google == null ? null : Number(x.harcama_google)), fmt: tl, kaynak: "sistem" },
    { ad: "Gösterim", f: (x) => x.gosterim, fmt: (n) => (n == null ? "—" : Math.round(n).toLocaleString("tr-TR")), kaynak: "sistem" },
    { ad: "Tık", f: (x) => x.tik, fmt: (n) => (n == null ? "—" : Math.round(n).toLocaleString("tr-TR")), kaynak: "sistem" },
    { ad: "Talep", f: (x) => x.talep, fmt: (n) => (n == null ? "—" : String(Math.round(n))), kaynak: "sistem" },
    { ad: "Talep başına maliyet", f: (x) => x.k1_talep_maliyeti_tl, fmt: tl, kaynak: "sistem", dusukIyi: true },
    { ad: "İlk dönüş süresi (ortanca)", f: (x) => x.k2_ilk_donus_dk, fmt: dk, kaynak: "sistem", dusukIyi: true },
    { ad: "Randevu", f: (x) => x.randevu, fmt: (n) => (n == null ? "—" : String(Math.round(n))), kaynak: bu?.randevu_kaynak ?? "sistem" },
    { ad: "Talep → randevu", f: (x) => x.k3_talep_randevu, fmt: yuzde, kaynak: bu?.randevu_kaynak ?? "sistem" },
    { ad: "Satış", f: (x) => x.satis, fmt: (n) => (n == null ? "—" : String(Math.round(n))), kaynak: bu?.randevu_kaynak ?? "sistem" },
    { ad: "Randevu → satış", f: (x) => x.k4_randevu_satis, fmt: yuzde, kaynak: bu?.randevu_kaynak ?? "sistem" },
    { ad: "Ciro (sizin rakamınız)", f: (x) => Number(x.tutar_tl), fmt: tl, kaynak: bu?.randevu_kaynak ?? "sistem" },
  ];

  return (
    <>
      <div className="mb-6 border-b border-line pb-5">
        <h1 className="font-display text-2xl font-semibold">{m?.isletme_adi} · Huni</h1>
        <p className="mt-1 text-[13px] text-muted">{bu ? haftaEtiketi(bu.hafta) : ""} · 4 hafta ortalaması son 4 haftadan</p>
      </div>
      {!bu ? (
        <Bos>Henüz haftalık veri yok.</Bos>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-label text-muted">
                <th className="px-4 py-3.5 font-semibold">Adım</th>
                <th className="px-4 py-3.5 font-semibold">Bu hafta</th>
                <th className="px-4 py-3.5 font-semibold">Geçen hafta</th>
                <th className="px-4 py-3.5 font-semibold">4 hafta ort.</th>
                <th className="px-4 py-3.5 font-semibold">Fark</th>
                <th className="px-4 py-3.5 font-semibold">Kaynak</th>
              </tr>
            </thead>
            <tbody>
              {satirlar.map((s) => {
                const a = s.f(bu), b = gecen ? s.f(gecen) : null;
                let fark = "—", renk = "text-muted";
                if (a != null && b != null && b !== 0) {
                  const p = Math.round(((a - b) / b) * 100);
                  fark = `${p > 0 ? "+" : ""}${p}%`;
                  const iyi = s.dusukIyi ? p < 0 : p > 0;
                  renk = p === 0 ? "text-muted" : iyi ? "text-[#1a9e5c]" : "text-[#d6443c]";
                }
                return (
                  <tr key={s.ad} className="border-t border-line">
                    <td className={`px-4 py-3 ${s.ad.startsWith("—") ? "pl-8 text-muted" : "font-medium"}`}>{s.ad}</td>
                    <td className="px-4 py-3 font-semibold">{s.fmt(a)}</td>
                    <td className="px-4 py-3 text-muted">{s.fmt(b)}</td>
                    <td className="px-4 py-3 text-muted">{s.fmt(ort(s.f))}</td>
                    <td className={`px-4 py-3 font-medium ${renk}`}>{fark}</td>
                    <td className="px-4 py-3">{s.kaynak && <Rozet kaynak={s.kaynak} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
