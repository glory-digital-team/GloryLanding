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
            <h2 className={styles.title}>Получите ориентир по сроку и бюджету</h2>
            <p className={styles.subtitle}>
              Выберите тип проекта и функции —
              калькулятор покажет ориентировочный бюджет ещё до
              разговора. Контакты — только после результата.
            </p>
          </div>
          {/* Ведёт на отдельную страницу калькулятора (раньше — модалка) */}
          <Button variant="secondary" className={styles.button} href="/raschet-stoimosti/" data-cta="cta_block_calc">
            Рассчитать стоимость
          </Button>
        </div>

        <CtaGraphic className={styles.graphic} />
      </div>
    </section>
  );
}
