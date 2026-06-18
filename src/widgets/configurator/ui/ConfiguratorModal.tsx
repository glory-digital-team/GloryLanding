/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { cn, formatRuPhone, isCompleteRuPhone, useOverlays } from "@/shared/lib";
import {
  MIN_BASE_PRICE,
  MODULES,
  PROJECT_TYPES,
  SOURCE_OPTIONS,
  urgencyFromDate,
} from "../model/config";
import { Receipt } from "./Receipt";
import styles from "./Configurator.module.scss";

const TOTAL_STEPS = 4;

// Заголовки шагов — из ранних фреймов конфигуратора в макете
// (100:1189 / 100:1752 / 100:2294); в финальных фреймах заголовок
// первого шага скопирован на все экраны.
const STEP_TITLES = [
  "Какой проект вам нужен?",
  "Что входит в проект?",
  "Уточните детали",
  "Куда прислать расчёт?",
];

// Модальный конфигуратор «Соберите проект. Узнайте бюджет.»
// (Figma: десктоп 337:385/450/624/779, мобайл 337:4773…337:5423).
export function ConfiguratorModal() {
  const { configuratorOpen, closeConfigurator } = useOverlays();

  const [step, setStep] = useState(0);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [moduleIds, setModuleIds] = useState<Set<string>>(new Set());
  const [launchDate, setLaunchDate] = useState("");
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = useCallback(() => {
    setStep(0);
    setTypeId(null);
    setModuleIds(new Set());
    setLaunchDate("");
    setSourceId(null);
    setName("");
    setPhone("");
    setConsent(false);
    setSubmitted(false);
  }, []);

  const close = useCallback(() => {
    closeConfigurator();
    // Сбрасываем после анимации закрытия, чтобы контент не мигал
    setTimeout(reset, 300);
  }, [closeConfigurator, reset]);

  useEffect(() => {
    if (!configuratorOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [configuratorOpen, close]);

  const selectedType = PROJECT_TYPES.find((t) => t.id === typeId) ?? null;
  const basePrice = selectedType?.basePrice ?? MIN_BASE_PRICE;
  const modulesTotal = useMemo(
    () => MODULES.filter((m) => moduleIds.has(m.id)).reduce((sum, m) => sum + m.price, 0),
    [moduleIds],
  );
  const urgency = urgencyFromDate(launchDate);
  const total = Math.max(basePrice + modulesTotal + (urgency?.delta ?? 0), MIN_BASE_PRICE);

  if (!configuratorOpen) return null;

  const toggleModule = (id: string) => {
    setModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const stepValid =
    (step === 0 && typeId !== null) ||
    step === 1 ||
    step === 2 ||
    (step === 3 && name.trim().length > 0 && isCompleteRuPhone(phone) && consent);

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < TOTAL_STEPS - 1) {
      next();
      return;
    }
    // Бэкенда пока нет — фиксируем заявку локально и показываем подтверждение
    setSubmitted(true);
  };

  return (
    <div className={styles.overlay} onClick={close}>
      <form
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="Конфигуратор стоимости проекта"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <button type="button" className={styles.close} aria-label="Закрыть" onClick={close}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className={styles.title}>
          Соберите проект.{" "}
          <br className={styles.titleBreak} />
          Узнайте бюджет.
        </h2>

        {submitted ? (
          <div className={styles.success}>
            <span className={styles.successIcon} aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24">
                <path
                  d="m5 12.5 4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className={styles.successTitle}>Заявка отправлена</h3>
            <p className={styles.successText}>
              Мы свяжемся с вами в ближайшее время, уточним детали и зафиксируем
              точную смету проекта.
            </p>
            <button type="button" className={styles.nextBtn} onClick={close}>
              Отлично
            </button>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.left}>
              {/* Чек на мобиле: сворачиваемый, виден с первого шага —
                  предварительная стоимость появляется сразу при выборе проекта
                  (Figma 369:756/762). */}
              <div className={styles.mobileReceipt}>
                <Receipt
                  basePrice={basePrice}
                  modulesTotal={modulesTotal}
                  urgency={urgency}
                  total={total}
                  collapsible
                />
              </div>

              {/* Прогресс: 4 сегмента (Figma 337:389) */}
              <div className={styles.progress} aria-hidden="true">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <span
                    key={i}
                    className={cn(styles.progressSeg, i <= step && styles.progressSegActive)}
                  />
                ))}
              </div>
              <p className={styles.srOnly} aria-live="polite">
                Шаг {step + 1} из {TOTAL_STEPS}
              </p>

              <h3 className={styles.stepTitle}>{STEP_TITLES[step]}</h3>

              {step === 0 && (
                <div className={styles.optionGrid}>
                  {PROJECT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={cn(styles.option, typeId === t.id && styles.optionSelected)}
                      aria-pressed={typeId === t.id}
                      onClick={() => setTypeId(t.id)}
                    >
                      <img src={t.icon} alt="" width={32} height={32} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className={styles.optionGrid}>
                  {MODULES.map((m) => {
                    const checked = moduleIds.has(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        className={cn(styles.option, styles.optionCheck)}
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggleModule(m.id)}
                      >
                        <span
                          className={cn(styles.checkbox, checked && styles.checkboxChecked)}
                          aria-hidden="true"
                        >
                          {checked && (
                            <svg width="14" height="14" viewBox="0 0 24 24">
                              <path
                                d="m5 12.5 4.5 4.5L19 7.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className={styles.detailsStep}>
                  <label className={styles.fieldLabel} htmlFor="conf-date">
                    Желаемая дата запуска
                  </label>
                  <input
                    id="conf-date"
                    type="date"
                    className={styles.input}
                    value={launchDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setLaunchDate(e.target.value)}
                  />

                  <p className={styles.fieldLabel}>Исходные данные</p>
                  <div className={styles.sourceRow}>
                    {SOURCE_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={cn(
                          styles.option,
                          styles.optionSource,
                          sourceId === s.id && styles.optionSelected,
                        )}
                        aria-pressed={sourceId === s.id}
                        onClick={() => setSourceId(s.id)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.detailsStep}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Ваше имя"
                    autoComplete="name"
                    aria-label="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label className={styles.fieldLabel} htmlFor="conf-phone">
                    Телефон
                  </label>
                  <input
                    id="conf-phone"
                    type="tel"
                    className={styles.input}
                    placeholder="+7 (___) ___-__-__"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatRuPhone(e.target.value))}
                  />
                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      className={styles.consentBox}
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>
                      Согласен на обработку персональных данных.{" "}
                      <PolicyInlineLink />
                    </span>
                  </label>
                </div>
              )}

              <div className={styles.actions}>
                {step > 0 && (
                  <button type="button" className={styles.backBtn} onClick={() => setStep(step - 1)}>
                    Назад
                  </button>
                )}
                <button type="submit" className={styles.nextBtn} disabled={!stepValid}>
                  Далее
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="m9 6 6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.desktopReceipt}>
              <Receipt
                basePrice={basePrice}
                modulesTotal={modulesTotal}
                urgency={urgency}
                total={total}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// Ссылка на политику внутри согласия — открывает LegalModal поверх конфигуратора.
function PolicyInlineLink() {
  const { openPolicy } = useOverlays();
  return (
    <button type="button" className={styles.policyLink} onClick={openPolicy}>
      Политика конфиденциальности
    </button>
  );
}
