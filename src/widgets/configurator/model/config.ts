// Данные конфигуратора стоимости (Figma «CTA» 337:385/450/624/779).
// Цены ориентировочные: базовые ставки из макета (сайт 100к, AI 200к в чеке),
// модули и срочность — по логике чека («+50 000₽», скидка за отложенный запуск).

export interface ProjectType {
  id: string;
  label: string;
  icon: string;
  serviceTypeCode: string;
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "site",
    label: "Создание сайтов",
    icon: "/configurator/site.svg",
    serviceTypeCode: "web_development",
  },
  {
    id: "promo",
    label: "Лендинг / Промо",
    icon: "/configurator/promo.svg",
    serviceTypeCode: "web_development",
  },
  {
    id: "ai",
    label: "AI-решения",
    icon: "/configurator/ai.svg",
    serviceTypeCode: "business_automation",
  },
  {
    id: "mobile",
    label: "Мобильная разработка",
    icon: "/configurator/mobile.svg",
    serviceTypeCode: "mobile_app",
  },
];

export interface ProjectModule {
  id: string;
  label: string;
}

export const MODULES: ProjectModule[] = [
  { id: "crm", label: "Автоматический обмен с CRM и 1С" },
  { id: "payments", label: "Приём платежей на сайте" },
  { id: "cabinet", label: "Личный кабинет для клиентов" },
  { id: "search", label: "Умный поиск и рекомендации" },
];

export interface SourceOption {
  id: string;
  label: string;
}

// «Исходные данные» — насколько проработана задача (шаг 3)
export const SOURCE_OPTIONS: SourceOption[] = [
  { id: "ready", label: "Всё продумано" },
  { id: "concept", label: "Есть концепция" },
  { id: "idea", label: "Только идея" },
];

export type UrgencyTone = "orange" | "blue" | "green";

export interface Urgency {
  id: string;
  code: string;
  label: string;
  tone: UrgencyTone;
}

const URGENT: Urgency = { id: "urgent", code: "urgent", label: "Срочный запуск", tone: "orange" };
const OPTIMAL: Urgency = {
  id: "optimal",
  code: "accelerated",
  label: "Оптимальный запуск",
  tone: "blue",
};
const DELAYED: Urgency = {
  id: "delayed",
  code: "standard",
  label: "Отложенный запуск",
  tone: "green",
};

/** Срочность выводится из желаемой даты запуска. */
export function urgencyFromDate(dateValue: string): Urgency | null {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;
  const days = (date.getTime() - Date.now()) / 86_400_000;
  if (days < 30) return URGENT;
  if (days < 90) return OPTIMAL;
  return DELAYED;
}

export function riskLevelFromSource(sourceId: string | null): string {
  if (sourceId === "idea") return "idea_only";
  if (sourceId === "concept") return "no_tz";
  return "full_specs";
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
