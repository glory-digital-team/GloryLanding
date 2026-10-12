import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { JsonLd } from "@/shared/components/JsonLd";
import { absoluteUrl } from "@/shared/lib/seo";
import { pageBlock, pageContent } from "@/shared/content";
import { Button } from "@/shared/ui/Button";
import { CASES, CaseCard, caseHref } from "@/entities/case";
import { CasesGrid } from "./CasesGrid";
import styles from "./CasesHubPage.module.scss";

const SHOWN = [
  "Исходная ситуация",
  "Задача и критерии успеха",
  "Анализ и решения",
  "UX и архитектура",
  "Внедрение и запуск",
  "Результат — только подтверждённый",
];

export function CasesHubPage() {
  const page = pageContent("/cases/");
  const featured = CASES.find((c) => c.status === "published");
  const rest = CASES.filter((c) => c !== featured);
  const schema = {
    "@type": "CollectionPage",
    name: page.h1,
    description: page.description,
    url: absoluteUrl("/cases/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CASES.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(caseHref(c)),
        name: c.name,
      })),
    },
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[{ label: "Кейсы", href: "/cases/" }]}
          eyebrow="Портфолио"
          title={page.h1}
          lead={<p>{pageBlock("/cases/", "Кейсы Глори.Цифра").lines[0]}</p>}
        />

        {featured ? (
          <section className={styles.featured} aria-labelledby="featured-title">
            <div className={styles.inner}>
              <div className={styles.featuredCard}>
                <div className={styles.featuredText}>
                  <p className={styles.kicker}>Ключевой кейс · {featured.industry}</p>
                  <h2 className={styles.featuredTitle} id="featured-title">
                    <a href={caseHref(featured)}>{featured.h1}</a>
                  </h2>
                  <p className={styles.featuredSummary}>{featured.summary}</p>
                  <ul className={styles.featuredFacts}>
                    {featured.facts.map((f) => (
                      <li key={f.label}>
                        <strong>{f.value}</strong>
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                  <Button href={caseHref(featured)} variant="primary" data-cta="cases_featured">
                    Читать кейс
                  </Button>
                </div>
                <div className={styles.featuredCover} aria-hidden="true">
                  <CaseCard item={featured} />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className={styles.all} aria-labelledby="all-title">
          <div className={styles.inner}>
            <h2 className={styles.sectionTitle} id="all-title">
              Все проекты
            </h2>
            <CasesGrid items={rest} />
          </div>
        </section>

        <section className={styles.method} aria-labelledby="method-title">
          <div className={styles.inner}>
            <div className={styles.methodCard}>
              <div>
                <h2 className={styles.sectionTitle} id="method-title">
                  Что показываем в каждом кейсе
                </h2>
                <p className={styles.methodText}>{pageBlock("/cases/", "Что показываем в каждом кейсе").lines[0]}</p>
              </div>
              <ol className={styles.methodList}>
                {SHOWN.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <LeadForm
          formId="cases"
          title="Есть похожая задача"
          text={pageBlock("/cases/", "Есть похожая задача").lines[0]}
          context="хаб кейсов"
        />
      </main>
      <Footer />
    </>
  );
}
