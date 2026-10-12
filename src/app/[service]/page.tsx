import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/entities/service";
import { buildMetadata } from "@/shared/lib/seo";
import { ServicePage } from "@/views/service";

// Посадочные услуг (ТЗ §2, §7): один шаблон, 19 URL первого уровня — /crm/, /landing-page/…
// Все страницы статически генерируются при сборке; неизвестный slug — 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug((await params).service);
  if (!service) return {};
  return buildMetadata({
    path: service.path,
    title: service.title,
    description: service.description,
    keywords: service.keywords,
  });
}

export default async function Page({ params }: Props) {
  const service = getServiceBySlug((await params).service);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
