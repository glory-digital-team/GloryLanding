import type { MetadataRoute } from "next";

const siteUrl = "https://xn--c1akimk.digital";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ui-kit", "/crm/", "/config/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}