"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/shared/lib";
import { Logo } from "@/shared/ui/Logo";
import { useApply } from "@/features/vacancy-apply";
import styles from "./CareersHeader.module.scss";

const links = [
  { label: "Вакансии", href: "#vacancies" },
  { label: "Как попасть", href: "#path" },
  { label: "Как у нас", href: "#culture" },
  { label: "Вопросы", href: "#careers-faq" },
];

// «Таблетка»-шапка карьерного раздела + полоса прогресса чтения.
export function CareersHeader() {
  const { openApply } = useApply();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Глори.Цифра — на главную">
          <Logo size={36} wordSize={22} />
          <span className={styles.section}>Команда</span>
        </Link>
        <nav className={styles.nav} aria-label="Команда">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <button type="button" className={styles.cta} onClick={() => openApply(null)}>
          Откликнуться
        </button>
        <motion.span className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />
      </div>
    </header>
  );
}
