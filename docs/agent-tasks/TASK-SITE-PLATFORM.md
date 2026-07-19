# SITE-PLATFORM-001 — технический каркас персональной платформы

## Статус

`ready / current task`

Исполнитель: GPT-V4 Pro или другой coding-agent с локальным Git, Node.js и правом записи в `spikeal8-maker/alexander-alikin`.

## Контекст

```text
Repository: spikeal8-maker/alexander-alikin
Base: main @ 5feccb8c39364e8d785b0d06691b718f55bdb165
Branch: agent/site-platform
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/7
Task ID: SITE-PLATFORM-001
```

Стратегический foundation принят. Эта задача создаёт только техническую платформу. Дизайн-система, финальная главная, реальные биографии, кейсы и публикации выполняются следующими задачами.

## Обязательное чтение

1. `AGENTS.md`.
2. GitHub Issue №7.
3. `docs/agent-tasks/CURRENT_TASK.yaml`.
4. `docs/testing/SITE-PLATFORM-QUALITY.md`.
5. `docs/CANONICAL_SITE_STRATEGY.md`.
6. `docs/PAGE_SPECIFICATIONS.md`.
7. `docs/CONTENT_MODEL.md`.
8. `docs/PRIVACY_AND_SECURITY.md`.
9. `docs/SITE_EXECUTION_MANIFEST.yaml`.
10. ADR 0002, 0003 и 0004.

## Пользовательский результат

```text
разработчик добавляет валидный публичный Markdown
→ единая quality-команда проверяет контракт
→ Astro строит правильный канонический маршрут
→ draft/blocked/private данные не попадают в dist
→ sitemap, RSS, robots и метаданные согласованы
```

## Технологический baseline

- Node.js 24 LTS.
- npm и `package-lock.json`.
- актуальная стабильная версия Astro на момент реализации.
- TypeScript `strict`.
- статическая генерация; сервер и база данных не нужны.
- основной HTML читается без клиентского JavaScript.
- `main` не публикуется автоматически в этой задаче.

Не копировать и не cherry-pick-ить старый scaffold из commit `8ff507d`. Его можно читать только как отрицательный reference.

# 1. Обязательная структура

```text
.github/workflows/quality.yml
package.json
package-lock.json
astro.config.mjs
tsconfig.json
src/
  components/foundation/
  config/
  content/
  layouts/
  lib/
  pages/
  styles/foundation.css
public/
scripts/
tests/fixtures/
```

Правила размера:

- hand-written source-файл — целевой максимум 300 строк;
- валидатор — целевой максимум 250 строк;
- route page — целевой максимум 160 строк;
- общая логика выносится в `lib`, config или компонент;
- контент не хранится большими массивами внутри страницы.

# 2. Канонические маршруты

Должны существовать и собираться:

```text
/
/about/
/projects/
/projects/[slug]/
/business/
/education/
/journal/
/journal/stories/
/journal/stories/[slug]/
/journal/thoughts/
/journal/thoughts/[slug]/
/journal/articles/
/journal/articles/[slug]/
/journal/news/
/journal/news/[slug]/
/journal/video/
/now/
/facts/
/press/
/second-brain/
/collaboration/
/contacts/
/search/
/privacy/
/404.html
/rss.xml
/robots.txt
/sitemap-index.xml или эквивалент Astro sitemap
```

Для маршрутов без утверждённого контента используется единый нейтральный shell с корректным title, description, H1 и навигацией. Не создавать рекламные обещания, вымышленные факты или фальшивые кейсы.

До launch-задачи сайт работает в режиме `prelaunch`: страницы имеют согласованную политику `noindex`, production deploy отсутствует.

# 3. Конфигурация сайта

Создать типизированную конфигурацию:

- имя и canonical routes;
- `SITE_URL`;
- base path GitHub Pages;
- prelaunch/production mode;
- каноническая навигация:
  `Обо мне · Проекты · Бизнесу · Образованию · Журнал · Обсудить задачу`;
- служебные маршруты;
- единая функция построения внутренних и абсолютных URL.

Не хранить URL-логику отдельно в каждой странице.

# 4. Content Collections

Создать строгие коллекции:

```text
profile
projects
cases
stories
thoughts
articles
news
now
facts
media
```

Общие поля:

```text
title
description
slug
publicationStatus
owner
publishedAt
updatedAt
lastVerifiedAt
reviewAt
topics
relatedProjects
relatedContent
evidenceLevel
sourceUrls
permissionIds
featured
```

Канонические значения `evidenceLevel`:

```text
author_statement
public_source
document_verified
```

Публикационные статусы:

```text
draft
review
ready
published
blocked
archived
```

Правила:

- в production output попадает только `published`;
- `blocked`, `draft`, `review`, `ready` не попадают в HTML, sitemap, RSS, search index и JSON payload;
- `reviewAt` и `lastVerifiedAt` обязательны для Profile, Project, Case, Fact и Now;
- `document_verified` требует хотя бы один источник;
- Fact требует период или явное `periodNotApplicable`;
- Media требует rights holder, allowed uses, alt и caption;
- публичный репозиторий не поддерживает статус `private`: приватный материал здесь запрещён полностью.

Реальные материалы из vault не импортировать. Для тестов использовать фикстуры только в `tests/fixtures/`, не выдавая их за публикации.

# 5. Foundation UI

Реализовать только минимальные переиспользуемые элементы:

- `BaseLayout`;
- `Header` с desktop и рабочей mobile navigation;
- `Footer`;
- `RouteShell`;
- `ContentLayout`;
- `Breadcrumbs`;
- `SkipLink`;
- текстовые статусы публикации и доказательности.

Требования:

- landmarks и последовательные heading levels;
- клавиатурная навигация;
- видимый `focus-visible`;
- mobile menu не исчезает без замены;
- 200% zoom без горизонтального overflow;
- `prefers-reduced-motion`;
- минимальный CSS, без финального визуального дизайна;
- не использовать сгенерированные лица, стоковых роботов, граф второго мозга и декоративные анимации.

# 6. SEO и generated output

Обязательны:

- уникальный title/description для route shells;
- canonical URL;
- `lang="ru"`;
- базовый Person и WebSite JSON-LD только из утверждённой конфигурации;
- breadcrumbs для вложенных маршрутов;
- sitemap;
- RSS только из published journal content;
- robots с prelaunch-политикой;
- 404 с канонической навигацией;
- search index только из published content.

Нельзя добавлять в structured data сведения, которых нет в видимом тексте.

# 7. Проверки и CI

Реализовать команды из `docs/testing/SITE-PLATFORM-QUALITY.md`.

Единая нормативная команда:

```bash
npm run quality
```

Она должна завершаться ненулевым кодом при нарушении любого обязательного локального gate.

GitHub Actions:

- `.github/workflows/quality.yml` запускается для Pull Request и проверяет `npm ci` + quality;
- permissions минимальны: `contents: read`;
- production deploy, Pages environment и write permissions запрещены в этой задаче;
- GitHub Actions не заменяет локальный фактический отчёт.

# 8. Git и PR

- работать только в `agent/site-platform`;
- открыть или продолжить один Draft PR в `main`;
- не изменять `main` напрямую;
- не выполнять merge;
- не использовать force push;
- PR не должен содержать реальные фотографии, второй мозг или неподтверждённые данные;
- неизвестные изменения рабочего дерева → `BLOCKED`.

# 9. Non-goals

- финальная дизайн-система;
- полноценная главная страница;
- страницы с реальными кейсами;
- контактная форма;
- аналитический поставщик;
- публичный граф знаний;
- комментарии;
- dark mode;
- мультиязычность;
- GitHub Pages deploy;
- домен;
- автоматический импорт из vault.

# 10. Acceptance

1. Все маршруты из раздела 2 генерируются.
2. Неверная фикстура frontmatter даёт FAIL.
3. Все непубличные статусы отсутствуют в `dist` и индексах.
4. Каноническая модель доказательности соблюдается.
5. Внутренняя битая ссылка даёт FAIL.
6. Search index, RSS и sitemap не содержат draft/blocked.
7. Основной текст доступен без client JS.
8. Mobile navigation работает с клавиатуры.
9. `npm run quality` PASS.
10. `npm ci` воспроизводим по lockfile.
11. В PR нет deploy workflow, секретов и приватных материалов.
12. PR остаётся Draft.
13. Фактический отчёт содержит команды, exit codes, HEAD и ограничения.
14. `SITE-DESIGN-001` не начата.

# 11. Формат отчёта

```text
TASK: SITE-PLATFORM-001
STATUS: PASS | BLOCKED | FAIL
BRANCH:
HEAD:
PR:
ISSUE:
VISIBLE_RESULT:
ROUTES_BUILT:
COLLECTIONS:
QUALITY_COMMAND:
TEST_IDS_AND_RESULTS:
DEPENDENCY_AUDIT:
FILES_CHANGED:
LARGEST_HANDWRITTEN_FILES:
SECURITY_CHECKS:
KNOWN_LIMITATIONS:
NEXT_ALLOWED_TASK: SITE-DESIGN-001 after owner review and merge only
NEXT_TASK_STARTED: NO
```

После отчёта остановиться.