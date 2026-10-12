import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "./providers";
import { Analytics, AnalyticsEvents } from "@/shared/analytics";
import { JsonLd } from "@/shared/components/JsonLd";
import { siteConfig } from "@/shared/config";
import { ORGANIZATION_REF, buildMetadata } from "@/shared/lib/seo";
import "./styles/index.scss";

// Единый граф сущностей (ТЗ §3.5): Organization с @id, на который ссылаются Service,
// Article и ContactPage на внутренних страницах. Без фиктивного SearchAction — поиска нет.
const organizationSchema = {
  "@type": "Organization",
  "@id": ORGANIZATION_REF["@id"],
  name: siteConfig.name,
  alternateName: ["Глори Цифра", "Glory Digital", siteConfig.domain],
  description: siteConfig.description,
  url: `${siteConfig.url}/`,
  logo: `${siteConfig.url}/icon-512.png`,
  image: `${siteConfig.url}/og/home.png`,
  telephone: "+7-993-898-04-80",
  email: "info@xn--c1akimk.digital",
  // Город офиса не указываем, пока адрес не подтверждён и не совпадает с Яндекс Бизнесом
  address: { "@type": "PostalAddress", addressCountry: "RU" },
  areaServed: [
    { "@type": "City", name: "Москва" },
    { "@type": "Country", name: "Россия" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+7-993-898-04-80",
    email: "info@xn--c1akimk.digital",
    availableLanguage: ["ru"],
    areaServed: "RU",
  },
  knowsAbout: [
    "Разработка сайтов",
    "Веб-приложения",
    "Автоматизация бизнес-процессов",
    "CRM",
    "Интеграции",
    "AI-ассистенты",
    "RAG",
    "UX/UI-дизайн",
    "SEO",
  ],
  sameAs: siteConfig.socials.filter((s) => !s.hidden).map((s) => s.href),
};

const webSiteSchema = {
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: `${siteConfig.url}/`,
  inLanguage: "ru",
  publisher: ORGANIZATION_REF,
};

const base = buildMetadata({
  path: "/",
  title: "Сайты, автоматизация и AI для бизнеса | Глори.Цифра",
  description:
    "Разрабатываем сайты, цифровые продукты, системы автоматизации и AI-решения для бизнеса. Прозрачная оценка, понятные этапы, кейсы и поддержка после запуска.",
});

export const metadata: Metadata = {
  ...base,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  // Вне продакшена (превью-стенды) — не индексировать
  robots: process.env.NODE_ENV === "production" ? base.robots : { index: false, follow: false },
  // Фавикон «Глори.Цифра» (issue #8): SVG для современных браузеров,
  // PNG-fallback 16/32 и apple-touch-icon 180 для iOS.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
        <Analytics />
        <AnalyticsEvents />
        {/* Пиксели-фоллбэки счётчиков: в <noscript> нужен голый <img>, next/image тут неприменим. */}
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/109943467"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://top-fwz1.mail.ru/counter?id=3774073;js=na"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
