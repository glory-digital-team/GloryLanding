import { CardIcon, type CardIconName } from "./cardIcons";
import styles from "./Advantages.module.scss";

// Секция «Почему выбирают нас» (Figma «Cards» 155:1510).
interface Advantage {
  icon: CardIconName;
  title: string;
  text: string;
  /** Первая карточка макета крупнее: p28, иконка 32 в боксе 64 (202:433). */
  large?: boolean;
}

const ADVANTAGES: Advantage[] = [
  {
    icon: "shield",
    title: "Цена без сюрпризов",
    text: "Цену каждого этапа вы видите до старта работ. Скрытых наценок и доплат по ходу проекта нет.",
    large: true,
  },
  {
    icon: "target",
    title: "Чем точнее задача — тем выгоднее",
    text: "Когда ожидания понятны с самого начала, бюджет можно зафиксировать. Так вы защищены от доплат и получаете предсказуемый результат в оговорённые сроки.",
  },
  {
    icon: "grid",
    title: "Всё в едином пространстве",
    text: "Задачи, правки и документы хранятся в одном месте, и там же виден текущий статус проекта.",
  },
  {
    icon: "arrow-up-right",
    title: "Продукт растёт вместе с вами",
    text: "После запуска продукт нужно развивать, поэтому у нас есть подписка на развитие",
  },
];

export function Advantages() {
  return (
    <section className={styles.advantages}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>ПОЧЕМУ ВЫБИРАЮТ НАС</p>
          <div className={styles.heading}>
            <h2 className={styles.title}>
              Понятный процесс <br className={styles.brMobile} />и предсказуемый бюджет
            </h2>
            <p className={styles.subtitle}>
              Мы выстроили процесс так, чтобы вы всегда знали, что происходит
              <br className={styles.brDesktop} /> с вашим проектом{" "}
              <br className={styles.brMobile} />и деньгами.
            </p>
          </div>
        </header>

        <div className={styles.grid}>
          {ADVANTAGES.map((item) => (
            <article
              key={item.title}
              className={item.large ? `${styles.card} ${styles.cardLg}` : styles.card}
            >
              <span className={styles.iconWrap}>
                <CardIcon name={item.icon} size={item.large ? 32 : 24} />
              </span>
              <div className={styles.cardText}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
