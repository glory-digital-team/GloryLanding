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
  // Навигация в футере: десктопный макет (191:411) и мобильный (273:5614) различаются
  footerNav: [
    { label: "Направления", href: "#services" },
    { label: "Портфолио", href: "#portfolio" },
    { label: "Частые вопросы", href: "#faq" },
  ] satisfies NavItem[],
  footerNavMobile: [
    { label: "Направления", href: "#services" },
    { label: "Кейсы", href: "#portfolio" },
    { label: "Начать проект", href: "#lead-form" },
  ] satisfies NavItem[],
  contacts: {
    phone: "8 (964) 638-04-80",
    phoneHref: "tel:+79646380480",
    email: "info@глори.digital",
    // IDN-домен в mailto — через punycode, чтобы ссылка работала везде
    emailHref: "mailto:info@xn--c1akimk.digital",
  },
  // Цветные иконки соцсетей (Figma 270:595, выгружены в /public/socials)
  socials: [
    { label: "ВКонтакте", href: "https://vk.com/", src: "/socials/vk.svg" },
    { label: "Telegram", href: "https://t.me/", src: "/socials/telegram.svg" },
    { label: "MAX", href: "https://max.ru/", src: "/socials/max.svg" },
  ],
  requisites: [
    "ИП Фомкин Георгий Андреевич",
    "ИНН: 771471030731",
    "ОГРНИП: 325774600762382",
  ],
  legal: [
    { label: "Политика конфиденциальности", href: "#", doc: "policy" },
    { label: "Оферта", href: "#", doc: null },
    { label: "Согласие на обработку ПДн", href: "#", doc: null },
  ],
  copyright: "© 2026 Глори.Цифра",
} as const;
