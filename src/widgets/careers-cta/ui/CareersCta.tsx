"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useApply } from "@/features/vacancy-apply";
import { siteConfig } from "@/shared/config";
import styles from "./CareersCta.module.scss";

// Финальный экран: «магнитная» кнопка свободного отклика.
export function CareersCta() {
  const { openApply } = useApply();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < 260) {
      x.set(dx * 0.35);
      y.set(dy * 0.35);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <section
      className={styles.section}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Не нашёл свою роль?
          <br />
          <span>Придумай её вместе с нами.</span>
        </motion.h2>
        <p className={styles.text}>
          Расскажи, чем хочешь заниматься и чем будешь полезен студии. Сильных людей мы ищем всегда
          — даже если вакансии ещё нет.
        </p>
        <motion.button
          ref={ref}
          type="button"
          className={styles.magnet}
          style={{ x, y }}
          whileTap={{ scale: 0.94 }}
          onClick={() => openApply(null)}
        >
          <span>Свободный отклик</span>
        </motion.button>
        <p className={styles.mail}>
          или напиши на <a href={siteConfig.contacts.emailHref}>{siteConfig.contacts.email}</a>
        </p>
      </div>
    </section>
  );
}
