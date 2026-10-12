/**
 * Генерация OG-картинок 1200×630 для каждой страницы (ТЗ §3.6): public/og/<slug>.png.
 * Запуск: npx tsx scripts/generate-og.ts (нужен установленный Chromium для Playwright).
 * Имя файла — путь страницы без слешей ("/cases/club-parus/" → cases--club-parus.png, "/" → home.png).
 */
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { SERVICES, SERVICE_GROUPS } from "../src/entities/service";
import { CASES } from "../src/entities/case/model/cases";
import { PAGES } from "../src/shared/content/pages.data";

const root = process.cwd();
const out = path.join(root, "public/og");
mkdirSync(out, { recursive: true });

const font = (f: string) => `data:font/woff2;base64,${readFileSync(path.join(root, "public/fonts", f)).toString("base64")}`;
const logo = `data:image/svg+xml;base64,${readFileSync(path.join(root, "public/logo-mark-light.svg")).toString("base64")}`;

interface Card {
  path: string;
  eyebrow: string;
  title: string;
}

const cards: Card[] = [
  { path: "/", eyebrow: "Digital-студия для бизнеса", title: "Сайты, автоматизация и AI-решения для бизнеса" },
  ...Object.entries(PAGES)
    .filter(([p]) => p !== "/" && p !== "/blog/")
    .map(([p, c]) => ({ path: p, eyebrow: "Глори.Цифра", title: c.h1 })),
  ...SERVICES.map((s) => ({
    path: s.path,
    eyebrow: SERVICE_GROUPS.find((g) => g.id === s.group)?.label ?? "Услуги",
    title: s.h1,
  })),
  ...CASES.map((c) => ({ path: `/cases/${c.slug}/`, eyebrow: `Кейс · ${c.industry}`, title: c.h1 })),
  { path: "/careers/", eyebrow: "Карьера", title: "Работа в Глори.Цифра" },
  { path: "/documents/", eyebrow: "Документы", title: "Юридические документы Глори.Цифра" },
];

const slug = (p: string) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "--"));
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const html = (c: Card) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;font-weight:100 900;src:url(${font("inter-cyrillic-wght-normal.woff2")}) format("woff2");unicode-range:U+0400-045F,U+2116}
@font-face{font-family:Inter;font-weight:100 900;src:url(${font("inter-latin-wght-normal.woff2")}) format("woff2")}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:Inter,sans-serif;background:#fafafa;overflow:hidden;position:relative}
.glow{position:absolute;right:-220px;top:-260px;width:820px;height:820px;border-radius:50%;background:radial-gradient(circle,rgba(204,0,0,.22),rgba(204,0,0,0) 62%)}
.card{position:absolute;inset:48px;border-radius:44px;background:#fff;box-shadow:0 0 70px rgba(0,0,0,.06);padding:64px 72px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px;color:#222224}
.top img{width:56px;height:56px;border-radius:14px;background:#c00}
.eyebrow{margin-top:56px;font-size:24px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#c00}
h1{margin-top:18px;font-size:${c.title.length > 60 ? 54 : 64}px;line-height:1.12;letter-spacing:-.025em;font-weight:800;color:#0f0f0f;max-width:960px}
.foot{margin-top:auto;display:flex;justify-content:space-between;font-size:24px;color:#6b7280;font-weight:500}
.dots{display:flex;gap:10px}.dots i{width:14px;height:14px;border-radius:50%;background:#e5e7eb}.dots i:nth-child(-n+3){background:#c00}
</style></head><body><div class="glow"></div><div class="card">
<div class="top"><img src="${logo}" alt="">Глори.Цифра</div>
<div class="eyebrow">${esc(c.eyebrow)}</div><h1>${esc(c.title)}</h1>
<div class="foot"><span>глори.digital</span><span class="dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
</div></body></html>`;

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const c of cards) {
    await page.setContent(html(c), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, `${slug(c.path)}.png`) });
  }
  await browser.close();
  console.log(`OG: ${cards.length} картинок → public/og`);
})();
