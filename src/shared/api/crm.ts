"use client";

export interface PublicLeadCaptureRequest {
  source_code?: string;
  requester_name?: string | null;
  requester_email?: string | null;
  requester_phone?: string | null;
  company_name?: string | null;
  note?: string | null;
  estimated_budget_amount?: number | null;
}

export interface PublicConfiguratorLeadRequest {
  requester_name?: string | null;
  requester_email?: string | null;
  requester_phone?: string | null;
  company_name: string;
  service_type_code?: string | null;
  note?: string | null;
  forecast_amount?: number | null;
}

export interface PublicConfiguratorLeadResponse {
  lead_id: string;
  counterparty_id: string;
  deal_id: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_GLORI_API_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "";

export class PublicCrmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicCrmError";
  }
}

const FIELD_LABELS: Record<string, string> = {
  company_name: "Компания",
  requester_name: "Имя",
  requester_email: "Email",
  requester_phone: "Телефон",
  service_type_code: "Тип услуги",
  forecast_amount: "Бюджет",
};

function formatValidationItem(item: unknown): string | null {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return null;

  const data = item as { loc?: unknown; msg?: unknown; message?: unknown };
  const message = typeof data.msg === "string"
    ? data.msg
    : typeof data.message === "string"
      ? data.message
      : null;
  if (!message) return null;

  const normalizedMessage = message === "Field required" ? "обязательное поле" : message;

  if (Array.isArray(data.loc)) {
    for (let i = data.loc.length - 1; i >= 0; i -= 1) {
      const field = data.loc[i];
      if (typeof field === "string" && FIELD_LABELS[field]) {
        return `${FIELD_LABELS[field]}: ${normalizedMessage}`;
      }
    }
  }

  return normalizedMessage;
}

export function getPublicApiErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string") return payload;
  if (!payload || typeof payload !== "object") return fallback;

  const data = payload as { detail?: unknown; message?: unknown; error?: unknown };
  const candidate = data.detail ?? data.message ?? data.error;

  if (typeof candidate === "string") return candidate;
  if (Array.isArray(candidate)) {
    const messages = candidate.map(formatValidationItem).filter(Boolean);
    return messages.length > 0 ? messages.join(". ") : fallback;
  }
  if (candidate && typeof candidate === "object") {
    return formatValidationItem(candidate) ?? fallback;
  }

  return fallback;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let detail = "Не удалось отправить заявку";
    try {
      detail = getPublicApiErrorMessage(await response.json(), detail);
    } catch {
      // Body is optional for gateway errors.
    }
    throw new PublicCrmError(detail);
  }
  return (await response.json()) as T;
}

export function createPublicContactLead(payload: PublicLeadCaptureRequest) {
  return postJson<{ status?: string; detail?: string }>("/crm/public/contact-leads", payload);
}

export function createPublicConfiguratorLead(payload: PublicConfiguratorLeadRequest) {
  return postJson<PublicConfiguratorLeadResponse>("/crm/public/configurator-leads", payload);
}
