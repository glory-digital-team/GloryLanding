"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Vacancy } from "@/entities/vacancy";

// Состояние шторки отклика: какая вакансия открыта и на каком шаге.
// null-вакансия — «свободный отклик» (роль, которой нет в списке).
type Step = "details" | "form";

interface ApplyState {
  open: boolean;
  vacancy: Vacancy | null;
  step: Step;
  openVacancy: (v: Vacancy) => void;
  openApply: (v?: Vacancy | null) => void;
  setStep: (s: Step) => void;
  close: () => void;
}

const ApplyContext = createContext<ApplyState | null>(null);

export function ApplyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [step, setStep] = useState<Step>("details");

  const openVacancy = useCallback((v: Vacancy) => {
    setVacancy(v);
    setStep("details");
    setOpen(true);
  }, []);
  const openApply = useCallback((v: Vacancy | null = null) => {
    setVacancy(v);
    setStep("form");
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, vacancy, step, openVacancy, openApply, setStep, close }),
    [open, vacancy, step, openVacancy, openApply, close],
  );
  return <ApplyContext.Provider value={value}>{children}</ApplyContext.Provider>;
}

export function useApply() {
  const ctx = useContext(ApplyContext);
  if (!ctx) throw new Error("useApply: оберните страницу в <ApplyProvider>");
  return ctx;
}
