"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

// Sekme → yol. musteriler.panel_sekmeler hangileri açık söyler (ay 1 / 2 / 3 kademesi).
const SEKMELER: Record<string, { ad: string; yol: string }> = {
  ozet: { ad: "Özet", yol: "/panel" },
  kacan_para: { ad: "Kaçan para", yol: "/panel/kacan-para" },
  huni: { ad: "Huni", yol: "/panel/huni" },
  para: { ad: "Para", yol: "/panel/para" },
  surer_mi: { ad: "Sürer mi", yol: "/panel/surer-mi" },
  dikkat: { ad: "Dikkat", yol: "/panel/dikkat" },
  kurulum: { ad: "Kurulum", yol: "/panel/kurulum" },
};
const SIRA = ["ozet", "kacan_para", "huni", "para", "surer_mi", "dikkat", "kurulum"];

export default function PanelNav({ isletme, sekmeler, email }: { isletme: string; sekmeler: string[]; email: string }) {
  const yol = usePathname();
  const acik = SIRA.filter((k) => sekmeler.includes(k));
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden text-sm text-muted sm:inline">·</span>
          <span className="hidden text-sm font-medium sm:inline">{isletme}</span>
        </div>
        <form action="/auth/cikis" method="post" className="flex items-center gap-3 text-xs text-muted">
          <span className="hidden md:inline">{email}</span>
          <button className="rounded-lg border border-line px-3 py-1.5 hover:bg-surface">Çıkış</button>
        </form>
      </div>
      <nav className="mx-auto w-full max-w-content overflow-x-auto px-5 sm:px-8">
        <ul className="flex gap-1 text-sm">
          {acik.map((k) => {
            const s = SEKMELER[k];
            const aktif = s.yol === "/panel" ? yol === "/panel" : yol.startsWith(s.yol);
            return (
              <li key={k}>
                <Link
                  href={s.yol}
                  className={`block whitespace-nowrap border-b-2 px-3 py-2.5 transition ${
                    aktif ? "border-signal font-medium text-ink" : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {s.ad}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
