# TASK-CONTENT-EXPORT-V4

## Идентификатор

`CONTENT-EXPORT-001`

## Результат

Проверить 29 разрешённых файлов private Draft PR #6, создать безопасный
публичный реестр, правила доказательств, media gate и owner checklist.
Экспортировать только записи со статусом `ready_for_public_export`.

## Scope

- `docs/content-v4/`;
- task/manifest/status документация;
- автоматический validator контентного export gate.

## Запрещено

- копировать private vault или сливать его PR;
- переносить `owner_review`, `fact_check`, `blocked`, `private_only`;
- изменять страницы, компоненты, CSS, маршруты и `public/`;
- начинать DESIGN-V4-001, страницы V4 или deploy;
- переводить Draft PR в Ready или выполнять merge.

## Acceptance

- все 29 source files зарегистрированы;
- происхождение закреплено private PR HEAD;
- нет неподтверждённых контактов, фактов и медиа;
- проверки включены в `npm run quality`;
- создан Draft PR и работа остановлена на owner review.
