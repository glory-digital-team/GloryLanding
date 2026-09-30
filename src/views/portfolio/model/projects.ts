export interface Project {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  color: string;
  badgeColor: string;
  tags: string[];
  image: {
    src: string;
    alt: string;
    className?: string;
  };
  cardClass: string;
  textBlur?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "ii-govori",
    title: "ИИ Говори",
    subtitle: "Диалоговый AI-тренажер",
    href: "https://ии-говори.рф/",
    color: "#0e3daf",
    badgeColor: "#2650b7",
    tags: [ "Разработка", "AI-решения", "Поддержка"],
    image: {
      src: "/portfolio/ii-govori.png",
      alt: "ИИ Говори",
      className: "imageGovori",
    },
    cardClass: "cardBlue",
  },
  {
    id: "esis",
    title: "ESIS",
    subtitle: "Электронные ценники",
    href: "https://esls.ru/",
    color: "#e8f4fc",
    badgeColor: "#222224",
    tags: ["Дизайн", "Разработка", "AI-решения"],
    image: {
      src: "/portfolio/esis.png",
      alt: "ESIS",
      className: "imageEsis",
    },
    cardClass: "cardLight",
    textBlur: true,
  },
  {
    id: "tienda",
    title: "Tienda de Gaucho",
    subtitle: "Доставка продуктов в Аргентине",
    href: "https://grvzen.notion.site/Tienda-de-Gaucho-FoodTech-1154e6ded3044837b01485526b67fb44",
    color: "#68ae53",
    badgeColor: "#222224",
    tags: ["Дизайн", "Разработка", "AI-решения"],
    image: {
      src: "/portfolio/tienda-logo.svg",
      alt: "Tienda de Gaucho",
      className: "imageTienda",
    },
    cardClass: "cardGreen",
    textBlur: true,
  },
  {
    id: "club-parus",
    title: "Клуб Парус",
    subtitle: "Детский досуг",
    href: "/portfolio/club-parus",
    color: "#dbeaf5",
    badgeColor: "#222224",
    tags: ["НКО", "Разработка", "Поддержка"],
    image: {
      src: "/portfolio/logo-parus.png",
      alt: "Клуб Парус",
      className: "imageClubParus",
    },
    cardClass: "cardClubParus",
    textBlur: true,
  },
];
