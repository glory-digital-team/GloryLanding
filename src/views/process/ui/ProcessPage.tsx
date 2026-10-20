import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Faq } from "@/widgets/faq";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { ProcessTrack } from "@/widgets/process-track";
import { JsonLd } from "@/shared/components/JsonLd";
import { absoluteUrl } from "@/shared/lib/seo";
import { linesToFaq, pageBlock, pageContent } from "@/shared/content";
import { Button } from "@/shared/ui/Button";

const STATUSES = ["Разбор", "Объём и оценка", "Проектирование", "Дизайн-система", "Разработка", "QA и запуск", "Передача и развитие"];

export function ProcessPage() {
  const page = pageContent("/process/");
  const steps = page.blocks
    .filter((b) => /^\d+\./.test(b.title))
    .map((b, i) => ({ status: STATUSES[i] ?? `Этап ${i + 1}`, title: b.title.replace(/^\d+\.\s*/, ""), text: b.lines.join(" ") }));
  const faq = linesToFaq(pageBlock("/process/", "Вопросы о процессе").lines);
  const schema = {
    "@type": "HowTo",
    name: page.h1,
    description: page.description,
    url: absoluteUrl("/process/"),
    step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text })),
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[{ label: "Как работаем", href: "/process/" }]}
          eyebrow="Процесс"
          title={page.h1}
          lead={<p>{pageBlock("/process/", page.h1).lines[0]}</p>}
          actions={
            <>
              <Button href="/raschet-stoimosti/" variant="primary" size="lg" data-cta="process_hero_calc">
                Рассчитать проект
              </Button>
              <Button href="/cases/" variant="secondary" calm size="lg">
                Посмотреть кейсы
              </Button>
            </>
          }
        />
        <ProcessTrack
          variant="full"
          steps={steps}
          title="Семь этапов — семь статусов в личном кабинете"
          lead="Слева статус, который клиент видит у своего проекта. Справа описано, что происходит на этапе и что мы фиксируем, прежде чем идти дальше."
        />
        <Faq items={faq} title="Вопросы о процессе" />
        <LeadForm formId="process" context="страница процесса" />
      </main>
      <Footer />
    </>
  );
}
