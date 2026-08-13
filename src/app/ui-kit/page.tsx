import type { Metadata } from "next";
import { UiKitPage } from "@/views/ui-kit";

export const metadata: Metadata = {
  title: "UI-кит — Глори.Цифра",
  description: "Дизайн-система «Глори.Цифра»: цвета, типографика и компоненты.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/ui-kit",
  },
};

// Маршрут "/ui-kit" — тонкая обёртка Next над view-слоем.
export default function Page() {
  return <UiKitPage />;
}
