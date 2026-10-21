"use client";

import { useEffect, useSyncExternalStore } from "react";
import { track, visitParams } from "./track";

// Простые A/B-тесты без внешних сервисов: вариант выбирается случайно и равновероятно,
// хранится в localStorage (посетитель видит один и тот же вариант при повторных визитах).
// Принудительно выбрать вариант для проверки: ?ab_<имя>=<вариант>, например ?ab_call_time_picker=native.

const STORAGE_PREFIX = "glory:ab:";
const assigned = new Map<string, string>();

function assign(name: string, variants: readonly string[]): string {
  const cached = assigned.get(name);
  if (cached) return cached;

  let variant = "";
  try {
    const forced = new URLSearchParams(window.location.search).get(`ab_${name}`);
    const stored = localStorage.getItem(STORAGE_PREFIX + name);
    variant =
      forced && variants.includes(forced)
        ? forced
        : stored && variants.includes(stored)
          ? stored
          : variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(STORAGE_PREFIX + name, variant);
  } catch {
    // localStorage недоступен (приватный режим): вариант живёт до перезагрузки страницы
    variant ||= variants[Math.floor(Math.random() * variants.length)];
  }
  assigned.set(name, variant);
  return variant;
}

const noopSubscribe = () => () => {};

/**
 * Вариант эксперимента для текущего посетителя. На сервере и до гидрации — `null`
 * (страницы статические), поэтому экспериментальный блок рендерится только в браузере.
 * Показ варианта отправляется событием `experiment_view` и параметром визита Метрики.
 * `enabled: false` — посетитель в эксперимент не попадает (хук нельзя вызывать по условию).
 */
export function useExperiment<V extends string>(
  name: string,
  variants: readonly V[],
  enabled = true,
): V | null {
  const variant = useSyncExternalStore(
    noopSubscribe,
    () => (enabled ? (assign(name, variants) as V) : null),
    () => null,
  );

  useEffect(() => {
    if (!variant) return;
    visitParams({ [`ab_${name}`]: variant });
    track("experiment_view", { experiment: name, variant });
  }, [name, variant]);

  return variant;
}
