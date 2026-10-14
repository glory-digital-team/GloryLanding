import type { Metadata } from "next";
import { platformDocument } from "@/shared/platform/server";
import { PlatformDocumentPage } from "@/views/platform-document";
import { PrivacyPage } from "@/views/privacy";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Глори.Цифра",
  description: "Политика в отношении обработки персональных данных ИП Фомкина Г. А. (Глори.Цифра).",
  alternates: {
    canonical: "/privacy/",
  },
};

// Текст ведётся в «Глори.Штат» (подпроект 12); пока там нет опубликованной версии — встроенный.
export const revalidate = 300;

export default async function Page() {
  const document = await platformDocument("privacy_policy");
  return document === null ? <PrivacyPage /> : <PlatformDocumentPage document={document} />;
}
