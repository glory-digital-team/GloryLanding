"use client";

import { useId, useMemo, useSyncExternalStore } from "react";
import { cn } from "@/shared/lib";
import { Input } from "@/shared/ui/Input";
import styles from "./LeadForm.module.scss";

/** A/B-тест выбора времени: чипы «день + интервал» против обычного поля даты и времени. */
export const CALL_TIME_EXPERIMENT = "call_time_picker";
export const CALL_TIME_VARIANTS = ["chips", "native"] as const;
export type CallTimeVariant = (typeof CALL_TIME_VARIANTS)[number];

/** Интервалы по Москве. Часы работы менеджеров не подтверждены: сверить с командой. */
const TIME_SLOTS = ["10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00"];
const DAYS_AHEAD = 5;

export interface CallTime {
  day: string;
  time: string;
}

interface Day {
  key: string;
  short: string;
  long: string;
}

/** Ближайшие рабочие дни, начиная с завтрашнего. Праздники не учитываются. */
function nextWorkdays(count: number): Day[] {
  const days: Day[] = [];
  const date = new Date();
  while (days.length < count) {
    date.setDate(date.getDate() + 1);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue;
    days.push({
      key: date.toISOString().slice(0, 10),
      short: date
        .toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" })
        .replace(".", ""),
      long: date.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }),
    });
  }
  return days;
}

/** Строка для комментария менеджеру: «вторник, 28 октября, 14:00–16:00 по Москве». */
export function callTimeNote(value: CallTime): string {
  if (!value.day && !value.time) return "";
  const parts = [value.day, value.time ? `${value.time} по Москве` : ""].filter(Boolean).join(", ");
  let zone = "";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (value.time && tz && tz !== "Europe/Moscow") zone = ` (часовой пояс клиента: ${tz})`;
  } catch {
    // часовой пояс не определился — без него
  }
  return `Удобное время для разговора: ${parts}${zone}`;
}

const noopSubscribe = () => () => {};

function clientTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

/** `YYYY-MM-DDTHH:mm` из поля datetime-local → дата в часовом поясе браузера. */
export function parseLocalDateTime(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Строка для менеджера из поля даты и времени: время переводим в московское. */
export function nativeCallTimeNote(value: string): string {
  const date = parseLocalDateTime(value);
  if (!date) return "";
  const fmt = (timeZone?: string) =>
    date.toLocaleString("ru-RU", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  const tz = clientTimeZone();
  const local = tz && tz !== "Europe/Moscow" ? ` (у клиента ${fmt()}, ${tz})` : "";
  return `Удобное время для разговора: ${fmt("Europe/Moscow")} по Москве${local}`;
}

/** Завтра 00:00 в формате datetime-local: раньше выбрать нельзя. */
function tomorrowMin(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00`;
}

interface CallTimePickerProps {
  value: CallTime;
  onChange: (value: CallTime) => void;
}

// Выбор удобного дня и времени для разговора: два тапа, без календаря.
// Это пожелание клиента, а не бронь: менеджер подтверждает время сам.
// Дни считаются в браузере: страница статическая, дата сборки устареет.
export function CallTimePicker({ value, onChange }: CallTimePickerProps) {
  // На сервере (статическая сборка) дней нет, в браузере — от сегодняшней даты.
  const inBrowser = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const days = useMemo(() => (inBrowser ? nextWorkdays(DAYS_AHEAD) : []), [inBrowser]);
  const dayLabel = useId();
  const timeLabel = useId();

  return (
    <div className={styles.picker}>
      <p className={styles.taskLabel}>Когда удобно поговорить — по желанию</p>

      <div className={styles.slots} role="group" aria-labelledby={dayLabel}>
        <span id={dayLabel} className={styles.srOnly}>
          День
        </span>
        {days.map((d) => {
          const on = value.day === d.long;
          return (
            <button
              key={d.key}
              type="button"
              className={cn(styles.slot, on && styles.slotOn)}
              aria-pressed={on}
              aria-label={d.long}
              onClick={() => onChange({ ...value, day: on ? "" : d.long })}
            >
              {d.short}
            </button>
          );
        })}
      </div>

      <div className={styles.slots} role="group" aria-labelledby={timeLabel}>
        <span id={timeLabel} className={styles.srOnly}>
          Время по Москве
        </span>
        {TIME_SLOTS.map((t) => {
          const on = value.time === t;
          return (
            <button
              key={t}
              type="button"
              className={cn(styles.slot, on && styles.slotOn)}
              aria-pressed={on}
              onClick={() => onChange({ ...value, time: on ? "" : t })}
            >
              {t}
            </button>
          );
        })}
      </div>

      <p className={styles.hint}>
        Время по Москве. Менеджер подтвердит его, когда свяжется с вами.
      </p>
    </div>
  );
}

interface NativeCallTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

// Вариант B: обычное поле даты и времени браузера. Время — в часовом поясе клиента,
// в комментарий менеджеру оно уходит в пересчёте на Москву.
export function NativeCallTimePicker({ value, onChange }: NativeCallTimePickerProps) {
  const inBrowser = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const min = useMemo(() => (inBrowser ? tomorrowMin() : undefined), [inBrowser]);

  return (
    <div className={styles.picker}>
      <Input
        label="Когда удобно поговорить — по желанию"
        type="datetime-local"
        min={min}
        step={900}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className={styles.hint}>
        Время по вашему часовому поясу. Менеджер подтвердит его, когда свяжется с вами.
      </p>
    </div>
  );
}
