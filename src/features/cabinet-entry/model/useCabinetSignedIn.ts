"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/shared/config";

const isSignedIn = (body: unknown): boolean =>
  typeof body === "object" && body !== null && (body as { signedIn?: unknown }).signedIn === true;

/**
 * Вошёл ли посетитель в личный кабинет. Кабинет живёт на том же домене и отвечает только «да / нет».
 * Пока ответа нет или кабинет недоступен (например, при локальной разработке лендинга) — «не вошёл»:
 * посетитель просто видит «Войти», для него это не ошибка.
 */
export function useCabinetSignedIn(): boolean {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(siteConfig.cabinet.status, {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => setSignedIn(isSignedIn(body)))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.warn("Не удалось узнать, вошёл ли посетитель в кабинет", error);
      });
    return () => controller.abort();
  }, []);

  return signedIn;
}
