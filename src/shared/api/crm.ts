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

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let detail = "Не удалось отправить заявку";
    try {
      const data = (await response.json()) as { detail?: string; message?: string };
      detail = data.detail || data.message || detail;
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
