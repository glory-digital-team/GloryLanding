/**
 * Глобальная конфигурация сайта «Глори.Цифра».
 * Единый источник правды для названия, описания, навигации и реквизитов.
 */
export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Глори.Цифра",
  tagline: "Цифровые решения для вашего бизнеса",
  description:
    "Глори.Цифра — цифровые продукты для бизнеса: сайты, лендинги, автоматизация и AI-решения с прозрачной ценой.",
  nav: [
    { label: "Направления", href: "#services" },
    { label: "Портфолио", href: "#portfolio" },
    { label: "Частые вопросы", href: "#faq" },
  ] satisfies NavItem[],
  // Нижняя навигация в футере
  footerNav: [
    { label: "Направления", href: "#services" },
    { label: "Кейсы", href: "#portfolio" },
    { label: "Начать проект", href: "#lead-form" },
  ] satisfies NavItem[],
  contacts: {
    phone: "8 (964) 638-04-80",
    phoneHref: "tel:+79646380480",
    email: "goshaf01@ya.ru",
    emailHref: "mailto:goshaf01@ya.ru",
  },
  socials: [
    { label: "ВКонтакте", href: "https://vk.com/", icon: "vk" as const },
    { label: "Telegram", href: "https://t.me/", icon: "telegram" as const },
  ],
  // Бейджи-мессенджеры рядом с контактами (Figma: #1F2937)
  messengers: ["Telegram", "MAX"],
  requisites: [
    "ИП Фомкин Георгий Андреевич",
    "ИНН: 771471030731",
    "ОГРНИП: 325774600762382",
  ],
  legal: [
    { label: "Политика конфиденциальности", href: "#" },
    { label: "Оферта", href: "#" },
    { label: "Согласие на обработку ПДн", href: "#" },
  ],
  copyright: "© 2026 Глори.Цифра",
} as const;
