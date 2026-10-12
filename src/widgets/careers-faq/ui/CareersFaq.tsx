"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./CareersFaq.module.scss";

const items = [
  [
    "Можно ли работать полностью удалённо?",
    "Да, большинство ролей — удалённые. Гибрид — для тех, кому важно иногда видеться с командой вживую.",
  ],
  [
    "Нужно ли резюме?",
    "Нет. Ссылка на портфолио, GitHub или живые проекты расскажет о тебе лучше, чем PDF.",
  ],
  [
    "Тестовое задание оплачивается?",
    "Если задание занимает больше пары часов — да. Короткий разбор кейса делаем вместе на созвоне.",
  ],
  [
    "Как быстро вы отвечаете?",
    "В течение 48 часов на каждый отклик, включая отказы — с короткой обратной связью.",
  ],
  [
    "Берёте ли без опыта?",
    "Да, на стажировку. Нужна база и хотя бы один проект, который можно открыть по ссылке.",
  ],
  [
    "Как оформляете?",
    "Обсуждаем на финальной встрече: формат зависит от роли и твоих предпочтений.",
  ],
];

export function CareersFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="careers-faq" className={styles.section}>
      <div className={styles.inner}>
        <div>
          <span className={styles.kicker}>04 · Вопросы</span>
          <h2 className={styles.heading}>Что обычно спрашивают</h2>
        </div>
        <div className={styles.list}>
          {items.map(([q, a], i) => (
            <div key={q} className={styles.item}>
              <button
                type="button"
                className={styles.q}
                aria-expanded={open === i}
                onClick={() => setOpen((o) => (o === i ? null : i))}
              >
                {q}
                <motion.span className={styles.plus} animate={{ rotate: open === i ? 45 : 0 }}>
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={styles.a}
                  >
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
