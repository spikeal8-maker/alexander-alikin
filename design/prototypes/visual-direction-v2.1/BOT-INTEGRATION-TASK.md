# Задача интеграционному боту

## Репозиторий

`spikeal8-maker/alexander-alikin`

## Цель

Перенести утверждённое визуальное направление `Visual Direction 2.1` в существующую Astro-платформу, не разрушая Content Collections, маршруты, SEO, accessibility и проверки.

## Источник

Ветка и commit будут указаны владельцем. Архив находится в:

`design/prototypes/alikin-visual-direction-v2.1-source.zip`

## Жёсткие правила

1. Не копировать статические HTML-файлы целиком в `src/pages`.
2. Выделить повторяемые Astro-компоненты.
3. Использовать существующий контент из Content Collections.
4. Сохранить реальные маршруты без `.html`.
5. Не публиковать неподтверждённые цифры, отзывы, логотипы и клиентские кейсы.
6. Visualized media не выдавать за документальные события.
7. Documentary media подписывать периодом и контекстом.
8. Удалить из пользовательского UI внутренние evidence/status labels.
9. Не добавлять внешние библиотеки анимации.
10. Не выполнять merge или deploy.

## Первая итерация

Реализовать только:

- `/` desktop + mobile;
- `/business/` desktop + mobile;
- `/projects/` desktop + mobile;
- `/projects/izo-asa/` desktop + mobile.

После этого создать screenshot artifact и остановиться для owner review.

## Дизайн-система

Перенести токены из `assets/css/site.css`, но оформить их как канонические CSS custom properties проекта. Сохранить:

- графит / тёплая бумага / кобальт;
- максимальную ширину 1380 px;
- крупную типографику с отрицательным tracking;
- минимальные радиусы;
- отсутствие декоративных теней;
- строгие линии-разделители;
- 12-колоночную desktop-логику;
- самостоятельную mobile-композицию.

## Проверки

- `npm run quality`;
- `npm run design:static`;
- `npm run test:media`;
- browser verification на 390, 768, 1024, 1440;
- no-JS;
- keyboard/focus;
- 200% text size;
- axe serious/critical = 0;
- broken images = 0;
- screenshot artifact.

## Формат отчёта

```text
TASK: INTEGRATE-VISUAL-DIRECTION-2-1
STATUS: PASS | BLOCKED | FAIL
HEAD_BEFORE:
HEAD_AFTER:
PAGES_IMPLEMENTED:
COMPONENTS_CREATED:
CONTENT_COLLECTIONS_REUSED:
VISUALIZED_MEDIA_USED:
DOCUMENTARY_MEDIA_USED:
QUALITY_RESULT:
DESIGN_STATIC_RESULT:
MEDIA_RESULT:
BROWSER_RESULT:
SCREENSHOT_ARTIFACT:
MERGE_PERFORMED: NO
DEPLOY_PERFORMED: NO
KNOWN_LIMITATIONS:
```
