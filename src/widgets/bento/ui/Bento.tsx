/* eslint-disable @next/next/no-img-element */
import { LandingsCarousel } from "./LandingsCarousel";
import { TypingLabel } from "./TypingLabel";
import styles from "./Bento.module.scss";

// Секция «Любые цифровые задачи. В одних руках.» — bento-сетка направлений
// (Figma «Bento» 155:1580). Геометрия, цвета и позиции — 1:1 с макетом,
// декоративные слои выгружены из Figma в public/bento.
export function Bento() {
  return (
    <section className={styles.bento} id="services">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            Любые цифровые задачи. <br className={styles.brMobile} />В одних руках.
          </h2>
        </header>

        <div className={styles.grid}>
          {/* ── Колонка 1 (262) ── */}
          <div className={styles.col}>
            {/* Дизайн — 262×400 (155:2369) */}
            <article className={`${styles.card} ${styles.design} ${styles.tall}`}>
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
            </article>

            {/* Поддержка — 262×262 (155:3140) */}
            <article className={`${styles.card} ${styles.dark} ${styles.square}`}>
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
            </article>
          </div>

          {/* ── Колонка 2 (453) ── */}
          <div className={styles.col}>
            {/* Лендинги — 453×188 (155:2379): карусель скриншотов по кругу */}
            <article className={`${styles.card} ${styles.dark} ${styles.wide}`}>
              <h3 className={styles.cardTitle}>Лендинги</h3>
              <LandingsCarousel />
            </article>

            {/* SEO и маркетинг — 453×188 (155:3087) */}
            <article className={`${styles.card} ${styles.seo} ${styles.wide}`}>
              <span className={`${styles.noise} ${styles.noiseSeo}`} aria-hidden="true" />
              <span className={`${styles.glow} ${styles.glowSeo1}`} aria-hidden="true">
                <img src="/bento/glow-seo-1.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowSeo2}`} aria-hidden="true">
                <img src="/bento/glow-seo-2.svg" alt="" />
              </span>
              <h3 className={`${styles.cardTitle} ${styles.cardTitleCenter}`}>SEO и маркетинг</h3>
            </article>

            {/* UX/UI — 453×262 (155:3117), светлая, без рамки */}
            <article className={`${styles.card} ${styles.light} ${styles.squareWide}`}>
              <div className={styles.uxFrame} aria-hidden="true">
                <img className={styles.uxBracket} src="/bento/uxui-bracket-l.svg" alt="" />
                <span className={styles.uxLines}>
                  <img src="/bento/uxui-frame.svg" alt="" />
                </span>
                <img className={styles.uxBracket} src="/bento/uxui-bracket-r.svg" alt="" />
                <span className={styles.uxTitle}>UX/UI</span>
              </div>
              <span className={styles.uxName}>
                <TypingLabel text="Проектируем каждый клик" />
              </span>
              <span className={styles.uxCursor} aria-hidden="true">
                <img src="/bento/uxui-cursor.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowUx}`} aria-hidden="true">
                <img src="/bento/glow-uxui.svg" alt="" />
              </span>
            </article>
          </div>

          {/* ── Колонка 3 (357) ── */}
          <div className={styles.col}>
            {/* AI Решения — 357×400 (155:3096) */}
            <article className={`${styles.card} ${styles.ai} ${styles.tall}`}>
              <span className={`${styles.glow} ${styles.glowAi1}`} aria-hidden="true">
                <img src="/bento/glow-ai-1.svg" alt="" />
              </span>
              <span className={`${styles.glow} ${styles.glowAi2}`} aria-hidden="true">
                <img src="/bento/glow-ai-2.svg" alt="" />
              </span>
              <span className={`${styles.noise} ${styles.noiseAi}`} aria-hidden="true" />
              <div className={styles.aiTitle}>
                <span>AI</span>
                <span>Решения</span>
              </div>
            </article>

            {/* Создание сайта — 357×262 (155:3108) */}
            <article className={`${styles.card} ${styles.dark} ${styles.squareWide}`}>
              <h3 className={styles.cardTitle}>Создание сайта</h3>
              <span className={`${styles.glow} ${styles.glowWebsites}`} aria-hidden="true">
                <img src="/bento/glow-websites.svg" alt="" />
              </span>
              <p className={styles.code} aria-hidden="true">
                {"// SPDX-License-Identifier"}
                <i>:</i>
                {" MIT\npragma solidity ^0.8.0;\n\nimport "}
                <i>{'".'}</i>
                {"/IERC20."}
                <em>sol</em>
                <i>{'";'}</i>
                {"\n\ncontract MyToken "}
                <u>is</u>
                {" IERC20 "}
                <b>{"{"}</b>
                {"\n    string public name "}
                <b>=</b> <i>{'"MyToken"'}</i>
                <b>;</b>
                {"\n    string public symbol "}
                <b>=</b> <i>{'"MT"'}</i>
                <b>;</b>
                {"\n    uint256 public override totalSupply"}
                <i>;</i>
                {"\n    mapping("}
                <u>address</u> <b>{"=>"}</b> <em>uint256</em>
                {") public override balanceOf;\n    mapping("}
                <u>address</u> <b>{"=>"}</b> <em>mapping</em>
                <b>(</b>
                {"address "}
                <b>{"=> "}</b>
                {"uint256"}
                <b>{"))"}</b>
                {" public override allowance;"}
              </p>
              <span className={styles.codeShadow} aria-hidden="true" />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
