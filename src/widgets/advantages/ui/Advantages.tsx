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
    text: "Вы видите цену каждого этапа до старта работ. Никаких скрытых наценок и доплат в процессе.",
    large: true,
  },
  {
    icon: "target",
    title: "Чем точнее задача — тем выгоднее",
    text: "Конкретные ожидания на старте позволяют зафиксировать бюджет. Это ваша защита от доплат и гарантия предсказуемого результата в оговоренные сроки.",
  },
  {
    icon: "target",
    title: "Всё в едином пространстве",
    text: "Задачи, правки и документы хранятся в одном месте. Вы всегда видите актуальный статус проекта.",
  },
  {
    icon: "grid",
    title: "Продукт растёт вместе с вами",
    text: "Цифровые решения должны эволюционировать. Поэтому мы предлагаем подписку на развитие",
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
              Никакого хаоса. <br className={styles.brMobile} />
              Только результат.
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
