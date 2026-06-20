/* eslint-disable @next/next/no-img-element */
import styles from "./Portfolio.module.scss";

// Секция «Наши проекты» (Figma «Portfolio» 184:967) — 4 карточки 548×548,
// геометрия и слои 1:1 с макетом.
export function Portfolio() {
  return (
    <section className={styles.portfolio} id="portfolio">
      <div className={styles.inner}>
        <h2 className={styles.title}>Наши проекты</h2>

        <div className={styles.grid}>
          {/* ИИ Говори — 202:306, синяя */}
          <a
            className={`${styles.card} ${styles.cardBlue}`}
            href="https://ии-говори.рф/"
            target="_blank"
            rel="noreferrer"
            aria-label="Открыть проект ИИ Говори"
          >
            <span className={styles.imageGovori} aria-hidden="true">
              <img src="/portfolio/ii-govori.png" alt="ИИ Говори" />
            </span>
            <div className={styles.tags}>
              <span className={styles.tag}>Дизайн</span>
              <span className={styles.tag}>Разработка</span>
              <span className={styles.tag}>AI-решения</span>
            </div>
            <div className={styles.text}>
              <h3 className={styles.cardTitle}>ИИ Говори</h3>
              <p className={styles.cardSubtitle}>Диалоговый AI-тренажер</p>
            </div>
          </a>

          {/* ESIS — 180:888, светло-голубая */}
          <a
            className={`${styles.card} ${styles.cardLight}`}
            href="https://esls.ru/"
            target="_blank"
            rel="noreferrer"
            aria-label="Открыть проект ESIS"
          >
            <img className={styles.imageEsis} src="/portfolio/esis.png" alt="ESIS" />
            <div className={styles.tags}>
              <span className={styles.tag}>Дизайн</span>
              <span className={styles.tag}>Разработка</span>
              <span className={styles.tag}>AI-решения</span>
            </div>
            <div className={`${styles.text} ${styles.textBlur}`}>
              <h3 className={styles.cardTitle}>ESIS</h3>
              <p className={styles.cardSubtitle}>Электронные ценники</p>
            </div>
          </a>

          {/* Tienda de Gaucho — 180:911, зелёная */}
          <article className={`${styles.card} ${styles.cardGreen}`}>
            <img
              className={styles.imageTienda}
              src="/portfolio/tienda-logo.svg"
              alt="Tienda de Gaucho"
            />
            <div className={styles.tags}>
              <span className={styles.tag}>Дизайн</span>
              <span className={styles.tag}>Разработка</span>
              <span className={styles.tag}>AI-решения</span>
            </div>
            <div className={`${styles.text} ${styles.textBlur}`}>
              <h3 className={styles.cardTitle}>Tienda de Gaucho</h3>
              <p className={styles.cardSubtitle}>Доставка продуктов в Аргентине</p>
            </div>
          </article>

          {/* Lunes — 180:902, тёмная с луной */}
          <article className={`${styles.card} ${styles.cardDark}`}>
            <span className={styles.lunesTexture} aria-hidden="true" />
            <img
              className={styles.lunesScript}
              src="/portfolio/lunes-script.png"
              alt="Beauty by Moonlight"
            />
            <img
              className={styles.lunesMoon}
              src="/portfolio/lunes-moon.png"
              alt=""
              aria-hidden="true"
            />
            <div className={styles.tags}>
              <span className={styles.tag}>Дизайн</span>
              <span className={styles.tag}>SEO Оптимизация</span>
            </div>
            <div className={styles.text}>
              <h3 className={styles.cardTitle}>Lunes</h3>
              <p className={styles.cardSubtitle}>Салон красоты</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
