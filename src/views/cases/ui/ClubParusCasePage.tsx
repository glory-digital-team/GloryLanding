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
const IMG = "/cases/club-parus";

const ISLANDS = ["Кружки", "Мероприятия", "Видео", "ВКонтакте", "Контент"];

const STEPS = ["Задачи", "Процессы", "Архитектура", "Интерфейс", "Продукт"];

const CARGO = [
  {
    title: "Каталог кружков с записью",
    text: "Родитель находит кружок и записывается прямо на сайте.",
  },
  {
    title: "Архив мероприятий с поиском",
    text: "Мероприятие находится по любому слову из описания.",
  },
  { title: "Видеоархив", text: "Записи клуба собраны в одном месте." },
  {
    title: "Синхронизация с ВКонтакте",
    text: "Записи из сообщества попадают на сайт автоматически.",
  },
  { title: "CMS для команды", text: "Контент и архив команда правит сама." },
  { title: "Модерация отзывов", text: "Отзывы появляются на сайте после проверки." },
];

const SPECS = [
  { key: "этапов", value: "11, от проектирования до запуска" },
  { key: "загрузка", value: "< 2,5 сек" },
  { key: "экраны", value: "320–1920 px" },
  { key: "backend", value: "PHP 8.3+, Laravel 13" },
  { key: "frontend", value: "React 19, Vite, Tailwind CSS 4" },
  { key: "данные", value: "MySQL 8, MariaDB" },
  { key: "связь", value: "VK API" },
];

// Кейс «Парус» как рейс в бортовом журнале: семь глав вместо стандартного шаблона.
// Серверный компонент без клиентского JS: анимации и счётчики не нужны, весь контент
// отдаётся в HTML. Шапка/подвал, крошки, форма и перелинковка — общие с остальными кейсами.
export function ClubParusCasePage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <CaseViewTracker slug="club-parus" />

        {/* Отправление */}
        <section className={styles.hero} aria-labelledby="parus-title">
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
              <p className={styles.kicker}>Кейс Глори.Цифра · АНО Клуб «Парус»</p>
              <h1 className={styles.title} id="parus-title">
                <span className={styles.titleLead}>{PARUS.h1}</span>
                <span className={styles.titleMain}>
                  Пять островов.
                  <br />
                  <em>Один порт.</em>
                </span>
              </h1>
              <p className={styles.lead}>
                Кружки, мероприятия, видео, ВКонтакте и контент клуба жили отдельно. Мы собрали их в
                одну систему и остались на борту.
              </p>
              <div className={styles.actions}>
                <a
                  href="#lead-form"
                  className={cn(styles.btn, styles.btnCoral)}
                  data-cta="case_hero_lead_club-parus"
                >
                  Хочу так же для своего клуба
                </a>
                <a
                  href="#mayak"
                  className={cn(styles.btn, styles.btnGhost)}
                  data-cta="case_hero_result_club-parus"
                >
                  Сразу к результату ↓
                </a>
              </div>
            </div>
            <div className={styles.heroVis}>
              <div className={styles.emblem}>
                <Image
                  src={`${IMG}/emblem-ring.png`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 112px, 400px"
                  className={styles.emblemRing}
                  aria-hidden="true"
                />
                <Image
                  src={`${IMG}/logo.png`}
                  alt="Логотип клуба «Парус»"
                  width={512}
                  height={556}
                  sizes="(max-width: 640px) 70px, 232px"
                  className={styles.emblemLogo}
                  priority
                />
              </div>
              <div className={styles.heroStat}>
                <div className={styles.bigNum}>+20%</div>
                <div className={styles.bigNumLabel}>заявок на кружки в месяц</div>
              </div>
            </div>
          </div>
          <Image
            src={`${IMG}/wave-top.png`}
            alt=""
            width={1600}
            height={159}
            sizes="100vw"
            className={cn(styles.wave, styles.waveTop)}
            aria-hidden="true"
          />
        </section>

        {/* Глава 1 */}
        <section className={styles.start} aria-labelledby="parus-start">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Глава 1 · Точка отправления</p>
            <div className={styles.startGrid}>
              <div className={styles.startText}>
                <h2 className={styles.h2} id="parus-start" style={{ marginTop: 0 }}>
                  Задача была больше, чем новый сайт
                </h2>
                <p className={styles.text}>
                  Клуб работает с детьми и родителями. Кружки, мероприятия, сообщество ВКонтакте и
                  большой видеоархив велись раздельно. Родителю было трудно найти кружок и
                  записаться, а команда обновляла контент вручную и редко.
                </p>
              </div>
              <ul className={styles.map} aria-label="Что нужно было объединить">
                {ISLANDS.map((name) => (
                  <li key={name} className={styles.island}>
                    {name}
                  </li>
                ))}
                <li className={styles.port} aria-label="Цель: единая цифровая среда">
                  <span className={styles.portLabel}>ПОРТ НАЗНАЧЕНИЯ</span>
                  <span className={styles.portName}>Единая цифровая среда</span>
                </li>
                <li className={styles.boat} aria-hidden="true">
                  <Image
                    src={`${IMG}/boat.webp`}
                    alt=""
                    width={395}
                    height={300}
                    sizes="110px"
                    loading="lazy"
                  />
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Глава 2 */}
        <section className={styles.course} aria-labelledby="parus-course">
          <div className={cn(styles.wrap, styles.coursePad)}>
            <p className={styles.eyebrow}>Глава 2 · Прокладываем курс</p>
            <h2 className={styles.motto} id="parus-course">
              Сначала процессы.
              <span>Потом интерфейс.</span>
            </h2>
            <p className={styles.text} style={{ maxWidth: 640 }}>
              Разобрали, что нужно родителям и что нужно команде клуба, и только потом нарисовали
              первый экран.
            </p>
            <ol className={styles.steps}>
              {STEPS.map((name, i) => (
                <li key={name} className={styles.step}>
                  <div className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.stepName}>{name}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Глава 3 */}
        <section className={styles.aboard} aria-labelledby="parus-aboard">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Глава 3 · На борту</p>
            <h2 className={styles.h2} id="parus-aboard" style={{ maxWidth: 820 }}>
              Что получили родители и команда клуба
            </h2>
            <div className={styles.aboardGrid}>
              <div
                className={styles.photos}
                tabIndex={0}
                role="group"
                aria-label="Фотографии клуба"
              >
                <figure className={styles.polaroid}>
                  <Image
                    src={`${IMG}/photo-circle.jpg`}
                    alt="Занятие в кружке клуба"
                    width={1680}
                    height={945}
                    sizes="(max-width: 640px) 72vw, 380px"
                    loading="lazy"
                  />
                  <figcaption>кружки</figcaption>
                </figure>
                <figure className={styles.polaroid}>
                  <Image
                    src={`${IMG}/photo-event.jpg`}
                    alt="Выступление на мероприятии клуба"
                    width={1280}
                    height={960}
                    sizes="(max-width: 640px) 72vw, 340px"
                    loading="lazy"
                  />
                  <figcaption>мероприятия</figcaption>
                </figure>
                <figure className={styles.polaroid}>
                  <Image
                    src={`${IMG}/photo-club.webp`}
                    alt="Здание клуба «Парус»"
                    width={1600}
                    height={1200}
                    sizes="(max-width: 640px) 72vw, 350px"
                    loading="lazy"
                  />
                  <figcaption>клуб «Парус»</figcaption>
                </figure>
                <Image
                  src={`${IMG}/flags.webp`}
                  alt=""
                  width={480}
                  height={185}
                  sizes="180px"
                  className={styles.flags}
                  aria-hidden="true"
                  loading="lazy"
                />
              </div>
              <div className={styles.manifest}>
                <h3 className={styles.manifestHead}>Грузовой манифест</h3>
                <ol className={styles.cargo}>
                  {CARGO.map((c) => (
                    <li key={c.title} className={styles.cargoItem}>
                      <div>
                        <strong className={styles.cargoTitle}>{c.title}</strong>
                        <span className={styles.cargoText}>{c.text}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Глава 4 */}
        <section className={styles.mayak} id="mayak" aria-labelledby="parus-mayak">
          <div className={cn(styles.wrap, styles.mayakInner)}>
            <Image
              src={`${IMG}/lighthouse.webp`}
              alt=""
              width={632}
              height={980}
              sizes="(max-width: 640px) 120px, 230px"
              className={styles.lighthouse}
              aria-hidden="true"
              loading="lazy"
            />
            <div className={styles.mayakBody}>
              <p className={styles.eyebrow}>Глава 4 · Маяк</p>
              <h2 className={styles.h2} id="parus-mayak">
                Что изменилось для клуба
              </h2>
              <dl className={styles.stats}>
                <div className={cn(styles.stat, styles.statRev)}>
                  <dt className={styles.statLabel}>заявок на кружки в месяц</dt>
                  <dd className={styles.statNum}>+20%</dd>
                </div>
                <div className={styles.stat}>
                  <dt className={styles.statLabel} style={{ margin: 0 }}>
                    <s className={styles.statWas}>вручную и редко</s>
                  </dt>
                  <dd style={{ margin: 0 }}>
                    <p className={styles.statNow}>автоматически и часто</p>
                    <p className={styles.statLabel}>обновление контента на сайте</p>
                  </dd>
                </div>
                <div className={cn(styles.stat, styles.statRev)}>
                  <dt className={styles.statLabel}>звонков с сайта</dt>
                  <dd className={styles.statNum}>+30%</dd>
                </div>
              </dl>
              <p className={styles.mayakNote}>После запуска сайта спрос на кружки вырос.</p>
              <p className={styles.mayakSource}>Заявки и звонки: оценка клуба «Парус».</p>
              <div className={cn(styles.actions, styles.mayakActions)}>
                <Link
                  href="/raschet-stoimosti/"
                  className={cn(styles.btn, styles.btnCoral)}
                  data-cta="case_result_calc_club-parus"
                >
                  Рассчитать похожий проект
                </Link>
                {PARUS.liveUrl ? (
                  <a
                    href={PARUS.liveUrl}
                    className={cn(styles.btn, styles.btnGhost)}
                    target="_blank"
                    rel="noopener"
                    data-cta="case_live_club-parus"
                  >
                    Открыть {PARUS.liveLabel} ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Глава 5 */}
        <section className={styles.captain} aria-labelledby="parus-captain">
          <div className={styles.wrap}>
            <figure className={styles.letter}>
              <div className={styles.stamp} aria-hidden="true">
                СЛОВО
                <br />
                КАПИТАНА
              </div>
              <p className={styles.eyebrow} id="parus-captain">
                Глава 5 · Запись в журнале
              </p>
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

        {/* Глава 6 */}
        <section className={styles.engine} aria-labelledby="parus-engine">
          <div className={cn(styles.wrap, styles.engineInner)}>
            <div className={styles.engineHead}>
              <p className={styles.eyebrow}>Глава 6 · Машинное отделение</p>
              <h2 className={styles.h2} id="parus-engine">
                Под капотом
              </h2>
              <p>
                Перенесли домен и сохранили SEO-параметры, настроили микроразметку Schema.org и
                Яндекс.Метрику с целями. Подробнее об услугах:{" "}
                <Link href="/razrabotka-saitov/">разработка сайтов</Link>,{" "}
                <Link href="/integracii/">интеграции</Link>, <Link href="/seo/">SEO</Link>.
              </p>
            </div>
            <dl className={styles.specs}>
              {SPECS.map((s) => (
                <div key={s.key} className={styles.specRow}>
                  <dt>{s.key}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Глава 7 */}
        <section className={styles.watch} aria-labelledby="parus-watch">
          <Image
            src={`${IMG}/wave-mid.webp`}
            alt=""
            width={2172}
            height={724}
            sizes="100vw"
            className={cn(styles.wave, styles.waveMid)}
            aria-hidden="true"
            loading="lazy"
          />
          <div className={cn(styles.wrap, styles.watchBody)}>
            <p className={styles.eyebrow}>Глава 7 · Вахта продолжается</p>
            <h2 className={styles.watchTitle} id="parus-watch">
              Сайт запустили. <em>Работу продолжили.</em>
            </h2>
            <p className={styles.watchText}>
              После запуска клуб остался у нас на сопровождении: мы поддерживаем систему и развиваем
              её вместе с клубом.
            </p>
          </div>
        </section>

        {/* Следующий порт */}
        <section className={styles.next} aria-labelledby="parus-next">
          <div className={cn(styles.wrap, styles.nextInner)}>
            <div className={styles.nextBody}>
              <p className={styles.eyebrow}>Следующий порт</p>
              <h2 className={styles.nextTitle} id="parus-next">
                Ваш клуб или школа следующие?
              </h2>
              <p className={styles.nextText}>
                Рассчитайте стоимость в калькуляторе или получите бесплатный экспресс-аудит на 15
                минут.
              </p>
              <div className={styles.actions}>
                <Link
                  href="/raschet-stoimosti/"
                  className={cn(styles.btn, styles.btnNavy)}
                  data-cta="case_footer_calc_club-parus"
                >
                  Рассчитать проект
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
            <Image
              src={`${IMG}/sail.png`}
              alt=""
              width={664}
              height={720}
              sizes="240px"
              className={styles.sail}
              aria-hidden="true"
              loading="lazy"
            />
          </div>
          <Image
            src={`${IMG}/wave-bottom.webp`}
            alt=""
            width={2172}
            height={724}
            sizes="100vw"
            className={cn(styles.wave, styles.waveBottom)}
            aria-hidden="true"
            loading="lazy"
          />
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
