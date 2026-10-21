import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { JsonLd } from "@/shared/components/JsonLd";
import { siteConfig } from "@/shared/config";
import { ORGANIZATION_REF, absoluteUrl } from "@/shared/lib/seo";
import { Button } from "@/shared/ui/Button";
import { Section } from "@/shared/ui/Section";
import {
  AFTER,
  CASES,
  FORMAT,
  HERO,
  LIMITS,
  OUTCOMES,
  SEO,
  SITUATIONS,
  STEPS,
  confirmedOnly,
} from "../model/content";
import { DiagnosticViewEvent } from "./DiagnosticViewEvent";
import { SituationCheck } from "./SituationCheck";
import styles from "./DiagnosticPage.module.scss";

const PATH = "/diagnostic/";

// Посадочная «Бесплатная диагностика»: одна цель — отправить форму.
// Неподтверждённые тексты (формат, сроки, кейсы, число мест) не выводятся — см. model/content.ts.
export function DiagnosticPage() {
  const [format] = confirmedOnly([FORMAT]);
  const outcomes = confirmedOnly(OUTCOMES);
  const cases = confirmedOnly(CASES);
  const limits = confirmedOnly(LIMITS);

  const schema = {
    "@type": "Service",
    "@id": `${absoluteUrl(PATH)}#service`,
    name: HERO.h1,
    serviceType: "Диагностика бизнес-процессов",
    description: SEO.description,
    url: absoluteUrl(PATH),
    provider: ORGANIZATION_REF,
    areaServed: siteConfig.areaServed.map((name) => ({
      "@type": name === "Россия" ? "Country" : "City",
      name,
    })),
    offers: { "@type": "Offer", price: "0", priceCurrency: "RUB", url: absoluteUrl(PATH) },
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <DiagnosticViewEvent />
        <PageHero
          crumbs={[{ label: HERO.crumb, href: PATH }]}
          eyebrow={HERO.eyebrow}
          title={HERO.h1}
          lead={HERO.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
          actions={
            <Button href="#lead-form" variant="primary" size="lg" data-cta="diagnostic_hero">
              {HERO.cta}
            </Button>
          }
        />

        <Section
          id="includes"
          title="Что входит в диагностику"
          lead={format ? <p>{format}</p> : undefined}
        >
          <ul className={styles.outcomes}>
            {outcomes.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="steps" title="Как проходит" tone="soft">
          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className={styles.stepNum} aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="for-whom"
          title="Для кого"
          lead={
            <p>Диагностика полезна, если в работе компании есть хотя бы одна из этих ситуаций.</p>
          }
        >
          <SituationCheck items={SITUATIONS} />
        </Section>

        {cases.length > 0 ? (
          <Section id="cases" title="Кейсы" tone="soft">
            <ul className={styles.outcomes}>
              {cases.map((item) => (
                <li key={item.href}>
                  <h3>
                    <a href={item.href}>{item.title}</a>
                  </h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section id="after" title="Что будет после заявки">
          <ol className={styles.after}>
            {AFTER.map((x) => (
              <li key={x.q}>
                <h3>{x.q}</h3>
                <p>{x.a}</p>
              </li>
            ))}
          </ol>
        </Section>

        <LeadForm
          variant="diagnostic"
          formId="diagnostic"
          title="Записаться на диагностику"
          text="Оставьте имя и почту, остальное обсудим на разговоре."
          context="страница бесплатной диагностики"
          ctaLabel="Записаться бесплатно"
          taskPlaceholder="Например: заказы приходят из почты и мессенджеров, менеджеры вручную переносят их в 1С"
        />
        {limits.length > 0 ? (
          <div className={styles.limits}>
            {limits.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
