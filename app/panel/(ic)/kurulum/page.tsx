import { getPanelClient, type PanelMusteri, type KurulumAdimi } from "@/lib/panel";
import { Bos, Kutu } from "@/components/panel/Parcalar";

const DURUM = {
  tamam: { ad: "Tamamlandı", stil: "bg-[#eef7f1] text-[#1a9e5c]" },
  devam: { ad: "Devam ediyor", stil: "bg-[#e8f0fe] text-signal" },
  sizden_bekleniyor: { ad: "Sizden bekleniyor", stil: "bg-[#fff4d6] text-[#8a5a00]" },
  bekliyor: { ad: "Sırada", stil: "bg-surface text-muted" },
} as const;

export default async function KurulumSayfasi() {
  const sb = (await getPanelClient())!;
  const [{ data: m }, { data: adimlar }] = await Promise.all([
    sb.from("v_panel_musteri").select("*").single<PanelMusteri>(),
    sb.from("panel_kurulum_adimlari").select("*").order("sira").returns<KurulumAdimi[]>(),
  ]);
  const liste = adimlar ?? [];
  const tamam = liste.filter((a) => a.durum === "tamam").length;
  const sizden = liste.filter((a) => a.durum === "sizden_bekleniyor");

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{m?.isletme_adi} · Kurulum</h1>
          <p className="mt-1 text-[13px] text-muted">10 iş günü; süre bilgi ve erişimlerin tesliminden itibaren başlar.</p>
        </div>
        {liste.length > 0 && <div className="text-sm font-medium">{tamam} / {liste.length} tamam</div>}
      </div>

      {liste.length === 0 ? (
        <Bos>Kurulum adımları henüz girilmedi.</Bos>
      ) : (
        <>
          {sizden.length > 0 && (
            <Kutu className="mb-5 border-[#f3d79a] bg-[#fffaf0] text-sm">
              <b>Sizden bekleniyor ({sizden.length}):</b>{" "}
              {sizden.map((a) => a.sizden_ne || a.kalem).join(" · ")}
            </Kutu>
          )}
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-signal transition-all" style={{ width: `${(tamam / liste.length) * 100}%` }} />
          </div>
          <ol className="mt-5 space-y-2.5">
            {liste.map((a) => {
              const d = DURUM[a.durum];
              return (
                <li key={a.sira} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-4 shadow-card">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${a.durum === "tamam" ? "bg-[#1a9e5c] text-white" : "bg-surface text-muted"}`}>
                    {a.durum === "tamam" ? "✓" : a.sira}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{a.kalem}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${d.stil}`}>{d.ad}</span>
                    </div>
                    {a.durum === "sizden_bekleniyor" && a.sizden_ne && <p className="mt-1 text-sm text-[#8a5a00]">{a.sizden_ne}</p>}
                    {a.bitis_at && <p className="mt-1 text-xs text-muted">Bitti: {new Date(a.bitis_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
