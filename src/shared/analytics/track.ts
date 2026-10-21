"use client";

/**
 * Словарь событий аналитики (ТЗ §12.1). Одни и те же имена уходят в Метрику (reachGoal)
 * и в dataLayer. Персональные данные (имя, почта, телефон) в события не передаются.
 */
export type AnalyticsEvent =
  | "lead_form_start"
  | "lead_form_submit"
  | "lead_form_error"
  | "contact_click"
  | "cta_click"
  | "case_view"
  | "calculator_start"
  | "calculator_step_view"
  | "calculator_option_select"
  | "calculator_result_view"
  | "calculator_lead_submit"
  | "calculator_error"
  | "diagnostic_check"
  | "diagnostic_page_view"
  | "diagnostic_form_submit"
  | "experiment_view";

type Params = Record<string, string | number | boolean | null | undefined>;

const YM_ID = 109943467;

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const payload = { page_path: window.location.pathname, ...params };
  try {
    window.ym?.(YM_ID, "reachGoal", event, payload);
    (window.dataLayer ??= []).push({ event, ...payload });
  } catch {
    // аналитика не должна ломать интерфейс
  }
}

const ATTRIBUTION_KEY = "glory:attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid"];

/** Первая точка входа сессии: UTM, referrer и посадочная (ТЗ §12: передавать в CRM). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const query = new URLSearchParams(window.location.search);
    const data: Record<string, string> = {
      landing: window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).hostname : "",
    };
    for (const key of UTM_KEYS) {
      const value = query.get(key);
      if (value) data[key] = value.slice(0, 120);
    }
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage недоступен (приватный режим) — просто без атрибуции
  }
}

/** Строка атрибуции для комментария заявки: менеджер видит источник прямо в карточке лида. */
export function attributionNote(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    const parts = Object.entries({ ...data, page: window.location.pathname })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`);
    return parts.length ? `Источник: ${parts.join("; ")}` : "";
  } catch {
    return "";
  }
}

/** Параметры визита в Метрике (например, вариант A/B-теста): по ним сегментируются отчёты. */
export function visitParams(params: Params): void {
  if (typeof window === "undefined") return;
  try {
    window.ym?.(YM_ID, "params", params);
    (window.dataLayer ??= []).push({ event: "visit_params", ...params });
  } catch {
    // аналитика не должна ломать интерфейс
  }
}
