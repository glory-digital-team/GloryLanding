import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { Button } from "@/shared/ui/Button";
import type { Document } from "../model/documents";
import styles from "./DocumentCard.module.scss";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>
        <Icon name={document.icon} size={24} />
      </div>
      <h3 className={styles.title}>{document.title}</h3>
      <p className={styles.description}>{document.description}</p>
      <Button
        variant="secondary"
        size="md"
        iconRight="arrow-right"
        href={document.href}
      >
        Открыть
      </Button>
    </article>
  );
}
