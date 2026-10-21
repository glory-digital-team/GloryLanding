"use client";

import { useRef, useState, type FormEvent } from "react";
import { CabinetCodeStep } from "@/features/cabinet-entry";
import { isEmail, submitSiteRequest, type CodeSent } from "@/shared/api/cabinet";
import { attributionNote, track, useExperiment } from "@/shared/analytics";
import { formatRuPhone } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import {
  CALL_TIME_EXPERIMENT,
  CALL_TIME_VARIANTS,
  CallTimePicker,
  NativeCallTimePicker,
  callTimeNote,
  nativeCallTimeNote,
  parseLocalDateTime,
  type CallTime,
} from "./CallTimePicker";
import styles from "./LeadForm.module.scss";

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
  /**
   * `default` — заявка с офертой и шагом входа в кабинет.
   * `diagnostic` — заявка на бесплатную диагностику: согласие только на обработку ПДн,
   * Telegram вместо телефона по желанию, выбор удобного времени разговора,
   * без кнопки калькулятора и без шага кода входа.
   */
  variant?: "default" | "diagnostic";
}

/** В поле контакта ввели Telegram (@username, t.me/…), а не номер телефона. */
const isTelegram = (value: string) => /[@a-zA-Z_]/.test(value);

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
  variant = "default",
}: LeadFormProps) {
  const isDiagnostic = variant === "diagnostic";
  // A/B-тест выбора времени разговора — только в форме диагностики.
  const picker = useExperiment(CALL_TIME_EXPERIMENT, CALL_TIME_VARIANTS, isDiagnostic);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [task, setTask] = useState("");
  const [callTime, setCallTime] = useState<CallTime>({ day: "", time: "" });
  const [callAt, setCallAt] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState<CodeSent | null>(null);
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

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (name.trim() === "") return fail("Как к вам обращаться?", "name");
    if (!isEmail(email)) return fail("Проверьте почту", "email");
    const callDate = picker === "native" ? parseLocalDateTime(callAt) : null;
    if (callDate && callDate.getTime() <= Date.now()) {
      return fail("Выберите время позже текущего или оставьте поле пустым", "call_time");
    }
    if (!consent) return fail("Подтвердите согласие на обработку данных", "consent");
    setPending(true);
    try {
      const comment = [
        `Форма «${title}» (${formId})${context ? ` — ${context}` : ""}`,
        isDiagnostic && isTelegram(phone) ? `Telegram: ${phone.trim()}` : "",
        picker === "chips" ? callTimeNote(callTime) : "",
        picker === "native" ? nativeCallTimeNote(callAt) : "",
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
        // Telegram уходит в комментарий: поле phone в Штате ждёт номер.
        phone: (isDiagnostic && isTelegram(phone) ? "" : phone.trim()) || null,
        comment,
        consent,
      });
      setSubmitted(sent);
      track("lead_form_submit", { form_id: formId, has_task: task.trim() !== "" });
      if (isDiagnostic) {
        // Без персональных данных: только факт заполнения необязательных полей.
        track("diagnostic_form_submit", {
          form_id: formId,
          has_task: task.trim() !== "",
          picker: picker ?? "none",
          has_day: picker === "chips" ? callTime.day !== "" : callDate !== null,
          has_time: picker === "chips" ? callTime.time !== "" : callDate !== null,
        });
      }
    } catch (cause) {
      fail(cause instanceof Error ? cause.message : "Не удалось отправить заявку", "api");
    } finally {
      setPending(false);
    }
  };

  const headingId = `lead-${formId}-title`;

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
          </div>
          {isDiagnostic ? (
            <Input
              label="Телефон или Telegram — по желанию"
              placeholder="+7 (___) ___-__-__ или @username"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(isTelegram(e.target.value) ? e.target.value : formatRuPhone(e.target.value))}
            />
          ) : (
            <Input
              label="Телефон или Telegram — по желанию"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(formatRuPhone(e.target.value))}
            />
          )}
          <label className={styles.taskField}>
            <span className={styles.taskLabel}>
              {isDiagnostic ? "Что хотите разобрать — по желанию" : "Коротко о задаче — по желанию"}
            </span>
            <textarea
              className={styles.textarea}
              rows={3}
              maxLength={1500}
              placeholder={taskPlaceholder}
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </label>
          {picker === "chips" ? <CallTimePicker value={callTime} onChange={setCallTime} /> : null}
          {picker === "native" ? <NativeCallTimePicker value={callAt} onChange={setCallAt} /> : null}

          <label className={styles.consent}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            {isDiagnostic ? (
              <span>
                {/* Диагностика — без оферты: согласие только на обработку персональных данных. */}
                Согласен на{" "}
                <a href="/consent/" target="_blank" rel="noopener" className={styles.policy}>
                  обработку персональных данных
                </a>{" "}
                по{" "}
                <a className={styles.policy} href="/privacy/" target="_blank" rel="noopener">
                  политике конфиденциальности
                </a>
              </span>
            ) : (
              <span>
                {/* Заявка сразу открывает личный кабинет: согласие — и с офертой, и на обработку данных. */}
                Принимаю условия{" "}
                <a href="/offer/" target="_blank" rel="noopener" className={styles.policy}>
                  оферты
                </a>{" "}
                и согласен на обработку персональных данных.{" "}
                <a className={styles.policy} href="/privacy/" target="_blank" rel="noopener">
                  Политика конфиденциальности
                </a>
              </span>
            )}
          </label>

          <p className={styles.error} role="alert" aria-live="assertive">
            {error}
          </p>
          {submitted && isDiagnostic ? (
            <p className={styles.status} role="status">
              Заявка принята, менеджер свяжется с вами и подтвердит время разговора. На{" "}
              {submitted.email} также придёт письмо с кодом входа в личный кабинет: там видна заявка, но
              для диагностики входить не обязательно.
            </p>
          ) : null}
          {submitted && !isDiagnostic ? (
            <div className={styles.codeStep}>
              <p className={styles.status} role="status">
                Заявка принята. Менеджер изучит задачу и свяжется с вами, чтобы договориться
                о первом разговоре. Расчёт и статус заявки будут в личном кабинете.
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
          {isDiagnostic ? (
            <p className={styles.note}>
              Данные нужны, чтобы связаться с вами по заявке, и передаются только в объёме, необходимом
              для оказания услуги.
            </p>
          ) : (
            <Button href={calculatorHref} className={styles.fullBtn} data-soft="true" data-cta={`lead-${formId}-calc`}>
              Сначала рассчитать стоимость
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
