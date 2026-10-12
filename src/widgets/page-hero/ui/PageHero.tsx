import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import type { Crumb } from "@/shared/lib/seo";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import styles from "./PageHero.module.scss";

interface PageHeroProps {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  /** Визуальная колонка справа (тикет заказа, схема и т. п.). */
  aside?: ReactNode;
  /** Нижний слот под текстом — факты, теги. */
  footer?: ReactNode;
  className?: string;
}

// Первый экран внутренних страниц: крошки → eyebrow → H1 → лид → CTA, справа — визуал.
// Весь текст серверный: H1 и лид видны в исходном HTML (ТЗ §3.1).
export function PageHero({ crumbs, eyebrow, title, lead, actions, aside, footer, className }: PageHeroProps) {
  return (
    <section className={cn(styles.hero, aside ? styles.withAside : undefined, className)}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.content}>
          <Breadcrumbs items={crumbs} className={styles.crumbs} />
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 className={styles.title}>{title}</h1>
          {lead ? <div className={styles.lead}>{lead}</div> : null}
          {actions ? <div className={styles.actions}>{actions}</div> : null}
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </div>
    </section>
  );
}
