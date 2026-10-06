import {
  getPanelClient,
  type PanelMusteri,
  type HaftalikOzet,
  type HaftalikNot,
  tl,
  yuzde,
  dk,
  haftaEtiketi,
  kartDurumu,
} from "@/lib/panel";
import { Baslik, Kart, HuniSeridi, Kutu, Bos } from "@/components/panel/Parcalar";
import HarcamaGrafigi from "@/components/panel/HarcamaGrafigi";

const VARSAYILAN_KPI = [
  { kod: "k1", ad: "Talep başına reklam maliyeti", kaynak: "sistem" },
  { kod: "k2", ad: "Talebe ilk dönüş süresi", kaynak: "sistem" },
  { kod: "k3", ad: "Talep → randevu oranı", kaynak: "firma" },
  { kod: "k4", ad: "Randevu → satış oranı", kaynak: "firma" },
] as const;

export default async function Ozet() {
  const sb = (await getPanelClient())!;
  const [{ data: m }, { data: haftalar }, { data: notlar }] = await Promise.all([
    sb.from("v_panel_musteri").select("*").single<PanelMusteri>(),
    sb.from("v_haftalik_ozet").select("*").order("hafta", { ascending: false }).limit(9).returns<HaftalikOzet[]>(),
    sb.from("panel_haftalik_notlar").select("*").order("hafta_baslangic", { ascending: false }).limit(1).returns<HaftalikNot[]>(),
  ]);

  const seri = (haftalar ?? []).slice().reverse(); // eski → yeni
  const bu = seri.at(-1);
  const gecen = seri.at(-2);
  const not = notlar?.[0];
  const kpiAdlari = m?.kpi_adlari?.length ? m.kpi_adlari : VARSAYILAN_KPI;
  const hedef = m?.kpi_hedefleri ?? {};

  if (!bu) {
    return (
      <>
        <Ust isletme={m?.isletme_adi ?? ""} hafta={null} />
        <Bos>Henüz ölçüm yok. Kurulum tamamlanıp ilk talepler düşünce bu sayfa dolar — bkz. Kurulum sekmesi.</Bos>
      </>
    );
  }

  const deger = {
    k1: [bu.k1_talep_maliyeti_tl, gecen?.k1_talep_maliyeti_tl, tl],
    k2: [bu.k2_ilk_donus_dk, gecen?.k2_ilk_donus_dk, dk],
    k3: [bu.k3_talep_randevu, gecen?.k3_talep_randevu, yuzde],
    k4: [bu.k4_randevu_satis, gecen?.k4_randevu_satis, yuzde],
  } as const;

  const gecis = (a: number, b: number) => (b > 0 ? `%${((a / b) * 100).toLocaleString("tr-TR", { maximumFractionDigits: 1 })}` : undefined);

  return (
    <>
      <Ust isletme={m?.isletme_adi ?? ""} hafta={bu.hafta} />

      <Baslik>İlk görüşmede birlikte seçtiğimiz 4 ölçüt</Baslik>
      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiAdlari.map((k) => {
          const [simdi, onceki, fmt] = deger[k.kod];
          const d = kartDurumu(k.kod, simdi ?? null, onceki ?? null, hedef[k.kod]);
          return (
            <Kart
              key={k.kod}
              ad={k.ad}
              deger={fmt(simdi)}
              ok={d.ok}
              renk={d.renk}
              kaynak={k.kaynak}
              onceki={onceki != null ? fmt(onceki) : undefined}
              not={not?.kart_notlari?.[k.kod]}
            />
          );
        })}
      </div>
      {Object.keys(hedef).length === 0 && (
        <p className="-mt-4 mb-7 text-xs text-muted">Hedef rakamlar henüz girilmedi; kartlar renk göstermiyor. İlk görüşmede birlikte koyduğumuz rakamlar işlenince renklenir.</p>
      )}

      <Baslik>Bu hafta huni — nereden nereye</Baslik>
      <div className="mb-7">
        <HuniSeridi
          adimlar={[
            { ad: "Gösterim", deger: bu.gosterim.toLocaleString("tr-TR") },
            { ad: "Tık", deger: bu.tik.toLocaleString("tr-TR"), gecis: gecis(bu.tik, bu.gosterim) },
            { ad: "Talep", deger: String(bu.talep), gecis: gecis(bu.talep, bu.tik) },
            { ad: "Randevu", deger: String(bu.randevu), gecis: gecis(bu.randevu, bu.talep), kaynak: bu.randevu_kaynak === "firma" ? "firma" : undefined },
            { ad: "Satış", deger: String(bu.satis), gecis: gecis(bu.satis, bu.randevu), kaynak: bu.randevu_kaynak === "firma" ? "firma" : undefined },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Kutu>
          <Baslik>Harcama ve talep · son {seri.length} hafta</Baslik>
          <HarcamaGrafigi seri={seri.map((h) => ({ hafta: h.hafta, harcama: Number(h.harcama_tl), talep: h.talep }))} />
          <p className="mt-2 text-xs text-muted">
            Sütun: haftalık reklam harcaması (bu hafta {tl(bu.harcama_tl)}) · <b className="text-signal">Çizgi: gelen talep</b>
          </p>
        </Kutu>
        <Kutu className="text-sm leading-relaxed">
          {not ? (
            <>
              {not.yapilanlar?.length > 0 && (
                <>
                  <Baslik>Bu hafta yapılanlar</Baslik>
                  <ul className="mb-4 space-y-1">{not.yapilanlar.map((y) => <li key={y} className="pl-4 before:absolute before:-ml-4 before:text-signal before:content-['•'] relative">{y}</li>)}</ul>
                </>
              )}
              {not.gelecek_hafta?.length > 0 && (
                <>
                  <Baslik>Gelecek hafta</Baslik>
                  <ul className="mb-4 space-y-1">{not.gelecek_hafta.map((y) => <li key={y} className="relative pl-4 before:absolute before:-ml-4 before:text-signal before:content-['•']">{y}</li>)}</ul>
                </>
              )}
              {not.sizden_tek_istek && (
                <div className="rounded-xl bg-[#eef4ff] p-3.5">
                  <b className="text-signal">Sizden tek istek:</b> {not.sizden_tek_istek}
                </div>
              )}
            </>
          ) : (
            <p className="text-muted">Bu haftanın notu Pazartesi sabahı buraya düşer.</p>
          )}
          {m?.ort_siparis_degeri_tl != null && bu.satis > 0 && (
            <p className="mt-4 text-xs text-muted">
              Tahmini getiri: {bu.satis} satış × {tl(m.ort_siparis_degeri_tl)} = {tl(bu.satis * m.ort_siparis_degeri_tl)} · harcama {tl(bu.harcama_tl)}.{" "}
              <em>Varsayım: ortalama değer sizin verdiğiniz rakam; tekrar alımlar dahil değil.</em>
            </p>
          )}
        </Kutu>
      </div>
    </>
  );
}

function Ust({ isletme, hafta }: { isletme: string; hafta: string | null }) {
  return (
    <div className="mb-6 flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold">{isletme} · Haftalık ölçüm</h1>
        <p className="mt-1 text-[13px] text-muted">Kaynak: reklam hesabı + takip hattı (otomatik) · randevu ve satış rakamları sizden (haftalık görüşme)</p>
      </div>
      {hafta && <div className="text-sm font-medium sm:text-right">{haftaEtiketi(hafta)}</div>}
    </div>
  );
}
