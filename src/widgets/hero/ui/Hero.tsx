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
            {/* H1 под главный коммерческий intent (ТЗ §7.1); прежний слоган — подзаголовок */}
            <h1 className={styles.title}>
              Сайты, автоматизация <br className={styles.titleBreak} />
              <span className={styles.accent}>
                и AI-решения <br className={styles.titleBreakMobile} />
                для бизнеса
              </span>
            </h1>

            <p className={styles.description}>
              <strong className={styles.slogan}>Превращаем бизнес-задачи в работающие IT-решения.</strong>{" "}
              Сначала разбираем процесс, пользователей и данные, затем предлагаем достаточный формат —
              от посадочной страницы до внутренней системы или AI-пилота. Каждый этап — в личном
              кабинете, как статус заказа.
            </p>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" href="/raschet-stoimosti/" data-cta="hero_calc">
              Рассчитать проект
            </Button>
            <Button variant="secondary" calm href="#lead-form" data-cta="hero_lead">
              Обсудить задачу
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
