"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import {
  SUBSCRIPTION_OFFER_REVISION,
  SUBSCRIPTION_OFFER_TITLE,
  SUBSCRIPTION_OFFER_SUBTITLE,
  SUBSCRIPTION_OFFER_INTRO,
  SUBSCRIPTION_OFFER_NAVIGATION,
  SUBSCRIPTION_OFFER_SECTIONS,
  type SubscriptionOfferPart,
} from "../model/subscription-offer";
import styles from "./OfferPage.module.scss";

function Part({ part }: { part: SubscriptionOfferPart }) {
  if (part.type === "p") {
    return <p className={styles.paragraph}>{part.text}</p>;
  }
  if (part.type === "list") {
    return (
      <ul className={styles.list}>
        {part.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    );
  }
  if (part.type === "numbered-list") {
    return (
      <ol className={styles.numberedList}>
        {part.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ol>
    );
  }
  if (part.type === "subheading") {
    return <h3 className={styles.subheading}>{part.text}</h3>;
  }
  if (part.type === "callout") {
    const calloutStyle = part.calloutType === "important" ? "Important" : "Note";
    return (
      <div className={`${styles.callout} ${styles[`callout${calloutStyle}`]}`}>
        <span className={styles.calloutLabel}>{part.calloutType === "important" ? "Важно" : "Примечание"}</span>
        <p className={styles.calloutText}>{part.text}</p>
      </div>
    );
  }
  if (part.type === "diagram") {
    return (
      <div className={styles.diagram}>
        <h4 className={styles.diagramTitle}>{part.title}</h4>
        <div className={styles.diagramSteps}>
          {part.steps.map((step, index) => (
            <div key={step.slice(0, 32)} className={styles.diagramStep}>
              <span className={styles.diagramStepNumber}>{index + 1}</span>
              <span className={styles.diagramStepText}>{step}</span>
              {index < part.steps.length - 1 && (
                <span className={styles.diagramArrow}>↓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function Sidebar({
  activeSection,
  onNavigate,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className={styles.mobileNavToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="sidebar-nav"
      >
        Содержание
        <span className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ""}`}>
          <span />
          <span />
        </span>
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar-nav"
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <nav className={styles.sidebarNav} aria-label="Навигация по документу">
          <ul className={styles.sidebarList}>
            {SUBSCRIPTION_OFFER_NAVIGATION.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.sidebarLink} ${
                    activeSection === item.id ? styles.sidebarLinkActive : ""
                  }`}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export function SubscriptionOfferPage() {
  const [activeSection, setActiveSection] = useState<string>("");

  // Handle smooth scroll to section
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = SUBSCRIPTION_OFFER_SECTIONS.map((s) => s.id);
      const scrollPosition = window.scrollY + 150;

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Вспомогательная функция для скрытия/восстановления элементов
  const hideElementsTemporarily = (elements: HTMLElement[]) => {
    elements.forEach(el => {
      el.dataset.originalDisplay = el.style.display || '';
      el.style.display = 'none';
    });
  };

  const restoreElements = (elements: HTMLElement[]) => {
    elements.forEach(el => {
      el.style.display = el.dataset.originalDisplay || '';
      delete el.dataset.originalDisplay;
    });
  };

  // Handle print
  const handlePrint = () => {
    // Скрываем те же элементы, что и для PDF
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const sidebar = document.querySelector<HTMLElement>(`.${styles.sidebar}`);
    const heroActions = document.querySelector<HTMLElement>(`.${styles.heroActions}`);
    const backNav = document.querySelector<HTMLElement>(`.${styles.backNav}`);

    const elementsToHide = [header, footer, sidebar, heroActions, backNav].filter(
      (element): element is HTMLElement => element !== null,
    );
    hideElementsTemporarily(elementsToHide);

    // Печатаем
    window.print();

    // Восстанавливаем после печати
    setTimeout(() => {
      restoreElements(elementsToHide);
    }, 100);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const html2pdfModule = await import("html2pdf.js");

    // Скрываем те же элементы, что и для печати
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const sidebar = document.querySelector<HTMLElement>(`.${styles.sidebar}`);
    const heroActions = document.querySelector<HTMLElement>(`.${styles.heroActions}`);
    const backNav = document.querySelector<HTMLElement>(`.${styles.backNav}`);

    const elementsToHide = [header, footer, sidebar, heroActions, backNav].filter(
      (element): element is HTMLElement => element !== null,
    );
    hideElementsTemporarily(elementsToHide);

    // Рендерим из всей страницы, но без скрытых элементов
    const pageElement = document.querySelector<HTMLElement>(`.${styles.page}`);
    if (!pageElement) {
      restoreElements(elementsToHide);
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Глори_Цифра_${SUBSCRIPTION_OFFER_TITLE.replace(/\s+/g, '_')}_ред${SUBSCRIPTION_OFFER_REVISION.number}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.section',
        after: '.section',
        avoid: ['.section', '.callout', '.diagram'],
      },
    };

    try {
      await html2pdfModule.default().set(opt).from(pageElement).save();
    } finally {
      // Восстанавливаем элементы
      restoreElements(elementsToHide);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.backNav}>
            <Button
              variant="ghost"
              size="sm"
              href="/documents"
              className={styles.backButton}
            >
              ← Назад к документам
            </Button>
          </div>
          <p className={styles.eyebrow}>Юридическая информация</p>
          <h1 className={styles.heroTitle}>{SUBSCRIPTION_OFFER_TITLE}</h1>
          <p className={styles.heroSubtitle}>{SUBSCRIPTION_OFFER_SUBTITLE}</p>
          <div className={styles.heroMeta}>
          </div>
          <p className={styles.heroIntro}>{SUBSCRIPTION_OFFER_INTRO}</p>
            <span className={styles.revision}>
              Редакция №{SUBSCRIPTION_OFFER_REVISION.number} от {SUBSCRIPTION_OFFER_REVISION.date}
            </span>
          <div className={styles.heroActions}>
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadPDF}
              className={styles.heroButton}
            >
              Скачать PDF
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrint}
              className={styles.heroButton}
            >
              Распечатать
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.content}>
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

        <main className={styles.document}>
          <article className={styles.article}>
            {SUBSCRIPTION_OFFER_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={styles.section}
              >
                <h2 className={styles.heading}>
                  <span className={styles.sectionNumber}>{section.number}.</span>{" "}
                  {section.title}
                </h2>
                {section.parts.map((part, i) => (
                  <Part key={i} part={part} />
                ))}
              </section>
            ))}

            <div className={styles.revisionBlock}>
              <p className={styles.revisionText}>
                Редакция №{SUBSCRIPTION_OFFER_REVISION.number} от {SUBSCRIPTION_OFFER_REVISION.date} · Опубликовано:{" "}
                {SUBSCRIPTION_OFFER_REVISION.published}
              </p>
            </div>
          </article>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
