"use client";

import { useState } from "react";
import { track } from "@/shared/analytics";
import { cn } from "@/shared/lib";
import styles from "./Diagnostic.module.scss";

interface DiagnosticProps {
  items: string[];
  service: string;
  calculatorHref: string;
}

// Интерактивная самодиагностика: пользователь отмечает, что узнаёт в своей ситуации,
// и получает понятный следующий шаг. Все пункты — в SSR-HTML (обычный список).
export function Diagnostic({ items, service, calculatorHref }: DiagnosticProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const count = checked.size;
  const ratio = items.length ? count / items.length : 0;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      track("diagnostic_check", { service, count: next.size, total: items.length });
      return next;
    });
  };

  const verdict =
    count === 0
      ? "Отметьте, что узнаёте в своей ситуации."
      : ratio < 0.34
        ? "Похоже, точечной доработки может хватить. Обсудим, чтобы не делать лишнего."
        : ratio < 0.67
          ? "Есть смысл разобрать процесс: скорее всего, ручные операции уже стоят дороже решения."
          : "Это типичная картина перед проектом. Начнём с короткого разбора и оценки.";

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
                    <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <aside className={styles.result} aria-live="polite">
        <div className={styles.meter} aria-hidden="true">
          <span style={{ transform: `scaleX(${ratio})` }} />
        </div>
        <p className={styles.score}>
          <strong>{count}</strong> из {items.length}
        </p>
        <p className={styles.verdict}>{verdict}</p>
        <div className={styles.actions}>
          <a href={calculatorHref} className={styles.primary} data-cta="diagnostic_calc">
            Рассчитать стоимость
          </a>
          <a href="#lead-form" className={styles.secondary} data-cta="diagnostic_lead">
            Обсудить задачу
          </a>
        </div>
      </aside>
    </div>
  );
}
