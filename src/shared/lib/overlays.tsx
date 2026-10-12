"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Глобальное состояние оверлеев сайта — модалка с юридическими документами.
 * Конфигуратор больше не модалка: он живёт на странице /raschet-stoimosti/ (ТЗ §7.24).
 */
interface OverlaysContextValue {
  policyOpen: boolean;
  openPolicy: () => void;
  closePolicy: () => void;
}

const OverlaysContext = createContext<OverlaysContextValue | null>(null);

export function OverlaysProvider({ children }: { children: ReactNode }) {
  const [policyOpen, setPolicyOpen] = useState(false);
  const openPolicy = useCallback(() => setPolicyOpen(true), []);
  const closePolicy = useCallback(() => setPolicyOpen(false), []);
  const value = useMemo(() => ({ policyOpen, openPolicy, closePolicy }), [policyOpen, openPolicy, closePolicy]);
  return <OverlaysContext.Provider value={value}>{children}</OverlaysContext.Provider>;
}

export function useOverlays(): OverlaysContextValue {
  const ctx = useContext(OverlaysContext);
  if (!ctx) {
    throw new Error("useOverlays должен вызываться внутри <OverlaysProvider>");
  }
  return ctx;
}
