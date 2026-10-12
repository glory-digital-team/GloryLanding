import { Header } from "@/widgets/header";
import { Hero } from "@/widgets/hero";
import { TaskRouter } from "@/widgets/task-router";
import { Advantages } from "@/widgets/advantages";
import { Cta } from "@/widgets/cta";
import { Bento } from "@/widgets/bento";
import { Portfolio } from "@/widgets/portfolio";
import { ProcessTrack } from "@/widgets/process-track";
import { Assurance } from "@/widgets/assurance";
import { LeadForm } from "@/widgets/lead-form";
import { Faq, type FaqEntry } from "@/widgets/faq";
import { Footer } from "@/widgets/footer";
import { pageBlock } from "@/shared/content";
import styles from "./HomePage.module.scss";

// Статусы этапов — те же, что видит клиент в личном кабинете
const STATUSES = ["Заявка", "Scope", "Сценарии", "Интерфейс", "Разработка", "QA и релиз", "Передача"];

const HOME_FAQ: FaqEntry[] = [
  {
    q: "Сколько стоит проект?",
    a: "Итог зависит от типа продукта, количества уникальных сценариев, интеграций, миграции и требований к данным. Мы не продаём «сайт за X рублей»: вы заранее видите структуру проекта и понимаете, за что платите. Быстрый ориентир можно получить в калькуляторе.",
    cta: { label: "Открыть калькулятор", href: "/raschet-stoimosti/" },
  },
  {
    q: "Сколько длится разработка?",
    a: "Срок определяется после фиксации объёма работ; сложные проекты удобнее делить на версии и запускать по частям.",
    cta: { label: "Как проходит работа", href: "/process/" },
  },
  {
    q: "Будут ли доплаты после заключения договора?",
    a: "Нет, если объём работ остаётся в рамках согласованного проекта. Изменения оцениваем отдельно, показываем их влияние на бюджет и сроки — решение остаётся за вами.",
  },
  {
    q: "Кому принадлежит код?",
    a: "Это фиксируется в договоре и составе передачи по проекту: репозиторий, доступы, документация и схема интеграций.",
  },
  {
    q: "Можно начать с небольшой задачи?",
    a: "Да, когда сначала нужно проверить гипотезу, архитектуру или один процесс. Небольшой первый этап помогает оценить остальное точнее.",
    cta: { label: "MVP и первые версии", href: "/mvp/" },
  },
  {
    q: "Что после запуска?",
    a: "Для проекта заранее определяется гарантийный период и/или формат дальнейшей поддержки. Можно перейти на подписку на развитие: обновления, консультации и доработки в рамках пакета часов.",
    cta: { label: "Поддержка и развитие", href: "/podderzhka/" },
  },
  {
    q: "SEO учитывается при разработке сайта?",
    a: "Для публичных проектов структура, индексация, производительность и аналитика закладываются до релиза, а не после него.",
    cta: { label: "SEO-продвижение", href: "/seo/" },
  },
];

export function HomePage() {
  const steps = pageBlock("/", "От задачи до запуска").lines.map((line, i) => ({
    status: STATUSES[i] ?? `Этап ${i + 1}`,
    title: line.replace(/^\d+\.\s*/, "").replace(/\.$/, ""),
  }));

  return (
    <>
      <div className={styles.firstScreen}>
        <Header />
        <main>
          <Hero />
        </main>
      </div>
      <TaskRouter />
      <Bento />
      <Advantages />
      <Portfolio />
      <ProcessTrack
        steps={steps}
        title="От задачи до запуска"
        lead="Работа строится по этапам, у каждого — проверяемый результат. Клиент видит, на каком этапе проект, как статус заказа."
        link={{ label: "Подробнее о процессе", href: "/process/" }}
      />
      <Cta />
      <Assurance />
      <Faq items={HOME_FAQ} title="Короткие ответы до первого звонка" />
      <LeadForm formId="home" />
      <Footer />
    </>
  );
}
