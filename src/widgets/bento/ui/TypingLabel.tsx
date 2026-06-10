"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Bento.module.scss";

// «Живое» печатание подписи в карточке UX/UI: при появлении в кадре текст
// стирается и перепечатывается с человеческим неровным ритмом, затем долгая
// пауза — и цикл повторяется. При prefers-reduced-motion остаётся статика.
const HOLD_MS = 4600; // пауза с готовым текстом
const PAUSE_MS = 750; // пауза перед повторным набором
const DELETE_MS = 26; // скорость стирания

export function TypingLabel({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(text.length);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    let n = text.length;
    let started = false;

    const schedule = (fn: () => void, ms: number) => {
      timer = window.setTimeout(fn, ms);
    };

    const type = () => {
      if (n < text.length) {
        n += 1;
        setCount(n);
        // Неровный «человеческий» ритм; после пробела — чуть дольше.
        const base = 55 + Math.random() * 90;
        schedule(type, text[n - 1] === " " ? base + 90 : base);
      } else {
        schedule(erase, HOLD_MS);
      }
    };

    const erase = () => {
      if (n > 0) {
        n -= 1;
        setCount(n);
        schedule(erase, DELETE_MS);
      } else {
        schedule(type, PAUSE_MS);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          setActive(true);
          schedule(erase, 900);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [text]);

  return (
    <span ref={ref} className={styles.typing}>
      {text.slice(0, count)}
      {active && <i className={styles.typingCaret} aria-hidden="true" />}
    </span>
  );
}
