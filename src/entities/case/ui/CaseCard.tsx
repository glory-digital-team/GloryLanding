/* eslint-disable @next/next/no-img-element */
import { cn } from "@/shared/lib";
import { caseHref } from "../model/helpers";
import type { CaseStudy, CaseVisual } from "../model/types";
import styles from "./CaseCard.module.scss";

const CARD_CLASS: Record<CaseVisual, string> = {
  govori: styles.cardBlue,
  esis: styles.cardLight,
  tienda: styles.cardGreen,
  parus: styles.cardClubParus,
  lunes: styles.cardDark,
};

/** Слои обложки — точные позиции из Figma; все картинки декоративные (alt=""). */
function Cover({ visual }: { visual: CaseVisual }) {
  switch (visual) {
    case "govori":
      return (
        <span className={styles.imageGovori} aria-hidden="true">
          <img src="/portfolio/ii-govori.png" alt="" loading="lazy" decoding="async" />
        </span>
      );
    case "esis":
      return <img className={styles.imageEsis} src="/portfolio/esis.png" alt="" loading="lazy" decoding="async" />;
    case "tienda":
      return (
        <img className={styles.imageTienda} src="/portfolio/tienda-logo.svg" alt="" loading="lazy" decoding="async" />
      );
    case "parus":
      return (
        <img className={styles.imageClubParus} src="/portfolio/logo-parus.png" alt="" loading="lazy" decoding="async" />
      );
    case "lunes":
      return (
        <>
          <span className={styles.lunesTexture} aria-hidden="true" />
          <img className={styles.lunesScript} src="/portfolio/lunes-script.png" alt="" loading="lazy" decoding="async" />
          <img className={styles.lunesMoon} src="/portfolio/lunes-moon.png" alt="" loading="lazy" decoding="async" />
        </>
      );
  }
}

interface CaseCardProps {
  item: CaseStudy;
  /** Уровень заголовка карточки: h3 внутри секции, h2 в каталоге. */
  headingLevel?: "h2" | "h3";
  compact?: boolean;
}

// Карточка кейса: всегда ведёт на внутреннюю страницу /cases/<slug>/ (аудит §1.4.2),
// ссылка на живой продукт — уже внутри кейса.
export function CaseCard({ item, headingLevel = "h3", compact }: CaseCardProps) {
  const Heading = headingLevel;
  const blur = item.visual !== "govori" && item.visual !== "lunes";
  return (
    <a
      className={cn(styles.card, CARD_CLASS[item.visual], compact && styles.compact)}
      href={caseHref(item)}
      data-cta={`case_card_${item.slug}`}
    >
      <Cover visual={item.visual} />

      <div className={styles.tags}>
        {item.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={cn(styles.text, blur && styles.textBlur)}>
        <Heading className={styles.cardTitle}>{item.name}</Heading>
        <p className={styles.cardSubtitle}>{item.subtitle}</p>
        <span className={styles.more}>
          <span>{item.industry}</span>
          <span className={styles.moreArrow} aria-hidden="true">
            Читать кейс →
          </span>
        </span>
      </div>
    </a>
  );
}
