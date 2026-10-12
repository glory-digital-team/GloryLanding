"use client";

import { useEffect, useState } from "react";
import { resendCabinetCode, verifyCabinetCode, type CodeSent } from "@/shared/api/cabinet";
import { siteConfig } from "@/shared/config";

interface CabinetCodeStepProps {
  sent: CodeSent;
  /** Классы родителя: поле, основная и тихая кнопки, текст и ошибка — шаг выглядит как форма вокруг. */
  classes: {
    input: string;
    primary: string;
    secondary: string;
    text: string;
    error: string;
  };
  onLater?: () => void;
}

const CODE_LENGTH = 6;

/**
 * После заявки: код из письма — и сразу в личный кабинет, где видна заявка и чат с менеджером.
 * Cookie кабинета ставит ответ проверки кода; дальше — обычный переход на `/cabinet`.
 */
export function CabinetCodeStep({ sent, classes, onLater }: CabinetCodeStepProps) {
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

  const submit = async () => {
    if (code.length !== CODE_LENGTH || pending) return;
    setPending(true);
    setError("");
    try {
      await verifyCabinetCode(sent.email, code);
      window.location.assign(siteConfig.cabinet.href);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось проверить код");
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
    <div role="group" aria-label="Вход в личный кабинет">
      <p className={classes.text}>
        Код для входа в личный кабинет — на {sent.email}. В кабинете видно, как идёт заявка, и можно
        написать менеджеру.
      </p>
      <input
        className={classes.input}
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="Код из письма"
        aria-label="Код из письма"
        maxLength={CODE_LENGTH + 1}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
        onKeyDown={(e) => {
          // Шаг живёт внутри формы заявки: Enter не должен отправить её ещё раз.
          if (e.key !== "Enter") return;
          e.preventDefault();
          void submit();
        }}
      />
      {error ? <p className={classes.error}>{error}</p> : null}
      {notice && !error ? <p className={classes.text}>{notice}</p> : null}
      <button
        type="button"
        className={classes.primary}
        disabled={code.length !== CODE_LENGTH || pending}
        onClick={() => void submit()}
      >
        {pending ? "Входим..." : "Войти в кабинет"}
      </button>
      <button
        type="button"
        className={classes.secondary}
        disabled={wait > 0}
        onClick={() => void resend()}
      >
        {wait > 0 ? `Новый код — через ${wait} с` : "Отправить код ещё раз"}
      </button>
      {onLater ? (
        <button type="button" className={classes.secondary} onClick={onLater}>
          Позже
        </button>
      ) : null}
    </div>
  );
}
