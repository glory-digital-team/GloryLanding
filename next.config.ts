import type { NextConfig } from "next";
import path from "node:path";

// Кабинет клиента и заявки с сайта (`/cabinet/*`) отдаёт платформа «Глори.Штат». На проде путь
// `/cabinet` основного домена ведёт ingress; адрес задаётся, только если лендинг живёт отдельно
// (локально — `GLORY_CABINET_ORIGIN=http://localhost:5175`), и тогда Next проксирует путь сам.
const cabinetOrigin = process.env.GLORY_CABINET_ORIGIN?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  // Минимальный self-contained сервер для Docker-образа (.next/standalone).
  output: "standalone",
  // Позволяет писать `@use 'shared/styles/abstracts' as *;` в любом *.scss
  // без относительных путей: sass ищет файлы относительно папки src.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src")],
  },
  // Разрешает доступ к dev-серверу с локального IP для исправления WebSocket ошибок
  allowedDevOrigins: ["192.168.1.94", "10.101.34.23"],
  async rewrites() {
    if (cabinetOrigin === "") return [];
    return [
      { source: "/cabinet", destination: `${cabinetOrigin}/cabinet` },
      { source: "/cabinet/:path*", destination: `${cabinetOrigin}/cabinet/:path*` },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/cabinet/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
