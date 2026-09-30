import type { Metadata } from "next";
import { ClubParusCasePage } from "@/views/portfolio";

export const metadata: Metadata = {
  title: "Кейс: АНО Клуб «Парус» | Глори.Цифра",
  description:
    "От нового сайта к цифровому партнёрству. Единая цифровая среда клуба: кружки, мероприятия, видеоархив, синхронизация с ВКонтакте и CMS.",
  openGraph: {
    title: "Кейс: АНО Клуб «Парус» | Глори.Цифра",
    description:
      "От нового сайта к цифровому партнёрству. Единая цифровая среда клуба: кружки, мероприятия, видеоархив, синхронизация с ВКонтакте и CMS.",
    images: ["/og-image-v2.png"],
  },
};

export default function Page() {
  return <ClubParusCasePage />;
}
