/**
 * Глобальная конфигурация сайта «Глори.Цифра».
 * Единый источник правды для названия, описания, навигации и реквизитов.
 */
export interface NavItem {
  label: string;
  href: string;
}

export interface SocialItem {
  label: string;
  href: string;
  src: string;
  hidden: boolean;
}

export const siteConfig = {
  name: "Глори.Цифра",
  tagline: "Цифровые решения для вашего бизнеса",
  description:
    "Глори.Цифра — цифровые продукты для бизнеса: сайты, лендинги, автоматизация и AI-решения с прозрачной ценой.",
  /** Канонический origin (punycode «глори.digital»): canonical, sitemap, schema, OG. */
  url: "https://xn--c1akimk.digital",
  /** Человекочитаемый домен для текстов. */
  domain: "глори.digital",
  // Главное меню (ТЗ §2.2): Услуги открывают mega-menu, остальное — обычные ссылки.
  nav: [
    { label: "Услуги", href: "/services/" },
    { label: "Кейсы", href: "/cases/" },
    { label: "Как работаем", href: "/process/" },
    { label: "О компании", href: "/about/" },
    { label: "Команда", href: "/careers/" },
  ] satisfies NavItem[],
  /** Главный CTA шапки — отдельная страница калькулятора. */
  primaryCta: { label: "Рассчитать проект", href: "/raschet-stoimosti/" },
  footerNav: [
    { label: "Услуги", href: "/services/" },
    { label: "Кейсы", href: "/cases/" },
    { label: "Как работаем", href: "/process/" },
    { label: "О компании", href: "/about/" },
    { label: "Команда", href: "/careers/" },
    { label: "Контакты", href: "/contacts/" },
    { label: "Рассчитать проект", href: "/raschet-stoimosti/" },
  ] satisfies NavItem[],
  footerNavMobile: [
    { label: "Услуги", href: "/services/" },
    { label: "Кейсы", href: "/cases/" },
    { label: "Рассчитать проект", href: "/raschet-stoimosti/" },
    { label: "Контакты", href: "/contacts/" },
  ] satisfies NavItem[],
  // Личный кабинет клиента на том же домене (платформа Глори): вход по коду из письма.
  // `status` отвечает только «вошёл / не вошёл» — cookie кабинета лендингу не видна.
  cabinet: {
    href: "/cabinet/",
    status: "/cabinet/api/status",
  },
  contacts: {
    phone: "8 (993) 898-04-80",
    phoneHref: "tel:+79938980480",
    email: "info@глори.digital",
    // IDN-домен в mailto — через punycode, чтобы ссылка работала везде
    emailHref: "mailto:info@xn--c1akimk.digital",
  },
  // Цветные иконки соцсетей (Figma 270:595, выгружены в /public/socials)
  socials: [
    {
      label: "ВКонтакте",
      href: "https://vk.ru/glorydigit",
      src: "/socials/vk.svg",
      hidden: false,
    },
    {
      label: "Telegram",
      href: "https://t.me/+k7aQU8zvtp9jNTEy",
      src: "/socials/telegram.svg",
      hidden: false,
    },
    { label: "MAX", href: "https://max.ru/", src: "/socials/max.svg", hidden: true },
  ] satisfies SocialItem[],
  requisites: ["ИП Фомкин Георгий Андреевич", "ИНН: 771471030731", "ОГРНИП: 325774600762382"],
  legal: [
    { label: "Политика конфиденциальности", href: "/privacy/", doc: "policy" },
    { label: "Рамочная оферта", href: "/offer/", doc: null },
    { label: "Согласие на обработку ПДн", href: "/consent/", doc: null },
    { label: "Документы", href: "/documents/", doc: null },
  ],
  copyright: "© 2026 Глори.Цифра",
  /** География (ТЗ §6.2 / аудит §2.5): Москва + удалённо по России. */
  areaServed: ["Москва", "Россия"],
} as const;
