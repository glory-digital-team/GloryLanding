import type { Metadata } from "next";
import { platformDocument } from "@/shared/platform/server";
import { PlatformDocumentPage } from "@/views/platform-document";
import { OfferPage } from "@/views/offer";

export const metadata: Metadata = {
  title: "Рамочная оферта — Глори.Цифра",
  description:
    "Рамочная оферта Глори.Цифра на оказание услуг в сфере разработки, дизайна, автоматизации и сопровождения цифровых решений.",
  alternates: {
    canonical: "/offer/",
  },
};

// Текст ведётся в «Глори.Штат» (подпроект 12); пока там нет опубликованной версии — встроенный.
export const revalidate = 300;

export default async function Page() {
  const document = await platformDocument("offer");
  return document === null ? <OfferPage /> : <PlatformDocumentPage document={document} />;
}
