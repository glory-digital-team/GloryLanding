"use client";

// Заявки с сайта уходят в платформу «Глори.Штат» — в кабинет клиента на том же домене
// (`/cabinet/api/site/*`): расчёт конфигуратора, заявка с кодом входа на почту и вход по коду.

export class SiteApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiteApiError";
  }
}

const SITE_API = "/cabinet/api/site";

async function post<T>(path: string, payload: unknown, fallback: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${SITE_API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new SiteApiError(fallback);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
    throw new SiteApiError(typeof body?.message === "string" ? body.message : fallback);
  }
  return (await response.json()) as T;
}

/** Что выбрали в конфигураторе. */
export interface SiteChoice {
  typeId: string | null;
  moduleIds: string[];
  launchOn: string | null;
  sourceId: string | null;
}

/** Бюджет «от – до» в рублях; `total: null` — посчитаем вручную (услуги не настроены). */
export interface SiteEstimate {
  total: number | null;
  min: number | null;
  max: number | null;
  currency: "RUB";
  urgency: "urgent" | "optimal" | "delayed";
}

export function estimateSite(choice: SiteChoice) {
  return post<SiteEstimate>("/estimate", choice, "Расчёт временно недоступен");
}

export interface SiteRequest extends SiteChoice {
  email: string;
  name: string;
  phone: string | null;
  comment: string | null;
  consent: boolean;
}

/** Куда ушёл код входа в кабинет и через сколько секунд можно запросить новый. */
export interface CodeSent {
  email: string;
  resendIn: number;
  expiresInMinutes: number;
}

export function submitSiteRequest(request: SiteRequest) {
  return post<CodeSent>("/request", request, "Не удалось отправить заявку");
}

export function resendCabinetCode(email: string) {
  return post<CodeSent>("/code", { email }, "Не удалось отправить код");
}

/** Код подошёл — cookie кабинета уже стоит, можно открывать `/cabinet`. */
export function verifyCabinetCode(email: string, code: string) {
  return post<{ ok: true }>("/verify", { email, code }, "Не удалось проверить код");
}

/** Почта похожа на настоящую: точная проверка — на сервере. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
