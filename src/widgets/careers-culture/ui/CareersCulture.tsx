"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib";
import styles from "./CareersCulture.module.scss";

const cards = [
  {
    front: "Твоя работа видна",
    back: "Клиенты видят каждый этап в личном кабинете — и ты тоже видишь, как задача доходит до запуска.",
    mark: "eye",
    tone: "light",
  },
  {
    front: "AI — рабочий инструмент",
    back: "Нейросети помогают нам каждый день: в коде, дизайне и текстах. Не умеешь — научим.",
    mark: "spark",
    tone: "red",
  },
  {
    front: "Короткие петли",
    back: "Без пяти уровней согласований: задача → обсуждение → результат. Решения принимают те, кто делает.",
    mark: "loop",
    tone: "light",
  },
  {
    front: "Чего у нас не будет",
    back: "Пинг-понга, «мы — семья» и созвонов ради созвонов. Будут взрослые задачи и уважение к твоему времени.",
    mark: "cross",
    tone: "dark",
  },
  {
    front: "Рост через проекты",
    back: "Разные клиенты и ниши, ревью кода и дизайна, ментор на старте. Растёшь в задачах, а не в грейдах на бумаге.",
    mark: "growth",
    tone: "light",
  },
  {
    front: "Честные деньги",
    back: "Вилка указана в вакансии. Пересмотр по результатам — без «потом обсудим».",
    mark: "rub",
    tone: "light",
  },
] as const;

const ICONS = {
  eye: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
    </>
  ),
  loop: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
    </>
  ),
  cross: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  growth: (
    <>
      <path d="M7 17L17 7M9 7h8v8" />
    </>
  ),
  rub: (
    <>
      <path d="M8 20V4h5.5a4 4 0 0 1 0 8H6M6 16h8" />
    </>
  ),
} as const;

// «Как у нас» — карточки-перевёртыши: заголовок спереди, честная расшифровка сзади.
export function CareersCulture() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section id="culture" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>03 · Как у нас</span>
          <h2 className={styles.heading}>Без печенек в описании вакансии</h2>
          <p className={styles.lead}>
            Наведи или нажми на карточку — на обороте то, как это работает на самом деле.
          </p>
        </div>

        <div className={styles.grid}>
          {cards.map((c, i) => (
            <motion.button
              type="button"
              key={c.front}
              className={cn(
                styles.card,
                styles[c.tone],
                i === 1 && styles.wide,
                i === 3 && styles.wide,
              )}
              onClick={() => setFlipped((f) => (f === i ? null : i))}
              onHoverStart={() => setFlipped(i)}
              onHoverEnd={() => setFlipped((f) => (f === i ? null : f))}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              aria-pressed={flipped === i}
            >
              <motion.span
                className={styles.flipper}
                animate={{ rotateY: flipped === i ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
              >
                <span className={styles.face}>
                  <span className={styles.mark}>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {ICONS[c.mark]}
                    </svg>
                  </span>
                  <span className={styles.front}>{c.front}</span>
                  <span className={styles.hint}>как это работает →</span>
                </span>
                <span className={cn(styles.face, styles.back)}>
                  <span className={styles.backText}>{c.back}</span>
                </span>
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
