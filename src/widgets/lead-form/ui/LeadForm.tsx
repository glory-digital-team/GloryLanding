"use client";

import { useState, type FormEvent } from "react";
import { createPublicContactLead } from "@/shared/api/crm";
import { formatRuPhone, isCompleteRuPhone, useOverlays } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import styles from "./LeadForm.module.scss";

// Блок-форма «Оставить заявку» (Figma «Frame 2147223060» 191:325).
export function LeadForm() {
  const { openConfigurator, openPolicy } = useOverlays();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!isCompleteRuPhone(phone)) {
      setError("Проверьте номер телефона");
      return;
    }
    if (!consent) {
      setError("Подтвердите согласие на обработку данных");
      return;
    }
    setPending(true);
    try {
      await createPublicContactLead({
        source_code: "landing",
        requester_name: name.trim() || null,
        requester_phone: phone,
        note: "Заявка с лендинга: форма «Обсудить точки роста»",
      });
      setSubmitted(true);
      setName("");
      setPhone("");
      setConsent(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить заявку");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className={styles.section} id="lead-form">
      <form className={styles.card} onSubmit={submit}>
        <h2 className={styles.title}>Обсудить точки роста</h2>

        <div className={styles.fields}>
          <Input
            aria-label="Имя"
            placeholder="Ваше имя"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Телефон"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatRuPhone(e.target.value))}
          />

          <label className={styles.consent}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              Согласен на обработку персональных данных.{" "}
              <button type="button" className={styles.policy} onClick={openPolicy}>
                Политика конфиденциальности
              </button>
            </span>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}
          {submitted ? <p className={styles.status}>Заявка отправлена. Мы скоро свяжемся.</p> : null}
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            className={styles.fullBtn}
            disabled={pending}
          >
            {pending ? "Отправляем..." : "Начать проект"}
          </Button>
          <Button
            type="button"
            className={styles.fullBtn}
            data-soft="true"
            onClick={openConfigurator}
          >
            Перейти в конфигуратор
          </Button>
        </div>
      </form>
    </section>
  );
}
