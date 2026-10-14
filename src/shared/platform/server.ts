import { siteConfig } from "@/shared/config/site";

// Чтение данных «Глори.Штат» на сервере сайта: вакансии раздела «Команда» и документы сайта. Штат отвечает по
// `/cabinet/api/site/*` того же домена; если лендинг живёт отдельно — по `GLORY_CABINET_ORIGIN`. Ответ кэшируется
// на 5 минут; Штат недоступен или ничего не опубликовано — страница берёт встроенные данные (null).

const ORIGIN = (
  process.env.GLORY_PLATFORM_ORIGIN ??
  process.env.GLORY_CABINET_ORIGIN ??
  siteConfig.url
).replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 4000;

async function read<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${ORIGIN}/cabinet/api/site${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type PlatformDirection = "design" | "dev" | "ai" | "management";
export type PlatformFormat = "remote" | "hybrid";

/** Опубликованная вакансия из Штата. */
export interface PlatformVacancy {
  id: string;
  title: string;
  direction: PlatformDirection;
  level: string;
  formats: PlatformFormat[];
  employment: string;
  salary: string;
  pitch: string;
  tasks: string[];
  requirements: string[];
  bonus: string[];
  stack: string[];
  hot: boolean;
}

export const platformVacancies = () => read<PlatformVacancy[]>("/vacancies");

/** Узел текста Tiptap — разделы документов Штата хранятся так. */
export interface TiptapNode {
  type: string;
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
}

export interface PlatformDocument {
  kind: "offer" | "subscription_offer" | "privacy_policy" | "pd_consent";
  n: number;
  publishedOn: string;
  title: string;
  sections: { title: string; body: TiptapNode | null }[];
}

export const platformDocument = (kind: PlatformDocument["kind"]) =>
  read<PlatformDocument>(`/documents/${kind}`);
