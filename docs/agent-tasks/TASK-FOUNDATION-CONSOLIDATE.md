# TASK-FOUNDATION-CONSOLIDATE-001

## Статус

`ready / merge-blocker`

## Репозиторий

```text
Repository: spikeal8-maker/alexander-alikin
Branch: agent/foundation-architecture
Pull Request: https://github.com/spikeal8-maker/alexander-alikin/pull/1
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/19
Base: main
Reference expanded commit: 8ff507d49fd41ab338c4decb4020ce5446233358
```

## Цель

Очистить PR №1 до небольшого канонического стратегического foundation. Технический Astro-scaffold, распакованный из более раннего архива, не должен входить в этот PR. Он остаётся в истории commit `8ff507d` только как reference для отдельной Issue №7.

## Почему

Распакованный scaffold создан до утверждения текущей информационной архитектуры. Он содержит старое меню, не имеет посадочных «Бизнесу» и «Образованию», использует другую модель доказательности, скрывает навигацию на mobile и содержит преждевременный deploy workflow.

## Обязательное чтение

1. `AGENTS.md`.
2. GitHub Issue №19.
3. Полный diff PR №1.
4. Канонические документы из `docs/README.md`.
5. `IMPLEMENTATION_STATUS.md`.
6. `docs/SITE_EXECUTION_MANIFEST.yaml`.

## Сделать

1. Удалить из конечного diff `package.json`, lockfile, Astro/TypeScript config, `src/`, `public/`, `scripts/`, `.env.example`, CI и deploy workflows.
2. Сохранить канонические документы и ADR `0001`–`0005`.
3. Удалить дублирующие ADR `ADR-001`–`ADR-003`.
4. Проверить imported supporting docs: оставить только документы с уникальной ролью и ссылкой из `docs/README.md`.
5. Обновить README, IMPLEMENTATION_STATUS, CURRENT_TASK и PR body до фактического статуса.
6. Сделать обычный commit и push без force push.
7. Оставить PR Draft.
8. Опубликовать отчёт в Issue №19 и PR №1.
9. Остановиться. Не начинать Issue №7.

## Не делать

- не исправлять UI и страницы;
- не реализовывать platform;
- не менять аудитории, CTA, навигацию и палитру;
- не добавлять контент или фотографии;
- не выполнять merge;
- не создавать архивы или generated payload.

## Проверки

```text
git status --short
git diff --check
git diff --stat origin/main...HEAD
git diff --name-only origin/main...HEAD
```

Дополнительно проверить:

- нет технического scaffold в конечном diff;
- нет auto-deploy;
- нет двух наборов ADR;
- ссылки `docs/README.md` существуют;
- YAML manifest читается;
- PR Draft;
- Issue №7 не начата.

## Acceptance

1. PR №1 — только стратегия, governance и необходимая документация.
2. Diff существенно меньше 130 файлов / 14k строк.
3. Технический scaffold отсутствует.
4. Дубли удалены.
5. Статусные документы правдивы.
6. `git diff --check` PASS.
7. Отчёт содержит HEAD, команды, exit codes, список оставшихся файлов.
8. Следующий шаг — только owner review.

## Формат отчёта

```text
TASK: TASK-FOUNDATION-CONSOLIDATE-001
STATUS: PASS | BLOCKED
HEAD:
PR:
FILES_BEFORE:
FILES_AFTER:
ADDITIONS_BEFORE:
ADDITIONS_AFTER:
REMOVED_TECHNICAL_SCOPE:
REMOVED_DUPLICATE_DOCS:
KEPT_SUPPORTING_DOCS_AND_PURPOSE:
COMMANDS_AND_EXIT_CODES:
KNOWN_LIMITATIONS:
NEXT_ALLOWED_TASK: owner review only | none
```
