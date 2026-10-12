"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { vacancies } from "@/entities/vacancy";
import { useApply } from "@/features/vacancy-apply";
import { Button } from "@/shared/ui/Button";
import { DotField } from "./DotField";
import styles from "./CareersHero.module.scss";

const words = [
  "пишет код",
  "рисует интерфейсы",
  "обучает нейросети",
  "ведёт проекты",
  "растёт быстрее задач",
];
const statuses = ["Отклик получен", "Знакомство", "Задача", "Встреча с командой", "Оффер 🎉"];
const ease = [0.22, 1, 0.36, 1] as const;

export function CareersHero() {
  const { openApply } = useApply();
  const [word, setWord] = useState(0);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setWord((i) => (i + 1) % words.length), 2400);
    const b = setInterval(() => setStatus((i) => (i + 1) % statuses.length), 1700);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  // Наклон «билета» за курсором
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 14 });
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const stats = [
    [String(vacancies.length), "открытых ролей"],
    ["48 ч", "на ответ по отклику"],
    ["4 шага", "от отклика до оффера"],
    ["0", "бесплатных тестовых"],
  ];

  return (
    <section className={styles.hero} onPointerMove={onMove}>
      <DotField className={styles.field} />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <motion.span
            className={styles.badge}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <i /> Открыт найм · {vacancies.length} ролей
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            Ищем тех, кто
            <span className={styles.rotator} aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[word]}
                  className={styles.word}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  {words[word].split(" ").map((w, wi, arr) => {
                    const offset = arr.slice(0, wi).join(" ").length + (wi ? 1 : 0);
                    return (
                      <span key={wi} className={styles.wordPart}>
                        {w.split("").map((ch, ci) => (
                          <motion.span
                            key={ci}
                            variants={{
                              hidden: { y: "110%", opacity: 0, rotate: 8 },
                              show: {
                                y: 0,
                                opacity: 1,
                                rotate: 0,
                                transition: { delay: (offset + ci) * 0.022, duration: 0.5, ease },
                              },
                              exit: {
                                y: "-110%",
                                opacity: 0,
                                transition: { delay: (offset + ci) * 0.012, duration: 0.3 },
                              },
                            }}
                          >
                            {ch}
                          </motion.span>
                        ))}
                      </span>
                    );
                  })}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.25 }}
          >
            Глори.Цифра — небольшая студия, которая превращает бизнес-задачи в работающие сайты,
            автоматизацию и AI-решения. Без лишней бюрократии: каждый видит, как его работа доходит
            до клиента.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
          >
            <Button variant="primary" size="lg" href="#vacancies" iconRight="arrow-right">
              Смотреть вакансии
            </Button>
            <Button variant="secondary" calm size="lg" onClick={() => openApply(null)}>
              Свободный отклик
            </Button>
          </motion.div>
        </div>

        <motion.div
          className={styles.scene}
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          aria-hidden="true"
        >
          <motion.div className={styles.ticket} style={{ rotateX: rx, rotateY: ry }}>
            <div className={styles.ticketHead}>
              <span>Отклик</span>
              <b>#GL-0427</b>
            </div>
            <p className={styles.ticketRole}>UX/UI-дизайнер</p>
            <div className={styles.ticketStatus}>
              <span>Статус</span>
              <AnimatePresence mode="wait">
                <motion.b
                  key={status}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {statuses[status]}
                </motion.b>
              </AnimatePresence>
            </div>
            <div className={styles.bar}>
              <motion.i
                animate={{ width: `${((status + 1) / statuses.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
            <div className={styles.steps}>
              {statuses.map((s, i) => (
                <span key={s} className={i <= status ? styles.stepOn : undefined} />
              ))}
            </div>
            <div className={styles.perforation} />
            <p className={styles.ticketFoot}>
              Так кандидат видит свой путь — как клиент видит заказ.
            </p>
          </motion.div>

          {["Next.js", "Figma", "LLM", "Motion", "PostgreSQL"].map((t, i) => (
            <motion.span
              key={t}
              className={styles.floater}
              data-i={i}
              animate={{ y: [0, -14, 0], rotate: [0, i % 2 ? 4 : -4, 0] }}
              transition={{
                duration: 4 + i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className={styles.stats}>
        {stats.map(([n, l], i) => (
          <motion.div
            key={l}
            className={styles.stat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.5 + i * 0.08 }}
          >
            <b>{n}</b>
            <span>{l}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
