import type { Metadata } from "next";
import { PrivacyPage } from "@/views/privacy";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Глори.Цифра",
  description:
    "Политика в отношении обработки персональных данных ИП Фомкина Г. А. (Глори.Цифра).",
};

export default function Page() {
  return <PrivacyPage />;
}
