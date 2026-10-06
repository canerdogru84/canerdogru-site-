import { getPanelClient, type PanelMusteri, type KacanPara, type HaftalikOzet, type HaftalikNot, tl } from "@/lib/panel";
import { Baslik, Kutu, Bos, Rozet } from "@/components/panel/Parcalar";

// Kaçak tipleri: adı, kimin tarafında, ne anlama geliyor. Aksiyon metni haftalık nottaki bayraklardan gelir.
const TIP = {
  bekleyen_talep: { ad: "24 saatten uzun bekleyen talep", sahip: "firma", aciklama: "Talep geldi, kimse dönmedi." },
  no_show: { ad: "Randevu alıp gelmeyen", sahip: "firma", aciklama: "Randevu vardı, gelmedi; hatırlatma/arama var mı?" },
  takipsiz_teklif: { ad: "7 gündür takipsiz teklif", sahip: "firma", aciklama: "Fiyat verildi, ikinci temas yok." },
} as const;

export default async function KacanParaSayfasi() {
  const sb = (await getPanelClient())!;
  const [{ data: m }, { data: satirlar }, { data: haftalar }, { data: notlar }] = await Promise.all([
    sb.from("v_panel_musteri").select("*").single<PanelMusteri>(),
    sb.from("v_kacan_para").select("*").returns<KacanPara[]>(),
    sb.from("v_haftalik_ozet").select("*").order("hafta", { ascending: false }).limit(1).returns<HaftalikOzet[]>(),
    sb.from("panel_haftalik_notlar").select("bayraklar").order("hafta_baslangic", { ascending: false }).limit(1).returns<Pick<HaftalikNot, "bayraklar">[]>(),
  ]);

  const bu = haftalar?.[0];
  const bayraklar = notlar?.[0]?.bayraklar ?? [];
  const gruplar = (Object.keys(TIP) as (keyof typeof TIP)[]).map((tip) => {
    const s = (satirlar ?? []).filter((r) => r.kacak_tipi === tip);
    return { tip, adet: s.length, tl: s.reduce((a, r) => a + Number(r.masada_kalan_tl || 0), 0) };
  });
  const toplam = gruplar.reduce((a, g) => a + g.tl, 0);
  const mesaiDisi = bu?.mesai_disi_talep ?? 0;
  const mesaiDisiOran = bu && bu.talep > 0 ? Math.round((mesaiDisi / bu.talep) * 100) : null;
  const bizde = bayraklar.filter((b) => b.sahip === "caner").length;
  const sizde = bayraklar.filter((b) => b.sahip === "firma").length;
  const hesapVar = m?.ort_siparis_degeri_tl != null && bu?.k3_talep_randevu != null;

  return (
    <>
      <div className="mb-6 flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{m?.isletme_adi} · Kaçan para</h1>
          <p className="mt-1 text-[13px] text-muted">Takip hattına düşen taleplerden otomatik hesaplanır · sizden ek rakam istemez · her satır TL'ye çevrilir</p>
        </div>
      </div>

      {gruplar.every((g) => g.adet === 0) ? (
        <Bos>Bu hafta kaçak yok: bekleyen talep, gelmeyen randevu ya da takipsiz teklif görünmüyor.</Bos>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <OzetKart renk="#d6443c" ad="Şu an masada kalan (tahmini)" deger={hesapVar ? `~${tl(toplam)}` : "—"} alt={hesapVar && bu ? `bu haftaki reklam harcamasının %${Math.round((toplam / Math.max(Number(bu.harcama_tl), 1)) * 100)}'i kadar` : "ortalama değer ve dönüşüm oranı girilince hesaplanır"} />
            <OzetKart renk="#d9960b" ad="Düzeltmesi bizde" deger={`${bizde}`} alt={bayraklar.filter((b) => b.sahip === "caner").map((b) => b.aksiyon).join(" · ") || "açık iş yok"} />
            <OzetKart renk="#0d6efd" ad="Düzeltmesi sizde" deger={`${sizde}`} alt={bayraklar.filter((b) => b.sahip === "firma").map((b) => b.aksiyon).join(" · ") || "açık karar yok"} />
          </div>

          <Baslik>Nerede kaçıyor</Baslik>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-label text-muted">
                  <th className="px-4 py-3.5 font-semibold">Kaçak noktası</th>
                  <th className="px-4 py-3.5 font-semibold">Adet</th>
                  <th className="px-4 py-3.5 font-semibold">Masada kalan</th>
                  <th className="px-4 py-3.5 font-semibold">Düzeltme</th>
                </tr>
              </thead>
              <tbody>
                {gruplar.map((g) => (
                  <tr key={g.tip} className="border-t border-line align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium">{TIP[g.tip].ad}</div>
                      <div className="mt-0.5 text-xs text-muted">{TIP[g.tip].aciklama}</div>
                    </td>
                    <td className="px-4 py-4 font-display text-2xl font-semibold">{g.adet}</td>
                    <td className="px-4 py-4 font-display text-xl font-semibold text-[#d6443c]">{g.adet && hesapVar ? `~${tl(g.tl)}` : "—"}</td>
                    <td className="px-4 py-4"><Rozet kaynak="firma" /></td>
                  </tr>
                ))}
                <tr className="border-t border-line align-top">
                  <td className="px-4 py-4">
                    <div className="font-medium">Mesai dışı gelen talep</div>
                    <div className="mt-0.5 text-xs text-muted">{mesaiDisiOran != null ? `Bu haftaki taleplerin %${mesaiDisiOran}'i akşam / hafta sonu geldi.` : "Bu hafta talep yok."}</div>
                  </td>
                  <td className="px-4 py-4 font-display text-2xl font-semibold">{mesaiDisi}</td>
                  <td className="px-4 py-4 text-muted">—</td>
                  <td className="px-4 py-4"><Rozet kaynak="bilgi" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <Kutu className="mt-5 text-xs leading-relaxed text-muted">
        Hesap: adet × o aşamadan satışa dönüş oranı (talep için randevu oranı × satış oranı; randevu/teklif için yalnız satış oranı — sizin son rakamlarınız) × ortalama değer ({tl(m?.ort_siparis_degeri_tl)}, sizin verdiğiniz rakam). Tahmindir; amaç kuruş hesabı değil, hangi deliğin büyük olduğunu göstermek. Takip hattına bağlanmamış kanal (kişisel WhatsApp vb.) burada görünmez.
      </Kutu>
    </>
  );
}

function OzetKart({ renk, ad, deger, alt }: { renk: string; ad: string; deger: string; alt: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card" style={{ borderTop: `4px solid ${renk}` }}>
      <div className="text-[13px] font-medium text-muted">{ad}</div>
      <div className="mt-1 font-display text-[34px] font-semibold leading-none">{deger}</div>
      <div className="mt-2 text-xs text-muted">{alt}</div>
    </div>
  );
}
