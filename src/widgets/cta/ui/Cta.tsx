import { Button } from "@/shared/ui/Button";
import { CtaGraphic } from "./CtaGraphic";
import styles from "./Cta.module.scss";

// Блок «Контроль в реальном времени» (Figma «CTA Block» 155:1554).
export function Cta() {
  return (
    <section className={styles.cta}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.heading}>
            <h2 className={styles.title}>Быстрая оценка проекта</h2>
            <p className={styles.subtitle}>
              Настройте параметры в конфигураторе <br className={styles.brMobile} />—
              увидите ориентировочный бюджет <br className={styles.brMobile} />и сроки.
              Обсудим детали и зафиксируем точные условия на следующем шаге.
            </p>
          </div>
          <Button variant="secondary" className={styles.button}>
            Подробнее
          </Button>
        </div>

        <CtaGraphic className={styles.graphic} />
      </div>
    </section>
  );
}
