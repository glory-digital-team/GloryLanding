import { PAGES } from "./pages.data";
import type { PageContent } from "./types";

export type { PageBlock, PageContent } from "./types";

export function pageContent(path: string): PageContent {
  const page = PAGES[path];
  if (!page) throw new Error(`Нет контента для ${path} в pages.data.ts`);
  return page;
}

/** Блок по рабочему заголовку из реестра (устойчивее, чем по индексу). */
export function pageBlock(path: string, title: string) {
  const block = pageContent(path).blocks.find((b) => b.title === title);
  if (!block) throw new Error(`Нет блока «${title}» на ${path}`);
  return block;
}

/** Разбор строк вида «Вопрос? Ответ.» в FAQ. */
export function linesToFaq(lines: string[]) {
  const out: { q: string; a: string }[] = [];
  for (const line of lines) {
    const i = line.indexOf("?");
    if (i > 0) out.push({ q: line.slice(0, i + 1).trim(), a: line.slice(i + 1).trim() });
    else if (out.length) out[out.length - 1].a += ` ${line}`;
  }
  return out;
}
