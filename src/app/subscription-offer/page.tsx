import type { Metadata } from "next";
import { platformDocument } from "@/shared/platform/server";
import { PlatformDocumentPage } from "@/views/platform-document";
import { SubscriptionOfferPage } from "@/views/offer";

export const metadata: Metadata = {
  title: "Оферта на подписку — Глори.Цифра",
  description:
    "Оферта Глори.Цифра на оказание услуг по технической поддержке и сопровождению цифровых решений.",
  alternates: {
    canonical: "/subscription-offer/",
  },
};

// Текст ведётся в «Глори.Штат» (подпроект 12); пока там нет опубликованной версии — встроенный.
export const revalidate = 300;

export default async function Page() {
  const document = await platformDocument("subscription_offer");
  return document === null ? (
    <SubscriptionOfferPage />
  ) : (
    <PlatformDocumentPage document={document} />
  );
}
