import type { Metadata } from "next";
import { buildMetadata } from "@/shared/lib/seo";
import { DiagnosticPage, diagnosticSeo } from "@/views/diagnostic";

// Страницы нет в реестре pages.data.ts (генерируется из «ядро.xlsx»), поэтому title
// и description берём из контента среза — как на /careers/.
export const metadata: Metadata = buildMetadata({
  path: "/diagnostic/",
  title: diagnosticSeo.title,
  description: diagnosticSeo.description,
});

export default function Page() {
  return <DiagnosticPage />;
}
