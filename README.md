<p align="center">
  <a href="https://глори.digital">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.svg">
      <img alt="Глори.Цифра — сайты, автоматизация и AI-решения" src=".github/assets/banner-light.svg" width="100%">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/glory-digital-team/GloryLanding/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/glory-digital-team/GloryLanding/actions/workflows/ci.yml/badge.svg?branch=main"></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-20232A?style=flat-square&logo=react&logoColor=61DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img alt="SCSS" src="https://img.shields.io/badge/SCSS-modules-CC6699?style=flat-square&logo=sass&logoColor=white">
  <img alt="FSD" src="https://img.shields.io/badge/архитектура-FSD-e5484d?style=flat-square">
</p>

<p align="center">
  <b><a href="https://глори.digital">глори.digital</a></b> — сайт студии Глори.Цифра: услуги, портфолио и конфигуратор, который считает бюджет проекта за минуту.
</p>

---

## Что на сайте

- **Конфигуратор проекта** — выбираете тип продукта и опции, сразу видите предварительную смету и можете скачать её в PDF.
- **Портфолио** — кейсы студии с подробными страницами.
- **Заявка в один клик** — форма с выбором удобного канала связи.
- **Документы** — оферта, подписка на поддержку, политика конфиденциальности.
- **UI-кит** — живая витрина дизайн-системы на `/ui-kit`.

Почти без зависимостей: Next.js, React и `html2pdf.js` для смет. Стили — SCSS-модули на токенах дизайн-системы, никаких UI-фреймворков.

## Быстрый старт

```bash
npm ci
npm run dev        # http://localhost:3000
```

| Команда                                    | Что делает                     |
| ------------------------------------------ | ------------------------------ |
| `npm run dev`                              | дев-сервер с hot reload        |
| `npm run build` · `npm run start`          | продакшен-сборка и запуск      |
| `npm run lint` · `npm run lint:styles`     | ESLint и Stylelint             |
| `npx tsc --noEmit`                         | проверка типов                 |
| `npm run format`                           | Prettier                       |

## Архитектура

Проект построен по **[Feature-Sliced Design](https://feature-sliced.design)**: слой может импортировать только нижележащие.

```
src/
├── app/        роутинг Next.js (App Router), провайдеры, глобальные стили
├── views/      страницы (слой pages из FSD)
├── widgets/    крупные блоки: hero, конфигуратор, портфолио, FAQ, форма заявки…
├── features/   пользовательские сценарии
├── entities/   бизнес-сущности
└── shared/     UI-кит, SCSS-абстракции, утилиты
```

Подробные правила слоёв, работа со стилями и готовые рецепты — в **[GLORY.md](./GLORY.md)**.

## Деплой

```
push в main ─▶ CI: ESLint · Stylelint · tsc · next build · helm lint
                 └─▶ образ ghcr.io/glory-digital-team/glorylanding:sha-<коммит>
                       └─▶ Helm-чарт deploy/chart → oci://ghcr.io/glory-digital-team/charts/glory-landing
                             └─▶ Flux на сервере выкатывает новую версию без простоя
```

- Обновление идёт с `maxSurge: 1 / maxUnavailable: 0`: новый под поднимается и проходит проверки, только потом гасится старый.
- Если новая версия не стартует, Flux автоматически откатывает релиз — сайт продолжает работать на предыдущей.
- У GitHub нет доступа к серверу: сервер сам забирает релизы из GHCR.
- Pull request проходит те же проверки, но ничего не публикует.

Доступность сайта в реальном времени — на [статус.глори.digital](https://статус.глори.digital).

---

<p align="center"><sub>© Глори.Цифра · <a href="https://глори.digital">глори.digital</a> · <a href="mailto:info@глори.digital">info@глори.digital</a></sub></p>
