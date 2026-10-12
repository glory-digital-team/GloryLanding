import { JsonLd } from "@/shared/components/JsonLd";
import { breadcrumbSchema, type Crumb } from "@/shared/lib/seo";
import { cn } from "@/shared/lib";
import styles from "./Breadcrumbs.module.scss";

interface BreadcrumbsProps {
  /** Цепочка без «Главной» — она добавляется автоматически. Последний пункт — текущая страница. */
  items: Crumb[];
  className?: string;
  tone?: "light" | "dark";
}

// Хлебные крошки + BreadcrumbList (ТЗ §3.4): одна и та же цепочка в HTML и в разметке.
export function Breadcrumbs({ items, className, tone = "light" }: BreadcrumbsProps) {
  const chain: Crumb[] = [{ label: "Главная", href: "/" }, ...items];
  return (
    <nav aria-label="Хлебные крошки" className={cn(styles.crumbs, tone === "dark" && styles.dark, className)}>
      <JsonLd data={breadcrumbSchema(chain)} />
      <ol className={styles.list}>
        {chain.map((c, i) => {
          const last = i === chain.length - 1;
          return (
            <li key={c.href} className={styles.item}>
              {last ? (
                <span aria-current="page" className={styles.current}>
                  {c.label}
                </span>
              ) : (
                <a href={c.href} className={styles.link}>
                  {c.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
