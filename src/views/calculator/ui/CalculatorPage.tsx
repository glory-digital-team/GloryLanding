import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Faq, type FaqEntry } from "@/widgets/faq";
import { Configurator } from "@/widgets/configurator";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Section } from "@/shared/ui/Section";
import { JsonLd } from "@/shared/components/JsonLd";
import { absoluteUrl } from "@/shared/lib/seo";
import { pageBlock, pageContent } from "@/shared/content";
import { CASES, type CaseStudy } from "@/entities/case";
import { SERVICES } from "@/entities/service";
import styles from "./CalculatorPage.module.scss";

const FAQ: FaqEntry[] = [
  {
    q: "Почему калькулятор показывает цену «от»?",
    a: "Автоматический расчёт не знает всех интеграций, объёма данных и контента. Поэтому показываем нижнюю границу по выбранному составу, а точную смету фиксируем после короткого разбора задачи.",
  },
  {
    q: "Что входит в расчёт?",
    a: "Тип проекта, выбранные модули, желаемая дата запуска и наличие исходных материалов. Срочный запуск и отсутствие ТЗ или дизайна влияют на оценку — калькулятор учитывает это сразу.",
  },
  {
    q: "Что может изменить сумму?",
    a: "Сложная миграция, нестандартные интеграции, дополнительные роли и workflow, подготовка контента, лицензии сторонних сервисов, повышенные требования к безопасности или нагрузке и изменение объёма работ.",
    cta: { label: "Как проходит работа", href: "/process/" },
  },
  {
    q: "Является ли результат офертой?",
    a: "Нет. Это ориентир для первого разговора. Условия и стоимость фиксируются в коммерческом предложении и договоре.",
  },
  {
    q: "Что произойдёт после отправки?",
    a: "Расчёт и заявка появятся в личном кабинете — вход по коду из письма. Менеджер изучит конфигурацию, уточнит детали и предложит следующий шаг: разбор, прототип или точную смету.",
  },
];

// Какие кейсы показывать после выбора типа проекта: по услугам с тем же типом конфигуратора.
function casesByType(): Record<string, CaseStudy[]> {
  const out: Record<string, CaseStudy[]> = {};
  for (const type of ["site", "promo", "ai", "mobile"]) {
    const paths = SERVICES.filter((s) => s.configuratorType === type).map((s) => s.path);
    out[type] = CASES.filter((c) => c.services.some((p) => paths.includes(p))).sort(
      (a, b) => Number(b.status === "published") - Number(a.status === "published"),
    );
  }
  return out;
}

export function CalculatorPage() {
  const page = pageContent("/raschet-stoimosti/");
  const how = page.blocks.filter((b) => /^\d+\./.test(b.title));
  const schema = {
    "@type": "WebApplication",
    name: "Калькулятор стоимости разработки — Глори.Цифра",
    url: absoluteUrl("/raschet-stoimosti/"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: page.description,
    offers: { "@type": "Offer", price: 0, priceCurrency: "RUB" },
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <section className={styles.top}>
          <div className={styles.inner}>
            <Breadcrumbs items={[{ label: "Расчёт стоимости", href: "/raschet-stoimosti/" }]} />
            <h1 className={styles.title}>{page.h1}</h1>
            <p className={styles.lead}>
              Получите ориентир по бюджету до первого разговора с менеджером. Выберите тип проекта и
              основные параметры — результат появится до запроса контактов. Расчёт не является
              офертой: после него команда уточнит интеграции, риски и миграцию.
            </p>
            <Configurator casesByType={casesByType()} />
          </div>
        </section>

        <Section id="how" title="Как устроен расчёт" tone="white">
          <ol className={styles.how}>
            {how.map((b) => (
              <li key={b.title}>
                <h3>{b.title.replace(/^\d+\.\s*/, "")}</h3>
                <p>
                  {b.title.startsWith("1.")
                    ? "Выберите основной тип проекта — от него зависит следующий набор вопросов. Короткий релевантный сценарий вместо чек-листа всех услуг."
                    : b.title.startsWith("2.")
                      ? "Показываем только функции, которые реально влияют на оценку выбранного проекта: личный кабинет, платежи, интеграции, квиз, AI-сценарии."
                      : "Дата запуска и исходные материалы: срочность и отсутствие ТЗ или дизайна меняют трудоёмкость. Если чего-то не знаете — это нормально, уточним на разборе."}
                </p>
              </li>
            ))}
          </ol>
          <div className={styles.note}>
            <h3>Что может изменить оценку</h3>
            <p>{pageBlock("/raschet-stoimosti/", "Что может изменить оценку").lines[0]}</p>
          </div>
        </Section>

        <Faq items={FAQ} title="Вопросы о расчёте" />
      </main>
      <Footer />
    </>
  );
}
