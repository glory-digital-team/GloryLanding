// Данные для секции Foundations страницы UI-кита.
// Значения синхронизированы с src/shared/styles/abstracts/_variables.scss.

export interface Swatch {
  name: string;
  value: string;
  /** Тёмный свотч — подпись светлая. */
  dark?: boolean;
  /** Нужна рамка (для очень светлых). */
  bordered?: boolean;
}

export const colorSwatches: Swatch[] = [
  { name: "Primary", value: "#cc0000", dark: true },
  { name: "Primary hover", value: "#a30000", dark: true },
  { name: "Dark", value: "#222224", dark: true },
  { name: "Text", value: "#222224", dark: true },
  { name: "Text muted", value: "#6b7280", dark: true },
  { name: "Text faint", value: "#9ca3af", dark: true },
  { name: "Surface", value: "#fafafa", bordered: true },
  { name: "Border", value: "#e5e7eb", bordered: true },
  { name: "White", value: "#ffffff", bordered: true },
];

export interface TypeRow {
  label: string;
  size: string;
  weight: number;
  sample: string;
}

export const typeScale: TypeRow[] = [
  { label: "Display", size: "56px", weight: 800, sample: "Глори.Цифра" },
  { label: "Heading 1", size: "40px", weight: 700, sample: "Цифровые продукты" },
  { label: "Heading 2", size: "32px", weight: 700, sample: "Никакого хаоса" },
  { label: "Heading 3", size: "24px", weight: 600, sample: "Цена без сюрпризов" },
  { label: "Body Large", size: "18px", weight: 400, sample: "Прозрачная цена на каждом этапе" },
  { label: "Body", size: "16px", weight: 400, sample: "Рассчитайте стоимость за 2 минуты" },
  { label: "Caption", size: "14px", weight: 500, sample: "Без звонков и ожиданий" },
];

export const fontWeights = [
  { label: "Regular", weight: 400 },
  { label: "Medium", weight: 500 },
  { label: "Semibold", weight: 600 },
  { label: "Bold", weight: 700 },
  { label: "Extrabold", weight: 800 },
];
