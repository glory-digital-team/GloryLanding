import Link from "next/link";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { Section } from "@/shared/ui/Section";
import { Button } from "@/shared/ui/Button";
import { JsonLd } from "@/shared/components/JsonLd";
import { siteConfig } from "@/shared/config";
import { ORGANIZATION_REF, absoluteUrl } from "@/shared/lib/seo";
import { pageBlock, pageContent } from "@/shared/content";
import styles from "./AboutPage.module.scss";

const SPEC_LINKS = ["/razrabotka-saitov/", "/avtomatizaciya/", "/ai-dlya-biznesa/"];

// «О компании»: только подтверждённое (ТЗ §7.27). Блоки «Факты», «Команда», «Клиенты»
// ждут данных от бизнеса и пока не выводятся — без «сотен проектов» и выдуманных людей.
export function AboutPage() {
  const page = pageContent("/about/");
  const spec = pageBlock("/about/", "На чём специализируемся").lines;
  const principles = pageBlock("/about/", "Как принимаем решения").lines;
  const schema = {
    "@type": "AboutPage",
    name: page.h1,
    description: page.description,
    url: absoluteUrl("/about/"),
    mainEntity: ORGANIZATION_REF,
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[{ label: "О компании", href: "/about/" }]}
          eyebrow="Глори.Цифра"
          title={page.h1}
          lead={<p>{pageBlock("/about/", page.h1).lines[0]}</p>}
          actions={
            <>
              <Button href="/cases/" variant="primary" size="lg">
                Смотреть кейсы
              </Button>
              <Button href="/process/" variant="secondary" calm size="lg">
                Как работаем
              </Button>
            </>
          }
        />

        <Section id="spec" title="На чём специализируемся">
          <ul className={styles.spec}>
            {spec.slice(0, 3).map((line, i) => {
              const [name, ...rest] = line.split(" — ");
              return (
                <li key={line}>
                  <a href={SPEC_LINKS[i]} className={styles.specCard}>
                    <h3>{name}</h3>
                    <p>{rest.join(" — ")}</p>
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className={styles.focus}>{spec[3]}</p>
        </Section>

        <Section id="principles" title="Как принимаем решения" tone="dark">
          <ol className={styles.principles}>
            {principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </Section>

        <Section id="quality" title="Как обеспечиваем качество">
          <div className={styles.quality}>
            <p>{pageBlock("/about/", "Как обеспечиваем качество").lines[0]}</p>
            <ul className={styles.tags}>
              {["Review решений и кода", "QA критичных сценариев", "Безопасность и интеграции", "Performance budget", "Аналитика", "SEO-by-design"].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="legal" title="Компания и документы" tone="soft">
          <div className={styles.legal}>
            <dl className={styles.requisites}>
              {siteConfig.requisites.map((r) => {
                const [k, v] = r.includes(":") ? r.split(":") : ["Исполнитель", r];
                return (
                  <div key={r}>
                    <dt>{k.trim()}</dt>
                    <dd>{v.trim()}</dd>
                  </div>
                );
              })}
            </dl>
            <ul className={styles.docs}>
              {siteConfig.legal.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label} →</a>
                </li>
              ))}
              <li>
                <Link href="/careers/">Карьера в Глори.Цифра →</Link>
              </li>
            </ul>
          </div>
        </Section>

        <LeadForm
          formId="about"
          title="Познакомиться и обсудить задачу"
          text={pageBlock("/about/", "Познакомиться и обсудить задачу").lines[0]}
          context="страница О компании"
        />
      </main>
      <Footer />
    </>
  );
}
