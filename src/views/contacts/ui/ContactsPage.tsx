/* eslint-disable @next/next/no-img-element */
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { LeadForm } from "@/widgets/lead-form";
import { PageHero } from "@/widgets/page-hero";
import { Section } from "@/shared/ui/Section";
import { JsonLd } from "@/shared/components/JsonLd";
import { siteConfig } from "@/shared/config";
import { ORGANIZATION_REF, absoluteUrl } from "@/shared/lib/seo";
import { pageBlock, pageContent } from "@/shared/content";
import styles from "./ContactsPage.module.scss";

// Только подтверждённое: SLA ответа, адрес офиса и NDA ждут данных от бизнеса (ТЗ §7.28).
const AFTER = [
  {
    q: "Что будет на первом разговоре?",
    a: "Уточняем задачу, текущую систему, пользователей, данные и ограничения; после этого определяем следующий шаг — оценку, аудит, прототип или discovery.",
  },
  {
    q: "Нужно ли готовое ТЗ?",
    a: "Нет, если процесс и ожидаемый результат можно описать своими словами. Если ТЗ, схема процесса или ссылка на продукт уже есть — приложите в комментарии.",
  },
  {
    q: "Где увидеть статус заявки?",
    a: "Сразу после отправки придёт письмо с кодом входа в личный кабинет: там заявка, расчёт и дальнейшие этапы проекта.",
  },
];

export function ContactsPage() {
  const page = pageContent("/contacts/");
  const { contacts, socials } = siteConfig;
  const schema = {
    "@type": "ContactPage",
    name: page.h1,
    description: page.description,
    url: absoluteUrl("/contacts/"),
    mainEntity: ORGANIZATION_REF,
  };

  return (
    <>
      <Header />
      <main>
        <JsonLd data={schema} />
        <PageHero
          crumbs={[{ label: "Контакты", href: "/contacts/" }]}
          eyebrow="Связаться"
          title={page.h1}
          lead={<p>{pageBlock("/contacts/", page.h1).lines[0]}</p>}
          footer={
            <ul className={styles.channels}>
              <li>
                <a href={contacts.phoneHref} className={styles.channel}>
                  <span className={styles.channelLabel}>Телефон</span>
                  <span className={styles.channelValue}>{contacts.phone}</span>
                </a>
              </li>
              <li>
                <a href={contacts.emailHref} className={styles.channel}>
                  <span className={styles.channelLabel}>Почта</span>
                  <span className={styles.channelValue}>{contacts.email}</span>
                </a>
              </li>
              {socials
                .filter((s) => !s.hidden)
                .map((s) => (
                  <li key={s.href}>
                    <a href={s.href} className={styles.channel} target="_blank" rel="noopener noreferrer">
                      <span className={styles.channelLabel}>
                        <img src={s.src} alt="" width={18} height={18} /> {s.label}
                      </span>
                      <span className={styles.channelValue}>Написать →</span>
                    </a>
                  </li>
                ))}
            </ul>
          }
        />

        <LeadForm
          formId="contacts"
          title="Расскажите о задаче"
          text="Для первого сообщения достаточно 2–3 предложений: что есть сейчас, какой результат нужен и есть ли ограничения по срокам или интеграциям."
          context="страница контактов"
        />

        <Section id="after" title="Что будет после заявки">
          <ol className={styles.after}>
            {AFTER.map((x) => (
              <li key={x.q}>
                <h3>{x.q}</h3>
                <p>{x.a}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="requisites" title="Реквизиты и документы" tone="soft">
          <p className={styles.geo}>Работаем с компаниями в Москве и удалённо по всей России.</p>
          <ul className={styles.req}>
            {siteConfig.requisites.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <ul className={styles.docs}>
            {siteConfig.legal.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label} →</a>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}
