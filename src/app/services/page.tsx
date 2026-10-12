import type { Metadata } from "next";
import { pageContent } from "@/shared/content";
import { buildMetadata } from "@/shared/lib/seo";
import { ServicesPage } from "@/views/services";

const page = pageContent("/services/");

export const metadata: Metadata = buildMetadata({ path: "/services/", title: page.title, description: page.description });

export default function Page() {
  return <ServicesPage />;
}
