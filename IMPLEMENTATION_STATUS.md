# Состояние реализации

## Текущий этап

`SITE-PLATFORM-001 — ready / current task`

Стратегический foundation принят и merged в `main` commit `5feccb8c39364e8d785b0d06691b718f55bdb165`.

Текущая работа ведётся отдельно:

```text
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/7
Branch: agent/site-platform
Draft PR: https://github.com/spikeal8-maker/alexander-alikin/pull/20
```

## Текущий пользовательский результат

Создать воспроизводимый технический каркас, в котором:

- все канонические маршруты существуют;
- утверждённый Markdown проходит строгую схему;
- draft, blocked и приватные материалы не попадают в generated output;
- sitemap, RSS, robots, canonical URL и search index согласованы;
- одна команда `npm run quality` проверяет обязательный контракт;
- основной HTML читается без client JavaScript;
- production deploy отсутствует до launch-задачи.

## Канонические документы задачи

- `docs/agent-tasks/CURRENT_TASK.yaml`;
- `docs/agent-tasks/TASK-SITE-PLATFORM.md`;
- `docs/testing/SITE-PLATFORM-QUALITY.md`;
- `docs/SITE_EXECUTION_MANIFEST.yaml`;
- Issue №7.

## Разрешённый scope

- Node.js 24 LTS, npm и lockfile;
- Astro + TypeScript strict;
- route shells;
- content collections и schemas;
- URL/base-path configuration;
- минимальные foundation layouts/components;
- SEO foundation;
- sitemap, RSS, robots, 404 и search index;
- validators, tests и read-only quality workflow.

## Запрещено в этой задаче

- финальный визуальный дизайн;
- полноценная главная страница;
- реальные биографии, фотографии и кейсы;
- контактная форма;
- аналитический поставщик;
- публичный граф знаний;
- GitHub Pages deploy;
- домен;
- подключение приватного vault;
- merge;
- начало Issue №8.

## История старого scaffold

Commit `8ff507d` содержит ранний технический scaffold, созданный до принятия канонической информационной архитектуры. Его нельзя cherry-pick-ить целиком. Допустимо изучать отдельные идеи только после проверки на соответствие текущим контрактам.

## Gate

Перед owner review Draft PR №20 обязательны:

- `npm ci`;
- все Test IDs из `docs/testing/SITE-PLATFORM-QUALITY.md`;
- `npm run quality`;
- `npm audit --audit-level=high`;
- `git diff --check`;
- фактический отчёт с HEAD, командами и ограничениями;
- отсутствие deploy workflow и приватных данных.

## Следующая допустимая задача

Только после owner review и merge PR №20:

`SITE-DESIGN-001 — Issue №8`

Coding-агент после отчёта по Issue №7 останавливается и не начинает дизайн в той же сессии.
