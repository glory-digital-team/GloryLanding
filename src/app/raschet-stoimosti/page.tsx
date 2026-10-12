import type { Metadata } from "next";
import { pageContent } from "@/shared/content";
import { buildMetadata } from "@/shared/lib/seo";
import { CalculatorPage } from "@/views/calculator";

const page = pageContent("/raschet-stoimosti/");

export const metadata: Metadata = buildMetadata({ path: "/raschet-stoimosti/", title: page.title, description: page.description });

export default function Page() {
  return <CalculatorPage />;
}
