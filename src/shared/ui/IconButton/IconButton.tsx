import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib";
import { Icon, type IconName } from "@/shared/ui/Icon";
import styles from "./IconButton.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Доступное название действия. */
  label: string;
  size?: number;
}

// Квадратная иконочная кнопка со светло-красной подложкой (из UI-кита).
export function IconButton({
  icon,
  label,
  size = 22,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(styles.iconButton, className)}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}
