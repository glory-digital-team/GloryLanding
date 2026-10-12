"use client";

import { MotionConfig } from "motion/react";
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

// Карьерный раздел «Глори.Цифра» (MVP).
export function CareersPage() {
  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
