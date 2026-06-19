import type { Metadata } from "next";
import { siteConfig } from "@/shared/config";
import { HomePage } from "@/views/home";
import { ConfigAutoOpen } from "./ConfigAutoOpen";

export const metadata: Metadata = {
  title: `Конфигуратор | ${siteConfig.name}`,
  description: "Откройте конфигуратор проекта и получите предварительный бюджет.",
};

export default function ConfigPage() {
  return (
    <>
      <HomePage />
      <ConfigAutoOpen />
    </>
  );
}
