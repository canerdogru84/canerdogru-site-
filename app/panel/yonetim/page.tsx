import { getPanelClient, type HaftalikOzet, type Bayrak, tl, yuzde, dk, haftaEtiketi, kartDurumu } from "@/lib/panel";
import { Baslik, Bos, Rozet } from "@/components/panel/Parcalar";

type Musteri = {
  id: string; isletme_adi: string; sektor: string; panel_aktif: boolean; panel_hediye: boolean;
  kpi_adlari: { kod: "k1" | "k2" | "k3" | "k4"; ad: string; kaynak: "sistem" | "firma" }[];
  kpi_hedefleri: Partial<Record<"k1" | "k2" | "k3" | "k4", number>>;
};

// Tüm müşteriler tek ekranda; bayraklı / rakamı eksik olan üstte. Pazartesi ilk bakılan yer.
export default async function Yonetim() {
  const sb = (await getPanelClient())!;
  const [{ data: musteriler }, { data: ozetler }, { data: notlar }, { data: kacan }] = await Promise.all([
    sb.from("v_panel_musteriler").select("*").order("isletme_adi").returns<Musteri[]>(),
    sb.from("v_haftalik_ozet").select("*").order("hafta", { ascending: false }).returns<HaftalikOzet[]>(),
    sb.from("panel_haftalik_notlar").select("musteri_id,hafta_baslangic,bayraklar,yayinda").order("hafta_baslangic", { ascending: false }).returns<{ musteri_id: string; hafta_baslangic: string; bayraklar: Bayrak[]; yayinda: boolean }[]>(),
    sb.from("v_kacan_para").select("musteri_id,masada_kalan_tl").returns<{ musteri_id: string; masada_kalan_tl: number }[]>(),
  ]);

  const liste = (musteriler ?? []).map((m) => {
    const h = (ozetler ?? []).filter((o) => o.musteri_id === m.id);
    const bu = h[0], gecen = h[1];
    const son = (notlar ?? []).find((n) => n.musteri_id === m.id);
    const bayrak = son?.bayraklar?.length ?? 0;
    const kacanTL = (kacan ?? []).filter((k) => k.musteri_id === m.id).reduce((a, k) => a + Number(k.masada_kalan_tl || 0), 0);
    const rakamEksik = !!bu && bu.randevu_kaynak !== "firma";
    const raporYok = !son || son.hafta_baslangic !== bu?.hafta;
    const skor = (bayrak ? 100 : 0) + (rakamEksik ? 10 : 0) + (raporYok ? 5 : 0);
    return { m, bu, gecen, bayrak, kacanTL, rakamEksik, raporYok, yayinda: son?.yayinda ?? false, skor };
  }).sort((a, b) => b.skor - a.skor || a.m.isletme_adi.localeCompare(b.m.isletme_adi, "tr"));

  const hafta = ozetler?.[0]?.hafta;
  const toplamKacan = liste.reduce((a, x) => a + x.kacanTL, 0);
  const toplamHarcama = liste.reduce((a, x) => a + Number(x.bu?.harcama_tl ?? 0), 0);

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Müşteriler</h1>
          <p className="mt-1 text-[13px] text-muted">{hafta ? haftaEtiketi(hafta) : "Henüz haftalık veri yok"} · bayraklı ve rakamı eksik olan üstte</p>
        </div>
        <div className="flex gap-6 text-sm">
          <div><div className="text-xs text-muted">Aktif</div><div className="font-display text-xl font-semibold">{liste.filter((x) => x.m.panel_aktif).length}</div></div>
          <div><div className="text-xs text-muted">Haftalık harcama</div><div className="font-display text-xl font-semibold">{tl(toplamHarcama)}</div></div>
          <div><div className="text-xs text-muted">Masada kalan</div><div className="font-display text-xl font-semibold text-[#d6443c]">{toplamKacan ? "~" + tl(toplamKacan) : "—"}</div></div>
        </div>
      </div>

      {liste.length === 0 ? (
        <Bos>Panel açık müşteri yok.</Bos>
      ) : (
        <div className="space-y-3">
          {liste.map(({ m, bu, gecen, bayrak, kacanTL, rakamEksik, raporYok, yayinda }) => {
            const kpis = m.kpi_adlari?.length ? m.kpi_adlari : [
              { kod: "k1" as const, ad: "Talep maliyeti", kaynak: "sistem" as const }, { kod: "k2" as const, ad: "İlk dönüş", kaynak: "sistem" as const },
              { kod: "k3" as const, ad: "Talep → randevu", kaynak: "firma" as const }, { kod: "k4" as const, ad: "Randevu → satış", kaynak: "firma" as const }];
            const deger = {
              k1: [bu?.k1_talep_maliyeti_tl, gecen?.k1_talep_maliyeti_tl, tl],
              k2: [bu?.k2_ilk_donus_dk, gecen?.k2_ilk_donus_dk, dk],
              k3: [bu?.k3_talep_randevu, gecen?.k3_talep_randevu, yuzde],
              k4: [bu?.k4_randevu_satis, gecen?.k4_randevu_satis, yuzde],
            } as const;
            return (
              <div key={m.id} className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{m.isletme_adi}</span>
                    <span className="text-xs text-muted">{m.sektor}</span>
                    {m.panel_hediye && <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">panel hediye</span>}
                    {bayrak > 0 && <span className="rounded-full bg-[#fdecea] px-2 py-0.5 text-[11px] font-medium text-[#d6443c]">{bayrak} bayrak</span>}
                    {rakamEksik && <span className="rounded-full bg-[#fff4d6] px-2 py-0.5 text-[11px] font-medium text-[#8a5a00]">iki rakam eksik</span>}
                    {raporYok ? <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">rapor yazılmadı</span>
                      : !yayinda && <span className="rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[11px] font-medium text-signal">rapor onay bekliyor</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    {kacanTL > 0 && <span>masada ~<b className="text-[#d6443c]">{tl(kacanTL)}</b></span>}
                    <span>harcama {tl(bu?.harcama_tl)}</span>
                    <span>{bu?.talep ?? 0} talep</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {kpis.map((k) => {
                    const [s, o, fmt] = deger[k.kod];
                    const d = kartDurumu(k.kod, s ?? null, o ?? null, m.kpi_hedefleri?.[k.kod]);
                    const renk = { gri: "#c7ccd6", iyi: "#1a9e5c", orta: "#d9960b", kotu: "#d6443c" }[d.renk];
                    return (
                      <div key={k.kod} className="rounded-xl bg-paper px-3 py-2" style={{ borderLeft: `3px solid ${renk}` }}>
                        <div className="truncate text-[11px] text-muted">{k.ad}</div>
                        <div className="flex items-baseline gap-1.5"><span className="font-display text-lg font-semibold">{fmt(s)}</span><span className="text-[11px]" style={{ color: d.renk === "gri" ? "#5b6578" : renk }}>{d.ok}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-6 text-xs text-muted"><Rozet kaynak="firma" /> rozetli ölçütler firmadan gelen haftalık iki rakamla hesaplanır; "iki rakam eksik" olan müşteride k3/k4 sistem tahminidir.</p>
      <Baslik>&nbsp;</Baslik>
    </>
  );
}
