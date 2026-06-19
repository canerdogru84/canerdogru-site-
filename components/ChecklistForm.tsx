"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { IconCheck, IconAlert, IconArrow, IconDownload } from "./icons";

/** Tarayıcıda dosya indirmesini tetikler (kullanıcı jesti içinde çağrılmalı). */
function triggerDownload(href: string) {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = href;
  a.download = "";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-lg border border-line-strong bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20";

export default function ChecklistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      isim: String(data.get("isim") || "").trim(),
      eposta: String(data.get("eposta") || "").trim(),
      kaynak: "checklist",
    };

    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Gönderim başarısız oldu.");
      if (typeof window !== "undefined") {
        // @ts-expect-error fbq global yer tutucu
        window.fbq?.("track", "Lead", { source: "checklist" });
        // @ts-expect-error gtag global yer tutucu
        window.gtag?.("event", "generate_lead", { source: "checklist" });
      }
      // Kayıt başarılı → checklist'i hemen indir (kullanıcı jesti hâlâ aktif).
      triggerDownload(site.assets.checklistPdf);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Bir şeyler ters gitti. Lütfen tekrar deneyin."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="bp-card tick-corners p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-signal/10 text-signal">
          <IconCheck className="h-7 w-7" />
        </span>
        <h3 className="h3 mt-5">Checklist&apos;in hazır!</h3>
        <p className="prose-body mx-auto mt-3 max-w-md text-[0.95rem]">
          İndirme otomatik başladı. Başlamadıysa{" "}
          <a
            href={site.assets.checklistPdf}
            download
            className="font-semibold text-signal underline underline-offset-2"
          >
            buradan indir
          </a>
          . Bir de şunu biliyor musun? Bu 30 günü{" "}
          <strong className="font-semibold text-ink">10 iş gününe</strong>{" "}
          indirebiliriz — röntgen başvurusu ücretsiz.
        </p>
        <Link href="/rontgen" className="btn-primary mt-6 inline-flex">
          Ücretsiz Röntgen Al
          <IconArrow className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bp-card tick-corners p-6 sm:p-8">
      <div className="grid gap-4">
        <div>
          <label htmlFor="isim" className="eyebrow-muted mb-2 block">
            İsim
          </label>
          <input
            id="isim"
            name="isim"
            type="text"
            required
            autoComplete="name"
            placeholder="Adın"
            className={fieldBase}
          />
        </div>
        <div>
          <label htmlFor="eposta" className="eyebrow-muted mb-2 block">
            E-posta
          </label>
          <input
            id="eposta"
            name="eposta"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="ornek@email.com"
            className={fieldBase}
          />
        </div>

        {status === "error" && error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {status === "submitting" ? (
            "Gönderiliyor…"
          ) : (
            <>
              <IconDownload className="h-4 w-4" />
              Checklist&apos;i İndir
            </>
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted">
          E-postan güvende. Spam göndermiyorum. İstediğin zaman çıkabilirsin.
        </p>
      </div>
    </form>
  );
}
