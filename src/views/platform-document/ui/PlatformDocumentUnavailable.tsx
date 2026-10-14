import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import styles from "./PlatformDocumentPage.module.scss";

/**
 * Документ сайта не пришёл из «Глори.Штата»: не опубликован или Штат недоступен. Своей копии текста на сайте
 * намеренно нет — утверждённая редакция живёт только в Штате, иначе документ разойдётся в двух местах.
 */
export function PlatformDocumentUnavailable() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.logoLink} aria-label={siteConfig.name}>
          <Logo size={36} wordSize={20} />
        </Link>
        <Button variant="ghost" size="sm" href="/documents/" className={styles.backButton}>
          ← Назад к документам
        </Button>
      </header>

      <main className={styles.content}>
        <article className={styles.article}>
          <p className={styles.eyebrow}>Юридическая информация</p>
          <h1 className={styles.title}>Документ временно недоступен</h1>
          <p className={styles.paragraph}>
            Текст публикуется в «Глори.Штат» и подтягивается автоматически. Попробуйте открыть страницу позже или
            напишите нам — пришлём документ на почту.
          </p>
          <p className={styles.paragraph}>
            <a href={siteConfig.contacts.emailHref}>{siteConfig.contacts.email}</a>
          </p>
        </article>
      </main>
    </div>
  );
}
