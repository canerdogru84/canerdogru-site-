// Sütun = harcama, çizgi = talep. Kütüphanesiz SVG; sunucuda çizilir.
export default function HarcamaGrafigi({ seri }: { seri: { hafta: string; harcama: number; talep: number }[] }) {
  if (seri.length === 0) return null;
  const W = 560, H = 200, P = 36;
  const maxH = Math.max(...seri.map((s) => s.harcama), 1) * 1.15;
  const maxT = Math.max(...seri.map((s) => s.talep), 1) * 1.15;
  const bw = (W - 2 * P) / seri.length;
  const y = (v: number, max: number) => H - P - (v / max) * (H - 2 * P);
  const etiket = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Haftalık harcama ve talep">
      {seri.map((s, i) => (
        <rect key={s.hafta} x={P + i * bw + 8} y={y(s.harcama, maxH)} width={Math.max(bw - 16, 4)} height={H - P - y(s.harcama, maxH)} rx={4} fill="#e5e8ef" />
      ))}
      <polyline points={seri.map((s, i) => `${P + i * bw + bw / 2},${y(s.talep, maxT)}`).join(" ")} fill="none" stroke="#0d6efd" strokeWidth={2.5} />
      {seri.map((s, i) => (
        <circle key={s.hafta + "d"} cx={P + i * bw + bw / 2} cy={y(s.talep, maxT)} r={4} fill="#0d6efd" />
      ))}
      {seri.map((s, i) => (
        <text key={s.hafta + "t"} x={P + i * bw + bw / 2} y={H - 10} fontSize={11} textAnchor="middle" fill="#5b6578">
          {etiket(s.hafta)}
        </text>
      ))}
    </svg>
  );
}
