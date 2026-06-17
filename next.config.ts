import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Минимальный self-contained сервер для Docker-образа (.next/standalone).
  output: "standalone",
  // Позволяет писать `@use 'shared/styles/abstracts' as *;` в любом *.scss
  // без относительных путей: sass ищет файлы относительно папки src.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

export default nextConfig;
