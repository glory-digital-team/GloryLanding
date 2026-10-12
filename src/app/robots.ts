import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/config";

// ТЗ §3.2: открыто всё публичное, включая AI-краулеры (OAI-SearchBot, PerplexityBot и др.) —
// они приводят пользователей из AI-поиска. Закрыты только служебные разделы.
// Раньше здесь был закрыт /crm/ — теперь это посадочная «CRM на заказ».
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cabinet/", "/ui-kit/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
