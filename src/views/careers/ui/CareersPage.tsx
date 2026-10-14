"use client";

import { MotionConfig } from "motion/react";
import { type Vacancy, VacanciesProvider } from "@/entities/vacancy";
import { ApplyDrawer, ApplyProvider } from "@/features/vacancy-apply";
import { CareersHeader } from "@/widgets/careers-header";
import { CareersHero } from "@/widgets/careers-hero";
import { Vacancies } from "@/widgets/vacancies";
import { StackMarquee } from "@/widgets/stack-marquee";
import { HiringPath } from "@/widgets/hiring-path";
import { CareersCulture } from "@/widgets/careers-culture";
import { CareersFaq } from "@/widgets/careers-faq";
import { CareersCta } from "@/widgets/careers-cta";
import { Footer } from "@/widgets/footer";

// Раздел «Команда» «Глори.Цифра»: вакансии из «Глори.Штат» (null — встроенный список), отклик уходит туда же.
export function CareersPage({ vacancies }: { vacancies: Vacancy[] | null }) {
  return (
    <MotionConfig reducedMotion="user">
      <VacanciesProvider value={vacancies}>
        <ApplyProvider>
          <CareersHeader />
          <main>
            <CareersHero />
            <Vacancies />
            <StackMarquee />
            <HiringPath />
            <CareersCulture />
            <CareersCta />
            <CareersFaq />
          </main>
          <Footer />
          <ApplyDrawer />
        </ApplyProvider>
      </VacanciesProvider>
    </MotionConfig>
  );
}
