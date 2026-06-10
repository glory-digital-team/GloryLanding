import type { SVGProps } from "react";

// Набор иконок UI-кита «Глори.Цифра» (line-style, stroke=currentColor).
// Соответствует ряду иконок на странице UI-kit в Figma:
// apps, check-circle, file, globe, chevron-up/down/left/right + shield-check, arrow-right.
export type IconName =
  | "apps"
  | "check-circle"
  | "file"
  | "globe"
  | "chevron-up"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "arrow-right"
  | "shield-check"
  | "telegram"
  | "whatsapp";

export const ICON_NAMES: IconName[] = [
  "apps",
  "check-circle",
  "file",
  "globe",
  "chevron-up",
  "chevron-down",
  "chevron-right",
  "chevron-left",
];

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  apps: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
    </>
  ),
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "arrow-right": (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  "shield-check": (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
      <path d="m9 12 2 2 4-4.5" />
    </>
  ),
  telegram: <path d="M21.5 4.3 2.9 11.5c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.4c.2.7 1.1.9 1.6.3l2.5-2.6 4.8 3.5c.6.4 1.5.1 1.7-.7l3.2-15c.2-.9-.7-1.7-1.5-1.4ZM8.9 14.3l8.6-5.6c.3-.2.6.2.4.4l-7 6.6c-.2.2-.4.5-.4.8l-.3 2.2-1.3-4.4Z" />,
  whatsapp: (
    <>
      <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" />
      <path d="M8.5 8.5c-.3 1 .2 2.2 1.2 3.4s2.2 1.9 3.3 1.6c.6-.2.9-.8 1-1.3.1-.3-.1-.5-.3-.7l-1-.6c-.3-.2-.6-.1-.8.1l-.3.4c-.6-.2-1.2-.8-1.5-1.5l.4-.3c.2-.2.3-.5.1-.8l-.6-1c-.2-.3-.5-.4-.8-.3-.5.1-.9.5-1.1 1z" />
    </>
  ),
};

export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
