import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Faq } from "@/widgets/faq";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { ProcessTrack } from "@/widgets/process-track";
import { JsonLd } from "@/shared/components/JsonLd";
import { ORGANIZATION_REF, absoluteUrl } from "@/shared/lib/seo";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Section } from "@/shared/ui/Section";
import {
  AREAS,
  DIAGNOSTICS_PATH,
  DIAGNOSTICS_SEO,
  FACTS,
  FAQ,
  HERO,
  RESULTS,
  STEPS,
} from "../model/content";
import styles from "./DiagnosticsPage.module.scss";

// Лендинг «Бесплатная диагностика»: созвон 30–40 минут → письменное резюме за 2 рабочих дня.
// Главный CTA ведёт на форму заявки внизу страницы (#lead-form).
export function DiagnosticsPage() {
  const schema = {
    "@type": "Service",
    "@id": `${absoluteUrl(DIAGNOSTICS_PATH)}#service`,
    name: HERO.h1,
    description: DIAGNOSTICS_SEO.description,
    url: absoluteUrl(DIAGNOSTICS_PATH),
    provider: ORGANIZATION_REF,
    offers: { "@type": "Offer", price: 0, priceCurrency: "RUB" },
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[{ label: "Бесплатная диагностика", href: DIAGNOSTICS_PATH }]}
          eyebrow="Бесплатно"
          title={HERO.h1}
          lead={<p>{HERO.lead}</p>}
          actions={
            <>
              <Button
                href="#lead-form"
                variant="primary"
                size="lg"
                data-cta="diagnostics_hero_form"
              >
                Записаться на диагностику
              </Button>
              <Button
                href="/raschet-stoimosti/"
                variant="secondary"
                calm
                size="lg"
                data-cta="diagnostics_hero_calc"
              >
                Рассчитать проект
              </Button>
            </>
          }
          aside={
            <dl className={styles.facts}>
              {FACTS.map((f) => (
                <div key={f.value} className={styles.fact}>
                  <dt>{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          }
        />

        <Section
          id="chto-proveryaem"
          eyebrow="Что проверяем"
          title="Смотрим на задачу целиком, а не только на технологию"
          lead={
            <p>
              Выберем то, что болит у вас: можно разобрать одно направление или сразу несколько.
            </p>
          }
        >
          <div className={styles.areas}>
            {AREAS.map((a) => (
              <Card key={a.title} icon={a.icon} title={a.title}>
                {a.text}
              </Card>
            ))}
          </div>
        </Section>

        <Section id="chto-poluchite" eyebrow="Результат" title="Что будет в резюме" tone="soft">
          <ol className={styles.results}>
            {RESULTS.map((r) => (
              <li key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <ProcessTrack
          steps={STEPS}
          title="Как проходит диагностика"
          lead="С вашей стороны — только заявка и созвон, остальное делаем мы."
        />

        <Faq items={FAQ} title="Вопросы о диагностике" />
        <LeadForm
          formId="diagnostics"
          context="бесплатная диагностика"
          title="Записаться на бесплатную диагностику"
          text="Опишите в нескольких предложениях, что сейчас происходит и что хочется изменить. Менеджер свяжется с вами и предложит время созвона."
          ctaLabel="Записаться"
          taskPlaceholder="Например: сайт есть, но заявок мало, и непонятно, что переделывать в первую очередь"
        />
      </main>
      <Footer />
    </>
  );
}
