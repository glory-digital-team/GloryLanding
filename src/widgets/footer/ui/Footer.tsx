import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import { SOCIAL_PATHS } from "./socialPaths";
import styles from "./Footer.module.scss";

// Футер лендинга «Глори.Цифра» (Figma: 191:468).
export function Footer() {
  const {
    tagline,
    socials,
    footerNav,
    contacts,
    messengers,
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
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={SOCIAL_PATHS[s.icon]} fill="currentColor" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.cols}>
            {/* Навигация */}
            <nav className={styles.col} aria-label="Навигация в футере">
              <h3 className={styles.colTitle}>Навигация</h3>
              <ul className={styles.list}>
                {footerNav.map((item) => (
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
                  <a href={contacts.emailHref} className={styles.link}>
                    {contacts.email}
                  </a>
                </li>
                {/* Моб. макет 273:5623: третий пункт — красный «Начать проект» */}
                <li className={styles.mobileOnly}>
                  <a href="#lead-form" className={`${styles.link} ${styles.ctaLink}`}>
                    Начать проект
                  </a>
                </li>
              </ul>
              <div className={styles.messengers}>
                {messengers.map((m) => (
                  <span key={m} className={styles.messenger}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Реквизиты */}
            <div className={styles.col}>
              <h3 className={`${styles.colTitle} ${styles.colTitleSm}`}>
                Реквизиты
              </h3>
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
            {legal.map((l) => (
              <a key={l.label} href={l.href} className={styles.legalLink}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
