import Link from "next/link";
import { CaseCard, similarCases, type CaseStudy } from "@/entities/case";
import { getService } from "@/entities/service";
import styles from "./CaseRelated.module.scss";

// Хвост кейса: какие услуги задействованы (перелинковка кейс → услуга) и похожие проекты.
export function CaseRelated({ item }: { item: CaseStudy }) {
  const services = item.services.map((p) => getService(p)).filter((s) => s !== undefined);
  const similar = similarCases(item, 2);
  return (
    <section className={styles.section} aria-label="Связанные услуги и кейсы">
      <div className={styles.inner}>
        {services.length ? (
          <div className={styles.services}>
            <h2 className={styles.title}>Услуги в этом проекте</h2>
            <ul className={styles.chips}>
              {services.map((s) => (
                <li key={s.path}>
                  <a href={s.path} className={styles.chip}>
                    {s.navLabel} <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {similar.length ? (
          <div className={styles.similar}>
            <div className={styles.head}>
              <h2 className={styles.title}>Похожие проекты</h2>
              <Link href="/cases/" className={styles.all}>
                Все кейсы →
              </Link>
            </div>
            <div className={styles.grid}>
              {similar.map((c) => (
                <CaseCard key={c.slug} item={c} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
