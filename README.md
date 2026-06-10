# Glory

Лендинг на **Next.js (App Router) + TypeScript + SCSS**, построенный по архитектуре
**Feature-Sliced Design (FSD)**, без лишних библиотек.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

## Документация

Полное описание структуры, правил FSD, работы со стилями и рецептов — в **[GLORY.md](./GLORY.md)**.

## Структура (кратко)

```
src/
├── app/        # роутинг Next + провайдеры + глобальные стили
├── views/      # страницы (FSD-слой pages)
├── widgets/    # крупные блоки UI
├── features/   # пользовательские сценарии
├── entities/   # бизнес-сущности
└── shared/     # переиспользуемый код, UI-кит, SCSS-абстракции
```

## Команды

- `npm run dev` — дев-сервер
- `npm run build` / `npm run start` — сборка и запуск
- `npm run lint` / `npm run lint:styles` — линтеры
- `npm run format` — Prettier
