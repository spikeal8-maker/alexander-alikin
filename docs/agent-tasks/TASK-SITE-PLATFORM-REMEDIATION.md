# SITE-PLATFORM-001 — remediation после независимого review

## Статус

`remediation_required / merge_blocker`

Этот документ продолжает Issue №7 и Draft PR №20. Новая продуктовая задача не начинается. Цель — устранить ложноположительный quality gate и доказать, что платформа работает на чистой Linux-среде, а не только локально при наличии старого `dist/`.

## Контекст

```text
Repository: spikeal8-maker/alexander-alikin
Branch: agent/site-platform
Draft PR: https://github.com/spikeal8-maker/alexander-alikin/pull/20
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/7
Audited head: 38829aac7a7782ca3a7fad68fa151001683e8eeb
Failed Actions run: 29705514096
Failed job: 88241704683
```

## Фактический результат review

Заявленный локальный PASS не является exit gate. GitHub Actions на чистом Ubuntu checkout завершился failure на шаге `npm run quality`; шаг dependency audit был пропущен.

Обнаружены следующие причины и дефекты.

### 1. Невоспроизводимый порядок quality

`npm run quality` запускает `test:links` до `build`, хотя `validate-links.mjs` требует существующий `dist/`. Локальный запуск прошёл только потому, что `dist/` уже существовал после предыдущей сборки. На чистом CI это даёт failure.

### 2. Content schemas не загружают сериализованные даты

В schemas используется `z.date()`, а JSON/YAML fixtures хранят даты строками. Отчёт прямо фиксирует `collection empty` из-за разбора дат. Published fixtures фактически не доказывают работу collections и dynamic routes.

### 3. Негативные fixtures не тестируют schemas

`validate-content.mjs` проверяет только наличие файлов и marker. Он не запускает каждую invalid fixture против той же Zod-схемы и не проверяет ожидаемую ошибку. Test ID `TST-PLATFORM-CONTENT-001` поэтому ложноположительный.

### 4. Route gate проверяет source-файлы, а не generated routes

`validate-routes.mjs` подтверждает только наличие шаблонов в `src/pages`. Он не проверяет, что published fixture создаёт конкретный URL в `dist`, а draft/blocked fixture URL отсутствует.

### 5. Link gate не проверяет цели и anchors

`validate-links.mjs` проверяет только наличие base path в `href`. Ссылка на несуществующий route или anchor может пройти.

### 6. Mobile menu не открывается

JavaScript переключает `data-visible` на элементе `<nav id="primary-nav">`, а CSS ожидает `.nav-list[data-visible="true"]` на `<ul>`. На mobile список остаётся скрытым. Статический a11y smoke этого не обнаруживает.

### 7. Foundation CSS не подключён

`BaseLayout.astro` не импортирует `tokens.css`, `layout.css` и `content.css`. HTML строится, но CSS variables и foundation layout не подключены.

### 8. Canonical/base-path не доказаны

`BaseLayout` вызывает `siteUrl(Astro.url.pathname)`, а `siteUrl` всегда добавляет base path. Generated canonical должен быть проверен на ровно одно вхождение `/alexander-alikin`. Текущий dist gate canonical не проверяет.

### 9. RSS/search/base-path не доказаны

Generated RSS и search index должны содержать абсолютные или внутренние URL с base path ровно один раз и только published entries. Текущие tests не подтверждают это на непустых collections.

### 10. Sitemap и robots расходятся

В prelaunch sitemap фильтруется до пустого/отсутствующего результата, но `robots.txt` указывает на sitemap URL. `robots.txt` всегда содержит `Disallow: /`, включая production mode. Платформа должна иметь проверяемое поведение prelaunch и production без deploy workflow.

### 11. GitHub Actions красный

Run `29705514096` завершился failure; `npm audit` в CI был skipped. До зелёного run PR не готов к review.

## Обязательный scope remediation

### A. Сделать quality чистым и детерминированным

Добавить `clean` и запускать quality из чистого output.

Рекомендуемый порядок:

```text
clean
→ format:check
→ lint
→ typecheck
→ test:content
→ test:source-routes
→ test:secrets
→ build
→ test:generated-routes
→ test:links
→ test:leaks
→ test:dist
→ test:a11y
→ test:file-size
```

Generated-output tests запрещено запускать до build.

Локальная проверка должна отдельно доказать:

```bash
rm -rf dist .astro
npm ci
npm run quality
npm audit --audit-level=high
```

На Windows использовать эквивалентную cross-platform `clean`-команду из package scripts, а не ручной shell-only command.

### B. Исправить content layer

- сериализованные даты обрабатываются через `z.coerce.date()` или эквивалентный проверенный transform;
- использовать актуальный Astro Content Layer API без массовых deprecated hints;
- schemas вынести в переиспользуемый модуль, чтобы collection config и negative tests использовали одну реализацию;
- все 10 collections имеют валидную положительную fixture либо явно проверяемую empty-policy;
- `astro check` не сообщает collection validation failures;
- сообщение `collection empty` из-за schema error запрещено.

Минимальные ожидаемые валидные fixtures:

```text
profile: 1
projects: 1
cases: 1
stories: 1
thoughts: 1
articles: 1
news: 1
now: 1
facts: 1
media: 1
```

Это синтетические foundation-fixtures, не реальные факты. Они должны быть явно маркированы и перечислены в `KNOWN_LIMITATIONS` до замены контентным пакетом.

### C. Сделать negative tests реальными

Каждая fixture из `tests/fixtures/invalid/` должна:

1. передаваться в соответствующую общую schema;
2. завершаться FAIL;
3. проверять конкретный код/путь ошибки;
4. приводить к FAIL теста, если schema неожиданно её принимает.

Обязательные случаи:

- неизвестный evidence level;
- document_verified без source;
- Fact без period и без periodNotApplicable;
- Media без rights/alt;
- Now без reviewAt;
- неизвестный publication status;
- broken internal route;
- broken anchor;
- draft/blocked leak marker.

Проверка только наличия fixture запрещена.

### D. Проверять generated dynamic routes

После build должны существовать конкретные synthetic URLs:

```text
/projects/test-platform/index.html
/journal/stories/test-story/index.html
/journal/thoughts/test-thought/index.html
/journal/articles/test-article/index.html
/journal/news/platform-launch/index.html
```

Путь учитывает Astro `base` и фактический layout `dist`.

Draft/blocked synthetic slug не должен создавать HTML, RSS item, search item или sitemap URL.

### E. Исправить links и canonical

Generated link test проверяет:

- internal href содержит base path ровно один раз;
- target HTML/endpoint существует;
- `#anchor` существует в target HTML;
- canonical соответствует текущему route;
- canonical содержит base path ровно один раз;
- favicon/RSS/internal navigation не указывают на root без base;
- RSS и search index не теряют base path и не дублируют его.

### F. Исправить mobile navigation

Разрешены два пути:

1. нативный `<details>/<summary>` без обязательного JS;
2. корректный JS-toggle с проверяемым изменением состояния.

Acceptance:

- кнопка/summary доступна клавиатурой;
- `aria-expanded` или native state соответствует видимости;
- mobile links становятся видимыми;
- Escape/focus behavior документирован, если используется custom JS;
- CSS selector и изменяемый DOM-атрибут совпадают.

Добавить фактический behavior smoke. Один статический поиск `aria-controls` недостаточен.

### G. Подключить foundation CSS

`BaseLayout` или единый entry import должен подключать:

```text
tokens.css
layout.css
content.css
```

Generated HTML/build должен содержать CSS asset. Test проверяет наличие ключевых tokens и отсутствие страниц без stylesheet.

### H. Проверить prelaunch и production modes

Без создания deploy workflow реализовать и протестировать два режима.

Prelaunch:

- meta robots `noindex, nofollow`;
- robots запрещает crawling;
- robots не ссылается на отсутствующий sitemap;
- canonical корректен.

Production test build:

- страницы не содержат prelaunch noindex;
- robots не содержит глобальный `Disallow: /`;
- sitemap существует и содержит только published URLs;
- sitemap/RSS/search/canonical используют production `SITE_URL` и base path.

Production build может собираться во временный `.work/` output; generated output не коммитится.

### I. Усилить dist/a11y gates

Для каждого generated HTML проверить:

- один `<main>`;
- ровно один содержательный H1;
- непустые title и description;
- canonical;
- stylesheet;
- skip link с существующей целью;
- нет пустых href;
- mobile navigation contract присутствует;
- основной текст доступен без JS.

RSS и search должны быть непустыми при наличии published synthetic fixtures.

### J. Получить зелёный GitHub Actions run

После push:

- workflow `Quality` должен завершиться `success` на актуальном HEAD;
- `npm ci` PASS;
- `npm run quality` PASS;
- `npm audit --audit-level=high` должен фактически выполниться, не быть skipped;
- URL run и job ID включить в отчёт.

## Запрещено

- ослаблять или удалять Test IDs;
- менять tests так, чтобы они снова проверяли только наличие файлов;
- отключать CI;
- добавлять `continue-on-error`;
- считать warnings/errors «косметикой» без устранения причины;
- начинать дизайн Issue №8;
- добавлять production deploy;
- импортировать vault;
- выполнять merge;
- использовать force push;
- расширять задачу реальным контентом или финальной главной.

## Acceptance Criteria

1. Чистый локальный checkout без `dist` проходит quality.
2. GitHub Actions на актуальном HEAD зелёный.
3. Dependency audit в CI выполнен и PASS.
4. Positive fixtures реально загружаются всеми 10 collections.
5. Negative fixtures реально отклоняются общими schemas.
6. Dynamic fixture routes реально присутствуют в generated output.
7. Draft/blocked fixture routes и markers отсутствуют в output.
8. Broken route и broken anchor дают FAIL.
9. Mobile menu фактически работает с клавиатуры.
10. Foundation CSS фактически подключён.
11. Canonical, RSS, search и internal URLs имеют base path ровно один раз.
12. Prelaunch и production mode contracts PASS.
13. Sitemap production-mode существует и содержит только published routes.
14. `astro check` не имеет content validation errors и массового deprecated content-layer noise.
15. PR №20 остаётся Draft.
16. Issue №8 не начата.

## Обязательные команды

```text
npm ci
npm run quality
npm audit --audit-level=high
git diff --check
git status --short
```

Также привести GitHub Actions run URL и conclusion.

## Формат отчёта

```text
TASK: SITE-PLATFORM-001-REMEDIATION
STATUS: PASS | BLOCKED | FAIL
BRANCH:
HEAD:
PR:
ISSUE:
CI_RUN:
CI_JOB:
CI_CONCLUSION:
ROOT_CAUSE_OF_PREVIOUS_CI_FAILURE:
CLEAN_BUILD_PROOF:
COLLECTION_COUNTS:
POSITIVE_FIXTURES:
NEGATIVE_FIXTURES_AND_EXPECTED_ERRORS:
GENERATED_DYNAMIC_ROUTES:
BLOCKED_ROUTES_PROOF:
MOBILE_NAV_BEHAVIOR:
CSS_ASSET_PROOF:
PRELAUNCH_MODE_RESULTS:
PRODUCTION_MODE_RESULTS:
CANONICAL_BASE_PATH_RESULTS:
RSS_SEARCH_SITEMAP_RESULTS:
TEST_IDS_AND_RESULTS:
DEPENDENCY_AUDIT:
LARGEST_HANDWRITTEN_FILES:
KNOWN_LIMITATIONS:
NEXT_ALLOWED_TASK: owner review of PR 20 only
NEXT_TASK_STARTED: NO
```

После отчёта остановиться. PR оставить Draft.