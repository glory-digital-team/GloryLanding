import type { Metadata } from "next";
import { platformDocument } from "@/shared/platform/server";
import { CONSENT_FALLBACK, PlatformDocumentPage } from "@/views/platform-document";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных — Глори.Цифра",
  description:
    "Согласие на обработку персональных данных для заявок, откликов и личного кабинета Глори.Цифра.",
  alternates: {
    canonical: "/consent/",
  },
};

// Текст ведётся в «Глори.Штат» (подпроект 12); пока там нет опубликованной версии — встроенный.
export const revalidate = 300;

export default async function Page() {
  const document = (await platformDocument("pd_consent")) ?? CONSENT_FALLBACK;
  return <PlatformDocumentPage document={document} />;
}
