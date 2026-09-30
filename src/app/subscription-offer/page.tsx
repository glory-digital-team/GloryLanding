import type { Metadata } from "next";
import { SubscriptionOfferPage } from "@/views/offer";

export const metadata: Metadata = {
  title: "Оферта на подписку — Глори.Цифра",
  description:
    "Оферта Глори.Цифра на оказание услуг по технической поддержке и сопровождению цифровых решений.",
  alternates: {
    canonical: "/subscription-offer",
  },
};

export default function Page() {
  return <SubscriptionOfferPage />;
}
