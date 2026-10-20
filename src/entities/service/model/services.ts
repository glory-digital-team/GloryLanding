import { SERVICES } from "./services.data";
import type { FaqItem, Service, ServiceGroup } from "./types";

export { SERVICES };

export interface ServiceGroupInfo {
  id: ServiceGroup;
  label: string;
  /** Короткая подводка для mega-menu и хаба. */
  lead: string;
  /** Страница-«вход» в направление. */
  href: string;
}

// Три основных направления + дополнительные услуги (ТЗ §2.2: mega-menu по 3 направлениям).
export const SERVICE_GROUPS: ServiceGroupInfo[] = [
  {
    id: "sites",
    label: "Сайты и цифровые продукты",
    lead: "От посадочной под рекламу до веб-сервиса с ролями и данными.",
    href: "/razrabotka-saitov/",
  },
  {
    id: "automation",
    label: "Автоматизация и интеграции",
    lead: "Убираем ручной перенос данных, таблицы и согласования в чатах.",
    href: "/avtomatizaciya/",
  },
  {
    id: "ai",
    label: "AI для реальных процессов",
    lead: "Начинаем со сценария, результат которого можно измерить, и с пилота.",
    href: "/ai-dlya-biznesa/",
  },
  {
    id: "extra",
    label: "UX/UI, SEO и поддержка",
    lead: "Проектирование интерфейсов, органический рост и развитие продукта.",
    href: "/podderzhka/",
  },
];

// Перелинковка из паспортов страниц (ТЗ §7, «Внутренняя перелинковка»).
export const RELATED: Record<string, string[]> = {
  "/razrabotka-saitov/": ["/korporativnye-sajty/", "/landing-page/", "/internet-magazin/", "/ux-ui/", "/seo/"],
  "/korporativnye-sajty/": ["/razrabotka-saitov/", "/ux-ui/", "/seo/", "/integracii/"],
  "/landing-page/": ["/razrabotka-saitov/", "/ux-ui/", "/seo/"],
  "/internet-magazin/": ["/razrabotka-saitov/", "/lichnye-kabinety-b2b/", "/integracii/", "/seo/"],
  "/web-prilozheniya/": ["/razrabotka-po/", "/mvp/", "/lichnye-kabinety-b2b/", "/integracii/", "/ux-ui/"],
  "/lichnye-kabinety-b2b/": ["/web-prilozheniya/", "/avtomatizaciya/", "/integracii/", "/crm/"],
  "/razrabotka-po/": ["/web-prilozheniya/", "/mvp/", "/avtomatizaciya/", "/crm/"],
  "/mvp/": ["/razrabotka-po/", "/web-prilozheniya/", "/ux-ui/"],
  "/avtomatizaciya/": ["/crm/", "/integracii/", "/lichnye-kabinety-b2b/", "/ai-avtomatizaciya/"],
  "/crm/": ["/avtomatizaciya/", "/integracii/", "/web-prilozheniya/", "/razrabotka-po/"],
  "/integracii/": ["/avtomatizaciya/", "/crm/", "/web-prilozheniya/"],
  "/ai-dlya-biznesa/": ["/ai-assistenty/", "/rag-baza-znanij/", "/ai-avtomatizaciya/", "/integracii/"],
  "/ai-assistenty/": ["/ai-dlya-biznesa/", "/rag-baza-znanij/", "/integracii/"],
  "/rag-baza-znanij/": ["/ai-dlya-biznesa/", "/ai-assistenty/", "/integracii/"],
  "/ai-avtomatizaciya/": ["/ai-dlya-biznesa/", "/avtomatizaciya/", "/integracii/"],
  "/mobilnye-prilozheniya/": ["/razrabotka-po/", "/ux-ui/", "/integracii/"],
  "/ux-ui/": ["/razrabotka-saitov/", "/web-prilozheniya/", "/mvp/"],
  "/seo/": ["/razrabotka-saitov/", "/korporativnye-sajty/", "/podderzhka/"],
  "/podderzhka/": ["/razrabotka-po/", "/razrabotka-saitov/", "/seo/"],
};

/**
 * Дополнительные вопросы, которых нет в реестре, но которые закрывают реальные
 * возражения (ТЗ §5). Только формулировки без новых обещаний — сроки, цены и SLA
 * по-прежнему «по договору» и «после разбора».
 */
export const EXTRA_FAQ: Record<string, FaqItem[]> = {
  "/ai-assistenty/": [
    {
      q: "Откуда ассистент берёт ответы?",
      a: "Из подключённых источников компании: базы знаний, документов, CRM или helpdesk. Если в источниках ответа нет, ассистент так и говорит или передаёт вопрос человеку.",
    },
    {
      q: "Может ли ассистент выполнять действия, а не только отвечать?",
      a: "Да, если для сценария подключены инструменты: создать заявку, проверить статус, заполнить карточку. Набор действий и права на них ограничиваются заранее.",
    },
    {
      q: "Что происходит со сложными или конфликтными обращениями?",
      a: "Ассистент передаёт их оператору вместе с историей диалога. Правила передачи и пороги уверенности задаём до запуска.",
    },
    {
      q: "Как понять, что ассистент работает хорошо?",
      a: "До запуска собираем набор типичных вопросов и действий. После пилота смотрим на точность ответов, долю обращений, переданных человеку, и отзывы пользователей.",
    },
    {
      q: "Сколько стоит AI-ассистент?",
      a: "Зависит от каналов, нужен ли RAG, числа интеграций и объёма обращений. Расходы на AI и API считаем отдельно. Примерную цену покажет калькулятор, точную оценку дадим после разбора сценария.",
    },
  ],
};

export function getService(path: string): Service | undefined {
  return SERVICES.find((s) => s.path === path);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function servicesInGroup(group: ServiceGroup): Service[] {
  return SERVICES.filter((s) => s.group === group);
}

export function relatedServices(path: string): Service[] {
  return (RELATED[path] ?? []).map((p) => getService(p)).filter((s): s is Service => Boolean(s));
}

/** FAQ страницы услуги: из реестра + дополнительные вопросы. */
export function serviceFaq(service: Service): FaqItem[] {
  const fromBlocks = service.blocks.flatMap((b) => (b.kind === "faq" ? b.items : []));
  return [...fromBlocks, ...(EXTRA_FAQ[service.path] ?? [])];
}
