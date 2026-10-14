import type { Metadata } from "next";
import { platformDocument } from "@/shared/platform/server";
import { PlatformDocumentPage, PlatformDocumentUnavailable } from "@/views/platform-document";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — Глори.Цифра",
  description:
    "Согласие на обработку персональных данных для заявок, откликов и личного кабинета Глори.Цифра.",
  alternates: {
    canonical: "/consent/",
  },
};

// Текст ведётся только в «Глори.Штат» (подпроект 12); своей копии на сайте нет.
export const revalidate = 300;

export default async function Page() {
  const document = await platformDocument("pd_consent");
  return document === null ? <PlatformDocumentUnavailable /> : <PlatformDocumentPage document={document} />;
}
