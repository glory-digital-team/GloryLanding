import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Позволяет писать `@use 'shared/styles/abstracts' as *;` в любом *.scss
  // без относительных путей: sass ищет файлы относительно папки src.
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src")],
  },
};

export default nextConfig;
