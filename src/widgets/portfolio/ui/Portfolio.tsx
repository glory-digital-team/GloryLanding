"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/shared/lib";
import { CASES, CaseCard, caseHref } from "@/entities/case";
import { getService } from "@/entities/service";
import styles from "./Portfolio.module.scss";

interface PortfolioProps {
  title?: string;
  lead?: string;
}

// «Что уже сделали» — индекс проектов вместо сетки одинаковых плиток.
// Слева «реестр»: номер, проект, отрасль, направления — каждая строка ведёт на внутренний
// кейс /cases/<slug>/ (аудит §1.4.2). Справа — живое превью карточки, которое меняется
// при наведении/фокусе. На мобиле — лента карточек со scroll-snap.
export function Portfolio({
  title = "Что уже сделали",
  lead = "Каждый проект — это история: с чем пришёл клиент, что мы решили и как продукт живёт после запуска.",
}: PortfolioProps) {
  const [active, setActive] = useState(0);
  const current = CASES[active];

  return (
    <section className={styles.portfolio} id="cases" aria-labelledby="portfolio-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title} id="portfolio-title">
            {title}
          </h2>
          <p className={styles.lead}>{lead}</p>
        </header>

        <div className={styles.board}>
          <ol className={styles.index}>
            {CASES.map((c, i) => (
              <li key={c.slug}>
                <a
                  href={caseHref(c)}
                  className={cn(styles.row, i === active && styles.rowActive)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-cta={`portfolio_${c.slug}`}
                >
                  <span className={styles.num} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.rowMain}>
                    <span className={styles.rowName}>{c.name}</span>
                    <span className={styles.rowSub}>{c.subtitle}</span>
                  </span>
                  <span className={styles.rowMeta}>
                    {c.services.slice(0, 2).map((p) => (
                      <span key={p} className={styles.chip}>
                        {getService(p)?.navLabel ?? p}
                      </span>
                    ))}
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>

          {/* Превью — дублирующая ссылка, скрыта от скринридеров (строки реестра уже ведут туда же) */}
          <div className={styles.preview} aria-hidden="true">
            <div key={current.slug} className={styles.previewCard}>
              <CaseCard item={current} />
            </div>
            <p className={styles.previewSummary}>{current.summary}</p>
          </div>
        </div>

        {/* Мобильная лента */}
        <div className={styles.rail}>
          {CASES.map((c) => (
            <div key={c.slug} className={styles.railItem}>
              <CaseCard item={c} />
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href="/cases/" className={styles.all} data-cta="portfolio_all">
            Все кейсы
          </Link>
          <Link href="/raschet-stoimosti/" className={styles.calc} data-cta="portfolio_calc">
            Похожая задача? Рассчитайте стоимость →
          </Link>
        </div>
      </div>
    </section>
  );
}
