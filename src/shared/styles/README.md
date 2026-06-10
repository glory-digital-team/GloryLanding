# shared/styles

Глобальные **SCSS-абстракции** проекта: переменные (дизайн-токены), функции и миксины.
Эти файлы **не выводят CSS** — они только предоставляют значения и хелперы.

## Как использовать в компонентах

В любом `*.module.scss`:

```scss
@use "shared/styles/abstracts" as *;

.button {
  padding: $space-sm $space-md;
  background: $color-primary;
  border-radius: $radius-md;
  font-size: rem(14px);

  @include respond-to("md") {
    font-size: rem(16px);
  }
}
```

Путь `shared/styles/abstracts` резолвится без относительных `../../` благодаря
`sassOptions.loadPaths` в `next.config.ts` (sass ищет от папки `src`).

## Состав

- `abstracts/_variables.scss` — цвета, отступы, типографика, брейкпоинты.
- `abstracts/_functions.scss` — `rem()`, `breakpoint()`.
- `abstracts/_mixins.scss` — `respond-to()`, `container`, `flex()`.
- `abstracts/_index.scss` — `@forward` всего перечисленного (точка входа).

> Глобальные стили (reset, базовая типографика), которые **выводят CSS**,
> лежат отдельно в `src/app/styles/` и подключаются один раз в `layout.tsx`.
