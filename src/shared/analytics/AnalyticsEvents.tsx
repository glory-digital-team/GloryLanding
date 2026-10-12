"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "./track";

/**
 * Глобальные слушатели событий без правок в каждом компоненте:
 * — клики по tel:/mailto:/t.me/vk → contact_click;
 * — клики по элементам с data-cta → cta_click (cta_id, destination_type).
 * Плюс фиксация UTM/посадочной первой страницы сессии.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    captureAttribution();

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement | HTMLButtonElement>("a, button");
      if (!link) return;
      const href = link instanceof HTMLAnchorElement ? link.getAttribute("href") ?? "" : "";

      if (href.startsWith("tel:")) track("contact_click", { contact_type: "phone" });
      else if (href.startsWith("mailto:")) track("contact_click", { contact_type: "email" });
      else if (/t\.me\//.test(href)) track("contact_click", { contact_type: "telegram" });
      else if (/vk\.(ru|com)\//.test(href)) track("contact_click", { contact_type: "vk" });

      const ctaId = link.dataset.cta;
      if (ctaId) {
        track("cta_click", {
          cta_id: ctaId,
          destination_type: href.startsWith("/raschet-stoimosti")
            ? "calculator"
            : href.startsWith("#") || href.includes("#lead")
              ? "form"
              : href.startsWith("/cases")
                ? "case"
                : "page",
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
