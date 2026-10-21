"use client";

import { useEffect, useRef } from "react";
import { track } from "@/shared/analytics";

/** Событие просмотра страницы диагностики: один раз за загрузку, без персональных данных. */
export function DiagnosticViewEvent() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track("diagnostic_page_view");
  }, []);

  return null;
}
