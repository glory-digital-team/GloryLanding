import type { Metadata } from "next";
import { pageContent } from "@/shared/content";
import { buildMetadata } from "@/shared/lib/seo";
import { ContactsPage } from "@/views/contacts";

const page = pageContent("/contacts/");

export const metadata: Metadata = buildMetadata({ path: "/contacts/", title: page.title, description: page.description });

export default function Page() {
  return <ContactsPage />;
}
