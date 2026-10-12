"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/shared/lib";
import { getService } from "@/entities/service";
import styles from "./TaskRouter.module.scss";

// «Выберите задачу, а не технологию» (SEO-реестр, главная): пользователь называет ситуацию,
// роутер показывает подходящие направления. Все панели — в SSR-HTML, активная видна.
const TASKS = [
  {
    label: "Новый сайт",
    when: "Нужно понятнее представить компанию, услуги или продукт и создать основу для продвижения.",
    services: ["/razrabotka-saitov/", "/korporativnye-sajty/", "/landing-page/", "/internet-magazin/"],
  },
  {
    label: "Цифровой продукт",
    when: "Клиенту или сотруднику нужен самостоятельный онлайн-сервис.",
    services: ["/web-prilozheniya/", "/mvp/", "/razrabotka-po/", "/mobilnye-prilozheniya/"],
  },
  {
    label: "Личный кабинет / B2B-портал",
    when: "Статусы, документы и заявки не должны проходить через менеджера вручную.",
    services: ["/lichnye-kabinety-b2b/", "/integracii/", "/web-prilozheniya/"],
  },
  {
    label: "Автоматизация",
    when: "Процесс держится на Excel, почте и чатах.",
    services: ["/avtomatizaciya/", "/ai-avtomatizaciya/", "/integracii/"],
  },
  {
    label: "CRM и интеграции",
    when: "Данные дублируются между системами или коробочная CRM ограничивает процесс.",
    services: ["/crm/", "/integracii/", "/avtomatizaciya/"],
  },
  {
    label: "AI",
    when: "Есть повторяемая работа с текстом, документами, знаниями или обращениями.",
    services: ["/ai-dlya-biznesa/", "/ai-assistenty/", "/rag-baza-znanij/", "/ai-avtomatizaciya/"],
  },
  {
    label: "Развитие продукта",
    when: "Нужно стабилизировать, ускорить и планово дорабатывать уже работающую систему.",
    services: ["/podderzhka/", "/ux-ui/", "/seo/"],
  },
];

export function TaskRouter() {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section} aria-labelledby="router-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>С чего начать</p>
          <h2 className={styles.title} id="router-title">
            Выберите задачу, а не технологию
          </h2>
          <p className={styles.lead}>
            Не нужно заранее знать название системы. Выберите ситуацию — покажем, какие решения
            её закрывают.
          </p>
        </header>

        <div className={styles.board}>
          <div className={styles.tabs} role="tablist" aria-label="Задачи бизнеса">
            {TASKS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                id={`task-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`task-panel-${i}`}
                className={cn(styles.tab, active === i && styles.tabActive)}
                onClick={() => setActive(i)}
              >
                <span className={styles.tabIdx} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.panels}>
            {TASKS.map((t, i) => (
              <div
                key={t.label}
                role="tabpanel"
                id={`task-panel-${i}`}
                aria-labelledby={`task-tab-${i}`}
                className={cn(styles.panel, active === i && styles.panelActive)}
              >
                <p className={styles.whenLabel}>Когда это ваш случай</p>
                <p className={styles.when}>{t.when}</p>
                <p className={styles.whenLabel}>Подходящие решения</p>
                <ul className={styles.services}>
                  {t.services.map((p) => {
                    const s = getService(p);
                    if (!s) return null;
                    return (
                      <li key={p}>
                        <a href={p} className={styles.service}>
                          <span className={styles.serviceName}>{s.navLabel}</span>
                          <span className={styles.serviceShort}>{s.short}</span>
                          <span className={styles.serviceArrow} aria-hidden="true">
                            →
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <Link href="/raschet-stoimosti/" className={styles.calc} data-cta="task_router_calc">
                  Рассчитать стоимость →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
