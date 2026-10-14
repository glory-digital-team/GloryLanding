import type { ReactNode } from "react";
import { CookieBanner } from "@/widgets/cookie-banner";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Единая точка для глобальных провайдеров приложения.
 * Cookie-баннер рендерится здесь же, поверх контента страницы; юридические документы открываются
 * страницами — своей копии текстов на сайте нет, они ведутся в «Глори.Штат» (подпроект 12).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
}
