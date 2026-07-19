# SITE-PLATFORM-001 — финальная унификация схем и тестовых контрактов

## Статус

`remediation_pass_3_required / merge-blocker`

Этот документ продолжает Issue №7 и Draft PR №20. Новая продуктовая задача не начинается.

## Контекст

```text
Repository: spikeal8-maker/alexander-alikin
Branch: agent/site-platform
Draft PR: https://github.com/spikeal8-maker/alexander-alikin/pull/20
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/7
Audited head: 0f02502e305eb9cca746fbd1a272d5ebc1174c0f
Successful CI run: 29706689032
```

## Результат независимого review

CI зелёный, но source review выявил последнее архитектурное расхождение.

1. `src/lib/schemas.ts` содержит refinements и URL validation.
2. `src/content.config.ts` не использует эти схемы как источник истины: он повторно создаёт собственные `z.object(...)`, поэтому refinements не действуют на реальные Content Collections.
3. `scripts/validate-content.mjs` загружает TypeScript-схемы путём текстовых замен и ad-hoc YAML parser. Это не гарантирует, что тестируется тот же runtime-контракт.
4. Invalid fixtures могут отклоняться из-за отсутствующих полей, а не из-за ожидаемого конкретного refinement. Тест не проверяет ожидаемый issue path/code.
5. `story-draft-leak.md` не проходит через schema parser.
6. Anchor validator умеет находить отсутствующий `id`, но quality pipeline не доказывает отдельным negative self-test, что broken route и broken anchor действительно возвращают ненулевой exit code.
7. Нативное `<details>/<summary>` используется корректно, но a11y gate не проверяет mobile native contract и соответствующие CSS selectors.

## Обязательная реализация

### 1. Один источник схем

Создать единый экспортируемый schema module или schema factories, которые используются одновременно:

- `src/content.config.ts`;
- positive fixture tests;
- negative fixture tests.

Дублирование field shapes и refinements между `content.config.ts` и `schemas.ts` запрещено.

Для Astro `reference()` допустимы schema factories с dependency injection, например:

```ts
createProjectSchema({ relatedProjects: z.array(reference("projects")).optional() })
```

Тесты вызывают ту же factory с тестовым reference schema.

Обязательные refinements должны действовать на реальную Content Collection:

- `document_verified` требует минимум один валидный source URL;
- все URL-поля валидируются;
- Fact требует непустой period или `periodNotApplicable: true`;
- Media требует rights holder, allowed uses, alt и caption.

### 2. Нормальный TypeScript test runtime

Запрещено компилировать `schemas.ts` строковыми заменами.

Использовать поддерживаемый путь, например:

- `tsx` как dev dependency;
- TypeScript test script, запускаемый через `tsx`;
- либо JavaScript schema module, напрямую импортируемый Astro и Node tests.

Ad-hoc YAML parser заменить библиотечным parser frontmatter/YAML либо использовать JSON fixtures там, где формат Markdown не является предметом теста.

### 3. Точные negative tests

Каждый invalid fixture обязан проверять:

- что `safeParse` возвращает `success: false`;
- ожидаемый issue path;
- ожидаемый code/message fragment;
- что fixture не отклонена случайно из-за отсутствия несвязанных обязательных полей.

Обязательные случаи:

- bad evidence level;
- document_verified without source;
- malformed source URL;
- Fact without period/flag;
- Media without rights/alt;
- Now without reviewAt;
- invalid publication status.

Draft leak — отдельный generated-output test, а не schema-invalid test. Draft fixture может быть schema-valid, но не должна создавать route/RSS/search/sitemap output.

### 4. Negative self-tests links

Вынести link-validation logic в импортируемую функцию.

Quality обязан детерминированно доказать:

- valid route/anchor fixture → PASS;
- broken route fixture → FAIL;
- broken anchor fixture → FAIL с ожидаемым сообщением.

Тест не должен изменять committed content и не должен зависеть от старого `dist`.

### 5. Native mobile contract

При сохранении `<details>/<summary>` test должен проверить generated HTML и CSS:

- summary находится внутри details;
- navigation находится внутри того же details;
- summary не имеет `tabindex="-1"` или disabled;
- CSS скрывает mobile nav только в закрытом details и показывает при `[open]`;
- desktop mode не скрывает основную навигацию;
- основной navigation content доступен без custom JS.

Browser automation не обязательна для native contract, но проверка только наличия слова `summary` недостаточна.

## Запрещено

- ослаблять Test IDs;
- сохранять две независимые схемы;
- использовать string-rewrite transpilation;
- считать любое schema rejection достаточным без expected issue assertion;
- отключать CI или audit;
- добавлять deploy, vault, реальный контент или дизайн;
- начинать Issue №8;
- выполнять merge;
- force push.

## Acceptance Criteria

1. Astro Content Collections и тесты используют один schema source/factory.
2. Все refinements реально применяются при `astro check` и build.
3. Test runtime импортирует schemas без текстовой переработки TypeScript.
4. Positive fixtures всех 10 collections PASS.
5. Negative fixtures FAIL по ожидаемым issue paths/messages.
6. Draft fixture schema-valid, но отсутствует в generated output.
7. Broken route negative self-test PASS.
8. Broken anchor negative self-test PASS.
9. Native mobile details/summary contract PASS.
10. `npm ci`, `npm run quality`, `npm audit --audit-level=high`, `git diff --check` PASS.
11. Новый GitHub Actions run на актуальном HEAD завершён success, audit executed.
12. PR №20 остаётся Draft.
13. Issue №8 не начата.

## Формат отчёта

```text
TASK: SITE-PLATFORM-001-REMEDIATION-3
STATUS: PASS | BLOCKED | FAIL
HEAD:
PR:
CI_RUN:
CI_JOB:
CI_CONCLUSION:
SCHEMA_SOURCE:
CONTENT_CONFIG_SCHEMA_USAGE:
TEST_RUNTIME:
POSITIVE_FIXTURE_RESULTS:
NEGATIVE_FIXTURE_EXPECTED_ISSUES:
DRAFT_OUTPUT_PROOF:
BROKEN_ROUTE_SELF_TEST:
BROKEN_ANCHOR_SELF_TEST:
NATIVE_MOBILE_CONTRACT:
QUALITY_RESULTS:
DEPENDENCY_AUDIT:
KNOWN_LIMITATIONS:
NEXT_ALLOWED_TASK: owner review of PR 20 only
NEXT_TASK_STARTED: NO
```

После отчёта остановиться. Merge и Issue №8 запрещены до независимого owner review.