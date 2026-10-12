import type { Metadata } from "next";
import { pageContent } from "@/shared/content";
import { buildMetadata } from "@/shared/lib/seo";
import { AboutPage } from "@/views/about";

const page = pageContent("/about/");

export const metadata: Metadata = buildMetadata({ path: "/about/", title: page.title, description: page.description });

export default function Page() {
  return <AboutPage />;
}
