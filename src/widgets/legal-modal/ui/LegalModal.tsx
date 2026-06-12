"use client";

import { useEffect } from "react";
import { cn, useOverlays } from "@/shared/lib";
import {
  POLICY_EYEBROW,
  POLICY_REVISION,
  POLICY_SECTIONS,
  POLICY_TITLE,
} from "../model/policy";
import styles from "./LegalModal.module.scss";

// Модалка юридических документов — правый drawer 672px (Figma «App» 369:1340).
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
          {POLICY_SECTIONS.map((section) => (
            <section key={section.title} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className={styles.paragraph}>
                  {p}
                </p>
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
