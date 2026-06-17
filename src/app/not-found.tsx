import type { Metadata } from "next";
import { Button } from "@/shared/ui/Button";
import styles from "./error-pages.module.scss";

export const metadata: Metadata = {
  title: "Страница не найдена — Глори.Цифра",
  robots: { index: false, follow: false },
};

// Кастомная 404 (App Router: src/app/not-found.tsx)
export default function NotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Такой страницы нет</h1>
        <p className={styles.text}>
          Возможно, ссылка устарела или была введена с ошибкой. Вернитесь на главную —
          оттуда легко найти нужное.
        </p>
        <Button href="/" variant="primary" size="lg">
          На главную
        </Button>
      </div>
    </main>
  );
}
