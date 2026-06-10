import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Icon, type IconName } from "@/shared/ui/Icon";
import styles from "./Card.module.scss";

interface CardProps {
  icon?: IconName;
  title: string;
  children: ReactNode;
  className?: string;
}

// Карточка с иконкой, заголовком и описанием (компонент «Card» из UI-кита).
export function Card({ icon = "shield-check", title, children, className }: CardProps) {
  return (
    <article className={cn(styles.card, className)}>
      <span className={styles.iconWrap}>
        <Icon name={icon} size={22} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{children}</p>
    </article>
  );
}
