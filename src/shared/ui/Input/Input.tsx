import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { cn } from "@/shared/lib";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

// Текстовое поле с опциональной подписью (как в UI-ките «Email»).
export function Input({ label, className, id, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input id={inputId} className={styles.input} {...rest} />
    </div>
  );
}
