import type { NextConfig } from "next";
import path from "node:path";

const defaultCrmGatewayUrl = "https://xn--80a9abv.xn--c1akimk.digital";
const crmGatewayUrl = (
  process.env.GLORI_CRM_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_GLORI_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  defaultCrmGatewayUrl
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Минимальный self-contained сервер для Docker-образа (.next/standalone).
  output: "standalone",
  // Позволяет писать `@use 'shared/styles/abstracts' as *;` в любом *.scss
  // без относительных путей: sass ищет файлы относительно папки src.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src")],
  },
  async rewrites() {
    return [
      {
        source: "/crm/:path*",
        destination: `${crmGatewayUrl}/crm/:path*`,
      },
    ];
  },
};

export default nextConfig;
