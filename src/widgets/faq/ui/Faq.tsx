"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Icon } from "@/shared/ui/Icon";
import styles from "./Faq.module.scss";

// Секция «Ответы на частые вопросы» (Figma «FAQ container» 191:326).
interface QA {
  q: string;
  a: ReactNode;
}

const ITEMS: QA[] = [
  {
    q: "Сколько стоит автоматизация и как формируется цена?",
    a: "Цену формирует конфигуратор: вы выбираете состав работ и сразу видите стоимость каждого этапа. Никаких «вилок» и устных оценок — только фиксированная смета до старта.",
  },
  {
    q: "Будут ли доплаты после заключения договора?",
    a: "Нет. Бюджет фиксируется в договоре до начала работ. Доплаты возможны только если вы сами решите расширить объём задач — и всегда по согласованной заранее цене.",
  },
  {
    q: "Если результат не устроит или не совпадёт с ожиданиями?",
    a: "Мы согласовываем результат на каждом этапе, поэтому к финалу не остаётся сюрпризов. Правки в рамках задачи входят в стоимость — мы доводим проект до результата.",
  },
  {
    q: "Что происходит после сдачи проекта?",
    a: "Вы получаете все исходники и доступы. Дальше — гарантийная поддержка и при желании договор на развитие: новые функции, доработки и сопровождение.",
  },
  {
    q: "Можно ли увидеть примеры работ с цифрами?",
    a: (
      <>
        Мы предпочитаем показывать, а не рассказывать. В разделе{" "}
        <a href="#portfolio" className={styles.answerLink}>
          Портфолио
        </a>{" "}
        мы публикуем кейсы с результатами: какие задачи решали и какой эффект
        получил клиент.
      </>
    ),
  },
  {
    q: "Вы работаете с малым бизнесом?",
    a: "Да, это наш профиль. Мы выстраиваем процессы и решения под задачи и бюджет малого и среднего бизнеса — без раздутых смет и лишней бюрократии.",
  },
  {
    q: "Что нужно от меня на старте?",
    a: "Достаточно описать задачу — чем подробнее, тем точнее смета. Остальное возьмём на себя: уточним детали на коротком брифинге и предложим структуру проекта.",
  },
];

export function Faq() {
  // В макете по умолчанию раскрыт пятый вопрос (191:336, h=161).
  const [open, setOpen] = useState(4);

  return (
    <section className={styles.faq} id="faq">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>Ответы на частые вопросы</h2>
        </header>

        <div className={styles.list}>
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={cn(styles.item, isOpen && styles.itemOpen)}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className={styles.icon}>
                    <Icon name="chevron-down" size={24} />
                  </span>
                </button>
                <div className={styles.answerWrap}>
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
