import type { Metadata } from "next";
import { siteConfig } from "@/shared/config";

/**
 * SEO-хелперы (ТЗ §3, §10): уникальные title/description, self-canonical,
 * Open Graph / Twitter с картинкой 1200×630 и robots с расширенными сниппетами.
 * Все пути — со слешем на конце (trailingSlash: true в next.config).
 */
export interface PageSeo {
  /** Путь страницы: "/", "/crm/", "/cases/club-parus/". */
  path: string;
  /** Итоговый Title из SEO-реестра (уже с брендом). */
  title: string;
  description: string;
  /** Путь к OG-картинке; по умолчанию — /og/<slug>.png, сгенерированная scripts/og. */
  image?: string;
  type?: "website" | "article";
  /** Черновики (кейсы без подтверждённых данных) — noindex, но follow. */
  noindex?: boolean;
  keywords?: string[];
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function ogImageFor(path: string): string {
  const slug = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "--");
  return `/og/${slug}.png`;
}

export function buildMetadata({
  path,
  title,
  description,
  image,
  type = "website",
  noindex = false,
  keywords,
}: PageSeo): Metadata {
  const img = image ?? ogImageFor(path);
  return {
    // absolute: бренд уже входит в Title из реестра — шаблон layout не дублирует его
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "ru_RU",
      type,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}

export interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Ссылка на организацию из глобального графа (layout) — без дублирования данных. */
export const ORGANIZATION_REF = { "@id": `${siteConfig.url}/#organization` };
