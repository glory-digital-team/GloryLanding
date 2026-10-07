"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import styles from "./ClubParusCasePage.module.scss";

/* ──────────────────────────────────────────────────
   Хук: IntersectionObserver для fade-up анимаций
   и запуска счётчиков при появлении в viewport.
────────────────────────────────────────────────── */
function useFadeUpObservables() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(`.${styles.fadeUp}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);

            // Запускаем все счётчики внутри текущего блока
            const counters = entry.target.querySelectorAll<HTMLElement>("[data-counter]");
            counters.forEach((counter) => animateCounter(counter));

            // Если сам элемент — счётчик
            if (entry.target.hasAttribute("data-counter")) {
              animateCounter(entry.target as HTMLElement);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function animateCounter(el: HTMLElement) {
  if (el.dataset.animated === "true") return;
  el.dataset.animated = "true";

  const target = parseFloat(el.dataset.target || "0");
  const isDecimal = el.dataset.decimal === "true";
  const duration = 1500;
  const start = performance.now();

  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = isDecimal ? current.toFixed(1) : String(Math.round(current));
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ──────────────────────────────────────────────────
   Хук: параллакс-эффект для iframe-обёртки при скролле
────────────────────────────────────────────────── */
function useIframeParallax() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const rect = wrapper.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const p = scrollY * 0.05;
        wrapper.style.transform = `perspective(1200px) rotateX(${2 - p * 0.1}deg) translateY(${p}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return wrapperRef;
}

/* ──────────────────────────────────────────────────
   Компонент: превью сайта в «рамке» устройства с
   мини-панелью браузера и реальным iframe внутри,
   отмасштабированным через transform: scale.
────────────────────────────────────────────────── */
type DeviceSpec = {
  /** Реальная ширина viewport сайта, который показываем */
  viewportW: number;
  /** Реальная высота viewport сайта */
  viewportH: number;
  /** Масштаб от реального viewport до «рамки» устройства */
  scale: number;
};

function DeviceBrowser({ spec }: { spec: DeviceSpec }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const timeout = window.setTimeout(() => {
      if (!iframe.dataset.loaded) setFallbackVisible(true);
    }, 6000);
    const onLoad = () => {
      iframe.dataset.loaded = "true";
      setFallbackVisible(false);
    };
    const onError = () => setFallbackVisible(true);
    iframe.addEventListener("load", onLoad);
    iframe.addEventListener("error", onError);
    return () => {
      window.clearTimeout(timeout);
      iframe.removeEventListener("load", onLoad);
      iframe.removeEventListener("error", onError);
    };
  }, []);

  const scaledW = spec.viewportW * spec.scale;
  const scaledH = spec.viewportH * spec.scale;

  return (
    <div
      className={styles.deviceViewport}
      style={{ width: `${scaledW}px`, height: `${scaledH}px` }}
    >
      <div className={styles.deviceBrowserBar}>
        <span className={styles.deviceBrowserDot} />
        <span className={styles.deviceBrowserDot} />
        <span className={styles.deviceBrowserDot} />
      </div>
      <div
        className={styles.deviceIframeWrap}
        style={{
          width: `${scaledW}px`,
          height: `${scaledH - 18}px`,
        }}
      >
        <div
          style={{
            width: `${spec.viewportW}px`,
            height: `${spec.viewportH}px`,
            transform: `scale(${spec.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <iframe
            ref={iframeRef}
            className={styles.deviceIframe}
            src="https://клубпарус.рф"
            title="Сайт Клуба Парус"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts"
            style={{
              width: `${spec.viewportW}px`,
              height: `${spec.viewportH}px`,
              display: "block",
              border: "none",
              background: "#fff",
            }}
          />
        </div>
        {fallbackVisible && (
          <a
            className={styles.deviceFallbackLink}
            href="https://клубпарус.рф"
            target="_blank"
            rel="noopener"
          >
            клубпарус.рф ↗
          </a>
        )}
      </div>
    </div>
  );
}

const DEVICES: Record<"phone" | "tablet" | "laptop" | "desktop", DeviceSpec> = {
  phone: { viewportW: 390, viewportH: 844, scale: 0.27 },
  tablet: { viewportW: 820, viewportH: 1180, scale: 0.23 },
  laptop: { viewportW: 1440, viewportH: 900, scale: 0.21 },
  desktop: { viewportW: 1920, viewportH: 1080, scale: 0.19 },
};

/* ──────────────────────────────────────────────────
   Компонент: график производительности (случайные бары)
────────────────────────────────────────────────── */
function PerformanceChart() {
  const barHeights = [
    24, 38, 30, 52, 34, 46, 28, 58, 42, 32, 50, 26,
    44, 36, 54, 30, 48, 34, 56, 40, 28, 52, 38, 60,
  ];

  return (
    <div className={styles.seoMetricChart} aria-hidden="true">
      {barHeights.map((height, index) => (
        <span
          className={`${styles.seoMetricChartBar} ${index >= 15 ? styles.active : ""}`}
          key={index}
          style={
            {
              "--bar-height": `${height}px`,
              "--bar-delay": `${index * -0.11}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────
   Компонент: iframe с fallback-интерфейсом
────────────────────────────────────────────────── */
function HeroIframe() {
  const wrapperRef = useIframeParallax();
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const timeout = window.setTimeout(() => {
      try {
        // Если за 5 секунд не загрузилось — показываем fallback
        if (!iframe.dataset.loaded) {
          setFallbackVisible(true);
        }
      } catch {
        setFallbackVisible(true);
      }
    }, 5000);

    const onLoad = () => {
      iframe.dataset.loaded = "true";
      setFallbackVisible(false);
    };

    const onError = () => setFallbackVisible(true);

    iframe.addEventListener("load", onLoad);
    iframe.addEventListener("error", onError);
    return () => {
      window.clearTimeout(timeout);
      iframe.removeEventListener("load", onLoad);
      iframe.removeEventListener("error", onError);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.heroIframeWrapper}>
      <div className={styles.iframeBrowserBar}>
        <div className={styles.iframeDots}>
          <span className={styles.iframeDot} />
          <span className={styles.iframeDot} />
          <span className={styles.iframeDot} />
        </div>
        <div className={styles.iframeUrl}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          клубпарус.рф
        </div>
      </div>
      <iframe
        ref={iframeRef}
        className={styles.heroIframe}
        src="https://клубпарус.рф"
        title="Сайт Клуба Парус"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts"
      />
      <div className={`${styles.iframeFallback} ${fallbackVisible ? styles.visible : ""}`}>
        <p className={styles.iframeFallbackText}>
          Сайт не удалось загрузить в превью. Откройте его в новой вкладке:
        </p>
        <a
          href="https://клубпарус.рф"
          target="_blank"
          rel="noopener"
          className={styles.iframeFallbackLink}
        >
          Открыть клубпарус.рф
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────
   Компонент: страница кейса «Клуб «Парус»
────────────────────────────────────────────────── */
export function ClubParusCasePage() {
  useFadeUpObservables();

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={`${styles.heroEyebrow} ${styles.fadeUp}`}>КЕЙС · КЛУБ «ПАРУС»</div>
            <h1 className={`${styles.heroTitle} ${styles.fadeUp}`}>
              От нового сайта
              <br />
              к цифровому партнёрству
            </h1>
            <p className={`${styles.heroSubtitle} ${styles.fadeUp}`}>
              Собрали в единую систему кружки, мероприятия, видеоархив и контент клуба — и продолжаем
              развивать цифровую среду вместе с командой «Паруса».
            </p>

            {/* Glassmorphism meta panel с логотипом партнёра */}
            <div className={`${styles.heroMetaPanel} ${styles.fadeUp}`}>
              <div className={styles.partnerLogo}>
                <div className={styles.partnerLogoMark}>
                  <Image
                    src="/portfolio/logo-parus.png"
                    alt="Логотип АНО Клуб «Парус»"
                    fill
                    sizes="44px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className={styles.partnerLogoInfo}>
                  <span className={styles.partnerLogoLabel}>Клиент</span>
                  <span className={styles.partnerLogoName}>
                    Клуб <span>«Парус»</span>
                  </span>
                </div>
              </div>

              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Формат</span>
                <span className={styles.heroMetaValue}>разработка + сопровождение</span>
              </div>
              <div className={styles.heroMetaItem}>
                <span className={styles.heroMetaLabel}>Статус</span>
                <span className={styles.heroMetaValue}>цифровой партнёр</span>
              </div>
            </div>

            <HeroIframe />
          </div>
        </section>

        {/* ── Stats Row ────────────────────────────────── */}
        <section className={styles.statsRow}>
          <div className={styles.container}>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.fadeUp}`}>
                <div className={styles.statValue}>
                  <span data-counter data-target="11">
                    0
                  </span>{" "}
                  этапов
                </div>
                <div className={styles.statLabel}>Полный цикл от проектирования до запуска</div>
              </div>
              <div className={`${styles.statCard} ${styles.fadeUp}`}>
                <div className={styles.statValue}>
                  {"< "}
                  <span data-counter data-target="2.5" data-decimal="true">
                    0
                  </span>{" "}
                  сек
                </div>
                <div className={styles.statLabel}>Загрузка страниц</div>
              </div>
              <div className={`${styles.statCard} ${styles.fadeUp}`}>
                <div className={styles.statValue}>320–1920 px</div>
                <div className={styles.statLabel}>Полная адаптивность</div>
              </div>
              <div className={`${styles.statCard} ${styles.fadeUp}`}>
                <div className={styles.statValue}>VK API</div>
                <div className={styles.statLabel}>Автоматическая синхронизация контента</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Context ──────────────────────────────────── */}
        <section className={styles.section} id="context">
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>
              Задача была больше,
              <br />
              чем новый сайт
            </h2>
            <p className={`${styles.sectionText} ${styles.fadeUp}`}>
              Клуб «Парус» работает с детьми и родителями, организует кружки и мероприятия, ведёт
              сообщество и большой архив материалов.
            </p>
            <p className={`${styles.sectionText} ${styles.fadeUp}`}>
              До разработки нового сайта отдельные цифровые процессы существовали разрозненно:
              информация о кружках, публикации во ВКонтакте, мероприятия и видеоархив требовали
              отдельного управления.
            </p>
            <p className={`${styles.sectionText} ${styles.fadeUp}`}>
              Нужно было создать единую цифровую среду, которая будет удобна одновременно для
              родителей и команды клуба.
            </p>

            <div className={`${styles.contextVisual} ${styles.fadeUp}`}>
              <div className={styles.contextScattered}>
                <div className={styles.contextBlock}>
                  <div className={styles.contextBlockIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <div className={styles.contextBlockLabel}>Кружки</div>
                </div>
                <div className={styles.contextBlock}>
                  <div className={styles.contextBlockIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className={styles.contextBlockLabel}>Мероприятия</div>
                </div>
                <div className={styles.contextBlock}>
                  <div className={styles.contextBlockIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div className={styles.contextBlockLabel}>Видео</div>
                </div>
                <div className={styles.contextBlock}>
                  <div className={styles.contextBlockIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <div className={styles.contextBlockLabel}>VK</div>
                </div>
                <div className={styles.contextBlock}>
                  <div className={styles.contextBlockIcon}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className={styles.contextBlockLabel}>Контент</div>
                </div>
              </div>
              <div className={styles.contextMerge}>
                <div className={styles.contextMergeLine} />
              </div>
              <div className={styles.contextUnified}>
                <div className={styles.contextUnifiedTitle}>Единая цифровая среда клуба</div>
                <div className={styles.contextUnifiedSub}>Все процессы — в одной системе</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Approach ─────────────────────────────────── */}
        <section className={styles.section} id="approach">
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>Мы начали не с интерфейса</h2>
            <div className={`${styles.approachQuote} ${styles.fadeUp}`}>
              Сначала — процессы.
              <br />
              Потом — интерфейс.
            </div>
            <p className={`${styles.approachText} ${styles.fadeUp}`}>
              Мы сначала определили, какие задачи сайт должен решать для двух основных групп
              пользователей: родителей и команды клуба.
            </p>
            <p className={`${styles.approachText} ${styles.fadeUp}`}>
              <strong>Для родителей</strong> — быстро найти нужный кружок, получить информацию,
              записаться, посмотреть материалы и события.
            </p>
            <p className={`${styles.approachText} ${styles.fadeUp}`}>
              <strong>Для команды клуба</strong> — управлять контентом, архивом и отзывами из
              единой системы.
            </p>
            <p className={`${styles.approachText} ${styles.fadeUp}`}>
              После этого перешли к проектированию интерфейсов и разработке.
            </p>

            <div className={`${styles.approachFlow} ${styles.fadeUp}`}>
              <div className={styles.approachFlowStep}>Задачи</div>
              <div className={styles.approachFlowArrow}>→</div>
              <div className={styles.approachFlowStep}>Процессы</div>
              <div className={styles.approachFlowArrow}>→</div>
              <div className={styles.approachFlowStep}>Архитектура</div>
              <div className={styles.approachFlowArrow}>→</div>
              <div className={styles.approachFlowStep}>Интерфейс</div>
              <div className={styles.approachFlowArrow}>→</div>
              <div className={styles.approachFlowStep}>Продукт</div>
            </div>
          </div>
        </section>

        {/* ── Features Grid ────────────────────────────── */}
        <section className={styles.section} id="features">
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>Единая цифровая среда клуба</h2>

            <div className={styles.featuresGrid}>
              <div className={`${styles.featureCard} ${styles.fadeUp}`}>
                <div className={styles.featureCardPreview}>
                  <div className={styles.previewCatalog}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div className={styles.previewCatalogItem} key={i}>
                        <div className={styles.bar} />
                        <div className={styles.bar} />
                        <div className={styles.btn} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.featureCardTitle}>Каталог кружков</div>
                <div className={styles.featureCardDesc}>
                  Карточки кружков, подробная информация и возможность записи.
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.fadeUp}`}>
                <div className={styles.featureCardPreview}>
                  <div className={styles.previewEvents}>
                    <div className={styles.search} />
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div className={styles.eventItem} key={i}>
                        <div className={styles.eventDate} />
                        <div className={styles.eventLines}>
                          <div className={styles.line} />
                          <div className={styles.line} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.featureCardTitle}>Архив мероприятий</div>
                <div className={styles.featureCardDesc}>
                  История мероприятий клуба с полнотекстовым поиском.
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.fadeUp}`}>
                <div className={styles.featureCardPreview}>
                  <div className={styles.previewVideo}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div className={styles.previewVideoItem} key={i}>
                        <div className={styles.previewVideoThumb}>
                          <div className={styles.play} />
                        </div>
                        <div className={styles.vline} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.featureCardTitle}>Видеоархив</div>
                <div className={styles.featureCardDesc}>
                  Собранная в одном месте коллекция видео клуба.
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.fadeUp}`}>
                <div className={styles.featureCardPreview}>
                  <div className={styles.previewVk}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div className={styles.previewVkItem} key={i}>
                        <div className={styles.previewVkAvatar} />
                        <div className={styles.previewVkContent}>
                          <div className={styles.line} />
                          <div className={styles.line} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.featureCardTitle}>Синхронизация с ВКонтакте</div>
                <div className={styles.featureCardDesc}>
                  Автоматическая загрузка записей и видео из сообщества клуба через VK API.
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.fadeUp}`}>
                <div className={styles.featureCardPreview}>
                  <div className={styles.previewCms}>
                    <div className={styles.previewCmsToolbar}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div className={styles.tool} key={i} />
                      ))}
                    </div>
                    <div className={styles.previewCmsEditor}>
                      <div className={styles.line} />
                      <div className={styles.line} />
                      <div className={styles.line} />
                    </div>
                  </div>
                </div>
                <div className={styles.featureCardTitle}>CMS</div>
                <div className={styles.featureCardDesc}>
                  Команда клуба самостоятельно управляет контентом сайта.
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.fadeUp}`}>
                <div className={styles.featureCardPreview}>
                  <div className={styles.previewModeration}>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div className={styles.previewReview} key={i}>
                        <div className={styles.previewReviewText}>
                          <div className={styles.line} />
                          <div className={styles.line} />
                        </div>
                        <div className={styles.previewReviewActions}>
                          <span className={`${styles.action} ${styles.approve}`} />
                          <span className={`${styles.action} ${styles.reject}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.featureCardTitle}>Модерация отзывов</div>
                <div className={styles.featureCardDesc}>
                  Отзывы проходят отдельный процесс модерации перед публикацией.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VK Integration ───────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.vkSection} ${styles.fadeUp}`}>
              <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>
                Контент больше не нужно
                <br />
                переносить вручную
              </h2>
              <p className={`${styles.sectionText} ${styles.fadeUp}`} style={{ textAlign: "center", margin: `${"16px"} auto 0` }}>
                Сайт автоматически получает необходимые материалы из сообщества Клуба «Парус»
                через VK API.
              </p>
              <div className={styles.vkFlow}>
                <div className={styles.vkFlowNode}>ВКонтакте</div>
                <div className={styles.vkFlowArrow} />
                <div className={styles.vkFlowNode}>API</div>
                <div className={styles.vkFlowArrow} />
                <div className={styles.vkFlowNode}>Сайт</div>
                <div className={styles.vkFlowArrow} />
                <div className={styles.vkFlowNode}>Архив</div>
              </div>
              <p className={styles.vkNote}>
                Интеграция сокращает ручную работу команды и помогает поддерживать сайт актуальным
                без дополнительных усилий.
              </p>
            </div>
          </div>
        </section>

        {/* ── SEO & Analytics ──────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>Запустить сайт — недостаточно</h2>
            <div className={styles.seoGrid}>
              <div className={`${styles.seoCard} ${styles.fadeUp}`}>
                <div className={styles.seoCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div className={styles.seoCardTitle}>SEO</div>
                <div className={styles.seoCardDesc}>
                  Миграция домена с сохранением SEO-параметров и настройка микроразметки Schema.org.
                </div>
              </div>
              <div className={`${styles.seoCard} ${styles.fadeUp}`}>
                <div className={styles.seoCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div className={styles.seoCardTitle}>Аналитика</div>
                <div className={styles.seoCardDesc}>
                  Яндекс.Метрика и настроенные цели для отслеживания действий пользователей.
                </div>
              </div>
              <div className={`${styles.seoCard} ${styles.fadeUp}`}>
                <div className={styles.seoCardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className={styles.seoCardTitle}>Производительность</div>
                <div className={styles.seoCardDesc}>
                  Загрузка страниц менее 2,5 секунды на любых устройствах.
                </div>
              </div>
            </div>
            <div className={`${styles.seoMetric} ${styles.fadeUp}`}>
              <div className={styles.seoMetricValue}>
                {"< "}
                <span data-counter data-target="2.5" data-decimal="true">
                  0
                </span>
                {" сек"}
              </div>
              <PerformanceChart />
            </div>
          </div>
        </section>

        {/* ── Tech Stack ───────────────────────────────── */}
        <section className={styles.section} id="tech">
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>Под капотом</h2>
            <p className={`${styles.sectionText} ${styles.fadeUp}`}>
              Технологический стек, обеспечивающий надёжность и масштабируемость продукта.
            </p>
            <div className={styles.techGrid}>
              <div className={`${styles.techCard} ${styles.fadeUp}`}>
                <div className={styles.techCardLabel}>Backend</div>
                <div className={styles.techCardValue}>
                  PHP 8.3+
                  <br />
                  Laravel 13
                </div>
              </div>
              <div className={`${styles.techCard} ${styles.fadeUp}`}>
                <div className={styles.techCardLabel}>Frontend</div>
                <div className={styles.techCardValue}>
                  React 19
                  <br />
                  Vite · Tailwind CSS 4
                </div>
              </div>
              <div className={`${styles.techCard} ${styles.fadeUp}`}>
                <div className={styles.techCardLabel}>Database</div>
                <div className={styles.techCardValue}>
                  MySQL 8
                  <br />
                  MariaDB
                </div>
              </div>
              <div className={`${styles.techCard} ${styles.fadeUp}`}>
                <div className={styles.techCardLabel}>Integrations</div>
                <div className={styles.techCardValue}>VK API</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Responsive / Devices ─────────────────────── */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`}>Один продукт — любой экран</h2>
            <div className={`${styles.devicesShowcase} ${styles.fadeUp}`}>
              <DeviceBrowser spec={DEVICES.phone} />
              <DeviceBrowser spec={DEVICES.tablet} />
              <DeviceBrowser spec={DEVICES.laptop} />
              <DeviceBrowser spec={DEVICES.desktop} />
            </div>
            <div className={`${styles.devicesLabel} ${styles.fadeUp}`}>320 → 1920 px</div>
          </div>
        </section>

        {/* ── Results ──────────────────────────────────── */}
        <section className={styles.resultsSection} id="result">
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`} style={{ textAlign: "center" }}>
              Что получилось
            </h2>
            <p className={`${styles.sectionText} ${styles.fadeUp}`} style={{ textAlign: "center", margin: "0 auto" }}>
              Новый сайт стал единой точкой доступа к информации о клубе, кружках, мероприятиях и
              видеоархиву. Родители получают удобный интерфейс для взаимодействия с клубом, а
              команда — единую систему управления контентом.
            </p>
            <div className={styles.resultsMetrics}>
              <div className={`${styles.resultCard} ${styles.fadeUp}`}>
                <div className={styles.resultCardValue}>
                  <span data-counter data-target="11">
                    0
                  </span>{" "}
                  этапов
                </div>
                <div className={styles.resultCardLabel}>разработки</div>
              </div>
              <div className={`${styles.resultCard} ${styles.fadeUp}`}>
                <div className={styles.resultCardValue}>
                  {"< "}
                  <span data-counter data-target="2.5" data-decimal="true">
                    0
                  </span>{" "}
                  сек
                </div>
                <div className={styles.resultCardLabel}>загрузка страниц</div>
              </div>
              <div className={`${styles.resultCard} ${styles.fadeUp}`}>
                <div className={styles.resultCardValue}>320–1920 px</div>
                <div className={styles.resultCardLabel}>адаптив</div>
              </div>
              <div className={`${styles.resultCard} ${styles.fadeUp}`}>
                <div className={styles.resultCardValue}>VK API</div>
                <div className={styles.resultCardLabel}>автоматическая синхронизация</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Continuation ─────────────────────────────── */}
        <section className={styles.continuationSection}>
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`} style={{ textAlign: "center" }}>
              Но проект не закончился на релизе
            </h2>
            <div className={`${styles.continuationBigText} ${styles.fadeUp}`}>
              Сайт запустили.
              <br />
              Работу продолжили.
            </div>
            <p className={`${styles.continuationText} ${styles.fadeUp}`}>
              После завершения разработки Клуб «Парус» перешёл на модель постпроектного
              сопровождения. Теперь «Глори.Цифра» отвечает не только за созданный продукт, но и
              за его дальнейшее развитие, поддержку и масштабирование.
            </p>
            <div className={`${styles.continuationFlow} ${styles.fadeUp}`}>
              <div className={styles.continuationFlowStep}>Разработка</div>
              <div className={styles.continuationFlowArrow}>→</div>
              <div className={styles.continuationFlowStep}>Запуск</div>
              <div className={styles.continuationFlowArrow}>→</div>
              <div className={styles.continuationFlowStep}>Сопровождение</div>
              <div className={styles.continuationFlowArrow}>→</div>
              <div className={styles.continuationFlowStep}>Развитие</div>
            </div>
          </div>
        </section>

        {/* ── Partnership ──────────────────────────────── */}
        <section className={styles.partnershipSection}>
          <div className={styles.container}>
            <div className={`${styles.partnershipCard} ${styles.fadeUp}`}>
              <div className={styles.partnershipHeader}>Глори.Цифра × Клуб «Парус»</div>
              <div className={styles.partnershipTitle}>Цифровое партнёрство</div>
              <div className={styles.partnershipSubtitle}>Не просто подрядчик — часть команды</div>
              <div className={styles.partnershipList}>
                <div className={styles.partnershipListItem}>Разработка</div>
                <div className={styles.partnershipListItem}>Сопровождение</div>
                <div className={styles.partnershipListItem}>Развитие</div>
                <div className={styles.partnershipListItem}>Масштабирование</div>
              </div>
              <p className={styles.partnershipQuote}>
                Для нас цифровой продукт не заканчивается в момент релиза. Мы остаёмся рядом с
                клиентом и продолжаем развивать систему вместе с его задачами.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA / Lead Form ──────────────────────────── */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={`${styles.sectionTitle} ${styles.fadeUp}`} style={{ textAlign: "center" }}>
              Следующий проект может начаться с задачи
            </h2>
            <p className={`${styles.sectionText} ${styles.fadeUp}`} style={{ textAlign: "center", margin: "0 auto" }}>
              Расскажите, какую задачу нужно решить. Мы разберём процессы, предложим решение и
              возьмём на себя его реализацию.
            </p>
            <div className={styles.leadFormWrap}>
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
