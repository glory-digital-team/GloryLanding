import type { Metadata } from "next";
import { buildMetadata } from "@/shared/lib/seo";
import { DIAGNOSTICS_SEO, DiagnosticsPage } from "@/views/diagnostics";

export const metadata: Metadata = buildMetadata(DIAGNOSTICS_SEO);

export default function Page() {
  return <DiagnosticsPage />;
}
