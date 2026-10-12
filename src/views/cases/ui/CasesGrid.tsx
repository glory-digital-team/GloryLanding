"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/lib";
import { CaseCard, type CaseStudy } from "@/entities/case";
import { SERVICE_GROUPS, getService } from "@/entities/service";
import styles from "./CasesHubPage.module.scss";

// Фильтр по направлению — UX-инструмент без отдельных URL (ТЗ: query фильтров не индексируются).
export function CasesGrid({ items }: { items: CaseStudy[] }) {
  const [group, setGroup] = useState<string>("all");
  const groups = useMemo(
    () =>
      SERVICE_GROUPS.filter((g) =>
        items.some((c) => c.services.some((p) => getService(p)?.group === g.id)),
      ),
    [items],
  );
  const visible = group === "all" ? items : items.filter((c) => c.services.some((p) => getService(p)?.group === group));

  return (
    <div className={styles.gridWrap}>
      <div className={styles.filters} role="group" aria-label="Фильтр по направлению">
        <button type="button" className={cn(styles.filter, group === "all" && styles.filterOn)} aria-pressed={group === "all"} onClick={() => setGroup("all")}>
          Все <span>{items.length}</span>
        </button>
        {groups.map((g) => {
          const n = items.filter((c) => c.services.some((p) => getService(p)?.group === g.id)).length;
          return (
            <button key={g.id} type="button" className={cn(styles.filter, group === g.id && styles.filterOn)} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.label} <span>{n}</span>
            </button>
          );
        })}
      </div>
      <ul className={styles.grid}>
        {items.map((c) => (
          <li key={c.slug} className={cn(styles.gridItem, !visible.includes(c) && styles.hidden)}>
            <CaseCard item={c} headingLevel="h3" />
          </li>
        ))}
      </ul>
    </div>
  );
}
