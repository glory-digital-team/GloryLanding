"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import { SERVICE_GROUPS, servicesInGroup } from "@/entities/service";
import { CabinetLink, useCabinetSignedIn } from "@/features/cabinet-entry";
import styles from "./Header.module.scss";

// Mega-menu «Услуги» (ТЗ §2.2): 3 направления + доп. услуги, все пункты — обычные <a>
// в SSR-HTML, чтобы поисковик видел перелинковку на каждую посадочную.
const MENU = SERVICE_GROUPS.map((g) => ({ ...g, items: servicesInGroup(g.id) }));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const signedIn = useCabinetSignedIn();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Меню и mega-menu закрываются по Escape
  useEffect(() => {
    if (!menuOpen && !megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, megaOpen]);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  // Небольшая задержка, чтобы панель не схлопывалась при движении курсора к ней
  const closeMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 160);
  };

  const [servicesItem, ...restNav] = siteConfig.nav;

  return (
    <header
      className={cn(
        styles.header,
        scrolled && styles.scrolled,
        menuOpen && styles.menuOpen,
        megaOpen && styles.megaOpen,
      )}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${siteConfig.name} — на главную`}>
          <Logo size={40} wordSize={24} />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          <div
            className={styles.megaWrap}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            onFocus={openMega}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMega();
            }}
          >
            <a href={servicesItem.href} className={styles.link}>
              {servicesItem.label}
            </a>
            <button
              type="button"
              className={styles.megaToggle}
              aria-expanded={megaOpen}
              aria-controls="mega-services"
              aria-label="Показать все услуги"
              onClick={() => setMegaOpen((v) => !v)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={styles.mega} id="mega-services">
              <div className={styles.megaGrid}>
                {MENU.map((group) => (
                  <div key={group.id} className={styles.megaCol}>
                    <a href={group.href} className={styles.megaGroup}>
                      {group.label}
                    </a>
                    <p className={styles.megaLead}>{group.lead}</p>
                    <ul className={styles.megaList}>
                      {group.items.map((s) => (
                        <li key={s.path}>
                          <a href={s.path} className={styles.megaLink}>
                            {s.navLabel}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className={styles.megaFoot}>
                <span>Не знаете, что выбрать? Опишите задачу — подскажем формат решения.</span>
                <a href={siteConfig.primaryCta.href} className={styles.megaCta} data-cta="mega-menu">
                  {siteConfig.primaryCta.label} →
                </a>
              </div>
            </div>
          </div>

          {restNav.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <CabinetLink signedIn={signedIn} iconOnly className={styles.cabinet} />
          <Button
            variant="primary"
            size="md"
            href={siteConfig.primaryCta.href}
            className={styles.cta}
            data-cta="header"
          >
            {siteConfig.primaryCta.label}
          </Button>
        </div>

        {/* Figma 273:5714: бургер, три полоски 20×2 #C00, radius 100. */}
        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.burgerBox} aria-hidden="true">
            <span className={cn(styles.burgerLine, styles.burgerLineTop)} />
            <span className={cn(styles.burgerLine, styles.burgerLineMid)} />
            <span className={cn(styles.burgerLine, styles.burgerLineBot)} />
          </span>
        </button>
      </div>

      {/* Мобильное меню: «Услуги» раскрываются аккордеоном по направлениям */}
      <div className={styles.mobileMenu} id="mobile-menu">
        <nav className={styles.mobileNav} aria-label="Мобильная навигация">
          <button
            type="button"
            className={cn(styles.mobileLink, styles.mobileToggle)}
            aria-expanded={mobileServices}
            onClick={() => setMobileServices((v) => !v)}
          >
            Услуги
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={cn(styles.mobileServices, mobileServices && styles.mobileServicesOpen)}>
            <div className={styles.mobileServicesInner}>
              <Link href="/services/" className={styles.mobileSub} onClick={() => setMenuOpen(false)}>
                Все услуги
              </Link>
              {MENU.map((group) => (
                <div key={group.id} className={styles.mobileGroup}>
                  <span className={styles.mobileGroupTitle}>{group.label}</span>
                  {group.items.map((s) => (
                    <a key={s.path} href={s.path} className={styles.mobileSub} onClick={() => setMenuOpen(false)}>
                      {s.navLabel}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {restNav.map((item) => (
            <a key={item.href} href={item.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <Link href="/contacts/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Контакты
          </Link>
        </nav>
        <CabinetLink signedIn={signedIn} className={styles.mobileCta} onClick={() => setMenuOpen(false)} />
        <Button
          variant="primary"
          size="md"
          href={siteConfig.primaryCta.href}
          className={styles.mobileCta}
          data-cta="mobile-menu"
          onClick={() => setMenuOpen(false)}
        >
          {siteConfig.primaryCta.label}
        </Button>
      </div>
    </header>
  );
}
