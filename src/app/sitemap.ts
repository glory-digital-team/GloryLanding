import type { MetadataRoute } from "next";
import { CASES, caseHref } from "@/entities/case";
import { SERVICES } from "@/entities/service";
import { absoluteUrl } from "@/shared/lib/seo";

// ТЗ §3.3: только канонические страницы с кодом 200; черновики кейсов (noindex) — не включаем.
// lastmod — дата фактического обновления контента, а не время сборки:
// обновляйте CONTENT_UPDATED при правке текстов, иначе поисковики перестают доверять lastmod.
const CONTENT_UPDATED = new Date("2026-10-12");
const LEGAL_UPDATED = new Date("2026-10-07");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, lastModified = CONTENT_UPDATED) => ({
    url: absoluteUrl(path),
    lastModified,
    priority,
  });

  return [
    page("/", 1),
    page("/services/", 0.9),
    ...SERVICES.map((s) => page(s.path, s.group === "extra" ? 0.7 : 0.8)),
    page("/raschet-stoimosti/", 0.8),
    page("/diagnostic/", 0.8),
    page("/cases/", 0.8),
    ...CASES.filter((c) => c.status === "published").map((c) => page(caseHref(c), 0.7)),
    page("/process/", 0.6),
    page("/about/", 0.6),
    page("/contacts/", 0.6),
    page("/careers/", 0.5),
    page("/documents/", 0.2, LEGAL_UPDATED),
    page("/privacy/", 0.2, LEGAL_UPDATED),
    page("/consent/", 0.2, LEGAL_UPDATED),
    page("/offer/", 0.2, LEGAL_UPDATED),
    page("/subscription-offer/", 0.2, LEGAL_UPDATED),
  ];
}
