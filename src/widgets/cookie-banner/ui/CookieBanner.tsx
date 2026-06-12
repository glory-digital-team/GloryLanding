"use client";

import { useEffect, useState } from "react";
import { useOverlays } from "@/shared/lib";
import styles from "./CookieBanner.module.scss";

const STORAGE_KEY = "glory-cookie-consent";

// Баннер согласия на cookie (Figma «CookieBanner» 369:644).
export function CookieBanner() {
  const { openPolicy } = useOverlays();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Показываем с небольшой задержкой и только если решение ещё не принято
    const timer = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <div className={styles.banner} role="region" aria-label="Использование cookie">
      <span className={styles.iconBox} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            d="M21.9 12.6a1 1 0 0 0-1-.8 3.4 3.4 0 0 1-3.3-2.6 1 1 0 0 0-.8-.7A3.4 3.4 0 0 1 14 5.6a1 1 0 0 0-.9-1.1A9 9 0 1 0 22 13.5a1 1 0 0 0-.1-.9ZM12 20a8 8 0 0 1-.6-16 5.4 5.4 0 0 0 3.8 4.4 5.4 5.4 0 0 0 4.7 4.1A8 8 0 0 1 12 20Z"
            fill="currentColor"
          />
          <circle cx="9" cy="9" r="1.2" fill="currentColor" />
          <circle cx="9" cy="14.5" r="1.2" fill="currentColor" />
          <circle cx="13.5" cy="13" r="1.2" fill="currentColor" />
        </svg>
      </span>

      <div className={styles.content}>
        <p className={styles.text}>
          Мы используем файлы cookie для аналитики и улучшения сервиса.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.accept} onClick={accept}>
            Принять
          </button>
          <button type="button" className={styles.more} onClick={openPolicy}>
            Подробнее
          </button>
        </div>
      </div>

      <button
        type="button"
        className={styles.close}
        aria-label="Закрыть"
        onClick={() => setVisible(false)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="m6 6 12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
