"use client";

import { useState } from "react";
import { track } from "@/shared/analytics";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import styles from "./SituationCheck.module.scss";

interface SituationCheckProps {
  items: string[];
}

// «Узнаёте себя?»: пользователь отмечает знакомые ситуации и переходит к форме.
// Идея — из самодиагностики на страницах услуг, но без расчёта стоимости.
// Все пункты есть в SSR-HTML обычным списком.
export function SituationCheck({ items }: SituationCheckProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const count = checked.size;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      track("diagnostic_check", { service: "diagnostic", count: next.size, total: items.length });
      return next;
    });
  };

  const verdict =
    count === 0
      ? "Отметьте ситуации, которые узнаёте у себя."
      : count === 1
        ? "Одной такой ситуации достаточно, чтобы её разобрать. На диагностике посмотрим, сколько времени она забирает и что с ней можно сделать."
        : "Похоже, ручной работы накопилось немало. На диагностике разберём, с чего начать, чтобы эффект был заметен быстрее.";

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {items.map((item, i) => {
          const on = checked.has(i);
          return (
            <li key={item}>
              <button
                type="button"
                className={cn(styles.item, on && styles.itemOn)}
                aria-pressed={on}
                onClick={() => toggle(i)}
              >
                <span className={styles.box} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      d="m5 12.5 4.5 4.5L19 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <aside className={styles.result}>
        <p className={styles.verdict} aria-live="polite">
          {verdict}
        </p>
        <Button
          href="#lead-form"
          variant="primary"
          className={styles.cta}
          data-cta="diagnostic_situations"
        >
          Записаться на диагностику
        </Button>
      </aside>
    </div>
  );
}
