"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DIRECTION_LABEL, FORMAT_LABEL, type Vacancy } from "@/entities/vacancy";
import { Button } from "@/shared/ui/Button";
import { useApply } from "../model/applyContext";
import { submitApplication, type ApplicationReceipt } from "../api/submitApplication";
import styles from "./ApplyDrawer.module.scss";

const ease = [0.22, 1, 0.36, 1] as const;

// Шторка вакансии: подробности → форма → «чек» отклика со статусом,
// как у заказа в личном кабинете клиента.
export function ApplyDrawer() {
  const { open, close } = useApply();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return <AnimatePresence>{open && <Panel />}</AnimatePresence>;
}

// Монтируется заново при каждом открытии — состояние формы и «чека» всегда чистое.
function Panel() {
  const { vacancy, step, setStep, close } = useApply();
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const view = receipt ? "done" : step;

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button type="button" className={styles.backdrop} aria-label="Закрыть" onClick={close} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={vacancy?.title ?? "Свободный отклик"}
        className={styles.panel}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease }}
      >
        <header className={styles.top}>
          <span className={styles.crumb}>
            {view === "details" && "Вакансия"}
            {view === "form" && "Отклик"}
            {view === "done" && "Готово"}
          </span>
          <button type="button" className={styles.close} onClick={close} aria-label="Закрыть">
            <span />
            <span />
          </button>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            className={styles.body}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease }}
          >
            {view === "details" && vacancy && (
              <Details vacancy={vacancy} onApply={() => setStep("form")} />
            )}
            {view === "form" && <ApplyForm vacancy={vacancy} onDone={setReceipt} />}
            {view === "done" && receipt && (
              <Receipt receipt={receipt} vacancy={vacancy} onClose={close} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.aside>
    </motion.div>
  );
}

function Details({ vacancy, onApply }: { vacancy: Vacancy; onApply: () => void }) {
  const blocks: [string, string[]][] = [
    ["Чем займёшься", vacancy.tasks],
    ["Что важно", vacancy.requirements],
    ["Будет плюсом", vacancy.bonus],
  ];
  return (
    <>
      <div className={styles.meta}>
        <span className={styles.chipAccent}>{DIRECTION_LABEL[vacancy.direction]}</span>
        <span className={styles.chip}>{vacancy.level}</span>
        {vacancy.format.map((f) => (
          <span key={f} className={styles.chip}>
            {FORMAT_LABEL[f]}
          </span>
        ))}
      </div>
      <h2 className={styles.title}>{vacancy.title}</h2>
      <p className={styles.pitch}>{vacancy.pitch}</p>
      <div className={styles.salary}>
        <span>{vacancy.salary}</span>
        <small>{vacancy.employment}</small>
      </div>

      {blocks.map(([label, items], i) => (
        <section key={label} className={styles.block}>
          <h3>{label}</h3>
          <ul>
            {items.map((item, j) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 + j * 0.04, duration: 0.4, ease }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </section>
      ))}

      <section className={styles.block}>
        <h3>Стек</h3>
        <div className={styles.stack}>
          {vacancy.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>

      <div className={styles.sticky}>
        <Button variant="primary" size="lg" iconRight="arrow-right" onClick={onApply}>
          Откликнуться
        </Button>
      </div>
    </>
  );
}

function ApplyForm({
  vacancy,
  onDone,
}: {
  vacancy: Vacancy | null;
  onDone: (r: ApplicationReceipt) => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Как к тебе обращаться?");
    if (contact.trim().length < 3) return setError("Оставь Telegram или почту для связи");
    if (!consent) return setError("Нужно согласие на обработку данных");
    setPending(true);
    try {
      onDone(
        await submitApplication({
          vacancyId: vacancy?.id ?? null,
          vacancyTitle: vacancy?.title ?? null,
          name,
          contact,
          link,
          message,
          consent,
        }),
      );
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Не получилось отправить. Попробуй ещё раз",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <h2 className={styles.title}>{vacancy ? vacancy.title : "Свободный отклик"}</h2>
      <p className={styles.pitch}>
        {vacancy
          ? "Четыре поля — и всё. Резюме не обязательно: ссылка на работы скажет больше."
          : "Не нашёл свою роль? Расскажи, чем хочешь заниматься в Глори — мы читаем всё."}
      </p>

      <label className={styles.field}>
        <span>Имя</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Как тебя зовут"
          autoComplete="name"
        />
      </label>
      <label className={styles.field}>
        <span>Telegram или почта</span>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="@username или mail@site.ru"
        />
      </label>
      <label className={styles.field}>
        <span>Портфолио, GitHub или резюме</span>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://"
          inputMode="url"
        />
      </label>
      <label className={styles.field}>
        <span>{vacancy ? "Пара слов о себе" : "Кем хочешь быть в Глори"}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={
            vacancy ? "Проект, которым гордишься, и почему" : "Роль, опыт и чем будешь полезен"
          }
        />
      </label>

      <label className={styles.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Согласен на{" "}
          <a href="/consent/" target="_blank" rel="noopener">
            обработку персональных данных
          </a>
        </span>
      </label>

      <AnimatePresence>
        {error && (
          <motion.p
            className={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className={styles.sticky}>
        <Button variant="primary" size="lg" type="submit" disabled={pending}>
          {pending ? "Отправляем…" : "Отправить отклик"}
        </Button>
      </div>
    </form>
  );
}

const STATUS = ["Отклик получен", "Знакомство", "Задача", "Встреча с командой", "Оффер"];

function Receipt({
  receipt,
  vacancy,
  onClose,
}: {
  receipt: ApplicationReceipt;
  vacancy: Vacancy | null;
  onClose: () => void;
}) {
  return (
    <div className={styles.receipt}>
      <motion.div
        className={styles.check}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      >
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" aria-hidden="true">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          />
        </svg>
      </motion.div>
      <h2 className={styles.title}>Отклик {receipt.number} принят</h2>
      <p className={styles.pitch}>
        {vacancy ? vacancy.title : "Свободный отклик"} · ответим в течение 2 рабочих дней. Статус —
        как у заказа: всегда понятно, где ты сейчас.
      </p>

      <ol className={styles.track}>
        {STATUS.map((s, i) => (
          <motion.li
            key={s}
            className={i === 0 ? styles.trackDone : undefined}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
          >
            <i />
            {s}
            {i === 0 && <em>сейчас</em>}
          </motion.li>
        ))}
      </ol>

      <Button variant="secondary" calm size="lg" onClick={onClose}>
        Вернуться к вакансиям
      </Button>
    </div>
  );
}
