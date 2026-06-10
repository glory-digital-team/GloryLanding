/**
 * Склейка CSS-классов с отбрасыванием falsy-значений.
 * Лёгкая замена библиотеки clsx — без лишних зависимостей.
 *
 * @example
 * cn(styles.btn, isActive && styles.active, variant && styles[variant])
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
