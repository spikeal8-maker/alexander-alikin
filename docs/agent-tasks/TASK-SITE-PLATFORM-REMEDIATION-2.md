# SITE-PLATFORM-001 — remediation pass 2

## Статус

`required / merge-blocker`

Этот документ продолжает Issue №7 и Draft PR №20 после review HEAD `3f2dbfed265d6a8b91be63ccdbbf081a730949dd`.

GitHub Actions run `29706261254` завершился `success`, однако независимый просмотр исходников выявил оставшиеся ложноположительные проверки. Продуктовый scope не расширяется.

## Оставшиеся блокеры

### 1. Invalid fixtures не проверяются общими schemas

`scripts/validate-content.mjs` вручную ищет строки и поля внутри fixture-файлов. Он не передаёт данные в те же Zod-схемы, которые используют Astro Content Collections.

Следствия:

- invalid fixture может соответствовать schema, но тест всё равно покажет PASS;
- правило `document_verified` + обязательный источник не реализовано в schema;
- URL-поля сейчас допускают произвольные строки;
- требование «общие schemas используются collection config и negative tests» не выполнено.

Обязательное исправление:

- вынести экспортируемые schemas и refinements в небольшой переиспользуемый модуль;
- использовать их и в `src/content.config.ts`, и в `validate-content.mjs`;
- каждая invalid fixture должна завершать `safeParse`/parse с FAIL;
- тест должен проверять ожидаемый path/code/message;
- если invalid fixture неожиданно принята — Test ID FAIL;
- `document_verified` требует минимум один валидный URL;
- `sourceUrls`, `demoUrl`, `repoUrl` валидируются как URL;
- Fact принимает либо непустой `period`, либо `periodNotApplicable: true`;
- positive fixtures всех 10 collections проходят теми же schemas.

### 2. Broken anchors не проверяются

`validate-links.mjs` при `#fragment` проверяет только существование целевой страницы, но не наличие элемента с соответствующим `id`.

Обязательное исправление:

- декодировать fragment;
- открыть target HTML;
- проверить `id="..."` на целевом элементе;
- добавить отдельный отрицательный тест broken anchor;
- добавить положительный anchor fixture;
- broken route и broken anchor должны давать независимые FAIL.

### 3. Mobile keyboard behavior не доказан

Исправление JS/CSS выглядит согласованным, но текущий a11y validator только анализирует HTML-строки и не исполняет взаимодействие.

Допустимые решения:

1. заменить custom JS на нативный `<details>/<summary>` и проверить generated contract;
2. добавить минимальный browser behavior smoke, который доказывает:
   - toggle получает keyboard focus;
   - Enter/Space меняет состояние;
   - ссылки становятся видимыми;
   - `aria-expanded` соответствует состоянию;
   - Escape/focus behavior документирован для custom JS.

Статический поиск `aria-controls` не считается behavior test.

## Ограничения

- не менять визуальный дизайн;
- не добавлять реальный контент;
- не добавлять deploy;
- не начинать Issue №8;
- не ослаблять существующие gates;
- не использовать `continue-on-error`;
- PR остаётся Draft;
- merge запрещён.

## Обязательные проверки

```text
npm ci
npm run quality
npm audit --audit-level=high
git diff --check
git status --short
```

После push дождаться нового GitHub Actions run на актуальном HEAD.

## Acceptance

1. Positive и negative fixtures используют те же экспортируемые schemas.
2. Все invalid fixtures действительно отвергаются schema parser.
3. `document_verified` без валидного source URL даёт FAIL.
4. Невалидные URL дают FAIL.
5. Fact без period и без `periodNotApplicable: true` даёт FAIL.
6. Broken route и broken anchor проверяются отдельно и дают FAIL.
7. Mobile navigation имеет фактическое keyboard-behavior доказательство либо нативный contract.
8. Все прежние Test IDs остаются зелёными.
9. Новый GitHub Actions run завершён `success`, audit выполнен.
10. PR №20 остаётся Draft; Issue №8 не начата.

## Отчёт

```text
TASK: SITE-PLATFORM-001-REMEDIATION-2
STATUS: PASS | BLOCKED | FAIL
HEAD:
CI_RUN:
SHARED_SCHEMAS:
POSITIVE_SCHEMA_RESULTS:
NEGATIVE_SCHEMA_RESULTS:
URL_REFINEMENT_RESULTS:
DOCUMENT_VERIFIED_REFINEMENT:
FACT_PERIOD_REFINEMENT:
BROKEN_ROUTE_TEST:
BROKEN_ANCHOR_TEST:
MOBILE_KEYBOARD_BEHAVIOR:
QUALITY:
AUDIT:
KNOWN_LIMITATIONS:
NEXT_ALLOWED_TASK: owner review of PR 20 only
NEXT_TASK_STARTED: NO
```
