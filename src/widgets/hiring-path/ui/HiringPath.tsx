"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/shared/lib";
import styles from "./HiringPath.module.scss";

const steps = [
  {
    title: "Отклик",
    time: "2 минуты",
    text: "Имя, контакт, ссылка на работы. Резюме по желанию — портфолио и GitHub скажут больше.",
    sla: "Ответим за 48 часов — даже если «нет»",
  },
  {
    title: "Знакомство",
    time: "30 минут",
    text: "Видеозвонок: рассказываем про студию и проекты, слушаем про твой опыт и ожидания.",
    sla: "Без стресс-интервью и задачек на доске",
  },
  {
    title: "Задача",
    time: "до 4 часов",
    text: "Разбор реального кейса студии или небольшое задание. Если задание объёмное — мы его оплачиваем.",
    sla: "Даём подробную обратную связь",
  },
  {
    title: "Команда",
    time: "1 час",
    text: "Встреча с теми, с кем будешь работать каждый день. Задаёшь любые вопросы — и про деньги тоже.",
    sla: "Решение в течение 3 рабочих дней",
  },
];

// «Путь кандидата» — как трекер заказа в кабинете: шаги подсвечиваются по мере скролла.
export function HiringPath() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="path" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.aside}>
          <span className={styles.kicker}>02 · Как попасть</span>
          <h2 className={styles.heading}>
            Четыре шага.
            <br />
            <span>Никакой тайны.</span>
          </h2>
          <div className={styles.tracker} aria-hidden="true">
            <div className={styles.trackerTop}>
              <span>Твой статус</span>
              <span className={styles.mono}>{active + 1} / 4</span>
            </div>
            <div className={styles.big}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ y: 40, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -40, opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.35 }}
                >
                  {steps[active].title}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className={styles.dots}>
              {steps.map((s, i) => (
                <motion.span
                  key={s.title}
                  animate={{ flexGrow: i === active ? 3 : 1, opacity: i <= active ? 1 : 0.3 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                />
              ))}
            </div>
            <p className={styles.after}>
              Дальше — <b>оффер</b> и онбординг с ментором
            </p>
          </div>
        </div>

        <div className={styles.steps} ref={ref}>
          <div className={styles.rail}>
            <motion.i style={{ scaleY: line }} />
          </div>
          {steps.map((s, i) => (
            <motion.article
              key={s.title}
              className={cn(styles.step, i <= active && styles.stepOn)}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.6, margin: "-10% 0px -30% 0px" }}
              initial={{ opacity: 0.25, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={styles.node}>{i + 1}</span>
              <div>
                <div className={styles.stepHead}>
                  <h3>{s.title}</h3>
                  <span>{s.time}</span>
                </div>
                <p>{s.text}</p>
                <p className={styles.sla}>{s.sla}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
