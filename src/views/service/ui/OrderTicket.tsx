import { cn } from "@/shared/lib";
import styles from "./OrderTicket.module.scss";

// Статусы, которые клиент видит в личном кабинете — тот же язык, что на /process/.
export const PROJECT_STATUSES = [
  "Заявка",
  "Разбор задачи",
  "Объём и оценка",
  "Прототип",
  "Разработка",
  "QA и запуск",
  "Развитие",
];

interface OrderTicketProps {
  service: string;
  outcomes: string[];
  /** Активный статус в «демо»-тикете. */
  active?: number;
}

// Визуал первого экрана услуги: «карточка заказа» из личного кабинета.
// Отражает главное УТП — каждый этап проекта виден как статус заказа.
// Декоративен по смыслу, но текст реальный (не картинка), поэтому вынесен в aside.
export function OrderTicket({ service, outcomes, active = 1 }: OrderTicketProps) {
  return (
    <figure className={styles.ticket}>
      <figcaption className={styles.caption}>Так проект выглядит в личном кабинете</figcaption>
      <div className={styles.card}>
        <div className={styles.top}>
          <span className={styles.kind}>Проект</span>
          <span className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {PROJECT_STATUSES[active]}
          </span>
        </div>
        <p className={styles.name}>{service}</p>

        <ol className={styles.track}>
          {PROJECT_STATUSES.map((s, i) => (
            <li
              key={s}
              className={cn(styles.step, i < active && styles.done, i === active && styles.current)}
              style={{ ["--i" as string]: i }}
            >
              <span className={styles.mark} aria-hidden="true" />
              <span className={styles.stepLabel}>{s}</span>
            </li>
          ))}
        </ol>

        {outcomes.length ? (
          <div className={styles.outcomes}>
            <span className={styles.outcomesTitle}>Что получите</span>
            <ul>
              {outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={styles.perf} aria-hidden="true">
          <span className={styles.perfCut} />
        </div>
        <div className={styles.bottom}>
          <span>Смета — до старта</span>
          <span>Этапы — с приёмкой</span>
        </div>
      </div>
    </figure>
  );
}
