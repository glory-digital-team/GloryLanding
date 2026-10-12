import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASES, caseHref, getCase } from "@/entities/case";
import { buildMetadata } from "@/shared/lib/seo";
import { JsonLd } from "@/shared/components/JsonLd";
import { CaseStudyPage, ClubParusCasePage, caseSchema } from "@/views/cases";

// Кейсы: /cases/<slug>/. Черновики (status: draft) доступны по ссылке, но noindex
// и вне sitemap, пока бизнес не подтвердит задачу, роль, результаты и разрешение клиента.
export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getCase((await params).slug);
  if (!item) return {};
  return buildMetadata({
    path: caseHref(item),
    title: item.title,
    description: item.description,
    type: "article",
    noindex: item.status !== "published",
  });
}

export default async function Page({ params }: Props) {
  const item = getCase((await params).slug);
  if (!item) notFound();
  // У «Паруса» — авторская страница с живым превью и графиками
  if (item.slug === "club-parus")
    return (
      <>
        <JsonLd data={caseSchema(item)} />
        <ClubParusCasePage />
      </>
    );
  return <CaseStudyPage item={item} />;
}
