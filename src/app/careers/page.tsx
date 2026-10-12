import type { Metadata } from "next";
import { CareersPage } from "@/views/careers";

export const metadata: Metadata = {
  title: "Карьера | Глори.Цифра",
  description:
    "Вакансии студии Глори.Цифра: фронтенд, бэкенд, дизайн, AI и менеджмент. Отклик за 2 минуты, ответ за 48 часов.",
  alternates: { canonical: "/careers" },
};

export default function Page() {
  return <CareersPage />;
}
