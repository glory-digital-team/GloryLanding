"use client";

import { useEffect, useState } from "react";
import { resendCabinetCode, verifyCabinetCode, type CodeSent } from "@/shared/api/cabinet";
import { siteConfig } from "@/shared/config";
import styles from "./CabinetCodeStep.module.scss";

interface CabinetCodeStepProps {
  sent: CodeSent;
  /** «Позже» — закрыть окно; без него ссылки нет. */
  onLater?: () => void;
}

const CODE_LENGTH = 6;

/**
 * После заявки: код из письма — и сразу в личный кабинет, где видна заявка и чат с менеджером.
 * Cookie кабинета ставит ответ проверки кода; дальше — обычный переход на `/cabinet`.
 * Шесть цифр набраны или вставлены целиком — входим сразу, без кнопки.
 */
export function CabinetCodeStep({ sent, onLater }: CabinetCodeStepProps) {
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [wait, setWait] = useState(sent.resendIn);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((left) => left - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  const submit = async (value: string) => {
    if (value.length !== CODE_LENGTH || pending) return;
    setPending(true);
    setError("");
    try {
      await verifyCabinetCode(sent.email, value);
      window.location.assign(siteConfig.cabinet.href);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось проверить код");
      setCode("");
      setPending(false);
    }
  };

  const resend = async () => {
    setError("");
    setNotice("");
    try {
      const next = await resendCabinetCode(sent.email);
      setWait(next.resendIn);
      setNotice("Отправили новый код");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить код");
    }
  };

  return (
    <div className={styles.step} role="group" aria-label="Вход в личный кабинет">
      <p className={styles.lead}>
        Код для входа в личный кабинет — на <span className={styles.email}>{sent.email}</span>. В
        кабинете видно, как идёт заявка, и можно написать менеджеру.
      </p>
      <input
        className={styles.code}
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="Код из письма"
        aria-label="Код из письма"
        maxLength={CODE_LENGTH + 2}
        value={code}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH);
          setCode(digits);
          if (digits.length === CODE_LENGTH) void submit(digits);
        }}
        onKeyDown={(e) => {
          // Шаг живёт внутри формы заявки: Enter не должен отправить её ещё раз.
          if (e.key !== "Enter") return;
          e.preventDefault();
          void submit(code);
        }}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      {notice && !error ? <p className={styles.notice}>{notice}</p> : null}
      <button
        type="button"
        className={styles.submit}
        disabled={code.length !== CODE_LENGTH || pending}
        onClick={() => void submit(code)}
      >
        {pending ? "Входим..." : "Войти в кабинет"}
      </button>
      <div className={styles.links}>
        {wait > 0 ? (
          <span className={styles.wait}>Новый код — через {wait} с</span>
        ) : (
          <button type="button" className={styles.link} onClick={() => void resend()}>
            Отправить код ещё раз
          </button>
        )}
        {onLater ? (
          <button type="button" className={styles.link} onClick={onLater}>
            Позже
          </button>
        ) : null}
      </div>
    </div>
  );
}
