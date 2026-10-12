import type { ReactNode } from "react";
import { OverlaysProvider } from "@/shared/lib";
import { CookieBanner } from "@/widgets/cookie-banner";
import { LegalModal } from "@/widgets/legal-modal";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Единая точка для глобальных провайдеров приложения.
 * OverlaysProvider управляет юридической модалкой; сама модалка и cookie-баннер
 * рендерятся здесь же, поверх контента страницы.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <OverlaysProvider>
      {children}
      <LegalModal />
      <CookieBanner />
    </OverlaysProvider>
  );
}
