"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";
import styles from "./error-pages.module.scss";

// Кастомная страница ошибки выполнения (App Router error boundary ≈ 500).
// Сохраняет корневой layout, поэтому шрифты и провайдеры остаются на месте.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.code}>500</p>
        <h1 className={styles.title}>Что-то пошло не так</h1>
        <p className={styles.text}>
          На сервере произошла ошибка. Мы уже разбираемся — попробуйте обновить страницу
          или вернуться позже.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" onClick={() => reset()}>
            Попробовать снова
          </Button>
          <Button href="/" variant="secondary" size="lg" calm>
            На главную
          </Button>
        </div>
      </div>
    </main>
  );
}
