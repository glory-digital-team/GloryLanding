// Услуга (направление) — посадочная страница под отдельный поисковый intent (ТЗ §2, §7).
export type ServiceGroup = "sites" | "automation" | "ai" | "extra";

export interface FaqItem {
  q: string;
  a: string;
}

export interface DefItem {
  title: string;
  text: string;
}

/** Блок контента страницы. Тип определяется при импорте из «ядро.xlsx». */
export type ServiceBlock =
  | { kind: "text"; title: string; text: string; link?: string | null }
  | { kind: "price"; title: string; text: string; link?: string | null }
  | { kind: "list"; title: string; items: string[]; link?: string | null }
  | { kind: "diagnostic"; title: string; items: string[]; link?: string | null }
  | { kind: "defs"; title: string; items: DefItem[]; link?: string | null }
  | { kind: "steps"; title: string; items: string[]; link?: string | null }
  | { kind: "faq"; title: string; items: FaqItem[] }
  | { kind: "cases"; title: string }
  | { kind: "cta"; title: string; text: string };

/** Тип проекта в конфигураторе (коды каталога платформы). */
export type ConfiguratorType = "site" | "promo" | "ai" | "mobile";

export interface Service {
  path: string;
  slug: string;
  group: ServiceGroup;
  navLabel: string;
  short: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  ctaLabel: string;
  configuratorType: ConfiguratorType | null;
  keywords: string[];
  blocks: ServiceBlock[];
}
