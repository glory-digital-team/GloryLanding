import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { DocumentCard } from "./DocumentCard";
import { DOCUMENTS } from "../model/documents";
import styles from "./DocumentsPage.module.scss";

export function DocumentsPage() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        <section className={styles.header}>
          <h1 className={styles.title}>Документы</h1>
          <p className={styles.subtitle}>
            Здесь собраны основы нашего сотрудничества.
          </p>
        </section>

        <section className={styles.grid}>
          {DOCUMENTS.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
