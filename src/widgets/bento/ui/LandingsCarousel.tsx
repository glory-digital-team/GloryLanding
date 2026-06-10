"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import styles from "./Bento.module.scss";

// Карусель окон-скриншотов в карточке «Лендинги» (Figma Illustration 155:2382).
// Полные рендеры окон выгружены из макета в 2x (public/bento/landing-*.png);
// натуральные размеры — 1x-размеры нод Figma.
const WINDOWS = [
  { src: "/bento/landing-notion.png", w: 211.9, h: 213.1 },
  { src: "/bento/landing-framer.png", w: 256.9, h: 167 },
  { src: "/bento/landing-reflect.png", w: 244.5, h: 155.4 },
  { src: "/bento/landing-dribbble.png", w: 179.7, h: 82.2 },
];

// Слоты A/B/C — точные позиции окон из макета (передний-левый, средний,
// задний-правый); D — «за нижним краем» карточки: туда плавно уходит
// передний скриншот и оттуда же всплывает следующий — круговая смена.
const SLOTS = [
  { x: 0, y: 34.6, w: 211.9, z: 4 },
  { x: 84.1, y: 22.8, w: 256.9, z: 3 },
  { x: 279.4, y: 12.1, w: 244.5, z: 2 },
  { x: 150, y: 270, w: 230, z: 1 },
];

const CYCLE_MS = 3600;

export function LandingsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setInterval(() => setStep((s) => s + 1), CYCLE_MS);
        } else {
          window.clearInterval(timer);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={styles.landingsArt} aria-hidden="true">
      {WINDOWS.map((win, i) => {
        const slot = SLOTS[(((i - step) % SLOTS.length) + SLOTS.length) % SLOTS.length];
        return (
          <img
            key={win.src}
            src={win.src}
            alt=""
            width={win.w}
            height={win.h}
            className={styles.landingsWindow}
            style={{
              zIndex: slot.z,
              transform: `translate(${slot.x}px, ${slot.y}px) scale(${(slot.w / win.w).toFixed(4)})`,
            }}
          />
        );
      })}
    </div>
  );
}
