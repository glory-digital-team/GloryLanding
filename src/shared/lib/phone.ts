/**
 * Прогрессивное форматирование российского номера телефона
 * в маску «+7 (XXX) XXX-XX-XX» по мере ввода.
 */
export function formatRuPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // Нормализуем первую цифру: 8/7 в начале — код страны
  if (digits.startsWith("8") || digits.startsWith("7")) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);

  if (!digits.length) return "";

  let out = "+7";
  out += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 4) out += `) ${digits.slice(3, 6)}`;
  if (digits.length >= 7) out += `-${digits.slice(6, 8)}`;
  if (digits.length >= 9) out += `-${digits.slice(8, 10)}`;
  return out;
}

/** Телефон заполнен полностью (10 цифр после кода страны). */
export function isCompleteRuPhone(value: string): boolean {
  return value.replace(/\D/g, "").replace(/^[78]/, "").length === 10;
}
