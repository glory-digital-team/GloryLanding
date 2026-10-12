import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { CaseLog } from "@/widgets/case-log";
import { JsonLd } from "@/shared/components/JsonLd";
import { ORGANIZATION_REF, absoluteUrl } from "@/shared/lib/seo";
import { Button } from "@/shared/ui/Button";
import { CaseCard, caseHref, type CaseStudy } from "@/entities/case";
import { getService } from "@/entities/service";
import { CaseRelated } from "./CaseRelated";
import { CaseViewTracker } from "./CaseViewTracker";
import styles from "./CaseStudyPage.module.scss";

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </>
  );
}

/** Article-разметка кейса: автор и издатель — организация из глобального графа. */
export function caseSchema(item: CaseStudy) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(caseHref(item))}#case`,
    headline: item.h1,
    description: item.description,
    url: absoluteUrl(caseHref(item)),
    inLanguage: "ru",
    author: ORGANIZATION_REF,
    publisher: ORGANIZATION_REF,
    about: item.services
      .map((p) => getService(p))
      .filter((s) => s !== undefined)
      .map((s) => ({ "@type": "Service", name: s.navLabel, url: absoluteUrl(s.path) })),
    image: absoluteUrl(`/og/cases--${item.slug}.png`),
  };
}

// Шаблон кейса (ТЗ §7.25): контекст → задача → подход → решение → «как создавали» →
// запуск → результат → стек → похожие проекты → заявка. Пустые разделы не выводятся:
// лучше короткий честный кейс, чем «вода» и выдуманные цифры.
export function CaseStudyPage({ item }: { item: CaseStudy }) {
  const mainService = getService(item.services[0]);
  const hasStory = item.context.length + item.task.length + item.features.length + item.results.length > 0;

  const schema = caseSchema(item);

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <CaseViewTracker slug={item.slug} />
        <PageHero
          crumbs={[
            { label: "Кейсы", href: "/cases/" },
            { label: item.name, href: caseHref(item) },
          ]}
          eyebrow={`Кейс · ${item.industry}`}
          title={item.h1}
          lead={<p>{item.summary}</p>}
          actions={
            <>
              {item.liveUrl ? (
                <Button href={item.liveUrl} variant="secondary" calm target="_blank" rel="noopener" data-cta={`case_live_${item.slug}`}>
                  Открыть {item.liveLabel ?? "проект"} ↗
                </Button>
              ) : null}
              <Button href="#lead-form" variant="primary" data-cta={`case_hero_lead_${item.slug}`}>
                Обсудить похожую задачу
              </Button>
            </>
          }
          aside={
            <div className={styles.cover} aria-hidden="true">
              <CaseCard item={item} />
            </div>
          }
          footer={
            <dl className={styles.meta}>
              <div>
                <dt>Отрасль</dt>
                <dd>{item.industry}</dd>
              </div>
              {mainService ? (
                <div>
                  <dt>Направление</dt>
                  <dd>
                    <a href={mainService.path}>{mainService.navLabel}</a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Работы</dt>
                <dd>{item.tags.join(", ")}</dd>
              </div>
            </dl>
          }
        />

        {item.facts.length > 1 ? (
          <section className={styles.facts} aria-label="Проект в цифрах">
            <div className={styles.inner}>
              <ul className={styles.factsGrid}>
                {item.facts.map((f) => (
                  <li key={f.label} className={styles.fact}>
                    <span className={styles.factValue}>{f.value}</span>
                    <span className={styles.factLabel}>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {hasStory ? (
          <div className={styles.story}>
            {item.context.length ? (
              <section className={styles.row}>
                <h2 className={styles.rowTitle}>С чем пришёл клиент</h2>
                <div className={styles.rowBody}>
                  <Paragraphs items={item.context} />
                </div>
              </section>
            ) : null}
            {item.task.length ? (
              <section className={styles.row}>
                <h2 className={styles.rowTitle}>Задача и критерии успеха</h2>
                <ul className={styles.checks}>
                  {item.task.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {item.approach ? (
              <section className={styles.approach}>
                <p className={styles.quote}>{item.approach.quote}</p>
                <ol className={styles.flow}>
                  {item.approach.flow.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ol>
                <div className={styles.rowBody}>
                  <Paragraphs items={item.approach.text} />
                </div>
              </section>
            ) : null}
            {item.features.length ? (
              <section className={styles.block}>
                <h2 className={styles.rowTitle}>Что сделали</h2>
                <div className={styles.features}>
                  {item.features.map((f) => (
                    <article key={f.title} className={styles.feature}>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <section className={styles.pending}>
            <div className={styles.inner}>
              <div className={styles.pendingCard}>
                <h2 className={styles.rowTitle}>Подробный разбор готовим к публикации</h2>
                <p>
                  Задачу, решения и результаты проекта мы публикуем только после согласования с
                  клиентом — без выдуманных цифр. Расскажем о проекте подробнее на звонке и покажем,
                  как похожий подход сработает для вашей задачи.
                </p>
                <div className={styles.pendingActions}>
                  {item.liveUrl ? (
                    <Button href={item.liveUrl} variant="secondary" calm target="_blank" rel="noopener">
                      Посмотреть проект ↗
                    </Button>
                  ) : null}
                  <Button href="#lead-form" variant="primary">
                    Обсудить задачу
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        <CaseLog entries={item.log} project={item.name} />

        {item.launch.length || item.results.length || item.stack.length ? (
          <div className={styles.story}>
            {item.launch.length ? (
              <section className={styles.row}>
                <h2 className={styles.rowTitle}>Запуск</h2>
                <ul className={styles.checks}>
                  {item.launch.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {item.results.length ? (
              <section className={styles.results}>
                <h2 className={styles.rowTitle}>Результат</h2>
                <ol className={styles.resultsList}>
                  {item.results.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </section>
            ) : null}
            {item.stack.length ? (
              <section className={styles.row}>
                <h2 className={styles.rowTitle}>Технологии</h2>
                <ul className={styles.stack}>
                  {item.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}

        <CaseRelated item={item} />
        <LeadForm
          formId={`case_${item.slug}`}
          title="Есть похожая задача?"
          text="Пришлите короткое описание текущего процесса или продукта: что сегодня не работает и какой результат нужен. Подберём формат следующего шага — аудит, оценку, прототип или discovery."
          context={`кейс ${item.name}`}
        />
      </main>
      <Footer />
    </>
  );
}
