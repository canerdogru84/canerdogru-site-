import { site } from "@/lib/site";

/**
 * Logo: SVG mark (currentColor — açık zeminde koyu, koyu zeminde beyaz) + isim.
 * SVG bir CSS mask olarak kullanılır; böylece dosyanın kendi rengi yerine
 * bulunduğu yerin metin rengini (currentColor) alır.
 * assets.logo yoksa blueprint nişangah wordmark'ına düşer.
 */
export default function Logo({ className = "" }: { className?: string }) {
  if (site.assets.logo) {
    return (
      <span
        role="img"
        aria-label={site.name}
        className={`inline-flex items-center gap-2.5 text-ink ${className}`}
      >
        <span
          aria-hidden="true"
          className="block h-[30px] w-[30px] shrink-0 bg-current"
          style={{
            WebkitMaskImage: `url(${site.assets.logo})`,
            maskImage: `url(${site.assets.logo})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />
        <span className="font-display text-[1.05rem] font-extrabold tracking-[-0.02em]">
          Caner Doğru
        </span>
      </span>
    );
  }

  // Yedek: nişangah wordmark
  return (
    <span
      role="img"
      aria-label={site.name}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="text-signal"
      >
        <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 1v3.2M9 13.8V17M1 9h3.2M13.8 9H17" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="2" fill="currentColor" />
      </svg>
      <span className="font-display text-[1.05rem] font-extrabold tracking-[-0.02em] text-ink">
        Caner Doğru
      </span>
    </span>
  );
}
