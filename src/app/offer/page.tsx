import type { Metadata } from "next";
import { OfferPage } from "@/views/offer";

export const metadata: Metadata = {
  title: "Рамочная оферта — Глори.Цифра",
  description:
    "Рамочная оферта Глори.Цифра на оказание услуг в сфере разработки, дизайна, автоматизации и сопровождения цифровых решений.",
  alternates: {
    canonical: "/offer",
  },
};

export default function Page() {
  return <OfferPage />;
}
