"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib";
import styles from "./ProcessTrack.module.scss";

export interface ProcessStep {
  status: string;
  title: string;
  text?: string;
}

interface ProcessTrackProps {
  steps: ProcessStep[];
  title: string;
  lead?: string;
  /** compact — главная (горизонтальная «лента статусов»), full — страница /process/. */
  variant?: "compact" | "full";
  link?: { label: string; href: string };
  headingLevel?: "h2" | "h3";
}

// Процесс как трекинг заказа: те же статусы клиент видит в личном кабинете.
// full: при прокрутке «карточка статуса» слева показывает текущий этап и прогресс.
export function ProcessTrack({ steps, title, lead, variant = "compact", link }: ProcessTrackProps) {
  const [current, setCurrent] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.idx));
        }
      },
      { rootMargin: variant === "full" ? "-45% 0px -50% 0px" : "0px", threshold: variant === "full" ? 0 : 0.6 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [variant]);

  const progress = steps.length > 1 ? current / (steps.length - 1) : 1;

  return (
    <section className={cn(styles.section, styles[variant])} aria-labelledby={`process-${variant}`}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title} id={`process-${variant}`}>
            {title}
          </h2>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>

        <div className={styles.body}>
          {variant === "full" ? (
            <aside className={styles.statusCard} aria-hidden="true">
              <span className={styles.statusKind}>Статус проекта</span>
              <span key={current} className={styles.statusValue}>
                <span className={styles.statusDot} />
                {steps[current]?.status}
              </span>
              <span className={styles.statusBar}>
                <span style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
              </span>
              <span className={styles.statusMeta}>
                Этап {current + 1} из {steps.length}
              </span>
            </aside>
          ) : null}

          <ol className={styles.track} style={{ ["--progress" as string]: progress }}>
            {steps.map((s, i) => (
              <li
                key={s.status}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-idx={i}
                className={cn(styles.step, i <= current && styles.reached, i === current && styles.current)}
              >
                <span className={styles.node} aria-hidden="true">
                  {i + 1}
                </span>
                <div className={styles.stepBody}>
                  <span className={styles.status}>{s.status}</span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  {s.text ? <p className={styles.stepText}>{s.text}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {link ? (
          <a href={link.href} className={styles.link}>
            {link.label} <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
