import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import styles from "./Hero.module.scss";

// Первый экран лендинга «Глори.Цифра» (Figma: First Screen 155:1480).
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* 3D-иконки из приложения (issue #21): Design, AI и Develop вместо красных кубов. */}
        <div className={styles.illustration} aria-hidden="true">
          <span className={`${styles.heroAsset} ${styles.heroAssetDesign}`} />
          <span className={`${styles.heroAsset} ${styles.heroAssetAi}`} />
          <span className={`${styles.heroAsset} ${styles.heroAssetDevelop}`} />
        </div>

        {/* Текстовый блок слева (Figma 155:1486, визуально x 160, w 757) */}
        <div className={styles.content}>
          <Badge>Digital-студия для бизнеса</Badge>

          <div className={styles.text}>
            <h1 className={styles.title}>
              Превращаем бизнес-задачи <br className={styles.titleBreak} />
              <span className={styles.accent}>
                в работающие <br className={styles.titleBreakMobile} />
                IT-решения
              </span>
            </h1>

            <p className={styles.description}>
              Сайты, автоматизация процессов и AI-решения для бизнеса. Проведем
              бесплатный аудит, чтобы найти точки роста. Каждый этап в личном кабинете,
              как статус заказа.
            </p>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" href="#lead-form">
              Начать проект
            </Button>
            <Button variant="secondary" calm href="#services">
              Подробнее
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
