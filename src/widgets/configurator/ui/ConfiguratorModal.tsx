/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  calculatePublicConfigurator,
  type PublicConfiguratorCalculateResponse,
} from "@/shared/api/config";
import { createPublicConfiguratorLead } from "@/shared/api/crm";
import { cn, formatRuPhone, isCompleteRuPhone, useOverlays } from "@/shared/lib";
import {
  MODULES,
  PROJECT_TYPES,
  SOURCE_OPTIONS,
  formatPrice,
  riskLevelFromSource,
  urgencyFromDate,
} from "../model/config";
import { Receipt } from "./Receipt";
import styles from "./Configurator.module.scss";

const TOTAL_STEPS = 4;

type EstimateState = {
  key: string;
  data: PublicConfiguratorCalculateResponse;
};

type EstimateErrorState = {
  key: string;
  message: string;
};

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
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [estimate, setEstimate] = useState<EstimateState | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<EstimateErrorState | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const reset = useCallback(() => {
    setStep(0);
    setTypeId(null);
    setModuleIds(new Set());
    setLaunchDate("");
    setSourceId(null);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setConsent(false);
    setPending(false);
    setEstimate(null);
    setEstimating(false);
    setEstimateError(null);
    setSubmitted(false);
    setError("");
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
  const urgency = urgencyFromDate(launchDate);
  const moduleCodes = useMemo(() => Array.from(moduleIds).sort(), [moduleIds]);
  const estimateKey = selectedType
    ? [
        selectedType.serviceTypeCode,
        selectedType.id,
        moduleCodes.join(","),
        urgency?.code ?? "standard",
        riskLevelFromSource(sourceId),
        launchDate || "",
      ].join("|")
    : "";
  const activeEstimate = estimate?.key === estimateKey ? estimate.data : null;
  const activeEstimateError = estimateError?.key === estimateKey ? estimateError.message : "";
  const priceAvailable = selectedType !== null && activeEstimate !== null && !activeEstimateError;
  const total = activeEstimate?.total ?? null;
  const estimateAmount = activeEstimate?.estimate_min_amount ?? total;

  useEffect(() => {
    if (!selectedType || !estimateKey) return;

    let cancelled = false;
    const currentEstimateKey = estimateKey;

    const timer = window.setTimeout(() => {
      setEstimating(true);
      setEstimateError(null);
      calculatePublicConfigurator({
        service_type_code: selectedType.serviceTypeCode,
        module_codes: moduleCodes,
        urgency_level_code: urgency?.code ?? "standard",
        risk_level_code: riskLevelFromSource(sourceId),
        has_tz: sourceId === "ready",
        deadline: launchDate || null,
        metadata: {
          public_project_type_id: selectedType.id,
        },
      })
        .then((nextEstimate) => {
          if (cancelled) return;
          setEstimate({ key: currentEstimateKey, data: nextEstimate });
          setEstimateError(null);
        })
        .catch((cause) => {
          if (cancelled) return;
          setEstimate(null);
          setEstimateError({
            key: currentEstimateKey,
            message: cause instanceof Error ? cause.message : "Расчёт временно недоступен",
          });
        })
        .finally(() => {
          if (!cancelled) setEstimating(false);
        });
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [estimateKey, launchDate, moduleCodes, selectedType, sourceId, urgency?.code]);

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
    (step === 3 &&
      name.trim().length > 0 &&
      company.trim().length > 0 &&
      isCompleteRuPhone(phone) &&
      consent);

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < TOTAL_STEPS - 1) {
      next();
      return;
    }
    setError("");
    setPending(true);
    try {
      await createPublicConfiguratorLead({
        requester_name: name.trim() || null,
        requester_email: email.trim() || null,
        requester_phone: phone,
        company_name: company.trim(),
        service_type_code: mapServiceType(typeId),
        note: buildConfiguratorNote({
          typeId,
          moduleIds,
          launchDate,
          sourceId,
          estimateAmount,
          calculationRequestId: activeEstimate?.calculation_request_id ?? null,
        }),
        forecast_amount: total,
      });
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить заявку");
    } finally {
      setPending(false);
    }
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
                  moduleCount={moduleIds.size}
                  urgency={urgency}
                  total={total}
                  minAmount={activeEstimate?.estimate_min_amount}
                  priceAvailable={priceAvailable}
                  pending={estimating}
                  error={activeEstimateError}
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
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Компания"
                    autoComplete="organization"
                    aria-label="Компания"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="Email"
                    autoComplete="email"
                    aria-label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {error ? <p className={styles.error}>{error}</p> : null}
                </div>
              )}

              <div className={styles.actions}>
                {step > 0 && (
                  <button type="button" className={styles.backBtn} onClick={() => setStep(step - 1)}>
                    Назад
                  </button>
                )}
                <button type="submit" className={styles.nextBtn} disabled={!stepValid || pending}>
                  {step === TOTAL_STEPS - 1 ? (pending ? "Отправляем..." : "Отправить") : "Далее"}
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
                moduleCount={moduleIds.size}
                urgency={urgency}
                total={total}
                minAmount={activeEstimate?.estimate_min_amount}
                priceAvailable={priceAvailable}
                pending={estimating}
                error={activeEstimateError}
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

function mapServiceType(typeId: string | null): string | null {
  return PROJECT_TYPES.find((item) => item.id === typeId)?.serviceTypeCode ?? null;
}

function buildConfiguratorNote({
  typeId,
  moduleIds,
  launchDate,
  sourceId,
  estimateAmount,
  calculationRequestId,
}: {
  typeId: string | null;
  moduleIds: Set<string>;
  launchDate: string;
  sourceId: string | null;
  estimateAmount: number | null;
  calculationRequestId: string | null;
}): string {
  const typeLabel = PROJECT_TYPES.find((item) => item.id === typeId)?.label ?? "не выбрано";
  const modules = MODULES.filter((item) => moduleIds.has(item.id)).map((item) => item.label);
  const source = SOURCE_OPTIONS.find((item) => item.id === sourceId)?.label ?? "не указано";
  return [
    "Заявка из публичного конфигуратора.",
    `Услуга: ${typeLabel}.`,
    `Модули: ${modules.length > 0 ? modules.join(", ") : "без дополнительных модулей"}.`,
    `Желаемый запуск: ${launchDate || "не указан"}.`,
    `Исходные данные: ${source}.`,
    estimateAmount !== null
      ? `Предварительный бюджет: От ${formatPrice(estimateAmount)}.`
      : "Предварительный бюджет: расчёт временно недоступен, требуется ручная оценка.",
    calculationRequestId ? `ID расчёта: ${calculationRequestId}.` : null,
  ].join("\n");
}
