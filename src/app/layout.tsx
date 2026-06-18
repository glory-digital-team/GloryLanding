import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "./providers";
import { Analytics } from "@/shared/analytics";
import { siteConfig } from "@/shared/config";
import "./styles/index.scss";

const siteUrl = new URL("https://xn--c1akimk.digital");
const previewImage = {
  url: "/og-image-v2.png",
  width: 1200,
  height: 630,
  alt: siteConfig.name,
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: siteConfig.name,
  description: siteConfig.description,
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
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [previewImage],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [previewImage.url],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AppProviders>{children}</AppProviders>
        <Analytics />
        {/* Yandex.Metrika + Top.Mail.Ru без JS — пиксели-фоллбэки (issue #9) */}
        {/* Пиксели-фоллбэки счётчиков: в <noscript> нужен голый <img>,
            next/image тут неприменим. */}
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
              alt="Top.Mail.Ru"
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
