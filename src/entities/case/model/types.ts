// Кейс — внутренняя страница проекта (ТЗ §7.25, аудит §2.3): контекст → задача →
// решение → запуск → результат. Цифры — только подтверждённые.
export type CaseVisual = "govori" | "esis" | "tienda" | "parus" | "lunes";

/** Запись «бортового журнала»: как проект проходил статусы — тот же язык, что в кабинете клиента. */
export interface CaseLogEntry {
  status: string;
  title: string;
  text: string;
}

export interface CaseFact {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  /** Подпись на карточке. */
  subtitle: string;
  /** H1 по шаблону «[Что сделали] для [клиент/отрасль]». */
  h1: string;
  title: string;
  description: string;
  industry: string;
  /** Пути услуг, к которым относится кейс (перелинковка услуга ↔ кейс). */
  services: string[];
  tags: string[];
  /**
   * published — подтверждённый кейс, индексируется;
   * draft — кандидат (ТЗ «Кейсы_кандидаты»): страница доступна по ссылке, но noindex
   * и вне sitemap, пока бизнес не подтвердит задачу, роль, результаты и разрешение.
   */
  status: "published" | "draft";
  visual: CaseVisual;
  liveUrl?: string;
  liveLabel?: string;
  summary: string;
  facts: CaseFact[];
  context: string[];
  task: string[];
  approach?: { quote: string; flow: string[]; text: string[] };
  features: { title: string; text: string }[];
  launch: string[];
  results: string[];
  stack: string[];
  log: CaseLogEntry[];
  /** Внутренняя памятка: чего не хватает до публикации. На сайте не выводится. */
  missing?: string[];
}
