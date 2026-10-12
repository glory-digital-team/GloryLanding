"use client";

import { useState, type FormEvent } from "react";
import { CabinetCodeStep } from "@/features/cabinet-entry";
import { isEmail, submitSiteRequest, type CodeSent } from "@/shared/api/cabinet";
import { useOverlays } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import styles from "./LeadForm.module.scss";

// Блок-форма «Оставить заявку» (Figma «Frame 2147223060» 191:325).
export function LeadForm() {
  const { openConfigurator, openPolicy } = useOverlays();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState<CodeSent | null>(null);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (name.trim() === "") {
      setError("Как к вам обращаться?");
      return;
    }
    if (!isEmail(email)) {
      setError("Проверьте почту");
      return;
    }
    if (!consent) {
      setError("Подтвердите согласие на обработку данных");
      return;
    }
    setPending(true);
    try {
      const sent = await submitSiteRequest({
        typeId: null,
        moduleIds: [],
        launchOn: null,
        sourceId: null,
        email: email.trim(),
        name: name.trim(),
        phone: null,
        comment: "Форма «Обсудить точки роста» на сайте",
        consent,
      });
      setSubmitted(sent);
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
            label="Почта"
            type="email"
            placeholder="name@company.ru"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {submitted ? (
            <div className={styles.codeStep}>
              <p className={styles.status}>Заявка у нас — менеджер скоро свяжется.</p>
              <CabinetCodeStep
                sent={submitted}
                classes={{
                  input: styles.codeInput,
                  primary: styles.codePrimary,
                  secondary: styles.codeSecondary,
                  text: styles.codeText,
                  error: styles.error,
                }}
              />
            </div>
          ) : null}
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            className={styles.fullBtn}
            disabled={pending || submitted !== null}
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
