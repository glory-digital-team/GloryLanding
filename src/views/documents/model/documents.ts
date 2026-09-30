import type { IconName } from "@/shared/ui/Icon";

export interface Document {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  href: string;
}

export const DOCUMENTS: Document[] = [
  {
    id: "offer",
    icon: "file-text",
    title: "Рамочная оферта",
    description: "Общие условия оказания услуг Глори.Цифра.",
    href: "/offer",
  },
  {
    id: "subscription-offer",
    icon: "file-text",
    title: "Оферта на подписку",
    description: "Условия подписки на техническую поддержку и сопровождение.",
    href: "/subscription-offer",
  },
  {
    id: "privacy",
    icon: "shield-check",
    title: "Политика конфиденциальности",
    description: "Как мы защищаем ваши данные и что с ними делаем.",
    href: "/privacy",
  },
];
