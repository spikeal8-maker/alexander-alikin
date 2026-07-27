# TASK-RECOVER-VISIBLE-SITE-001

## Результат

Вернуть полный видимый сайт из runtime/UI реализации V3 поверх безопасного
`main @ b3f33d2c8f18fb73715cfb93b46623d0199dd1aa`.

Источник интерфейса:

- PR #24;
- branch `agent/editorial-visual-restart-v3`;
- source HEAD `9374e27fd8b83b4928906d180d1e3d8adb9c6b5a`.

## Разрешённый перенос

- публичные Astro-страницы;
- используемые layouts и компоненты;
- CSS V2/V3;
- безопасный публичный контент;
- необходимые реальные documentary images;
- design, media, browser и responsive checks.

## Не переносится

- V3 workflow, package.json, lockfile и task-state;
- AI-generated `visualized` media;
- неподтверждённые показатели, награды и результаты;
- контакты вне утверждённого allowlist;
- приватный vault и незавершённый CONTENT-EXPORT-001.

## Stop rule

Создать Draft PR и остановиться. Merge и deploy запрещены.

## Локальная проверка

Проверено на Node `24.18.0`:

- полный quality gate;
- статические design gates для фактически используемого V3 runtime;
- 25 маршрутов на ширинах 320, 390, 768, 1024 и 1440;
- 404, no-JS, keyboard focus, 200% zoom/text size;
- Axe serious/critical и broken images;
- media allowlist без generated portraits;
- dependency audit уровня high.

Шесть обязательных снимков сохранены в
`docs/screenshots/recover-visible-site-001/`.
