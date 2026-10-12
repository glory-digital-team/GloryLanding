#!/usr/bin/env python3
"""
Импорт контента из SEO-реестра «ядро.xlsx» (листы «Страницы» и «Контент») в TypeScript.

    python3 scripts/import-content.py path/to/ядро.xlsx

Генерирует:
  src/entities/service/model/services.data.ts — страницы услуг (направлений);
  src/shared/content/pages.data.ts           — блоки остальных страниц (главная, хабы, о компании…).

Блоки со статусом «Требует бизнес-данных» в текст не попадают: это инструкции редактору,
а не публичный контент. Вместо них шаблон показывает реальные кейсы (kind: "cases") или
пропускает блок. Файлы — генерируемые: правьте xlsx и перезапускайте скрипт.
"""
import json
import re
import sys

import openpyxl

SERVICES = {
    # path: (group, navLabel, configuratorType)
    "/razrabotka-saitov/": ("sites", "Разработка сайтов", "site"),
    "/korporativnye-sajty/": ("sites", "Корпоративные сайты", "site"),
    "/landing-page/": ("sites", "Лендинги", "promo"),
    "/internet-magazin/": ("sites", "Интернет-магазины", "site"),
    "/web-prilozheniya/": ("sites", "Веб-приложения", "site"),
    "/lichnye-kabinety-b2b/": ("sites", "Личные кабинеты и B2B-порталы", "site"),
    "/razrabotka-po/": ("sites", "Разработка ПО", "site"),
    "/mvp/": ("sites", "MVP", "site"),
    "/mobilnye-prilozheniya/": ("sites", "Мобильные приложения", "mobile"),
    "/avtomatizaciya/": ("automation", "Автоматизация процессов", "site"),
    "/crm/": ("automation", "CRM на заказ", "site"),
    "/integracii/": ("automation", "Интеграции 1С, CRM, API", "site"),
    "/ai-dlya-biznesa/": ("ai", "AI для бизнеса", "ai"),
    "/ai-assistenty/": ("ai", "AI-ассистенты", "ai"),
    "/rag-baza-znanij/": ("ai", "RAG и AI-база знаний", "ai"),
    "/ai-avtomatizaciya/": ("ai", "AI-автоматизация", "ai"),
    "/ux-ui/": ("extra", "UX/UI дизайн", "site"),
    "/seo/": ("extra", "SEO-продвижение", None),
    "/podderzhka/": ("extra", "Поддержка и развитие", None),
}

# Короткие описания для меню и хаба — из блоков страницы /services/ («Название — описание»).
HUB_ALIASES = {
    "Разработка сайтов": "/razrabotka-saitov/",
    "Корпоративные сайты": "/korporativnye-sajty/",
    "Веб-приложения": "/web-prilozheniya/",
    "Личные кабинеты и B2B-порталы": "/lichnye-kabinety-b2b/",
    "Заказная разработка ПО": "/razrabotka-po/",
    "MVP": "/mvp/",
    "E-commerce": "/internet-magazin/",
    "Мобильные приложения": "/mobilnye-prilozheniya/",
    "Автоматизация бизнес-процессов": "/avtomatizaciya/",
    "CRM на заказ": "/crm/",
    "Интеграции": "/integracii/",
    "AI для бизнеса": "/ai-dlya-biznesa/",
    "AI-ассистенты": "/ai-assistenty/",
    "RAG и AI-базы знаний": "/rag-baza-znanij/",
    "AI-автоматизация": "/ai-avtomatizaciya/",
    "UX/UI": "/ux-ui/",
    "SEO": "/seo/",
    "Поддержка": "/podderzhka/",
}
LANDING_SHORT = "Посадочная под один оффер и источник трафика: структура, UX, формы и аналитика."

CASE_SLOT = re.compile(r"пример|кейс|проект|сервис|портал|систем|делали|MVP и нов|CRM и внутр", re.I)
DIAG = re.compile(r"^Когда (пора|знания|обмен|лендинг)", re.I)
PRICE = re.compile(r"(влия|бюджет|стоимост|^Факторы|оценива)", re.I)


def lines_of(text):
    return [l.strip() for l in (text or "").split("\n") if l.strip()]


def links_in(s):
    return re.findall(r"/[a-z0-9\-]+/", s or "")


def parse_faq(lines):
    items = []
    for l in lines:
        if "?" in l:
            q, a = l.split("?", 1)
            items.append({"q": q.strip() + "?", "a": a.strip()})
        elif items:
            items[-1]["a"] = (items[-1]["a"] + " " + l).strip()
    return items


def parse_defs(lines):
    out = []
    for l in lines:
        if " — " in l:
            t, d = l.split(" — ", 1)
            out.append({"title": t.strip(), "text": d.strip()})
        else:
            out.append({"title": "", "text": l})
    return out


def block_of(row, is_last):
    title = row["Рабочий заголовок"].strip()
    text = row["Готовый текст / контент блока"] or ""
    cta = row["CTA / ссылка"] or ""
    status = row["Статус"] or ""
    L = lines_of(text)
    link = (links_in(cta) or [None])[0]
    calc = "calculator" in cta or "/raschet-stoimosti/" in cta or bool(PRICE.search(title))
    if status.startswith("Требует"):
        return {"kind": "cases", "title": title} if CASE_SLOT.search(title) else None
    num = sum(1 for l in L if re.match(r"^\d+\.", l))
    q = sum(1 for l in L if "?" in l)
    dash = sum(1 for l in L if " — " in l)
    if q >= 3:
        return {"kind": "faq", "title": title, "items": parse_faq(L)}
    if num >= 3:
        return {"kind": "steps", "title": title, "items": [re.sub(r"^\d+\.\s*", "", l) for l in L], "link": link}
    if len(L) >= 3 and dash >= len(L) - 1:
        return {"kind": "defs", "title": title, "items": parse_defs(L), "link": link}
    if len(L) >= 3:
        kind = "diagnostic" if DIAG.search(title) else "list"
        return {"kind": kind, "title": title, "items": L, "link": link}
    if is_last or cta.strip().upper().startswith("CTA") and not calc and not cta.startswith("CTA:"):
        return {"kind": "cta", "title": title, "text": " ".join(L)}
    return {"kind": "price" if calc else "text", "title": title, "text": " ".join(L), "link": link}


def main(path):
    wb = openpyxl.load_workbook(path, read_only=True)

    def rows(name):
        it = list(wb[name].iter_rows(values_only=True))
        head = [str(h) for h in it[0]]
        return [dict(zip(head, r)) for r in it[1:] if any(r)]

    pages = {r["URL"]: r for r in rows("Страницы")}
    content = {}
    for r in rows("Контент"):
        content.setdefault(r["URL"], []).append(r)

    # Короткие описания услуг из хаба
    short = {}
    for r in content["/services/"]:
        for l in lines_of(r["Готовый текст / контент блока"]):
            if " — " in l:
                name, desc = l.split(" — ", 1)
                p = HUB_ALIASES.get(name.strip())
                if p:
                    short[p] = desc.strip().rstrip(".") + "."
    short["/landing-page/"] = LANDING_SHORT

    services = []
    for p, (group, nav, ctype) in SERVICES.items():
        meta = pages[p]
        rs = content[p]
        first = rs[0]
        lead = " ".join(lines_of(first["Готовый текст / контент блока"]))
        cta_label = re.sub(r"^CTA:\s*", "", first["CTA / ссылка"] or "Обсудить задачу").strip()
        blocks = []
        for i, r in enumerate(rs[1:]):
            b = block_of(r, i == len(rs) - 2)
            if b:
                blocks.append(b)
        services.append({
            "path": p,
            "slug": p.strip("/"),
            "group": group,
            "navLabel": nav,
            "short": short.get(p, ""),
            "title": meta["Итоговый Title"],
            "description": meta["Итоговый Description"],
            "h1": meta["H1"],
            "lead": lead,
            "ctaLabel": cta_label,
            "configuratorType": ctype,
            "keywords": [k.strip() for k in (meta["Запросы-кандидаты"] or "").split(";") if k.strip()][:8],
            "blocks": blocks,
        })

    # Остальные страницы: сырые блоки (только готовые) — композицию делают views
    other = {}
    for p, rs in content.items():
        if p in SERVICES or "<" in p:
            continue
        other[p] = {
            "title": pages[p]["Итоговый Title"],
            "description": pages[p]["Итоговый Description"],
            "h1": pages[p]["H1"],
            "blocks": [
                {
                    "title": r["Рабочий заголовок"].strip(),
                    "lines": lines_of(r["Готовый текст / контент блока"]),
                    "ready": not (r["Статус"] or "").startswith("Требует"),
                }
                for r in rs
            ],
        }

    header = "// Сгенерировано scripts/import-content.py из «ядро.xlsx». Не править руками.\n"
    with open("src/entities/service/model/services.data.ts", "w") as f:
        f.write(header + 'import type { Service } from "./types";\n\n')
        f.write("export const SERVICES: Service[] = ")
        f.write(json.dumps(services, ensure_ascii=False, indent=2))
        f.write(";\n")
    with open("src/shared/content/pages.data.ts", "w") as f:
        f.write(header + 'import type { PageContent } from "./types";\n\n')
        f.write("export const PAGES: Record<string, PageContent> = ")
        f.write(json.dumps(other, ensure_ascii=False, indent=2))
        f.write(";\n")
    print(f"services: {len(services)}, pages: {len(other)}")
    for s in services:
        print(s["path"], [b["kind"] for b in s["blocks"]], s["ctaLabel"], "|", s["short"][:40])


if __name__ == "__main__":
    main(sys.argv[1])
