import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Наши проекты | Глори.Цифра",
  description: "Портфолио проектов Глори.Цифра: веб-разработка, дизайн, AI-решения",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
