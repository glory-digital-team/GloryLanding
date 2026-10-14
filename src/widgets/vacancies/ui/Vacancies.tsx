"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  DIRECTION_LABEL,
  DIRECTION_PERSON,
  FORMAT_LABEL,
  useVacancies,
  type VacancyDirection,
  type VacancyFormat,
} from "@/entities/vacancy";
import { useApply } from "@/features/vacancy-apply";
import { cn } from "@/shared/lib";
import styles from "./Vacancies.module.scss";

type Dir = VacancyDirection | "all";
type Fmt = VacancyFormat | "all";

const dirOptions: [Dir, string][] = [
  ["all", "кто угодно"],
  ...(Object.keys(DIRECTION_PERSON) as VacancyDirection[]).map(
    (d) => [d, DIRECTION_PERSON[d]] as [Dir, string],
  ),
];
const fmtOptions: [Fmt, string][] = [
  ["all", "как удобно"],
  ["remote", "удалённо"],
  ["hybrid", "в гибриде"],
];

function plural(n: number) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "вакансия";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "вакансии";
  return "вакансий";
}

// Список вакансий с фильтром-предложением «Я — …, хочу работать …».
export function Vacancies() {
  const { openVacancy, openApply } = useApply();
  const vacancies = useVacancies();
  const [dir, setDir] = useState<Dir>("all");
  const [fmt, setFmt] = useState<Fmt>("all");

  const list = useMemo(
    () =>
      vacancies.filter(
        (v) => (dir === "all" || v.direction === dir) && (fmt === "all" || v.format.includes(fmt)),
      ),
    [vacancies, dir, fmt],
  );

  return (
    <section id="vacancies" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.kicker}>01 · Вакансии</span>
          <h2 className={styles.heading}>Найди себя в одной фразе</h2>
        </div>

        <LayoutGroup>
          <div className={styles.sentence}>
            <span>Я —</span>
            <Pills id="dir" options={dirOptions} value={dir} onChange={setDir} />
            <span>и хочу работать</span>
            <Pills id="fmt" options={fmtOptions} value={fmt} onChange={setFmt} />
          </div>
        </LayoutGroup>

        <div className={styles.count}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b
              key={list.length}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              {list.length}
            </motion.b>
          </AnimatePresence>
          <span>{plural(list.length)} под тебя</span>
        </div>

        <motion.ul layout className={styles.list}>
          <AnimatePresence mode="popLayout">
            {list.map((v, i) => (
              <motion.li
                layout
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              >
                <button type="button" className={styles.card} onClick={() => openVacancy(v)}>
                  <span className={styles.fill} aria-hidden="true" />
                  <span className={styles.num}>
                    {String(vacancies.indexOf(v) + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.main}>
                    <span className={styles.title}>
                      {v.title}
                      {v.hot && <em>горит</em>}
                    </span>
                    <span className={styles.pitch}>{v.pitch}</span>
                  </span>
                  <span className={styles.tags}>
                    <span>{DIRECTION_LABEL[v.direction]}</span>
                    <span>{v.level}</span>
                    <span>{v.format.map((f) => FORMAT_LABEL[f]).join(" / ")}</span>
                  </span>
                  <span className={styles.salary}>{v.salary}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                      <path
                        d="M7 17L17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              className={styles.empty}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p>
                Под такую комбинацию вакансий пока нет. Но мы любим людей, которые приходят сами.
              </p>
              <button type="button" onClick={() => openApply(null)}>
                Свободный отклик →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Pills<T extends string>({
  id,
  options,
  value,
  onChange,
}: {
  id: string;
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <span className={styles.pills} role="radiogroup">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={value === key}
          className={cn(styles.pill, value === key && styles.pillOn)}
          onClick={() => onChange(key)}
        >
          {value === key && (
            <motion.span
              layoutId={`pill-${id}`}
              className={styles.pillBg}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          <span className={styles.pillLabel}>{label}</span>
        </button>
      ))}
    </span>
  );
}
