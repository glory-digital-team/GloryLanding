import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Icon, type IconName } from "@/shared/ui/Icon";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "dark";
export type ButtonSize = "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Иконка слева от текста. */
  iconLeft?: IconName;
  /** Иконка справа от текста. */
  iconRight?: IconName;
  /** Спокойный hover без перекраски — для secondary рядом с красной primary. */
  calm?: boolean;
  children: ReactNode;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  calm,
  className,
  children,
  ...rest
}: ButtonProps) {
  const iconSize = size === "lg" ? 20 : 18;
  const classes = cn(styles.button, styles[variant], styles[size], calm && styles.calm, className);

  const content = (
    <>
      {iconLeft && <Icon name={iconLeft} size={iconSize} className={styles.icon} />}
      <span className={styles.label}>{children}</span>
      {iconRight && <Icon name={iconRight} size={iconSize} className={styles.icon} />}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
