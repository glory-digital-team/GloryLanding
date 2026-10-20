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
    a: "Цена зависит от типа продукта, числа уникальных сценариев, интеграций, миграции и требований к данным. «Сайт за X рублей» мы не продаём: вы заранее видите структуру проекта и понимаете, за что платите. Примерную сумму можно посчитать в калькуляторе.",
    cta: { label: "Открыть калькулятор", href: "/raschet-stoimosti/" },
  },
  {
    q: "Сколько длится разработка?",
    a: "Срок называем после того, как согласован объём работ. Сложные проекты удобнее делить на версии и запускать по частям.",
    cta: { label: "Как проходит работа", href: "/process/" },
  },
  {
    q: "Будут ли доплаты после заключения договора?",
    a: "Нет, если объём работ не выходит за рамки согласованного проекта. Изменения оцениваем отдельно и показываем, как они повлияют на бюджет и сроки. Решение принимаете вы.",
  },
  {
    q: "Кому принадлежит код?",
    a: "Это прописывается в договоре вместе с перечнем того, что передаётся по проекту: репозиторий, доступы, документация и схема интеграций.",
  },
  {
    q: "Можно начать с небольшой задачи?",
    a: "Да. Так стоит делать, если сначала нужно проверить гипотезу, архитектуру или один процесс. После небольшого первого этапа остальное легче оценить точно.",
    cta: { label: "MVP и первые версии", href: "/mvp/" },
  },
  {
    q: "Что после запуска?",
    a: "Гарантийный период и (или) формат дальнейшей поддержки обговариваем заранее. Можно перейти на подписку на развитие: обновления, консультации и доработки в рамках пакета часов.",
    cta: { label: "Поддержка и развитие", href: "/podderzhka/" },
  },
  {
    q: "SEO учитывается при разработке сайта?",
    a: "Да. В публичных проектах структуру, индексацию, производительность и аналитику закладываем до релиза.",
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
        lead="Проект идёт по этапам, и у каждого есть результат, который можно проверить. Текущий этап видно в личном кабинете, как статус заказа."
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
