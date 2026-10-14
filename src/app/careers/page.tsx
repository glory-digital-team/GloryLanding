import type { Metadata } from "next";
import type { Vacancy } from "@/entities/vacancy";
import { buildMetadata } from "@/shared/lib/seo";
import { type PlatformVacancy, platformVacancies } from "@/shared/platform/server";
import { CareersPage } from "@/views/careers";

export const metadata: Metadata = buildMetadata({
  path: "/careers/",
  title: "Команда Глори.Цифра — вакансии разработчиков, дизайнеров и AI",
  description:
    "Команда студии Глори.Цифра: вакансии во фронтенде, бэкенде, дизайне, AI и менеджменте. Отклик за 2 минуты, ответ за 48 часов.",
});

// Вакансии ведутся в «Глори.Штат» (подпроект 12): страница перечитывает их раз в 5 минут.
export const revalidate = 300;

const toVacancy = (v: PlatformVacancy): Vacancy => ({
  id: v.id,
  title: v.title,
  direction: v.direction,
  level: v.level,
  format: v.formats,
  employment: v.employment,
  salary: v.salary,
  pitch: v.pitch,
  tasks: v.tasks,
  requirements: v.requirements,
  bonus: v.bonus,
  stack: v.stack,
  hot: v.hot,
});

export default async function Page() {
  const fromPlatform = await platformVacancies();
  return <CareersPage vacancies={fromPlatform === null ? null : fromPlatform.map(toVacancy)} />;
}
