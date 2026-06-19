import Reveal from "./Reveal";

type Props = {
  index?: string; // ör. "02" — gerçek bir sıra varsa anlamlı, dekor değil
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <Reveal>
        <p
          className={`eyebrow flex items-center gap-2 ${
            centered ? "justify-center" : ""
          }`}
        >
          {index && <span className="text-muted">{index}</span>}
          {index && <span className="h-px w-6 bg-line-strong" aria-hidden />}
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="h2 mt-4">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className={`lead mt-5 ${centered ? "mx-auto" : ""}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
