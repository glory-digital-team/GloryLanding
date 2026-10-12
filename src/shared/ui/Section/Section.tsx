import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Section.module.scss";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  tone?: "white" | "soft" | "dark";
  children?: ReactNode;
  className?: string;
}

// Базовая секция внутренних страниц: контейнер 1120, заголовок H2, лид и контент.
export function Section({ id, eyebrow, title, lead, tone = "white", children, className }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={cn(styles.section, styles[tone], className)} aria-labelledby={title ? headingId : undefined}>
      <div className={styles.inner}>
        {title || eyebrow || lead ? (
          <header className={styles.head}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            {title ? (
              <h2 className={styles.title} id={headingId}>
                {title}
              </h2>
            ) : null}
            {lead ? <div className={styles.lead}>{lead}</div> : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}
