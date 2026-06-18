"use client";

import { useState } from "react";
import { cn, useOverlays } from "@/shared/lib";
import { Icon } from "@/shared/ui/Icon";
import styles from "./Faq.module.scss";

// Секция «Ответы на частые вопросы» (Figma «FAQ container» 191:326).
// CTA-ссылка под ответом — выделенная акцентом строка, ловит доп. конверсию:
// type "configurator" открывает конфигуратор, type "link" ведёт по якорю.
type Cta =
  | { type: "configurator"; label: string }
  | { type: "link"; label: string; href: string };

interface QA {
  q: string;
  a: string;
  cta?: Cta;
}

const ITEMS: QA[] = [
  {
    q: "Сколько стоят ваши услуги и как формируется цена?",
    a: "Стоимость зависит от задач, которые нужно решить. Мы не продаём «сайт за X рублей». Система рассчитывает цену на основе объёма работ, сложности и сроков — вы заранее видите структуру проекта и понимаете, за что платите.",
    cta: { type: "configurator", label: "Перейти в конфигуратор" },
  },
  {
    q: "Будут ли доплаты после заключения договора?",
    a: "Нет, если объём работ остаётся в рамках согласованного проекта. Мы оцениваем изменения отдельно, показываем их влияние на бюджет и сроки, после чего решение остаётся за вами. Никаких внезапных счетов.",
  },
  {
    q: "А если результат не устроит или не совпадёт с ожиданиями?",
    a: "Мы работаем итерациями: каждый этап вы подтверждаете до перехода к следующему. Если на этапе приёмки что-то не соответствует согласованному ТЗ — мы дорабатываем до желаемого результата.",
  },
  {
    q: "Что происходит после сдачи проекта?",
    a: "IT-продукт требует развития, а не просто «гарантийного обслуживания». Мы предлагаем перейти на подписку: это не просто техподдержка, а непрерывное развитие вашего сервиса. Обновления, консультации, минорные доработки и приоритетная помощь — всё прозрачно, в рамках пакета часов.",
  },
  {
    q: "Можно ли увидеть примеры работ с цифрами?",
    a: "Мы предпочитаем показывать, а не рассказывать. В разделе «Портфолио» мы публикуем кейсы с результатами: какие задачи решали и какой эффект получил клиент.",
    cta: { type: "link", label: "Посмотреть портфолио", href: "#portfolio" },
  },
  {
    q: "Вы работаете с малым бизнесом?",
    a: "Наши решения подходят как для стартапов и малого бизнеса, так и для растущих компаний. Главное — наличие задачи, которую можно решить с помощью IT. На старте мы помогаем определить, какие инструменты принесут наибольший эффект.",
  },
  {
    q: "Что нужно от меня на старте?",
    a: "Достаточно запустить конфигуратор на сайте или оставить заявку. При необходимости мы проведём бесплатный экспресс-аудит процессов. После этого вы получите структурированное КП с расчётом стоимости, сроков и ожидаемого эффекта.",
    cta: { type: "configurator", label: "Перейти в конфигуратор" },
  },
];

export function Faq() {
  const { openConfigurator } = useOverlays();
  // По умолчанию раскрыт первый вопрос — сразу показываем ответ про цену и CTA.
  const [open, setOpen] = useState(0);

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
                  <div className={styles.answer}>
                    <p>{item.a}</p>
                    {item.cta &&
                      (item.cta.type === "link" ? (
                        <a href={item.cta.href} className={styles.cta}>
                          {item.cta.label}
                          <Icon name="arrow-right" size={18} className={styles.ctaIcon} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={styles.cta}
                          onClick={openConfigurator}
                        >
                          {item.cta.label}
                          <Icon name="arrow-right" size={18} className={styles.ctaIcon} />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
