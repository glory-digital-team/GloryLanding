import type { CaseLogEntry } from "@/entities/case";
import styles from "./CaseLog.module.scss";

interface CaseLogProps {
  entries: CaseLogEntry[];
  project: string;
}

// «Как мы создавали» — бортовой журнал проекта в стиле ленты личного кабинета:
// каждая запись — смена статуса, решение и почему оно принято.
export function CaseLog({ entries, project }: CaseLogProps) {
  if (!entries.length) return null;
  return (
    <section className={styles.section} aria-labelledby="case-log-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>Бортовой журнал</p>
          <h2 className={styles.title} id="case-log-title">
            Как мы создавали проект
          </h2>
          <p className={styles.lead}>
            Ключевые решения по статусам — так же, как клиент видит движение проекта в личном
            кабинете.
          </p>
        </header>

        <ol className={styles.feed}>
          {entries.map((e, i) => (
            <li key={e.status + e.title} className={styles.entry}>
              <div className={styles.meta}>
                <span className={styles.idx}>#{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.status}>{e.status}</span>
              </div>
              <div className={styles.card}>
                <span className={styles.project} aria-hidden="true">
                  {project}
                </span>
                <h3 className={styles.entryTitle}>{e.title}</h3>
                <p className={styles.entryText}>{e.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
