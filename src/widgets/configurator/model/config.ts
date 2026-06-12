// Данные конфигуратора стоимости (Figma «CTA» 337:385/450/624/779).
// Цены ориентировочные: базовые ставки из макета (сайт 100к, AI 200к в чеке),
// модули и срочность — по логике чека («+50 000₽», скидка за отложенный запуск).

export interface ProjectType {
  id: string;
  label: string;
  icon: string;
  basePrice: number;
}

export const PROJECT_TYPES: ProjectType[] = [
  { id: "site", label: "Создание сайтов", icon: "/configurator/site.svg", basePrice: 100_000 },
  { id: "promo", label: "Лендинг / Промо", icon: "/configurator/promo.svg", basePrice: 100_000 },
  { id: "ai", label: "AI-решения", icon: "/configurator/ai.svg", basePrice: 200_000 },
  { id: "mobile", label: "Мобильная разработка", icon: "/configurator/mobile.svg", basePrice: 250_000 },
];

export interface ProjectModule {
  id: string;
  label: string;
  price: number;
}

export const MODULES: ProjectModule[] = [
  { id: "crm", label: "Автоматический обмен с CRM и 1С", price: 50_000 },
  { id: "payments", label: "Приём платежей на сайте", price: 50_000 },
  { id: "cabinet", label: "Личный кабинет для клиентов", price: 50_000 },
  { id: "search", label: "Умный поиск и рекомендации", price: 50_000 },
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
  label: string;
  delta: number;
  tone: UrgencyTone;
}

const URGENT: Urgency = { id: "urgent", label: "Срочный запуск", delta: 50_000, tone: "orange" };
const OPTIMAL: Urgency = { id: "optimal", label: "Оптимальный запуск", delta: 0, tone: "blue" };
const DELAYED: Urgency = { id: "delayed", label: "Отложенный запуск", delta: -50_000, tone: "green" };

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

/** Минимальная ставка — для чека, пока тип проекта не выбран. */
export const MIN_BASE_PRICE = PROJECT_TYPES.reduce(
  (min, t) => Math.min(min, t.basePrice),
  Infinity,
);

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}
