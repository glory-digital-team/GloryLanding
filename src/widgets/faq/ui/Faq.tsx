"use client";

import { useState } from "react";
import { cn } from "@/shared/lib";
import { faqSchema } from "@/shared/lib/seo";
import { Icon } from "@/shared/ui/Icon";
import { JsonLd } from "@/shared/components/JsonLd";
import styles from "./Faq.module.scss";

// Секция «Ответы на частые вопросы» (Figma «FAQ container» 191:326).
// Переиспользуется на главной, страницах услуг, процесса и калькулятора.
// FAQPage-разметка строится из тех же вопросов, что видны на странице (ТЗ §5:
// разметка только для видимого контента).
export interface FaqEntry {
  q: string;
  a: string;
  /** Ссылка-CTA под ответом — ловит доп. конверсию. */
  cta?: { label: string; href: string };
}

interface FaqProps {
  items: FaqEntry[];
  title?: string;
  subtitle?: string;
  id?: string;
  /** Разметку FAQPage можно выключить, если на странице уже есть другой FAQ. */
  schema?: boolean;
}

export function Faq({
  items,
  title = "Ответы на частые вопросы",
  subtitle,
  id = "faq",
  schema = true,
}: FaqProps) {
  // По умолчанию раскрыт первый вопрос — сразу показываем ответ и CTA.
  const [open, setOpen] = useState(0);
  if (items.length === 0) return null;

  return (
    <section className={styles.faq} id={id} aria-labelledby={`${id}-title`}>
      {schema ? <JsonLd data={faqSchema(items)} /> : null}
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title} id={`${id}-title`}>
            {title}
          </h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>

        <div className={styles.list}>
          {items.map((item, i) => {
            const isOpen = open === i;
            const answerId = `${id}-a-${i}`;
            return (
              <div key={item.q} className={cn(styles.item, isOpen && styles.itemOpen)}>
                <h3 className={styles.qHeading}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className={styles.icon}>
                      <Icon name="chevron-down" size={24} />
                    </span>
                  </button>
                </h3>
                {/* Ответ всегда в DOM (SSR): закрытый скрыт визуально, но доступен поиску. */}
                <div className={styles.answerWrap} id={answerId}>
                  <div className={styles.answer}>
                    <p>
                      {item.a}
                      {item.cta ? (
                        <>
                          {" "}
                          <a href={item.cta.href} className={styles.cta} data-cta="faq">
                            {item.cta.label}
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
