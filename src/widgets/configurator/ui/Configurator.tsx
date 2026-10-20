/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CabinetCodeStep } from "@/features/cabinet-entry";
import {
  estimateSite,
  isEmail,
  submitSiteRequest,
  type CodeSent,
  type SiteEstimate,
} from "@/shared/api/cabinet";
import { attributionNote, track } from "@/shared/analytics";
import { cn, formatRuPhone } from "@/shared/lib";
import { CaseCard, type CaseStudy } from "@/entities/case";
import {
  MODULES,
  PROJECT_TYPES,
  SOURCE_OPTIONS,
  urgencyFromDate,
  type ProjectModule,
} from "../model/config";
import { Receipt } from "./Receipt";
import styles from "./Configurator.module.scss";

const TOTAL_STEPS = 4;

type EstimateState = {
  key: string;
  data: SiteEstimate;
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

const STORAGE_KEY = "glory:configurator";

/** Состояние без персональных данных — переживает перезагрузку и переход «назад» (ТЗ §7.24). */
interface StoredState {
  step: number;
  typeId: string | null;
  moduleIds: string[];
  launchDate: string;
  sourceId: string | null;
}

interface ConfiguratorProps {
  /** Подходящие кейсы по типу проекта — показываются после выбора типа, если есть. */
  casesByType?: Record<string, CaseStudy[]>;
}

// Конфигуратор «Соберите проект. Узнайте бюджет.» — теперь отдельная страница
// /raschet-stoimosti/, а не модалка (ТЗ §7.24): индексируемый URL, предвыбор типа
// через ?type=site|promo|ai|mobile, сохранение выбора и события calculator_*.
// (Figma: десктоп 337:385/450/624/779, мобайл 337:4773…337:5423).
export function Configurator({ casesByType = {} }: ConfiguratorProps) {
  const [step, setStep] = useState(0);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [moduleIds, setModuleIds] = useState<Set<string>>(new Set());
  const [launchDate, setLaunchDate] = useState("");
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [estimate, setEstimate] = useState<EstimateState | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<EstimateErrorState | null>(null);
  const [submitted, setSubmitted] = useState<CodeSent | null>(null);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const started = useRef(false);
  const rootRef = useRef<HTMLFormElement>(null);

  // Восстановление: сначала сохранённая сессия, затем ?type= из ссылки услуги
  useEffect(() => {
    let restored: StoredState | null = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      restored = raw ? (JSON.parse(raw) as StoredState) : null;
    } catch {
      restored = null;
    }
    const queryType = new URLSearchParams(window.location.search).get("type");
    const preset = PROJECT_TYPES.some((t) => t.id === queryType) ? queryType : null;
    /* eslint-disable react-hooks/set-state-in-effect -- однократная гидрация из sessionStorage/URL */
    if (restored && (!preset || restored.typeId === preset)) {
      setStep(Math.min(Math.max(restored.step, 0), TOTAL_STEPS - 1));
      setTypeId(restored.typeId);
      setModuleIds(new Set(restored.moduleIds));
      setLaunchDate(restored.launchDate);
      setSourceId(restored.sourceId);
    } else if (preset) {
      setTypeId(preset);
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated || submitted) return;
    const state: StoredState = { step, typeId, moduleIds: Array.from(moduleIds), launchDate, sourceId };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // приватный режим — просто без сохранения
    }
  }, [hydrated, submitted, step, typeId, moduleIds, launchDate, sourceId]);

  useEffect(() => {
    if (hydrated) track("calculator_step_view", { step: step + 1, type: typeId ?? "" });
  }, [hydrated, step, typeId]);

  const markStart = () => {
    if (started.current) return;
    started.current = true;
    track("calculator_start", {});
  };

  const handleProjectTypeChange = (nextTypeId: string) => {
    markStart();
    track("calculator_option_select", { option: "type", value: nextTypeId });
    setTypeId(nextTypeId);
    setModuleIds((previous) =>
      new Set(
        Array.from(previous).filter((id) =>
          MODULES.find((module) => module.id === id)?.projectTypeIds.includes(nextTypeId),
        ),
      ),
    );
  };

  const matchedCases = typeId ? (casesByType[typeId] ?? []).slice(0, 2) : [];
  const selectedType = PROJECT_TYPES.find((t) => t.id === typeId) ?? null;
  const urgency = urgencyFromDate(launchDate);
  const availableModules = useMemo(
    () => MODULES.filter((m) => !typeId || m.projectTypeIds.includes(typeId)),
    [typeId],
  );
  const moduleCodes = useMemo(() => Array.from(moduleIds).sort(), [moduleIds]);
  const estimateKey = selectedType
    ? [selectedType.id, moduleCodes.join(","), sourceId ?? "", launchDate || ""].join("|")
    : "";
  const activeEstimate = estimate?.key === estimateKey ? estimate.data : null;
  const activeEstimateError = estimateError?.key === estimateKey ? estimateError.message : "";
  const priceAvailable = selectedType !== null && activeEstimate !== null && !activeEstimateError;
  const total = activeEstimate?.min ?? null;

  useEffect(() => {
    if (!selectedType || !estimateKey) return;

    let cancelled = false;
    const currentEstimateKey = estimateKey;

    const timer = window.setTimeout(() => {
      setEstimating(true);
      setEstimateError(null);
      estimateSite({
        typeId: selectedType.id,
        moduleIds: moduleCodes,
        launchOn: launchDate || null,
        sourceId,
      })
        .then((nextEstimate) => {
          if (cancelled) return;
          setEstimate({ key: currentEstimateKey, data: nextEstimate });
          setEstimateError(null);
          track("calculator_result_view", {
            type: selectedType.id,
            modules: moduleCodes.length,
            manual: nextEstimate.total === null,
          });
        })
        .catch((cause) => {
          if (cancelled) return;
          setEstimate(null);
          track("calculator_error", { reason: "estimate" });
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
  }, [estimateKey, launchDate, moduleCodes, selectedType, sourceId]);

  const toggleModule = (id: string) => {
    markStart();
    track("calculator_option_select", { option: "module", value: id, checked: !moduleIds.has(id) });
    setModuleIds((prev: Set<string>) => {
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
    // Имя и почта обязательны: по почте человек сразу входит в личный кабинет и видит заявку.
    // Телефон — по желанию.
    (step === 3 && name.trim() !== "" && isEmail(email) && consent);

  const goTo = (nextStep: number) => {
    setStep(nextStep);
    // На мобиле карточка длинная — возвращаем к началу шага
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) goTo(step + 1);
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
      const sent = await submitSiteRequest({
        typeId,
        moduleIds: moduleCodes,
        launchOn: launchDate || null,
        sourceId,
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim() || null,
        comment:
          [comment.trim() ? `Комментарий: ${comment.trim()}` : "", "Калькулятор /raschet-stoimosti/", attributionNote()]
            .filter(Boolean)
            .join("\n") || null,
        consent,
      });
      setSubmitted(sent);
      track("calculator_lead_submit", { type: typeId ?? "", modules: moduleCodes.length });
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    } catch (cause) {
      track("calculator_error", { reason: "submit" });
      setError(cause instanceof Error ? cause.message : "Не удалось отправить заявку");
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      ref={rootRef}
      className={cn(styles.card, styles.inline)}
      aria-label="Калькулятор стоимости проекта"
      onSubmit={submit}
      id="calculator"
    >
        <h2 className={styles.title}>
          Соберите проект.{" "}
          <br className={styles.titleBreak} />
          Узнайте бюджет.
        </h2>
        <p className={styles.lead}>
          Стоимость видна сразу после выбора типа проекта, а контакты нужны, только чтобы
          прислать расчёт. Выбор сохраняется, пока вы на сайте.
        </p>

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
            <h3 className={styles.successTitle}>Заявка у нас</h3>
            <p className={styles.successText}>
              Менеджер свяжется с вами, уточнит детали и зафиксирует точную смету проекта.
            </p>
            <CabinetCodeStep sent={submitted} />
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
                  manual={activeEstimate !== null && activeEstimate.total === null}
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
                      onClick={() => handleProjectTypeChange(t.id)}
                    >
                      <img src={t.icon} alt="" width={32} height={32} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className={styles.optionGrid}>
                  {availableModules.map((m: ProjectModule) => {
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
                    onChange={(e) => {
                      setLaunchDate(e.target.value);
                      track("calculator_option_select", { option: "launch_date", value: e.target.value ? "set" : "empty" });
                    }}
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
                        onClick={() => {
                          track("calculator_option_select", { option: "source", value: s.id });
                          setSourceId(s.id);
                        }}
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
                  <label className={styles.fieldLabel} htmlFor="conf-email">
                    Почта — пришлём расчёт и вход в личный кабинет
                  </label>
                  <input
                    id="conf-email"
                    type="email"
                    className={styles.input}
                    placeholder="name@company.ru"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className={styles.fieldLabel} htmlFor="conf-phone">
                    Телефон (необязательно)
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
                  <label className={styles.fieldLabel} htmlFor="conf-comment">
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    id="conf-comment"
                    className={cn(styles.input, styles.textarea)}
                    rows={3}
                    maxLength={1500}
                    placeholder="Ссылка на текущий сайт, сроки, интеграции — всё, что важно"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      className={styles.consentBox}
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>
                      {/* Заявка сразу открывает личный кабинет: согласие — и с офертой, и на обработку данных. */}
                      Принимаю условия{" "}
                      <a href="/offer/" target="_blank" rel="noopener" className={styles.policyLink}>
                        оферты
                      </a>{" "}
                      и согласен на обработку персональных данных.{" "}
                      <PolicyInlineLink />
                    </span>
                  </label>
                  {error ? <p className={styles.error}>{error}</p> : null}
                </div>
              )}

              <div className={styles.actions}>
                {step > 0 && (
                  <button type="button" className={styles.backBtn} onClick={() => goTo(step - 1)}>
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
                manual={activeEstimate !== null && activeEstimate.total === null}
                priceAvailable={priceAvailable}
                pending={estimating}
                error={activeEstimateError}
              />
            </div>
          </div>
        )}
      {matchedCases.length > 0 && !submitted ? (
        <div className={styles.cases}>
          <p className={styles.casesTitle}>Похожие проекты, которые мы делали</p>
          <div className={styles.casesGrid}>
            {matchedCases.map((c) => (
              <CaseCard key={c.slug} item={c} compact />
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}

// Ссылка на политику внутри согласия: текст документа живёт в «Глори.Штат» и открывается страницей.
function PolicyInlineLink() {
  return (
    <a className={styles.policyLink} href="/privacy/" target="_blank" rel="noopener">
      Политика конфиденциальности
    </a>
  );
}
