import { getPanelClient, tl, haftaEtiketi } from "@/lib/panel";
import { Baslik, HuniSeridi, Kutu, Bos } from "@/components/panel/Parcalar";

// Caner'in kendi işi — KPI ağacı ★ (kuzey yıldızı) + D (Röntgen hunisi) + A (edinme) katmanlarının görsel hali.
// Hedefler: kararlar.md 2026-10-06 — Q4 2026 5 müşteri; bütçe tavanı 40.000 TL/ay; görüşme tavanı 10/hafta.
// Haftalık Telegram raporu (haftalik-is-gozden-gecirme) aynı veriden "tek darboğaz + tek aksiyon" üretir; bu sayfa onun grafiğidir.
const HEDEF = { q4Musteri: 5, butceAy: 40000, gorusmeHafta: 10 };

type Huni = { hafta: string; basvuru: number; nitelikli: number; hat_takvim: number; hat_rapor: number; gorusme: number; kapanis: number; kaynak_meta: number; kaynak_google: number; kaynak_organik: number; checklist_abone: number };
type Kuzey = { ay: string; yeni_musteri: number; yeni_mrr: number | null };

export default async function BenimIsim() {
  const sb = (await getPanelClient())!;
  const [{ data: huni }, { data: kuzey }] = await Promise.all([
    sb.from("v_benim_huni").select("*").order("hafta", { ascending: false }).limit(8).returns<Huni[]>(),
    sb.from("v_benim_kuzey").select("*").order("ay", { ascending: false }).limit(6).returns<Kuzey[]>(),
  ]);
  const h = huni ?? [];
  const bu = h[0], gecen = h[1];
  const q4 = (kuzey ?? []).filter((k) => k.ay >= "2026-10-01" && k.ay < "2027-01-01");
  const q4Musteri = q4.reduce((a, k) => a + k.yeni_musteri, 0);
  const mrr = (kuzey ?? []).reduce((a, k) => a + Number(k.yeni_mrr ?? 0), 0);
  const oran = (a: number, b: number) => (b > 0 ? `%${Math.round((a / b) * 100)}` : undefined);
  const fark = (a?: number, b?: number) => (a == null || b == null ? "" : a === b ? "→" : a > b ? `↑ ${a - b}` : `↓ ${b - a}`);

  return (
    <>
      <div className="mb-6 border-b border-line pb-5">
        <h1 className="font-display text-2xl font-semibold">Benim işim</h1>
        <p className="mt-1 text-[13px] text-muted">Kaynak: Röntgen başvuruları (test hariç), checklist aboneleri, müşteri kayıtları. Reklam harcaması kendi hesabından — n8n bağlanınca.</p>
      </div>

      <Baslik>Kuzey yıldızı · Q4 2026</Baslik>
      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <Sayac ad="Yeni müşteri (ön ödeme günü)" deger={`${q4Musteri} / ${HEDEF.q4Musteri}`} alt={`${Math.max(HEDEF.q4Musteri - q4Musteri, 0)} kaldı · 31 Ara`} ilerleme={q4Musteri / HEDEF.q4Musteri} />
        <Sayac ad="MRR (Büyüme Partnerliği)" deger={tl(mrr)} alt="aktif aylık ücretler toplamı" />
        <Sayac ad="Görüşme kapasitesi (bu hafta)" deger={`${bu?.gorusme ?? 0} / ${HEDEF.gorusmeHafta}`} alt={bu && bu.gorusme >= HEDEF.gorusmeHafta * 0.8 ? "doluluk %80+ → eşik sertleştir" : "slot var"} ilerleme={(bu?.gorusme ?? 0) / HEDEF.gorusmeHafta} />
      </div>

      <Baslik>Röntgen hunisi · {bu ? haftaEtiketi(bu.hafta) : "veri yok"}</Baslik>
      {!bu ? (
        <Bos>Henüz gerçek başvuru yok (test kayıtları hariç tutulur).</Bos>
      ) : (
        <>
          <div className="mb-4">
            <HuniSeridi adimlar={[
              { ad: "Başvuru", deger: String(bu.basvuru) },
              { ad: "Nitelikli (≥50K)", deger: String(bu.nitelikli), gecis: oran(bu.nitelikli, bu.basvuru) },
              { ad: "Görüşme", deger: String(bu.gorusme), gecis: oran(bu.gorusme, bu.nitelikli) },
              { ad: "Kapanış", deger: String(bu.kapanis), gecis: oran(bu.kapanis, bu.gorusme) },
            ]} />
          </div>
          <div className="mb-7 grid gap-4 lg:grid-cols-2">
            <Kutu>
              <Baslik>Son 8 hafta</Baslik>
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[11px] uppercase tracking-label text-muted"><th className="py-2">Hafta</th><th>Başvuru</th><th>Nitelikli</th><th>Görüşme</th><th>Kapanış</th><th>Checklist</th></tr></thead>
                <tbody>{h.map((r) => (
                  <tr key={r.hafta} className="border-t border-line"><td className="py-2 text-muted">{new Date(r.hafta + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</td><td className="font-medium">{r.basvuru}</td><td>{r.nitelikli}</td><td>{r.gorusme}</td><td className="font-medium">{r.kapanis}</td><td className="text-muted">{r.checklist_abone}</td></tr>
                ))}</tbody>
              </table>
            </Kutu>
            <Kutu>
              <Baslik>Bu hafta nereden geldi</Baslik>
              <Satir ad="Meta (reklam)" v={bu.kaynak_meta} f={fark(bu.kaynak_meta, gecen?.kaynak_meta)} />
              <Satir ad="Google (reklam)" v={bu.kaynak_google} f={fark(bu.kaynak_google, gecen?.kaynak_google)} />
              <Satir ad="Organik / doğrudan" v={bu.kaynak_organik} f={fark(bu.kaynak_organik, gecen?.kaynak_organik)} />
              <Satir ad="Checklist abonesi (SİSTEM kapısı)" v={bu.checklist_abone} f={fark(bu.checklist_abone, gecen?.checklist_abone)} />
              <div className="mt-3 border-t border-dashed border-line pt-3 text-xs text-muted">
                Hat dağılımı: takvim {bu.hat_takvim} · rapor (PDF) {bu.hat_rapor}. Edinme maliyeti (nitelikli CPL) kendi reklam hesabı bağlanınca burada; tavan {tl(HEDEF.butceAy)}/ay.
              </div>
            </Kutu>
          </div>
        </>
      )}
      <p className="text-xs text-muted">Darboğaz ve haftanın tek aksiyonu Pazartesi Telegram raporunda (haftalık iş gözden geçirme); bu sayfa aynı sayıların görsel halidir.</p>
    </>
  );
}

function Sayac({ ad, deger, alt, ilerleme }: { ad: string; deger: string; alt: string; ilerleme?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="text-[13px] font-medium text-muted">{ad}</div>
      <div className="mt-1 font-display text-[34px] font-semibold leading-none">{deger}</div>
      <div className="mt-2 text-xs text-muted">{alt}</div>
      {ilerleme != null && <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-signal" style={{ width: `${Math.min(100, Math.round(ilerleme * 100))}%` }} /></div>}
    </div>
  );
}
function Satir({ ad, v, f }: { ad: string; v: number; f: string }) {
  return <div className="flex items-center justify-between border-b border-line py-2 text-sm last:border-b-0"><span>{ad}</span><span className="flex items-baseline gap-2"><b className="font-display text-lg">{v}</b><span className="text-xs text-muted">{f}</span></span></div>;
}
