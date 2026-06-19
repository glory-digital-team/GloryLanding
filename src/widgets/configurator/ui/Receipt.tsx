"use client";

import { useState } from "react";
import { cn } from "@/shared/lib";
import { formatPrice, type Urgency } from "../model/config";
import styles from "./Configurator.module.scss";

interface ReceiptProps {
  moduleCount: number;
  urgency: Urgency | null;
  total: number | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  priceAvailable: boolean;
  pending?: boolean;
  error?: string;
  /** Мобильный режим: чек сворачивается до строки с итогом (Figma 337:5202/369:762). */
  collapsible?: boolean;
}

// Чек «Ваш проект» (Figma «Receipt» 337:422).
export function Receipt({
  moduleCount,
  urgency,
  total,
  minAmount,
  maxAmount,
  priceAvailable,
  pending,
  error,
  collapsible,
}: ReceiptProps) {
  const [open, setOpen] = useState(false);

  const rows = (
    <div className={styles.receiptRows}>
      <div className={styles.receiptRow}>
        <span>Модули:</span>
        <b>{moduleCount > 0 ? moduleCount : "-"}</b>
      </div>
      <div className={styles.receiptRow}>
        <span>Срочность:</span>
        {urgency ? (
          <span className={cn(styles.urgencyBadge, styles[`tone-${urgency.tone}`])}>
            {urgency.label}
          </span>
        ) : (
          <b>-</b>
        )}
      </div>
    </div>
  );

  const estimateText =
    minAmount && maxAmount
      ? `от ${formatPrice(minAmount)} до ${formatPrice(maxAmount)}`
      : total !== null
        ? `от ${formatPrice(total)}`
        : "Выберите услугу";

  const finalPrice = (
    <div className={styles.receiptFinal}>
      <span className={styles.receiptFinalLabel}>Предварительно:</span>
      <span className={styles.receiptFinalValue}>
        {pending
          ? "Уточняем..."
          : error
            ? "Расчёт временно недоступен"
            : priceAvailable
              ? estimateText
              : "Выберите услугу"}
      </span>
    </div>
  );

  if (collapsible) {
    return (
      <aside className={cn(styles.receipt, styles.receiptMobile)}>
        <button
          type="button"
          className={styles.receiptToggle}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {finalPrice}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={cn(styles.receiptChevron, open && styles.receiptChevronOpen)}
            aria-hidden="true"
          >
            <path
              d="m6 9 6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <div className={styles.receiptDetails}>
            <hr className={styles.receiptLine} />
            <h3 className={styles.receiptTitle}>Ваш проект</h3>
            {rows}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className={styles.receipt} aria-label="Ваш проект — предварительный расчёт">
      <div>
        <h3 className={styles.receiptTitle}>Ваш проект</h3>
        {rows}
      </div>
      <hr className={styles.receiptLine} />
      {finalPrice}
    </aside>
  );
}
