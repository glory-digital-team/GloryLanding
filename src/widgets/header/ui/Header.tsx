"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import { CabinetLink, useCabinetSignedIn } from "@/features/cabinet-entry";
import styles from "./Header.module.scss";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const signedIn = useCabinetSignedIn();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Меню занимает весь экран ссылками — закрываем по Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        styles.header,
        scrolled && styles.scrolled,
        menuOpen && styles.menuOpen,
      )}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={siteConfig.name}>
          <Logo size={40} wordSize={24} />
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <CabinetLink signedIn={signedIn} className={styles.cabinet} />
          <Button variant="primary" size="md" href="#lead-form" className={styles.cta}>
            Начать проект
          </Button>
        </div>

        {/* Figma 273:5714: бургер, три полоски 20×2 #C00, radius 100.
            Анимация дизайнера — «слияние»: крайние полоски съезжаются к центру
            и поворачиваются в крестик, средняя растворяется, вся иконка
            при этом проворачивается. */}
        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.burgerBox} aria-hidden="true">
            <span className={cn(styles.burgerLine, styles.burgerLineTop)} />
            <span className={cn(styles.burgerLine, styles.burgerLineMid)} />
            <span className={cn(styles.burgerLine, styles.burgerLineBot)} />
          </span>
        </button>
      </div>

      {/* Мобильное меню (в макете нет — продолжаем стиль «таблетки») */}
      <div className={styles.mobileMenu}>
        <nav className={styles.mobileNav} aria-label="Мобильная навигация">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <CabinetLink
          signedIn={signedIn}
          className={styles.mobileCta}
          onClick={() => setMenuOpen(false)}
        />
        <Button
          variant="primary"
          size="md"
          href="#lead-form"
          className={styles.mobileCta}
          onClick={() => setMenuOpen(false)}
        >
          Начать проект
        </Button>
      </div>
    </header>
  );
}
