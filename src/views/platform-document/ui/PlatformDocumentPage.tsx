import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { siteConfig } from "@/shared/config";
import type { PlatformDocument, TiptapNode } from "@/shared/platform/server";
import styles from "./PlatformDocumentPage.module.scss";

/** Безопасная ссылка из текста документа: только http(s), mailto и tel. */
const safeHref = (href: unknown): string | null =>
  typeof href === "string" && /^(https?:|mailto:|tel:|\/)/i.test(href) ? href : null;

/** Текст с отметками Tiptap: жирный, курсив, подчёркнутый, ссылка. */
function Text({ node }: { node: TiptapNode }) {
  let out: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") out = <strong>{out}</strong>;
    else if (mark.type === "italic") out = <em>{out}</em>;
    else if (mark.type === "underline") out = <u>{out}</u>;
    else if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      if (href !== null) out = <a href={href}>{out}</a>;
    }
  }
  return <>{out}</>;
}

function Inline({ nodes }: { nodes: TiptapNode[] | undefined }) {
  return (
    <>
      {(nodes ?? []).map((node, i) =>
        node.type === "hardBreak" ? <br key={i} /> : <Text key={i} node={node} />,
      )}
    </>
  );
}

/** Блоки раздела: абзацы, списки и подзаголовки — как их хранит редактор Штата. */
function Blocks({ nodes }: { nodes: TiptapNode[] | undefined }) {
  return (
    <>
      {(nodes ?? []).map((node, i) => {
        if (node.type === "paragraph")
          return (
            <p key={i} className={styles.paragraph}>
              <Inline nodes={node.content} />
            </p>
          );
        if (node.type === "heading")
          return (
            <h3 key={i} className={styles.paragraph}>
              <strong>
                <Inline nodes={node.content} />
              </strong>
            </h3>
          );
        if (node.type === "bulletList" || node.type === "orderedList") {
          const List = node.type === "orderedList" ? "ol" : "ul";
          return (
            <List key={i} className={styles.list}>
              {(node.content ?? []).map((item, j) => (
                <li key={j}>
                  {(item.content ?? []).map((child, k) =>
                    child.type === "paragraph" ? (
                      <Inline key={k} nodes={child.content} />
                    ) : (
                      <Blocks key={k} nodes={[child]} />
                    ),
                  )}
                </li>
              ))}
            </List>
          );
        }
        return null;
      })}
    </>
  );
}

const longDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * Документ сайта, опубликованный в «Глори.Штат» (подпроект 12): оферта, оферта на подписку, политика
 * конфиденциальности, согласие на обработку ПДн. Разделы без заголовка — вступление.
 */
export function PlatformDocumentPage({ document }: { document: PlatformDocument }) {
  // Номер раздела: считаются только разделы с заголовком.
  const numbers = document.sections.map(
    (_, i) => document.sections.slice(0, i + 1).filter((section) => section.title !== "").length,
  );
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
          <h1 className={styles.title}>{document.title}</h1>
          {document.sections.map((section, i) => {
            return (
              <section key={i} className={styles.section}>
                {section.title === "" ? null : (
                  <h2 className={styles.heading}>
                    {numbers[i]}. {section.title}
                  </h2>
                )}
                <Blocks nodes={section.body?.content} />
              </section>
            );
          })}
          <p className={styles.revision}>
            Редакция {document.n} от {longDate(document.publishedOn)} · © {siteConfig.name}
          </p>
        </article>
      </main>
    </div>
  );
}
