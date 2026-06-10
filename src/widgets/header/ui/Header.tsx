"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import styles from "./Header.module.scss";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        <Button variant="primary" size="md" href="#lead-form" className={styles.cta}>
          Начать проект
        </Button>

        {/* Figma 273:5714: бургер, три полоски 20×2 #C00, radius 100.
            Морфинг в крестик: видимый отрезок каждой линии (stroke-dash)
            скользит по пути «прямая → дуга → диагональ», линия буквально
            перетекает в крестик. Геометрия путей — в Header.module.scss. */}
        <button
          type="button"
          className={styles.burger}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path
              className={styles.burgerLine}
              d="M 20,29 H 80 C 80,29 94.5,28.8 94.5,66.7 C 94.5,78 91,81.7 85.3,81.7 C 79.6,81.7 75,75 75,75 L 25,25"
            />
            <path className={cn(styles.burgerLine, styles.burgerLineMid)} d="M 20,50 H 80" />
            <path
              className={styles.burgerLine}
              d="M 20,71 H 80 C 80,71 94.5,71.2 94.5,33.3 C 94.5,22 91,18.3 85.3,18.3 C 79.6,18.3 75,25 75,25 L 25,75"
            />
          </svg>
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
