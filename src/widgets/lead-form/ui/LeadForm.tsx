"use client";

import { useRef, useState, type FormEvent } from "react";
import { CabinetCodeStep } from "@/features/cabinet-entry";
import { isEmail, submitSiteRequest, type CodeSent } from "@/shared/api/cabinet";
import { attributionNote, track } from "@/shared/analytics";
import { formatRuPhone } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import styles from "./LeadForm.module.scss";

interface FieldErrors {
  name?: string;
  email?: string;
  consent?: string;
}

interface LeadFormProps {
  /** Идентификатор формы для аналитики и якоря: home, service, case, contacts… */
  formId?: string;
  title?: string;
  text?: string;
  /** Услуга/страница, с которой пришла заявка — уходит в комментарий для менеджера. */
  context?: string;
  ctaLabel?: string;
  /** Ссылка вторичной кнопки (калькулятор с предвыбором типа). */
  calculatorHref?: string;
  /** Подсказка в поле задачи. */
  taskPlaceholder?: string;
}

// Блок-форма «Оставить заявку» (Figma «Frame 2147223060» 191:325).
// Короткая форма (ТЗ §6): имя, почта, телефон по желанию, описание задачи.
// В комментарий заявки добавляем контекст страницы и UTM — менеджер видит источник.
export function LeadForm({
  formId = "home",
  title = "Обсудим задачу",
  text = "Опишите задачу в нескольких предложениях: что сейчас происходит, кто пользуется системой и какой результат нужен. Этого достаточно для первого разговора.",
  context,
  ctaLabel = "Отправить заявку",
  calculatorHref = "/raschet-stoimosti/",
  taskPlaceholder = "Например: заявки приходят в почту и Excel, хотим видеть статусы в одном месте",
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [task, setTask] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState<CodeSent | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const started = useRef(false);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track("lead_form_start", { form_id: formId });
  };

  const fail = (message: string, reason: string) => {
    setError(message);
    track("lead_form_error", { form_id: formId, reason });
  };

  // Ошибка поля пропадает, как только его начали исправлять.
  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    // Проверяем все поля сразу, чтобы показать все ошибки за одну попытку.
    const found: FieldErrors = {};
    if (name.trim() === "") found.name = "Как к вам обращаться?";
    if (email.trim() === "") found.email = "Укажите почту — пришлём на неё код входа в кабинет";
    else if (!isEmail(email)) found.email = "Проверьте почту";
    if (!consent) found.consent = "Нужно согласие на обработку данных";
    setErrors(found);
    const failed = Object.keys(found);
    if (failed.length > 0) {
      for (const reason of failed) track("lead_form_error", { form_id: formId, reason });
      return;
    }
    setPending(true);
    try {
      const comment = [
        `Форма «${title}» (${formId})${context ? ` — ${context}` : ""}`,
        task.trim() ? `Задача: ${task.trim()}` : "",
        attributionNote(),
      ]
        .filter(Boolean)
        .join("\n");
      const sent = await submitSiteRequest({
        typeId: null,
        moduleIds: [],
        launchOn: null,
        sourceId: null,
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim() || null,
        comment,
        consent,
      });
      setSubmitted(sent);
      track("lead_form_submit", { form_id: formId, has_task: task.trim() !== "" });
    } catch (cause) {
      fail(cause instanceof Error ? cause.message : "Не удалось отправить заявку", "api");
    } finally {
      setPending(false);
    }
  };

  const headingId = `lead-${formId}-title`;
  const consentErrorId = `lead-${formId}-consent-error`;

  return (
    <section className={styles.section} id="lead-form" aria-labelledby={headingId}>
      <form className={styles.card} onSubmit={submit} onFocus={onStart} noValidate>
        <h2 className={styles.title} id={headingId}>
          {title}
        </h2>
        {text ? <p className={styles.text}>{text}</p> : null}

        <div className={styles.fields}>
          <div className={styles.row}>
            <Input
              label="Имя"
              placeholder="Как к вам обращаться"
              autoComplete="name"
              value={name}
              error={errors.name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
            />
            <Input
              label="Почта"
              type="email"
              placeholder="name@company.ru"
              autoComplete="email"
              value={email}
              error={errors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
            />
          </div>
          <Input
            label="Телефон или Telegram — по желанию"
            type="tel"
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatRuPhone(e.target.value))}
          />
          <label className={styles.taskField}>
            <span className={styles.taskLabel}>Коротко о задаче — по желанию</span>
            <textarea
              className={styles.textarea}
              rows={3}
              maxLength={1500}
              placeholder={taskPlaceholder}
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </label>

          <div className={styles.consentField}>
            <label className={styles.consent}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={consent}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? consentErrorId : undefined}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  clearError("consent");
                }}
              />
              <span>
                {/* Только согласие на ПДн (152-ФЗ: отдельно от других документов). Оферту клиент
                    принимает в личном кабинете, а не в заявке. */}
                Согласен на{" "}
                <a href="/consent/" target="_blank" rel="noopener" className={styles.policy}>
                  обработку персональных данных
                </a>
                .{" "}
                <a className={styles.policy} href="/privacy/" target="_blank" rel="noopener">
                  Политика конфиденциальности
                </a>
              </span>
            </label>
            {errors.consent ? (
              <p id={consentErrorId} className={styles.fieldError}>
                {errors.consent}
              </p>
            ) : null}
          </div>

          <p className={styles.error} role="alert" aria-live="assertive">
            {error}
          </p>
          {submitted ? (
            <div className={styles.codeStep}>
              <p className={styles.status} role="status">
                Заявка принята. Менеджер изучит задачу и свяжется с вами, чтобы договориться о
                первом разговоре. Расчёт и статус заявки будут в личном кабинете.
              </p>
              <CabinetCodeStep sent={submitted} />
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
            {pending ? "Отправляем..." : ctaLabel}
          </Button>
          <Button
            href={calculatorHref}
            className={styles.fullBtn}
            data-soft="true"
            data-cta={`lead-${formId}-calc`}
          >
            Сначала рассчитать стоимость
          </Button>
        </div>
      </form>
    </section>
  );
}
