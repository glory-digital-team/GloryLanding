"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import styles from "./StackMarquee.module.scss";

const rows = [
  ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Kubernetes", "SCSS"],
  ["Figma", "Motion", "Python", "LLM", "RAG", "Spline", "Notion", "Telegram API"],
];

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// Бегущая строка стека: скорость и направление зависят от скорости скролла.
function Row({ items, base }: { items: string[]; base: number }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    x.set(wrap(-50, 0, x.get() + move));
  });
  const tx = useTransform(x, (v) => `${v}%`);

  return (
    <div className={styles.row}>
      <motion.div className={styles.track} style={{ x: tx }}>
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className={styles.item}>
            {t}
            <svg viewBox="0 0 24 24" width="0.5em" height="0.5em" aria-hidden="true">
              <path
                d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"
                fill="currentColor"
              />
            </svg>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function StackMarquee() {
  return (
    <section className={styles.section} aria-label="Технологии, с которыми мы работаем">
      <Row items={rows[0]} base={-2} />
      <Row items={rows[1]} base={2} />
    </section>
  );
}
