// Panel ortak parçaları. Tasarım: leadadmedia/references/raporlama/musteri-kpi-ve-panel.md §2 (görsel kurallar).
// Renk yalnız hedef varsa (gri = hedef konmamış). Her kartta en fazla 3 satır.

const RENK = { gri: "#c7ccd6", iyi: "#1a9e5c", orta: "#d9960b", kotu: "#d6443c" } as const;
export type KartRenk = keyof typeof RENK;

export function Baslik({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-label text-muted">{children}</h2>;
}

export function Rozet({ kaynak }: { kaynak: "sistem" | "firma" | "bilgi" }) {
  const stil =
    kaynak === "sistem" ? "bg-[#e8f0fe] text-signal" : kaynak === "firma" ? "bg-[#eef7f1] text-[#1a9e5c]" : "bg-surface text-muted";
  const ad = kaynak === "sistem" ? "Sistemden" : kaynak === "firma" ? "Sizden" : "Bilgi";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${stil}`}>{ad}</span>;
}

export function Kart({
  ad,
  deger,
  ok,
  renk,
  kaynak,
  onceki,
  not,
}: {
  ad: string;
  deger: string;
  ok: string;
  renk: KartRenk;
  kaynak: "sistem" | "firma";
  onceki?: string;
  not?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card" style={{ borderTop: `4px solid ${RENK[renk]}` }}>
      <div className="min-h-[2.5rem] text-[13px] font-medium text-muted">{ad}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-[34px] font-semibold leading-none sm:text-[38px]">{deger}</span>
        <span className="text-sm font-semibold" style={{ color: renk === "gri" ? "#5b6578" : RENK[renk] }}>
          {ok}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
        <Rozet kaynak={kaynak} />
        {onceki && <span>geçen hafta {onceki}</span>}
      </div>
      {not && <p className="mt-3 border-t border-dashed border-line pt-2.5 text-[12.5px] leading-snug">{not}</p>}
    </div>
  );
}

export function HuniSeridi({ adimlar }: { adimlar: { ad: string; deger: string; gecis?: string; kaynak?: "firma" }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-y-4 rounded-2xl border border-line bg-white px-4 py-5 shadow-card sm:px-6">
      {adimlar.map((a, i) => (
        <div key={a.ad} className="flex items-center">
          {i > 0 && (
            <div className="mx-2 text-center text-line-strong sm:mx-4">
              <div className="text-2xl leading-none">→</div>
              {a.gecis && <div className="-mt-0.5 text-[11px] font-semibold text-signal">{a.gecis}</div>}
            </div>
          )}
          <div className="min-w-[88px] text-center">
            <div className="font-display text-2xl font-semibold">{a.deger}</div>
            <div className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-muted">
              {a.ad}
              {a.kaynak && <Rozet kaynak="firma" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Kutu({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6 ${className}`}>{children}</div>;
}

export function Bos({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line-strong bg-white/60 p-8 text-center text-sm text-muted">{children}</div>;
}
