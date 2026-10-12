import type { Metadata } from "next";
import { pageContent } from "@/shared/content";
import { buildMetadata } from "@/shared/lib/seo";
import { CasesHubPage } from "@/views/cases";

const page = pageContent("/cases/");

export const metadata: Metadata = buildMetadata({ path: "/cases/", title: page.title, description: page.description });

export default function Page() {
  return <CasesHubPage />;
}
