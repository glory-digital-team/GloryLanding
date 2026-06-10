import type { ReactNode } from "react";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Единая точка для глобальных провайдеров приложения
 * (тема, store, i18n, react-query и т.п.).
 * Пока просто пробрасывает children — добавляйте провайдеры по мере роста проекта.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>;
}
