import Link from "next/link";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  type PolicyPart,
} from "../model/policy";
import styles from "./PrivacyPage.module.scss";

function Part({ part }: { part: PolicyPart }) {
  if (part.type === "p") return <p className={styles.paragraph}>{part.text}</p>;
  if (part.type === "list") {
    return (
      <ul className={styles.list}>
        {part.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {part.headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {part.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Страница «Политика конфиденциальности» — глори.digital/privacy (issue #9).
export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.logoLink} aria-label={siteConfig.name}>
          <Logo size={36} wordSize={20} />
        </Link>
        <Link href="/" className={styles.back}>
          ← На главную
        </Link>
      </header>

      <main className={styles.content}>
        <article className={styles.article}>
          <p className={styles.eyebrow}>Юридическая информация</p>
          <h1 className={styles.title}>
            Политика в отношении обработки персональных данных
          </h1>

          <section className={styles.section}>
            <h2 className={styles.heading}>1. Общие положения</h2>
            {PRIVACY_INTRO.map((part, i) => (
              <Part key={i} part={part} />
            ))}
          </section>

          {PRIVACY_SECTIONS.map((block) => (
            <section key={block.heading} className={styles.section}>
              <h2 className={styles.heading}>{block.heading}</h2>
              {block.parts.map((part, i) => (
                <Part key={i} part={part} />
              ))}
            </section>
          ))}

          <p className={styles.revision}>
            Редакция от 01.01.2026 · {siteConfig.copyright}
          </p>
        </article>
      </main>
    </div>
  );
}
