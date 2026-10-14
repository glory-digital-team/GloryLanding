"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Vacancy } from "./types";
import { vacancies as builtIn } from "./vacancies";

// Вакансии страницы «Команда»: из «Глори.Штат» (их передаёт сервер страницы) или встроенный список, если Штат
// недоступен.
const VacanciesContext = createContext<Vacancy[] | null>(null);

export function VacanciesProvider({
  value,
  children,
}: {
  value: Vacancy[] | null;
  children: ReactNode;
}) {
  return <VacanciesContext.Provider value={value}>{children}</VacanciesContext.Provider>;
}

export function useVacancies(): Vacancy[] {
  return useContext(VacanciesContext) ?? builtIn;
}
