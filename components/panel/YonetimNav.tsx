"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const S = [
  { ad: "Müşteriler", yol: "/panel/yonetim" },
  { ad: "Benim işim", yol: "/panel/yonetim/isim" },
];
export default function YonetimNav() {
  const yol = usePathname();
  return (
    <nav className="mx-auto w-full max-w-content px-5 sm:px-8">
      <ul className="flex gap-1 text-sm">
        {S.map((s) => {
          const aktif = s.yol === "/panel/yonetim" ? yol === s.yol : yol.startsWith(s.yol);
          return (
            <li key={s.yol}>
              <Link href={s.yol} className={`block border-b-2 px-3 py-2.5 ${aktif ? "border-signal font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}>{s.ad}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
