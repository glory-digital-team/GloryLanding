"use client";

import { PublicCrmError } from "./crm";

export interface PublicConfiguratorCalculateRequest {
  service_type_code: string;
  module_codes: string[];
  urgency_level_code?: string;
  risk_level_code?: string;
  client_segment_code?: string | null;
  has_tz?: boolean | null;
  deadline?: string | null;
  metadata?: Record<string, unknown>;
}

export interface PublicConfiguratorCalculateResponse {
  total: number;
  currency: "RUB";
  valid_until: string;
  calculation_request_id: string;
  estimate_min_amount?: number | null;
  estimate_max_amount?: number | null;
  duration_min_days?: number | null;
  duration_max_days?: number | null;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    let detail = "Расчёт временно недоступен";
    try {
      const data = (await response.json()) as { detail?: string; message?: string };
      detail = data.detail || data.message || detail;
    } catch {
      // Gateway errors may not return JSON.
    }
    throw new PublicCrmError(detail);
  }
  return (await response.json()) as T;
}

export function calculatePublicConfigurator(payload: PublicConfiguratorCalculateRequest) {
  return postJson<PublicConfiguratorCalculateResponse>("/config/public/calculate", payload);
}
