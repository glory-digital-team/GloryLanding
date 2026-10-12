// Данные конфигуратора стоимости (Figma «CTA» 337:385/450/624/779).
// Цену считает платформа (`/cabinet/api/site/estimate`) по услугам каталога с такими же
// кодами (id вида проекта и модулей — «Код на сайте» услуги в каталоге платформы).

export interface ProjectType {
  id: string;
  label: string;
  icon: string;
}

export const PROJECT_TYPES: ProjectType[] = [
  {
    id: "site",
    label: "Создание сайтов",
    icon: "/configurator/site.svg",
  },
  {
    id: "promo",
    label: "Лендинг / Промо",
    icon: "/configurator/promo.svg",
  },
  {
    id: "ai",
    label: "AI-решения",
    icon: "/configurator/ai.svg",
  },
  {
    id: "mobile",
    label: "Мобильная разработка",
    icon: "/configurator/mobile.svg",
  },
];

export interface ProjectModule {
  id: string;
  label: string;
  projectTypeIds: string[];
}

export const MODULES: ProjectModule[] = [
  // Создание сайтов
  {
    id: "crm",
    label: "Автоматический обмен с CRM и 1С",
    projectTypeIds: ["site"],
  },
  {
    id: "payments",
    label: "Приём платежей на сайте",
    projectTypeIds: ["site"],
  },
  {
    id: "cabinet",
    label: "Личный кабинет для клиентов",
    projectTypeIds: ["site"],
  },
  {
    id: "search",
    label: "Умный поиск и рекомендации",
    projectTypeIds: ["site"],
  },
  // Промо-сайты и лендинги
  {
    id: "quiz",
    label: "Интерактивный квиз или калькулятор",
    projectTypeIds: ["promo"],
  },
  {
    id: "promo_crm",
    label: "Связь с вашей CRM",
    projectTypeIds: ["promo"],
  },
  {
    id: "ab_tests",
    label: "A/B-тесты и аналитика",
    projectTypeIds: ["promo"],
  },
  {
    id: "target_ads",
    label: "Настройка таргетированной рекламы",
    projectTypeIds: ["promo"],
  },
  // AI-решения
  {
    id: "ai_chatbot",
    label: "AI-чатбот для поддержки 24/7",
    projectTypeIds: ["ai"],
  },
  {
    id: "ai_docs",
    label: "AI по вашим документам",
    projectTypeIds: ["ai"],
  },
  {
    id: "ai_analytics",
    label: "Аналитика звонков и переписок",
    projectTypeIds: ["ai"],
  },
  {
    id: "ai_onprem",
    label: "AI на ваших серверах",
    projectTypeIds: ["ai"],
  },
  // Мобильная разработка
  {
    id: "native_dev",
    label: "Нативная разработка (Android/iOS)",
    projectTypeIds: ["mobile"],
  },
  {
    id: "realtime_data",
    label: "Живые данные из ваших систем",
    projectTypeIds: ["mobile"],
  },
  {
    id: "retention_tools",
    label: "Инструменты возврата клиентов",
    projectTypeIds: ["mobile"],
  },
  {
    id: "offline_mode",
    label: "Офлайн-режим с синхронизацией",
    projectTypeIds: ["mobile"],
  },
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

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })} ₽`;
}
