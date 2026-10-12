import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { TaskRouter } from "@/widgets/task-router";
import { JsonLd } from "@/shared/components/JsonLd";
import { absoluteUrl } from "@/shared/lib/seo";
import { pageBlock, pageContent } from "@/shared/content";
import { Button } from "@/shared/ui/Button";
import { SERVICES, SERVICE_GROUPS, servicesInGroup } from "@/entities/service";
import styles from "./ServicesPage.module.scss";

export function ServicesPage() {
  const page = pageContent("/services/");
  const schema = {
    "@type": "CollectionPage",
    name: page.h1,
    description: page.description,
    url: absoluteUrl("/services/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(s.path),
        name: s.navLabel,
      })),
    },
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[{ label: "Услуги", href: "/services/" }]}
          eyebrow="Что делаем"
          title={page.h1}
          lead={<p>{pageBlock("/services/", "Услуги").lines[0]}</p>}
          actions={
            <>
              <Button href="/raschet-stoimosti/" variant="primary" size="lg" data-cta="services_hero_calc">
                Рассчитать проект
              </Button>
              <Button href="#lead-form" variant="secondary" calm size="lg">
                Описать задачу
              </Button>
            </>
          }
          footer={
            <ul className={styles.jump}>
              {SERVICE_GROUPS.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`}>{g.label}</a>
                </li>
              ))}
            </ul>
          }
        />

        {SERVICE_GROUPS.map((g, gi) => (
          <section key={g.id} id={g.id} className={styles.group} aria-labelledby={`${g.id}-title`}>
            <div className={styles.inner}>
              <header className={styles.groupHead}>
                <span className={styles.groupIdx} aria-hidden="true">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <h2 className={styles.groupTitle} id={`${g.id}-title`}>
                  {g.label}
                </h2>
                <p className={styles.groupLead}>{g.lead}</p>
              </header>
              <ul className={styles.cards}>
                {servicesInGroup(g.id).map((s) => (
                  <li key={s.path}>
                    <a href={s.path} className={styles.card}>
                      <h3 className={styles.cardTitle}>{s.navLabel}</h3>
                      <p className={styles.cardText}>{s.short.charAt(0).toUpperCase() + s.short.slice(1)}</p>
                      <span className={styles.cardMore}>
                        Подробнее <span aria-hidden="true">→</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <TaskRouter />

        <LeadForm
          formId="services"
          title="Не уверены, какая услуга нужна"
          text={pageBlock("/services/", "Не уверены, какая услуга нужна").lines[0]}
          context="хаб услуг"
        />
      </main>
      <Footer />
    </>
  );
}
