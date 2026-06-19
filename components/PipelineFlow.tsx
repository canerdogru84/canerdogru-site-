"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconAd, IconChat, IconCRM, IconLoop } from "./icons";

type Node = {
  id: string;
  index: string;
  title: string;
  desc: string;
  Icon: (p: { className?: string }) => JSX.Element;
  active?: boolean;
};

const NODES: Node[] = [
  {
    id: "reklam",
    index: "01",
    title: "Reklam",
    desc: "Doğru kitleye, ölçülebilir bütçeyle giden talep akışı.",
    Icon: IconAd,
  },
  {
    id: "yz",
    index: "02",
    title: "WhatsApp YZ Müşteri Temsilcisi",
    desc: "Her mesaja saniyeler içinde yanıt; niteler, randevu açar.",
    Icon: IconChat,
    active: true,
  },
  {
    id: "crm",
    index: "03",
    title: "CRM",
    desc: "Tek görünüm: her aday, her temas, her fırsat kayıt altında.",
    Icon: IconCRM,
  },
  {
    id: "takip",
    index: "04",
    title: "Takip Akışı",
    desc: "Soğuyan adayı geri getiren otomatik hatırlatma döngüsü.",
    Icon: IconLoop,
  },
];

function NodeCard({ node }: { node: Node }) {
  const { Icon } = node;
  return (
    <div
      className={`bp-card tick-corners h-full p-5 transition-transform duration-300 hover:-translate-y-1 ${
        node.active ? "ring-1 ring-copper/40" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid h-10 w-10 place-items-center rounded-lg ${
            node.active
              ? "bg-copper/10 text-copper"
              : "bg-signal/10 text-signal"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-[11px] tracking-label text-muted">
          {node.index}
        </span>
      </div>
      <h3 className="mt-4 font-display text-[1.02rem] font-semibold leading-tight text-ink">
        {node.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{node.desc}</p>
      {node.active && (
        <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-label text-copper">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-copper" />
          7/24 aktif
        </span>
      )}
    </div>
  );
}

function HConnector({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-full min-h-[1px] items-center px-1">
      <motion.div
        className="relative h-px w-full origin-left overflow-hidden bg-gradient-to-r from-signal/30 via-signal to-signal/30"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      >
        <span className="absolute top-1/2 h-1.5 w-8 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_8px_2px_rgba(13,110,253,0.5)] animate-signal-travel" />
      </motion.div>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-signal">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
          <path d="M1 1l4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

function VConnector({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-9 justify-center">
      <motion.div
        className="relative w-px origin-top bg-gradient-to-b from-signal/30 via-signal to-signal/30"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={reduce ? undefined : { scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
      />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-signal">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
          <path d="M1 1l3.5 4L8 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

/**
 * İmza öğesi: "müşteri kazanım sistemi"nin canlı şeması.
 * Masaüstünde yatay, mobilde dikey — her ikisi de scroll'da çizilir.
 */
export default function PipelineFlow() {
  return (
    <div>
      {/* Masaüstü — yatay akış */}
      <div className="hidden items-stretch md:flex">
        {NODES.map((node, i) => (
          <div key={node.id} className="flex flex-1 items-stretch">
            <div className="flex-1">
              <NodeCard node={node} />
            </div>
            {i < NODES.length - 1 && (
              <div className="w-10 shrink-0 md:w-12">
                <HConnector delay={0.15 + i * 0.15} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobil — dikey akış */}
      <div className="flex flex-col md:hidden">
        {NODES.map((node, i) => (
          <div key={node.id}>
            <NodeCard node={node} />
            {i < NODES.length - 1 && <VConnector delay={0.1 + i * 0.1} />}
          </div>
        ))}
      </div>
    </div>
  );
}
