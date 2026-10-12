import type { Metadata } from "next";
import { buildMetadata } from "@/shared/lib/seo";
import { DocumentsPage } from "@/views/documents";

export const metadata: Metadata = buildMetadata({
  path: "/documents/",
  title: "Документы — Глори.Цифра",
  description: "Юридические документы Глори.Цифра: политика конфиденциальности, рамочная оферта и оферта на подписку.",
});

export default function Page() {
  return <DocumentsPage />;
}
