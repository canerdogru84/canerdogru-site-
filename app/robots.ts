import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.txt
 *
 * AI tarayıcıları BİLEREK AÇIK. GEO/AEO stratejisi, içeriğin ChatGPT, Claude,
 * Perplexity ve Google AI yanıtlarında alıntılanmasına dayanıyor; engellemek
 * o görünürlüğü kapatır.
 *
 * Kapalı olanlar: API uçları ve teşekkür/ara sayfalar — arama sonucunda
 * görünmelerinin bir faydası yok.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // AI tarayıcıları — açıkça izinli
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
