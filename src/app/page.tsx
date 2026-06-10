import { HomePage } from "@/views/home";

// Маршрут "/" — тонкая обёртка Next, вся композиция страницы живёт в слое views.
export default function Page() {
  return <HomePage />;
}
