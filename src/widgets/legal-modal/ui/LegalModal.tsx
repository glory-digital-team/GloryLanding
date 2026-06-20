"use client";

import { useEffect } from "react";
import { cn, useOverlays } from "@/shared/lib";
import {
  POLICY_EYEBROW,
  POLICY_REVISION,
  POLICY_TITLE,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  type PolicyPart,
} from "@/shared/legal/policy";
import styles from "./LegalModal.module.scss";

// Рендер одной части раздела (абзац / список / таблица) — единый формат
// с страницей /privacy.
function Part({ part }: { part: PolicyPart }) {
  if (part.type === "p") return <p className={styles.paragraph}>{part.text}</p>;
  if (part.type === "list") {
    return (
      <ul className={styles.list}>
        {part.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {part.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {part.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Модалка юридических документов — правый drawer 672px (Figma «App» 369:1340).
// Текст берётся из единого источника правды (@/shared/legal/policy), чтобы не
// расходиться с официальной редакцией на /privacy — issue #15.
export function LegalModal() {
  const { policyOpen, closePolicy } = useOverlays();

  useEffect(() => {
    if (!policyOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePolicy();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [policyOpen, closePolicy]);

  if (!policyOpen) return null;

  return (
    <div className={styles.overlay} onClick={closePolicy}>
      <aside
        className={cn(styles.drawer)}
        role="dialog"
        aria-modal="true"
        aria-label={POLICY_TITLE}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{POLICY_EYEBROW}</p>
            <h2 className={styles.title}>{POLICY_TITLE}</h2>
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label="Закрыть"
            onClick={closePolicy}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>1. Общие положения</h3>
            {PRIVACY_INTRO.map((part, i) => (
              <Part key={i} part={part} />
            ))}
          </section>

          {PRIVACY_SECTIONS.map((block) => (
            <section key={block.heading} className={styles.section}>
              <h3 className={styles.sectionTitle}>{block.heading}</h3>
              {block.parts.map((part, i) => (
                <Part key={i} part={part} />
              ))}
            </section>
          ))}

          <p className={styles.revision}>{POLICY_REVISION}</p>
        </div>

        <footer className={styles.foot}>
          <button type="button" className={styles.closeBtn} onClick={closePolicy}>
            Закрыть
          </button>
        </footer>
      </aside>
    </div>
  );
}
