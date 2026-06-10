import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import styles from "./Hero.module.scss";

// Первый экран лендинга «Глори.Цифра» (Figma: First Screen 155:1480).
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Кубы справа (Figma 155:1482; фрейм отзеркален — см. Hero.module.scss) */}
        <div className={styles.illustration} aria-hidden="true">
          <span className={`${styles.cubeBox} ${styles.cubeBox1}`}>
            <span className={`${styles.cube} ${styles.cube1}`} />
          </span>
          <span className={`${styles.cubeBox} ${styles.cubeBox2}`}>
            <span className={`${styles.cube} ${styles.cube2}`} />
          </span>
          <span className={`${styles.cubeBox} ${styles.cubeBox3}`}>
            <span className={`${styles.cube} ${styles.cube3}`} />
          </span>
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
            <Button variant="primary">Начать проект</Button>
            <Button variant="secondary">Подробнее</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
