import type { ReactNode } from "react";
import { OverlaysProvider } from "@/shared/lib";
import { ConfiguratorModal } from "@/widgets/configurator";
import { CookieBanner } from "@/widgets/cookie-banner";
import { LegalModal } from "@/widgets/legal-modal";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Единая точка для глобальных провайдеров приложения.
 * OverlaysProvider управляет конфигуратором и юридической модалкой;
 * сами оверлеи рендерятся здесь же, поверх контента страницы.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <OverlaysProvider>
      {children}
      <ConfiguratorModal />
      <LegalModal />
      <CookieBanner />
    </OverlaysProvider>
  );
}
