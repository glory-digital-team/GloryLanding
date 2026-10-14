import type { Metadata } from "next";
import { platformDocument } from "@/shared/platform/server";
import { PlatformDocumentPage, PlatformDocumentUnavailable } from "@/views/platform-document";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Глори.Цифра",
  description:
    "Политика в отношении обработки персональных данных ИП Фомкина Г. А. (Глори.Цифра).",
  alternates: {
    canonical: "/privacy/",
  },
};

// Текст ведётся только в «Глори.Штат» (подпроект 12); своей копии на сайте нет.
export const revalidate = 300;

export default async function Page() {
  const document = await platformDocument("privacy_policy");
  return document === null ? <PlatformDocumentUnavailable /> : <PlatformDocumentPage document={document} />;
}
