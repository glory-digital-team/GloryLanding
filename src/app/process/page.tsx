import type { Metadata } from "next";
import { pageContent } from "@/shared/content";
import { buildMetadata } from "@/shared/lib/seo";
import { ProcessPage } from "@/views/process";

const page = pageContent("/process/");

export const metadata: Metadata = buildMetadata({ path: "/process/", title: page.title, description: page.description });

export default function Page() {
  return <ProcessPage />;
}
