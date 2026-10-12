"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib";
import styles from "./ServicePage.module.scss";

interface TocProps {
  items: { id: string; label: string }[];
}

// Оглавление с подсветкой текущего раздела — длинную посадочную удобно сканировать.
export function Toc({ items }: TocProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.toc} aria-label="Содержание страницы">
      <p className={styles.tocTitle}>На странице</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={cn(styles.tocLink, active === item.id && styles.tocActive)}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
