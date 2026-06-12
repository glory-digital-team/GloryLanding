"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Глобальное состояние оверлеев сайта: конфигуратор стоимости
 * и модалка с юридическими документами. Контекст живёт в shared,
 * чтобы любые виджеты могли открывать оверлеи, не зависая друг от друга;
 * сами модалки рендерит провайдер приложения.
 */
interface OverlaysContextValue {
  configuratorOpen: boolean;
  openConfigurator: () => void;
  closeConfigurator: () => void;
  policyOpen: boolean;
  openPolicy: () => void;
  closePolicy: () => void;
}

const OverlaysContext = createContext<OverlaysContextValue | null>(null);

export function OverlaysProvider({ children }: { children: ReactNode }) {
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const openConfigurator = useCallback(() => setConfiguratorOpen(true), []);
  const closeConfigurator = useCallback(() => setConfiguratorOpen(false), []);
  const openPolicy = useCallback(() => setPolicyOpen(true), []);
  const closePolicy = useCallback(() => setPolicyOpen(false), []);

  const value = useMemo(
    () => ({
      configuratorOpen,
      openConfigurator,
      closeConfigurator,
      policyOpen,
      openPolicy,
      closePolicy,
    }),
    [configuratorOpen, policyOpen, openConfigurator, closeConfigurator, openPolicy, closePolicy],
  );

  return <OverlaysContext.Provider value={value}>{children}</OverlaysContext.Provider>;
}

export function useOverlays(): OverlaysContextValue {
  const ctx = useContext(OverlaysContext);
  if (!ctx) {
    throw new Error("useOverlays должен вызываться внутри <OverlaysProvider>");
  }
  return ctx;
}
