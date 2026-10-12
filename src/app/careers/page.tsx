import type { Metadata } from "next";
import { buildMetadata } from "@/shared/lib/seo";
import { CareersPage } from "@/views/careers";

export const metadata: Metadata = buildMetadata({
  path: "/careers/",
  title: "Карьера в Глори.Цифра — вакансии разработчиков, дизайнеров и AI",
  description:
    "Вакансии студии Глори.Цифра: фронтенд, бэкенд, дизайн, AI и менеджмент. Отклик за 2 минуты, ответ за 48 часов.",
});

export default function Page() {
  return <CareersPage />;
}
