/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { LandingsCarousel } from "./LandingsCarousel";
import { TypingLabel } from "./TypingLabel";
import styles from "./Bento.module.scss";

// Секция «Любые цифровые задачи. В одних руках.» — bento-сетка направлений
// (Figma «Bento» 155:1580). Геометрия, цвета и позиции — 1:1 с макетом,
// декоративные слои выгружены из Figma в public/bento.
// Под сеткой — четыре направления текстом из SEO-реестра (блок «Разработка, автоматизация и AI»):
// поиск и AI-ответы получают формулировки, а не только картинки.
const DIRECTIONS = [
  {
    title: "Сайты и цифровые продукты",
    text: "Проектируем структуру до дизайна, связываем публичные страницы с SEO и аналитикой, а сложные сервисы — с реальными пользовательскими сценариями.",
    href: "/razrabotka-saitov/",
  },
  {
    title: "Автоматизация",
    text: "Описываем текущий процесс, определяем источник данных и убираем ручные операции там, где это действительно даёт эффект.",
    href: "/avtomatizaciya/",
  },
  {
    title: "AI для бизнеса",
    text: "Начинаем с измеримого сценария и пилота, а не с выбора модели.",
    href: "/ai-dlya-biznesa/",
  },
  {
    title: "Поддержка и развитие",
    text: "Принимаем существующий продукт, фиксируем риски и backlog, после чего развиваем его итерациями.",
    href: "/podderzhka/",
  },
];

export function Bento() {
  return (
    <section className={styles.bento} id="services">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Разработка, автоматизация и AI. <br className={styles.brMobile} />В одних руках.
          </h2>
        </header>

        <div className={styles.grid}>
          {/* ── Колонка 1 (262) ── */}
          <div className={styles.col}>
            {/* Дизайн — 262×400 (155:2369) */}
            <Link href="/ux-ui/" data-cta="bento" className={`${styles.card} ${styles.design} ${styles.tall}`}>
              <h3 className={styles.cardTitle}>Дизайн</h3>
              <div className={styles.designArt} aria-hidden="true">
                <span className={`${styles.artboardBox} ${styles.artboard1}`}>
                  <span />
                </span>
                <span className={`${styles.artboardBox} ${styles.artboard2}`}>
                  <span />
                </span>
                <img className={styles.designCircle} src="/bento/design-circle.svg" alt="" />
                <span className={styles.designSquare} />
                <span className={styles.designPolygonBox}>
                  <img src="/bento/design-polygon.svg" alt="" />
                </span>
              </div>
            </Link>

            {/* Поддержка — 262×262 (155:3140) */}
            <Link href="/podderzhka/" data-cta="bento" className={`${styles.card} ${styles.dark} ${styles.square}`}>
              <span className={`${styles.glow} ${styles.glowSupport1}`} aria-hidden="true">
                <img src="/bento/glow-support-1.svg" alt="" />
              </span>
              <span className={`${styles.noise} ${styles.noiseSupport}`} aria-hidden="true" />
              <span className={`${styles.glow} ${styles.glowSupportGreen}`} aria-hidden="true">
                <img src="/bento/glow-support-e53.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowSupportBlue}`} aria-hidden="true">
                <img src="/bento/glow-support-e54.svg" alt="" />
              </span>
              <h3 className={`${styles.cardTitle} ${styles.cardTitleCenter}`}>Поддержка</h3>
            </Link>
          </div>

          {/* ── Колонка 2 (453) ── */}
          <div className={styles.col}>
            {/* Лендинги — 453×188 (155:2379): карусель скриншотов по кругу */}
            <Link href="/landing-page/" data-cta="bento" className={`${styles.card} ${styles.dark} ${styles.wide}`}>
              <h3 className={styles.cardTitle}>Лендинги</h3>
              <LandingsCarousel />
            </Link>

            {/* SEO и маркетинг — 453×188 (155:3087) */}
            <Link href="/seo/" data-cta="bento" className={`${styles.card} ${styles.seo} ${styles.wide}`}>
              <span className={`${styles.noise} ${styles.noiseSeo}`} aria-hidden="true" />
              <span className={`${styles.glow} ${styles.glowSeo1}`} aria-hidden="true">
                <img src="/bento/glow-seo-1.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowSeo2}`} aria-hidden="true">
                <img src="/bento/glow-seo-2.svg" alt="" />
              </span>
              <h3 className={`${styles.cardTitle} ${styles.cardTitleCenter}`}>SEO и маркетинг</h3>
            </Link>

            {/* UX/UI — 453×262 (155:3117), светлая, без рамки */}
            <Link href="/ux-ui/" data-cta="bento" className={`${styles.card} ${styles.light} ${styles.squareWide}`}>
              <div className={styles.uxFrame} aria-hidden="true">
                <img className={styles.uxBracket} src="/bento/uxui-bracket-l.svg" alt="" />
                <span className={styles.uxLines}>
                  <img src="/bento/uxui-frame.svg" alt="" />
                </span>
                <img className={styles.uxBracket} src="/bento/uxui-bracket-r.svg" alt="" />
                <span className={styles.uxTitle}>UX/UI</span>
              </div>
              <h3 className={styles.srOnly}>UX/UI-дизайн</h3>
              <span className={styles.uxName}>
                <TypingLabel text="Проектируем каждый клик" />
              </span>
              <span className={styles.uxCursor} aria-hidden="true">
                <img src="/bento/uxui-cursor.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowUx}`} aria-hidden="true">
                <img src="/bento/glow-uxui.svg" alt="" />
              </span>
            </Link>
          </div>

          {/* ── Колонка 3 (357) ── */}
          <div className={styles.col}>
            {/* AI Решения — 357×400 (155:3096) */}
            <Link href="/ai-dlya-biznesa/" data-cta="bento" className={`${styles.card} ${styles.ai} ${styles.tall}`}>
              <span className={`${styles.glow} ${styles.glowAi1}`} aria-hidden="true">
                <img src="/bento/glow-ai-1.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowAi2}`} aria-hidden="true">
                <img src="/bento/glow-ai-2.svg" alt="" />
              </span>
              <span className={`${styles.noise} ${styles.noiseAi}`} aria-hidden="true" />
              <h3 className={styles.aiTitle}>
                <span>AI</span>
                <span>Решения</span>
              </h3>
            </Link>

            {/* Создание сайта — 357×262 (155:3108) */}
            <Link href="/razrabotka-saitov/" data-cta="bento" className={`${styles.card} ${styles.dark} ${styles.squareWide}`}>
              <h3 className={styles.cardTitle}>Создание сайта</h3>
              <span className={`${styles.glow} ${styles.glowWebsites}`} aria-hidden="true">
                <img src="/bento/glow-websites.svg" alt="" />
              </span>
              {/* Код — декоративная картинка, а не текст в HTML (ТЗ §3: код не должен попадать в индекс) */}
              <img className={styles.code} src="/bento/code.svg" alt="" width={300} height={212} loading="lazy" />
              <span className={styles.codeShadow} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ul className={styles.directions}>
          {DIRECTIONS.map((d) => (
            <li key={d.href} className={styles.direction}>
              <a href={d.href} className={styles.directionLink}>
                <span className={styles.directionTitle}>{d.title}</span>
                <span className={styles.directionText}>{d.text}</span>
                <span className={styles.directionMore} aria-hidden="true">
                  Подробнее →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.allServices}>
          <Link href="/services/">Все услуги</Link>
        </p>
      </div>
    </section>
  );
}
