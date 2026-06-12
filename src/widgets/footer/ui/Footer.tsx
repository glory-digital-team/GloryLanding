/* eslint-disable @next/next/no-img-element */
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import { PolicyLink } from "@/widgets/legal-modal";
import styles from "./Footer.module.scss";

// Футер лендинга «Глори.Цифра» (Figma: 191:468, моб. 273:5594).
export function Footer() {
  const {
    tagline,
    socials,
    footerNav,
    footerNavMobile,
    contacts,
    requisites,
    legal,
    copyright,
  } = siteConfig;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Колонка бренда */}
          <div className={styles.brand}>
            <Logo invert size={40} wordSize={24} />
            <p className={styles.tagline}>{tagline}</p>
            {/* Цветные иконки соцсетей (Figma 270:595) */}
            <div className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.social}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={s.src} alt="" width={28} height={28} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.cols}>
            {/* Навигация: на десктопе и мобиле — разные наборы пунктов (191:411 / 273:5614) */}
            <nav className={styles.col} aria-label="Навигация в футере">
              <h3 className={styles.colTitle}>Навигация</h3>
              <ul className={`${styles.list} ${styles.desktopOnly}`}>
                {footerNav.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className={`${styles.list} ${styles.mobileOnly}`}>
                {footerNavMobile.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Контакты */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>Контакты</h3>
              <ul className={styles.list}>
                <li>
                  <a href={contacts.phoneHref} className={styles.link}>
                    {contacts.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={contacts.emailHref}
                    className={`${styles.link} ${styles.linkUnderline}`}
                  >
                    {contacts.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Реквизиты */}
            <div className={styles.col}>
              <h3 className={styles.colTitle}>Реквизиты</h3>
              <ul className={`${styles.list} ${styles.listTight}`}>
                {requisites.map((r) => (
                  <li key={r} className={styles.requisite}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>{copyright}</span>
          <div className={styles.legal}>
            {legal.map((l) =>
              l.doc === "policy" ? (
                <PolicyLink key={l.label} className={styles.legalLink}>
                  {l.label}
                </PolicyLink>
              ) : (
                <a key={l.label} href={l.href} className={styles.legalLink}>
                  {l.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
