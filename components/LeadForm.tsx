"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { IconCheck, IconAlert, IconArrow } from "./icons";

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-lg border border-line-strong bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20";

export default function LeadForm({ source = "rontgen" }: { source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      ad_soyad: String(data.get("ad_soyad") || "").trim(),
      isletme_adi: String(data.get("isletme_adi") || "").trim(),
      telefon: String(data.get("telefon") || "").trim(),
      eposta: String(data.get("eposta") || "").trim(),
      web_sitesi: String(data.get("web_sitesi") || "").trim(),
      instagram: String(data.get("instagram") || "").trim(),
      reklam_butcesi: String(data.get("reklam_butcesi") || ""),
      kaynak: source,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Gönderim başarısız oldu.");
      }
      // Analytics: lead event (ID'ler sonra; güvenli no-op)
      if (typeof window !== "undefined") {
        // @ts-expect-error fbq global yer tutucu
        window.fbq?.("track", "Lead", { source });
        // @ts-expect-error gtag global yer tutucu
        window.gtag?.("event", "generate_lead", { source });
      }
      setStatus("success");
      form.reset();
      setBudget("");
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
        <h3 className="h3 mt-5">Başvurun alındı.</h3>
        <p className="prose-body mx-auto mt-3 max-w-md text-[0.95rem]">
          48 saat içinde işletmeni inceleyip 3 kritik kayıp noktanı kişiye özel
          video + raporla paylaşacağım. Acil bir konu varsa{" "}
          <a
            href={site.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-signal underline-offset-2 hover:underline"
          >
            WhatsApp&apos;tan
          </a>{" "}
          yazabilirsin.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bp-card tick-corners p-6 sm:p-8">
      <div className="grid gap-4">
        {/* Ad Soyad + İşletme Adı */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ad_soyad" className="eyebrow-muted mb-2 block">
              Ad Soyad
            </label>
            <input
              id="ad_soyad"
              name="ad_soyad"
              type="text"
              required
              autoComplete="name"
              placeholder="Adınız Soyadınız"
              className={fieldBase}
            />
          </div>
          <div>
            <label htmlFor="isletme_adi" className="eyebrow-muted mb-2 block">
              İşletme Adı
            </label>
            <input
              id="isletme_adi"
              name="isletme_adi"
              type="text"
              required
              autoComplete="organization"
              placeholder="İşletmenizin adı"
              className={fieldBase}
            />
          </div>
        </div>

        {/* Telefon + E-posta */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="telefon" className="eyebrow-muted mb-2 block">
              Telefon
            </label>
            <input
              id="telefon"
              name="telefon"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="05XX XXX XX XX"
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
        </div>

        <div>
          <label htmlFor="web_sitesi" className="eyebrow-muted mb-2 block">
            Web Sitesi
          </label>
          <input
            id="web_sitesi"
            name="web_sitesi"
            type="text"
            required
            inputMode="url"
            autoComplete="url"
            placeholder="firmaniz.com"
            className={fieldBase}
          />
        </div>

        <div>
          <label htmlFor="instagram" className="eyebrow-muted mb-2 block">
            Instagram Kullanıcı Adı
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            required
            placeholder="@kullaniciadi"
            className={fieldBase}
          />
        </div>

        <div>
          <label htmlFor="reklam_butcesi" className="eyebrow-muted mb-2 block">
            Aylık Reklam Bütçesi
          </label>
          <div className="relative">
            <select
              id="reklam_butcesi"
              name="reklam_butcesi"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`${fieldBase} appearance-none pr-10 ${
                budget === "" ? "text-muted/70" : ""
              }`}
            >
              {site.budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
                <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
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
              Ücretsiz Röntgen Başvurusu Gönder
              <IconArrow className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs leading-relaxed text-muted">
          Göndererek{" "}
          <a href={site.legal.kvkkHref} className="underline underline-offset-2 hover:text-ink">
            KVKK Aydınlatma Metni
          </a>{" "}
          kapsamında iletişim kurulmasını kabul edersiniz.
        </p>
      </div>
    </form>
  );
}
