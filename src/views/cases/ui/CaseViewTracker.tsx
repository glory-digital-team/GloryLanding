"use client";

import { useEffect } from "react";
import { track } from "@/shared/analytics";

// Событие case_view (ТЗ §12.1) — какие кейсы реально читают перед заявкой.
export function CaseViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("case_view", { case: slug });
  }, [slug]);
  return null;
}
