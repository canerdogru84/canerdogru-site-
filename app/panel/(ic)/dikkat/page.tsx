import { getPanelClient, type PanelMusteri, type HaftalikNot } from "@/lib/panel";
import { Bos, Rozet } from "@/components/panel/Parcalar";

// Kırmızı bayraklar: düşen ölçüt · sebep · müdahale sahibi · tarih. Boşsa açıkça "bayrak yok".
export default async function DikkatSayfasi() {
  const sb = (await getPanelClient())!;
  const [{ data: m }, { data: notlar }] = await Promise.all([
    sb.from("v_panel_musteri").select("*").single<PanelMusteri>(),
    sb.from("panel_haftalik_notlar").select("hafta_baslangic,bayraklar").order("hafta_baslangic", { ascending: false }).limit(8).returns<Pick<HaftalikNot, "hafta_baslangic" | "bayraklar">[]>(),
  ]);
  const kpiAd = Object.fromEntries((m?.kpi_adlari ?? []).map((k) => [k.kod, k.ad]));
  const bayraklar = (notlar ?? []).flatMap((n) => (n.bayraklar ?? []).map((b) => ({ ...b, hafta: n.hafta_baslangic })));

  return (
    <>
      <div className="mb-6 border-b border-line pb-5">
        <h1 className="font-display text-2xl font-semibold">{m?.isletme_adi} · Dikkat</h1>
        <p className="mt-1 text-[13px] text-muted">Düşen ölçüt, sebebi ve düzeltmeyi kimin yaptığı. Son 8 hafta.</p>
      </div>
      {bayraklar.length === 0 ? (
        <Bos>Bu dönemde bayrak yok.</Bos>
      ) : (
        <ul className="space-y-3">
          {bayraklar.map((b, i) => (
            <li key={i} className="rounded-2xl border border-line bg-white p-4 shadow-card" style={{ borderLeft: "4px solid #d6443c" }}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">{kpiAd[b.olcut] ?? b.olcut}</span>
                <Rozet kaynak={b.sahip === "firma" ? "firma" : "sistem"} />
                <span className="text-xs text-muted">{new Date(b.tarih || b.hafta).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</span>
              </div>
              <p className="mt-1.5 text-sm text-ink-soft"><b>Sebep:</b> {b.sebep}</p>
              <p className="mt-1 text-sm"><b>{b.sahip === "firma" ? "Sizden beklenen" : "Yaptığımız"}:</b> {b.aksiyon}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
