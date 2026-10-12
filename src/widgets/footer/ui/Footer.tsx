/* eslint-disable @next/next/no-img-element */
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import { SERVICE_GROUPS, servicesInGroup } from "@/entities/service";
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
  const visibleSocials = socials.filter((social) => !social.hidden);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Карта услуг: сквозная перелинковка на все посадочные (ТЗ §2.2, §3.4) */}
        <nav className={styles.services} aria-label="Услуги">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.id} className={styles.serviceCol}>
              <a href={group.href} className={styles.serviceGroup}>
                {group.label}
              </a>
              <ul className={styles.serviceList}>
                {servicesInGroup(group.id).map((s) => (
                  <li key={s.path}>
                    <a href={s.path} className={styles.serviceLink}>
                      {s.navLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.top}>
          {/* Колонка бренда */}
          <div className={styles.brand}>
            <Logo invert size={40} wordSize={24} />
            <p className={styles.tagline}>{tagline}</p>
            {/* Цветные иконки соцсетей (Figma 270:595) */}
            <div className={styles.socials}>
              {visibleSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.social}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={s.src} alt={`${s.label} — социальная сеть`} width={28} height={28} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.cols}>
            {/* Навигация: на десктопе и мобиле — разные наборы пунктов (191:411 / 273:5614) */}
            <nav className={styles.col} aria-label="Навигация в футере">
              <p className={styles.colTitle}>Навигация</p>
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
              <p className={styles.colTitle}>Контакты</p>
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
              <p className={styles.colTitle}>Реквизиты</p>
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
            {/* Документы — обычные ссылки на страницы (раньше политика открывалась только модалкой) */}
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
