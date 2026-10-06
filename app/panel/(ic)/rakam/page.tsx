import { getPanelClient, type PanelMusteri, haftaEtiketi } from "@/lib/panel";
import { Kutu } from "@/components/panel/Parcalar";
import RakamFormu from "@/components/panel/RakamFormu";

// Firmanın haftalık iki rakamı girdiği sayfa. Pazartesi e-postasındaki link buraya gelir (?hafta=YYYY-MM-DD).
// Yazma RLS firma_yaz/firma_guncelle ile (kaynak='panel'); müşteri yalnız kendi satırını yazar.
export default async function RakamSayfasi({ searchParams }: { searchParams: Promise<{ hafta?: string }> }) {
  const sp = await searchParams;
  const sb = (await getPanelClient())!;
  const { data: m } = await sb.from("v_panel_musteri").select("*").single<PanelMusteri>();

  // Varsayılan: geçen haftanın Pazartesi'si
  const simdi = new Date();
  const dow = (simdi.getDay() + 6) % 7;
  const buPzt = new Date(simdi); buPzt.setDate(simdi.getDate() - dow); buPzt.setHours(0, 0, 0, 0);
  const gecen = new Date(buPzt); gecen.setDate(buPzt.getDate() - 7);
  const hafta = /^\d{4}-\d{2}-\d{2}$/.test(sp.hafta ?? "") ? sp.hafta! : gecen.toISOString().slice(0, 10);

  const { data: mevcut } = await sb.from("panel_haftalik_firma").select("randevu,satis,tutar_tl").eq("hafta_baslangic", hafta).maybeSingle<{ randevu: number | null; satis: number | null; tutar_tl: number | null }>();
  const ad = (kod: string, v: string) => m?.kpi_adlari?.find((k) => k.kod === kod)?.ad ?? v;

  return (
    <>
      <div className="mb-6 border-b border-line pb-5">
        <h1 className="font-display text-2xl font-semibold">{m?.isletme_adi} · Haftanın iki rakamı</h1>
        <p className="mt-1 text-[13px] text-muted">{haftaEtiketi(hafta)} · Girdiğiniz anda panel tablosu tamamlanır.</p>
      </div>
      <Kutu className="max-w-xl">
        <RakamFormu musteriId={m!.id} hafta={hafta} mevcut={mevcut ?? null} etiketRandevu={ad("k3", "Gerçekleşen randevu / deneme / görüşme")} etiketSatis={ad("k4", "Satışa dönen")} />
      </Kutu>
    </>
  );
}
