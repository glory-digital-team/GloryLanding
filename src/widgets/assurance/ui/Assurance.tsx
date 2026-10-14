import Link from "next/link";
import styles from "./Assurance.module.scss";

const SYSTEMS = ["1С", "CRM", "ERP", "Платежи", "Базы данных", "Аналитика", "Внешние API"];
const HANDOVER = [
  "Репозиторий и доступы",
  "Техническая документация",
  "Схема окружений и интеграций",
  "Порядок работы с изменениями",
  "Условия NDA и дальнейшей поддержки",
];

// Два возражения B2B-клиента одним блоком (SEO-реестр, главная):
// «впишется ли в наши системы» и «что останется у нас после проекта».
export function Assurance() {
  return (
    <section className={styles.section} aria-label="Интеграции и передача результата">
      <div className={styles.inner}>
        <article className={styles.card}>
          <div className={styles.orbit} aria-hidden="true">
            <span className={styles.core}>Ваш продукт</span>
            {SYSTEMS.map((s, i) => (
              <span key={s} className={styles.sat} style={{ ["--i" as string]: i, ["--n" as string]: SYSTEMS.length }}>
                {s}
              </span>
            ))}
          </div>
          <h2 className={styles.title}>Встраиваемся в текущую инфраструктуру</h2>
          <p className={styles.text}>
            Новая система не должна создавать ещё один изолированный контур. При необходимости
            связываем её с 1С, CRM, ERP, платёжными сервисами, корпоративными базами данных,
            аналитикой и внешними API. До разработки фиксируем, где находится источник истины,
            какие данные передаются, что происходит при ошибке и кто видит статус обмена.
          </p>
          <Link href="/integracii/" className={styles.link}>
            Интеграции <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className={`${styles.card} ${styles.dark}`}>
          <h2 className={styles.title}>Что остаётся у клиента</h2>
          <p className={styles.text}>
            До старта стороны фиксируют, что входит в результат каждого этапа, как проходит приёмка
            и что передаётся после запуска. Конкретные юридические условия — только из утверждённого
            договора.
          </p>
          <ul className={styles.list}>
            {HANDOVER.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <Link href="/process/" className={styles.link}>
            Как проходит работа <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>
    </section>
  );
}
