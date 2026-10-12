import { CASES } from "./cases";
import type { CaseStudy } from "./types";

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find((c) => c.slug === slug);
}

/** Кейсы для страницы услуги: сначала подтверждённые, затем кандидаты. */
export function casesForService(path: string, limit = 3): CaseStudy[] {
  return CASES.filter((c) => c.services.includes(path))
    .sort((a, b) => Number(b.status === "published") - Number(a.status === "published"))
    .slice(0, limit);
}

/** Похожие кейсы: пересечение по услугам, без текущего. */
export function similarCases(current: CaseStudy, limit = 2): CaseStudy[] {
  return CASES.filter((c) => c.slug !== current.slug)
    .map((c) => ({ c, score: c.services.filter((s) => current.services.includes(s)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ c }) => c);
}

export function caseHref(c: CaseStudy): string {
  return `/cases/${c.slug}/`;
}
