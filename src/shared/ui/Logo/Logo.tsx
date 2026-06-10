import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/shared/lib";
import styles from "./Logo.module.scss";

interface LogoProps {
  /** На тёмном фоне — светлый знак и текст. */
  invert?: boolean;
  /** Только фирменный знак, без словесной части. */
  markOnly?: boolean;
  /** Размер знака в px (по умолчанию 40, как в макете). */
  size?: number;
  /** Размер словесной части в px (header 32, footer 24). */
  wordSize?: number;
  className?: string;
}

// Логотип «Глори.Цифра»: фирменный знак (точный SVG из Figma) + словесная часть.
export function Logo({
  invert = false,
  markOnly = false,
  size = 40,
  wordSize = 24,
  className,
}: LogoProps) {
  const mark = invert ? "/logo-mark-light.svg" : "/logo-mark-dark.svg";

  return (
    <span className={cn(styles.logo, invert && styles.invert, className)}>
      <Image
        className={styles.mark}
        src={mark}
        alt="Глори.Цифра"
        width={size}
        height={size}
        priority
      />
      {!markOnly && (
        <span
          className={styles.word}
          style={{ "--logo-word-size": `${wordSize}px` } as CSSProperties}
        >
          Глори.Цифра
        </span>
      )}
    </span>
  );
}
