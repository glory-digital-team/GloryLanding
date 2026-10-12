// Вакансия карьерного раздела «Глори.Цифра».
export type VacancyDirection = "design" | "dev" | "ai" | "management";
export type VacancyFormat = "remote" | "hybrid";

export interface Vacancy {
  id: string;
  title: string;
  direction: VacancyDirection;
  level: string;
  format: VacancyFormat[];
  employment: string;
  salary: string;
  /** Одна фраза — зачем эта роль студии. */
  pitch: string;
  tasks: string[];
  requirements: string[];
  bonus: string[];
  stack: string[];
  hot?: boolean;
}

export const DIRECTION_LABEL: Record<VacancyDirection, string> = {
  design: "Дизайн",
  dev: "Разработка",
  ai: "AI",
  management: "Менеджмент",
};

/** Как направление звучит в фразе-фильтре «Я — …». */
export const DIRECTION_PERSON: Record<VacancyDirection, string> = {
  design: "дизайнер",
  dev: "разработчик",
  ai: "AI-инженер",
  management: "менеджер",
};

export const FORMAT_LABEL: Record<VacancyFormat, string> = {
  remote: "Удалённо",
  hybrid: "Гибрид",
};
