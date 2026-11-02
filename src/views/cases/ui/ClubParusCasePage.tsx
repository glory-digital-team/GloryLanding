import Image from "next/image";
import Link from "next/link";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { cn } from "@/shared/lib";
import { getCase } from "@/entities/case";
import { CaseRelated } from "./CaseRelated";
import { CaseViewTracker } from "./CaseViewTracker";
import styles from "./ClubParusCasePage.module.scss";

const PARUS = getCase("club-parus")!;

const TAGS = ["НКО", "Автоматизация контента", "Интеграция с VK API", "Сопровождение"];

const SOURCES = ["Кружки", "Мероприятия", "Видеоархив", "ВКонтакте", "Контент сайта"];

const PARENTS = [
  { title: "Каталог кружков с записью", text: "Нашёл кружок и записался прямо на сайте." },
  {
    title: "Архив мероприятий с поиском",
    text: "Мероприятие находится по любому слову из описания.",
  },
  { title: "Видеоархив", text: "Записи клуба собраны в одном месте." },
];

const TEAM = [
  { title: "Автозагрузка из ВКонтакте", text: "Записи сообщества попадают на сайт сами." },
  { title: "CMS для команды", text: "Контент и архив команда правит сама." },
  { title: "Модерация отзывов", text: "Отзывы появляются после проверки." },
];

const STEPS = [
  { name: "Разбор процессов", text: "Как клуб работает сейчас" },
  { name: "Две аудитории", text: "Родители и команда" },
  { name: "Архитектура", text: "Данные и интеграции" },
  { name: "Разработка", text: "Интерфейс и тесты" },
  { name: "Запуск и сопровождение", text: "Работаем с клубом дальше" },
];

const SPECS = [
  { key: "этапов", value: "11, от проектирования до запуска" },
  { key: "загрузка", value: "< 2,5 сек" },
  { key: "экраны", value: "320–1920 px" },
  { key: "backend", value: "PHP 8.3+, Laravel 13" },
  { key: "frontend", value: "React 19, Vite, Tailwind CSS 4" },
  { key: "данные", value: "MySQL 8, MariaDB" },
  { key: "интеграции", value: "VK API" },
];

// Кейс «Парус» в фирменном стиле студии. Серверный компонент без клиентского JS: весь контент
// отдаётся в HTML. Шапка/подвал, крошки, форма и перелинковка общие с остальными кейсами.
export function ClubParusCasePage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <CaseViewTracker slug="club-parus" />

        {/* Первый экран */}
        <section className={cn(styles.hero, styles.gridDark)} aria-labelledby="parus-title">
          <div className={styles.glow} aria-hidden="true" />
          <div className={cn(styles.wrap, styles.heroInner)}>
            <Breadcrumbs
              items={[
                { label: "Кейсы", href: "/cases/" },
                { label: PARUS.name, href: "/cases/club-parus/" },
              ]}
              className={styles.crumbs}
              tone="dark"
            />
            <div className={styles.heroText}>
              <div className={styles.brandRow}>
                <Image
                  className={styles.brandMark}
                  src="/logo-mark-light.svg"
                  alt=""
                  width={44}
                  height={44}
                  unoptimized
                />
                <p className={styles.titleLead} style={{ margin: 0 }}>
                  Кейс 01 · АНО Клуб «Парус» · детский досуг
                </p>
              </div>
              <h1 className={styles.title} id="parus-title">
                <span className={styles.titleLead}>{PARUS.h1}</span>
                Собрали клуб
                <br />
                в одну систему.
                <br />
                <span className={styles.titleAccent}>Заявок стало больше.</span>
              </h1>
              <p className={styles.heroLead}>
                Кружки, мероприятия, видео, ВКонтакте и контент жили в разных местах. Мы соединили
                их, автоматизировали обновление и остались с клубом на сопровождении.
              </p>
              <div className={styles.actions}>
                <Link
                  href="/raschet-stoimosti/"
                  className={cn(styles.btn, styles.btnRed)}
                  data-cta="case_hero_calc_club-parus"
                >
                  Рассчитать похожий проект
                </Link>
                <a
                  href="#result"
                  className={cn(styles.btn, styles.btnLine)}
                  data-cta="case_hero_result_club-parus"
                >
                  Смотреть результат ↓
                </a>
              </div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.bigNum}>
                +20<span>%</span>
              </div>
              <p className={styles.bigNumLabel}>заявок на кружки в месяц</p>
            </div>
          </div>
          <div className={styles.tags}>
            <div className={styles.wrap}>
              <ul className={styles.tagList} aria-label="Что входило в проект">
                {TAGS.map((t) => (
                  <li key={t} className={styles.tag}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 01 Задача */}
        <section className={cn(styles.section, styles.gridLight)} aria-labelledby="parus-task">
          <div className={styles.wrap}>
            <span className={styles.bar} aria-hidden="true" />
            <p className={styles.eyebrow}>01 · Задача</p>
            <h2 className={styles.h2} id="parus-task" style={{ maxWidth: 820 }}>
              Пять разрозненных мест вместо одной системы
            </h2>
            <p className={styles.lead}>
              Родителю было трудно найти кружок и записаться. Команда обновляла контент вручную и
              редко, а записи ВКонтакте до сайта не доходили.
            </p>
            <div className={styles.diagram}>
              <ul className={styles.sources} aria-label="Что нужно было объединить">
                {SOURCES.map((name, i) => (
                  <li key={name} className={styles.source}>
                    {name}
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
              <svg
                className={styles.lines}
                viewBox="0 0 400 340"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <g fill="none" stroke="#CC0000" strokeWidth="2">
                  <path d="M0 30 C 200 30, 200 170, 400 170" />
                  <path d="M0 100 C 200 100, 200 170, 400 170" />
                  <path d="M0 170 L 400 170" />
                  <path d="M0 240 C 200 240, 200 170, 400 170" />
                  <path d="M0 310 C 200 310, 200 170, 400 170" />
                </g>
                <g fill="#CC0000">
                  {[30, 100, 170, 240, 310].map((y) => (
                    <circle key={y} cx="0" cy={y} r="5" />
                  ))}
                </g>
              </svg>
              <div className={styles.system}>
                <p className={styles.eyebrow}>Одна система</p>
                <p className={styles.systemTitle}>
                  Сайт клуба с записью, архивом и автозагрузкой из ВКонтакте
                </p>
                <p className={styles.systemText}>CMS для команды · модерация отзывов · VK API</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Результат */}
        <section
          className={cn(styles.section, styles.light)}
          id="result"
          aria-labelledby="parus-result"
        >
          <div className={styles.wrap}>
            <span className={styles.bar} aria-hidden="true" />
            <p className={styles.eyebrow}>02 · Результат</p>
            <h2 className={styles.h2} id="parus-result">
              После запуска спрос на кружки вырос
            </h2>
            <ul className={styles.results}>
              <li className={cn(styles.result, styles.resultRed)}>
                <p className={styles.eyebrow}>Заявки</p>
                <div>
                  <p className={styles.resultNum}>+20%</p>
                  <p className={styles.resultLabel}>заявок на кружки в месяц</p>
                </div>
              </li>
              <li className={cn(styles.result, styles.resultDark)}>
                <p className={styles.eyebrow}>Звонки</p>
                <div>
                  <p className={styles.resultNum}>+30%</p>
                  <p className={styles.resultLabel}>звонков с сайта</p>
                </div>
              </li>
              <li className={cn(styles.result, styles.resultWhite)}>
                <p className={styles.eyebrow}>Контент</p>
                <div>
                  <p className={styles.was}>вручную и редко</p>
                  <p className={styles.now}>автоматически и часто</p>
                  <p className={cn(styles.resultLabel, styles.muted)}>
                    обновление контента на сайте
                  </p>
                </div>
              </li>
            </ul>
            <p className={styles.note}>
              Заявки и звонки: оценка клуба «Парус».
              {PARUS.liveUrl ? (
                <>
                  {" "}
                  <a
                    href={PARUS.liveUrl}
                    target="_blank"
                    rel="noopener"
                    data-cta="case_live_club-parus"
                  >
                    Открыть {PARUS.liveLabel} ↗
                  </a>
                </>
              ) : null}
            </p>
          </div>
        </section>

        {/* 03 Слово клиенту */}
        <section
          className={cn(styles.quoteSection, styles.gridDark)}
          aria-labelledby="parus-client"
        >
          <div className={cn(styles.wrap, styles.quoteInner)}>
            <p className={styles.eyebrow} id="parus-client">
              03 · Слово клиенту
            </p>
            <figure style={{ margin: 0 }}>
              <blockquote className={styles.quote}>
                «Георгий и его команда сделали нашему клубу отличный современный сайт. Всем вас
                рекомендуем!»
              </blockquote>
              <figcaption className={styles.author}>
                <span className={styles.avatar} aria-hidden="true">
                  ТП
                </span>
                <span>
                  <cite className={styles.authorName}>Татьяна Анатольевна Прохорова</cite>
                  <span className={styles.authorRole}>директор АНО Клуб «Парус»</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 04 Что получили */}
        <section className={cn(styles.section, styles.white)} aria-labelledby="parus-got">
          <div className={styles.wrap}>
            <span className={styles.bar} aria-hidden="true" />
            <p className={styles.eyebrow}>04 · Что получили</p>
            <h2 className={styles.h2} id="parus-got">
              Родителям проще записаться.
              <br />
              Команде проще вести клуб.
            </h2>
            <div className={styles.audiences}>
              <div className={styles.audience}>
                <h3 className={styles.eyebrow}>Родителям</h3>
                <ol className={styles.feats}>
                  {PARENTS.map((f, i) => (
                    <li key={f.title} className={styles.feat}>
                      <span className={styles.featNum} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <strong className={styles.featTitle}>{f.title}</strong>
                        <span className={styles.featText}>{f.text}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={cn(styles.audience, styles.audienceDark)}>
                <h3 className={styles.eyebrow}>Команде клуба</h3>
                <ol className={styles.feats}>
                  {TEAM.map((f, i) => (
                    <li key={f.title} className={styles.feat}>
                      <span className={styles.featNum} aria-hidden="true">
                        {String(i + 4).padStart(2, "0")}
                      </span>
                      <div>
                        <strong className={styles.featTitle}>{f.title}</strong>
                        <span className={styles.featText}>{f.text}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 05 Как работали */}
        <section className={cn(styles.section, styles.gridLight)} aria-labelledby="parus-how">
          <div className={styles.wrap}>
            <span className={styles.bar} aria-hidden="true" />
            <p className={styles.eyebrow}>05 · Как работали</p>
            <h2 className={styles.h2} id="parus-how">
              Сначала процессы. Потом интерфейс.
            </h2>
            <ol className={styles.steps}>
              {STEPS.map((s, i) => (
                <li
                  key={s.name}
                  className={cn(styles.step, i === STEPS.length - 1 && styles.stepLast)}
                >
                  <div className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.stepName}>{s.name}</div>
                  <div className={styles.stepText}>{s.text}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 06 Под капотом */}
        <section className={cn(styles.engine, styles.gridDark)} aria-labelledby="parus-engine">
          <div className={cn(styles.wrap, styles.engineInner)}>
            <div className={styles.engineHead}>
              <span className={styles.bar} aria-hidden="true" />
              <p className={styles.eyebrow}>06 · Под капотом</p>
              <h2 className={styles.h2} id="parus-engine">
                Перенесли домен без потерь
              </h2>
              <p>
                Сохранили SEO-параметры, настроили микроразметку Schema.org и Яндекс.Метрику с
                целями. Услуги в этом проекте:{" "}
                <Link href="/razrabotka-saitov/">разработка сайтов</Link>,{" "}
                <Link href="/integracii/">интеграции</Link>, <Link href="/seo/">SEO</Link>,{" "}
                <Link href="/podderzhka/">поддержка</Link>.
              </p>
            </div>
            <dl className={styles.specs}>
              {SPECS.map((s) => (
                <div key={s.key} className={styles.spec}>
                  <dt>{s.key}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Призыв */}
        <section className={cn(styles.section, styles.light)} id="cta" aria-labelledby="parus-cta">
          <div className={styles.wrap}>
            <div className={cn(styles.ctaBox, styles.gridDark)}>
              <p className={styles.eyebrow}>Следующий проект</p>
              <h2 className={styles.h2} id="parus-cta">
                Нужна такая же система для вашего клуба или школы?
              </h2>
              <p className={styles.ctaText}>
                Рассчитайте стоимость в калькуляторе или получите бесплатный экспресс-аудит на 15
                минут.
              </p>
              <div className={styles.actions}>
                <Link
                  href="/raschet-stoimosti/"
                  className={cn(styles.btn, styles.btnRed)}
                  data-cta="case_footer_calc_club-parus"
                >
                  Рассчитать похожий проект
                </Link>
                <Link
                  href="/diagnostic/"
                  className={cn(styles.btn, styles.btnWhite)}
                  data-cta="case_footer_audit_club-parus"
                >
                  Бесплатный экспресс-аудит
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CaseRelated item={PARUS} />

        <div className={styles.leadWrap}>
          <LeadForm
            formId="case_club-parus"
            title="Обсудить проект"
            text=""
            context="кейс Клуб «Парус»"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
