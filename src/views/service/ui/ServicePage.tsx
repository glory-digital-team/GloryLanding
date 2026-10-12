import Link from "next/link";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Faq } from "@/widgets/faq";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { JsonLd } from "@/shared/components/JsonLd";
import { siteConfig } from "@/shared/config";
import { ORGANIZATION_REF, absoluteUrl } from "@/shared/lib/seo";
import { Button } from "@/shared/ui/Button";
import { CaseCard, casesForService } from "@/entities/case";
import {
  SERVICE_GROUPS,
  getService,
  relatedServices,
  serviceFaq,
  type Service,
  type ServiceBlock,
} from "@/entities/service";
import { Diagnostic } from "./Diagnostic";
import { OrderTicket } from "./OrderTicket";
import { Toc } from "./Toc";
import styles from "./ServicePage.module.scss";

const SPECIAL_LINKS: Record<string, string> = {
  "/process/": "Как проходит работа",
  "/raschet-stoimosti/": "Калькулятор стоимости",
  "/cases/": "Кейсы",
};

function linkLabel(path: string): string {
  return SPECIAL_LINKS[path] ?? getService(path)?.navLabel ?? path;
}

export function calculatorHref(service: Service): string {
  return service.configuratorType ? `/raschet-stoimosti/?type=${service.configuratorType}` : "/raschet-stoimosti/";
}

/** «Что получите» в тикете: первые пункты списков/диагностики/форматов. */
function outcomesOf(service: Service): string[] {
  for (const b of service.blocks) {
    if (b.kind === "list") return b.items.slice(0, 3).map((t) => t.replace(/\.$/, ""));
    if (b.kind === "defs") return b.items.filter((d) => d.title).slice(0, 3).map((d) => d.title);
  }
  return [];
}

function BlockLink({ link }: { link?: string | null }) {
  if (!link || link === "/raschet-stoimosti/") return null;
  return (
    <a href={link} className={styles.chipLink}>
      {linkLabel(link)} <span aria-hidden="true">→</span>
    </a>
  );
}

interface Rendered {
  id: string;
  title: string;
  node: React.ReactNode;
}

function renderBlock(block: ServiceBlock, id: string, service: Service, index: number): Rendered | null {
  const calc = calculatorHref(service);
  switch (block.kind) {
    case "text":
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.textRow} key={id}>
            <h2 className={styles.textTitle}>{block.title}</h2>
            <div className={styles.textBody}>
              <p>{block.text}</p>
              <BlockLink link={block.link} />
            </div>
          </section>
        ),
      };
    case "list":
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.block} key={id}>
            <h2 className={styles.blockTitle}>{block.title}</h2>
            <ol className={styles.numbered}>
              {block.items.map((item, i) => (
                <li key={item}>
                  <span className={styles.numberedIdx} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <BlockLink link={block.link} />
          </section>
        ),
      };
    case "diagnostic":
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.block} key={id}>
            <p className={styles.kicker}>Самопроверка · 30 секунд</p>
            <h2 className={styles.blockTitle}>{block.title}</h2>
            <Diagnostic items={block.items} service={service.slug} calculatorHref={calc} />
          </section>
        ),
      };
    case "defs": {
      const cards = block.items.filter((d) => d.title);
      const notes = block.items.filter((d) => !d.title);
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.block} key={id}>
            <h2 className={styles.blockTitle}>{block.title}</h2>
            <div className={styles.defs}>
              {cards.map((d, i) => (
                <article key={d.title} className={styles.def}>
                  <span className={styles.defIdx} aria-hidden="true">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <h3 className={styles.defTitle}>{d.title}</h3>
                  <p className={styles.defText}>{d.text.charAt(0).toUpperCase() + d.text.slice(1)}</p>
                </article>
              ))}
            </div>
            {notes.map((n) => (
              <p key={n.text} className={styles.note}>
                {n.text}
              </p>
            ))}
            <BlockLink link={block.link} />
          </section>
        ),
      };
    }
    case "steps":
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.block} key={id}>
            <h2 className={styles.blockTitle}>{block.title}</h2>
            <ol className={styles.steps}>
              {block.items.map((item, i) => (
                <li key={item} className={styles.stepItem}>
                  <span className={styles.stepNum}>Этап {i + 1}</span>
                  <span className={styles.stepText}>{item}</span>
                </li>
              ))}
            </ol>
            <BlockLink link={block.link} />
          </section>
        ),
      };
    case "price":
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.price} key={id}>
            <div>
              <p className={styles.kickerLight}>Бюджет</p>
              <h2 className={styles.priceTitle}>{block.title}</h2>
              <p className={styles.priceText}>{block.text}</p>
            </div>
            <div className={styles.priceAside}>
              <p>Ориентир по бюджету — за пару минут, контакты только после результата.</p>
              <Button href={calc} variant="primary" data-cta={`service_price_${service.slug}`}>
                {service.ctaLabel}
              </Button>
            </div>
          </section>
        ),
      };
    case "cases": {
      const cases = casesForService(service.path, 2);
      if (cases.length === 0) return null;
      return {
        id,
        title: block.title,
        node: (
          <section id={id} className={styles.block} key={id}>
            <div className={styles.blockHead}>
              <h2 className={styles.blockTitle}>{block.title}</h2>
              <Link href="/cases/" className={styles.chipLink}>
                Все кейсы <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className={styles.cases}>
              {cases.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          </section>
        ),
      };
    }
    default:
      void index;
      return null;
  }
}

export function ServicePage({ service }: { service: Service }) {
  const group = SERVICE_GROUPS.find((g) => g.id === service.group);
  const faq = serviceFaq(service).map((item, i) =>
    i === 0 && /стоит|стоимост|бюджет|цен/i.test(item.q)
      ? { ...item, cta: { label: "Открыть калькулятор", href: calculatorHref(service) } }
      : item,
  );
  const cta = service.blocks.find((b) => b.kind === "cta");
  const rendered = service.blocks
    .map((b, i) => renderBlock(b, `razdel-${i + 1}`, service, i))
    .filter((r): r is Rendered => r !== null);
  const toc = [...rendered.map((r) => ({ id: r.id, label: r.title })), ...(faq.length ? [{ id: "faq", label: "Вопросы и ответы" }] : [])];
  const related = relatedServices(service.path);
  const calc = calculatorHref(service);

  const schema = {
    "@type": "Service",
    "@id": `${absoluteUrl(service.path)}#service`,
    name: service.h1,
    serviceType: service.navLabel,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: ORGANIZATION_REF,
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": name === "Россия" ? "Country" : "City", name })),
    ...(group ? { category: group.label } : {}),
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[
            { label: "Услуги", href: "/services/" },
            { label: service.navLabel, href: service.path },
          ]}
          eyebrow={group?.label}
          title={service.h1}
          lead={<p>{service.lead}</p>}
          actions={
            <>
              <Button href={calc} variant="primary" size="lg" data-cta={`service_hero_${service.slug}`}>
                {service.ctaLabel}
              </Button>
              <Button href="#lead-form" variant="secondary" calm size="lg" data-cta={`service_hero_lead_${service.slug}`}>
                Обсудить задачу
              </Button>
            </>
          }
          aside={<OrderTicket service={service.navLabel} outcomes={outcomesOf(service)} />}
        />

        <div className={styles.layout}>
          <aside className={styles.side}>
            <Toc items={toc} />
          </aside>
          <div className={styles.content}>{rendered.map((r) => r.node)}</div>
        </div>

        {related.length ? (
          <section className={styles.related} aria-labelledby="related-title">
            <div className={styles.relatedInner}>
              <h2 className={styles.blockTitle} id="related-title">
                Обычно идёт в связке
              </h2>
              <ul className={styles.relatedGrid}>
                {related.map((s) => (
                  <li key={s.path}>
                    <a href={s.path} className={styles.relatedCard}>
                      <span className={styles.relatedName}>{s.navLabel}</span>
                      <span className={styles.relatedShort}>{s.short.charAt(0).toUpperCase() + s.short.slice(1)}</span>
                      <span className={styles.relatedArrow} aria-hidden="true">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <Faq items={faq} title="Вопросы и ответы" />

        <LeadForm
          formId={`service_${service.slug}`}
          title={cta?.kind === "cta" ? cta.title : "Обсудим задачу"}
          text={cta?.kind === "cta" ? cta.text : undefined}
          context={service.navLabel}
          calculatorHref={calc}
        />
      </main>
      <Footer />
    </>
  );
}
