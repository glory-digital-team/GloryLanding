# GLORY — гайд по проекту

Этот файл — карта проекта: **что где лежит, как устроено и как добавлять новое**.
Держите его открытым при разработке.

---

## 1. Стек

| Технология | Версия | Зачем |
| ---------- | ------ | ----- |
| Next.js (App Router) | ^16 | фреймворк, роутинг, сборка |
| React | ^19 | UI |
| TypeScript | ^5.7 | типизация |
| Sass (Dart Sass, `@use`) | ^1.100 | стили вручную, CSS Modules |
| ESLint + Prettier + Stylelint | — | качество кода |

Никаких UI-китов, CSS-in-JS, Tailwind и прочих лишних библиотек — всё руками.

---

## 2. Архитектура — Feature-Sliced Design (FSD)

Код делится на **слои** (layers). Импорт разрешён строго **сверху вниз**:
слой может использовать только слои ниже себя.

```
app      →  views  →  widgets  →  features  →  entities  →  shared
(верх)                                                       (низ)
```

| Слой | Папка | Назначение | Может импортировать |
| ---- | ----- | ---------- | ------------------- |
| **app** | `src/app` | роутинг Next + провайдеры + глобальные стили | все слои |
| **views** | `src/views` | страницы как композиция виджетов (это FSD-слой `pages`, переименован) | widgets, features, entities, shared |
| **widgets** | `src/widgets` | крупные самостоятельные блоки UI (Header, Footer) | features, entities, shared |
| **features** | `src/features` | действия пользователя с бизнес-ценностью | entities, shared |
| **entities** | `src/entities` | бизнес-сущности (user, product) | shared |
| **shared** | `src/shared` | переиспользуемый код без бизнес-логики | ничего (самый низ) |

### Slice и Segment

Внутри слоя (кроме `app` и `shared`) код делится на **срезы (slices)** — по предметной
области (`header`, `home`, `user`). Внутри среза — **сегменты**:

- `ui/` — компоненты;
- `model/` — состояние, типы, логика;
- `api/` — запросы к бэкенду;
- `lib/` — локальные хелперы.

### Публичный API

Каждый срез наружу торчит **только через `index.ts`**. Импортируйте так:

```ts
import { Header } from "@/widgets/header";   // ✅ через публичный API
import { Header } from "@/widgets/header/ui/Header"; // ❌ лезть внутрь нельзя
```

---

## 3. Почему `app` совмещён с роутингом, а `pages` стал `views`

Next.js App Router требует папку `src/app/` под роутинг. У FSD тоже есть верхний слой
`app`. Мы их **объединяем**: `src/app/` содержит и маршруты Next (`layout.tsx`,
`page.tsx`), и FSD-слой app (провайдеры, глобальные стили).

FSD-слой `pages` переименован в **`views`**, чтобы слово «pages» не путалось с
маршрутами Next. Файлы маршрутов (`page.tsx`) делаем **тонкими** — они лишь
импортируют готовую страницу из `views`.

Поток рендера главной страницы:

```
app/page.tsx → views/home (HomePage) → widgets/header (Header) → shared/ui/Button
```

---

## 4. Стили (SCSS)

Три уровня — не путать:

| Что | Где | Выводит CSS? | Как подключается |
| --- | --- | ------------ | ---------------- |
| **Абстракции** (токены, миксины, функции) | `src/shared/styles/abstracts` | ❌ нет | `@use "shared/styles/abstracts" as *;` в каждом нужном файле |
| **Глобальные стили** (reset, базовая типографика) | `src/app/styles` | ✅ да | один раз импортом в `app/layout.tsx` |
| **Компонентные стили** | `*.module.scss` рядом с компонентом | ✅ да | `import styles from "./X.module.scss"` |

### Как работает импорт абстракций без `../../../`

В `next.config.ts` задан `sassOptions.loadPaths: [<корень>/src]`. Поэтому sass
находит `shared/styles/abstracts` от папки `src`. В компоненте достаточно:

```scss
@use "shared/styles/abstracts" as *;

.card {
  padding: $space-md;
  border-radius: $radius-md;
  font-size: rem(14px);

  @include respond-to("md") {
    padding: $space-lg;
  }
}
```

Доступные хелперы: переменные из `_variables.scss`, функции `rem()` / `breakpoint()`,
миксины `respond-to()`, `container`, `flex()`.

---

## 5. Алиасы импортов

`@/*` указывает на `src/*` (см. `tsconfig.json`):

```ts
import { cn } from "@/shared/lib";
import { siteConfig } from "@/shared/config";
import { Button } from "@/shared/ui/Button";
```

---

## 6. Рецепты

### Добавить компонент в `shared/ui`

```
src/shared/ui/Input/
├── Input.tsx
├── Input.module.scss   // @use "shared/styles/abstracts" as *;
└── index.ts            // export { Input } from "./Input";
```

### Добавить виджет

```
src/widgets/footer/
├── ui/
│   ├── Footer.tsx
│   └── Footer.module.scss
└── index.ts            // export { Footer } from "./ui/Footer";
```

Используйте его в `views/home/ui/HomePage.tsx`.

### Добавить новую страницу (route)

1. Создайте view: `src/views/about/ui/AboutPage.tsx` (+ `.module.scss`, `index.ts`).
2. Создайте маршрут: `src/app/about/page.tsx`:
   ```tsx
   import { AboutPage } from "@/views/about";
   export default function Page() {
     return <AboutPage />;
   }
   ```

### Добавить фичу/сущность

См. `src/features/README.md` и `src/entities/README.md` — там правила импортов и
структура срезов.

---

## 7. Команды

| Команда | Что делает |
| ------- | ---------- |
| `npm run dev` | дев-сервер на http://localhost:3000 |
| `npm run build` | продакшн-сборка |
| `npm run start` | запуск собранного приложения |
| `npm run lint` | ESLint |
| `npm run lint:styles` | Stylelint по `src/**/*.scss` |
| `npm run format` | Prettier (форматирование) |
