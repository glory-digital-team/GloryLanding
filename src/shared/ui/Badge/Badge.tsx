import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import styles from "./Badge.module.scss";

export type BadgeVariant = "dark" | "soft";
export type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: ReactNode;
}

// Бейдж-таблетка. По умолчанию тёмный (как в UI-ките).
export function Badge({
  variant = "dark",
  size = "md",
  className,
  children,
}: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], styles[size], className)}>
      {children}
    </span>
  );
}
