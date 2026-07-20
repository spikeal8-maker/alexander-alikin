# SITE-DESIGN-001 — редакционно-инженерная дизайн-система

## Статус

`ready / current task`

Исполнитель: coding-agent с локальным Git, Node.js 24, npm и доступом к репозиторию `spikeal8-maker/alexander-alikin`.

## Контекст

```text
Repository: spikeal8-maker/alexander-alikin
Base: main @ 96ea8269ff71c79f05defa429f2542a74a03a648
Branch: agent/site-design-system
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/8
Task ID: SITE-DESIGN-001
```

Техническая Astro-платформа принята. Эта задача реализует одну общую визуальную систему. Она не заменяет следующую задачу `SITE-HOME-001` и не должна превращаться в полную разработку главной страницы.

## Обязательное чтение

1. `AGENTS.md`.
2. GitHub Issue №8.
3. `docs/agent-tasks/CURRENT_TASK.yaml`.
4. `docs/testing/SITE-DESIGN-QUALITY.md`.
5. `docs/VISUAL_SYSTEM.md`.
6. `docs/CANONICAL_SITE_STRATEGY.md`.
7. `docs/PAGE_SPECIFICATIONS.md`.
8. `docs/HOMEPAGE_BLUEPRINT.md`.
9. `docs/CONTENT_MODEL.md`.
10. `docs/PRIVACY_AND_SECURITY.md`.
11. ADR 0004 и 0005.
12. полный diff текущего Draft PR.

## Пользовательский результат

Главная оболочка, тестовый проект и тестовая длинная статья должны выглядеть как части одного продукта:

```text
тёплая редакционная среда
+ точная инженерная сетка
+ ясная типографика
+ понятная доказательность
+ доступная мобильная навигация
```

Посетитель должен видеть взрослую персональную платформу, а не шаблон ИИ-агентства, школьный портал или SaaS-dashboard.

## Каноническое направление

`Интеллектуальный редакционный журнал + инженерная мастерская`.

Эмоциональные характеристики:

- спокойный;
- взрослый;
- интеллектуальный;
- человеческий;
- инженерно-точный;
- любознательный;
- уверенный без превосходства;
- современный без одноразовой модности.

# 1. Design tokens

Создать устойчивую семантическую систему CSS custom properties.

## Цвета

Канонические значения:

```text
background  #F6F2EA
surface     #FFFEFB
text        #1C252D
primary     #173B57
accent      #A8582D
muted       #5D6B75
border      #D8D0C4
verified    #2F6B57
warning     #8B5A20
danger      #8A3D3D
```

Допустимо создавать производные surface/hover/subtle tokens, но только как семантические токены в одном месте. Запрещены случайные дополнительные синие, медные и серые оттенки внутри компонентов.

## Обязательные группы токенов

- foreground/background/surface;
- primary/accent/status;
- border/divider/focus;
- typography family/weight/size/line-height/letter-spacing;
- spacing на базе 4px;
- reading/main/wide containers;
- responsive gutters;
- grid columns/gaps;
- radii;
- border widths;
- редкие shadows;
- motion durations/easing;
- target size;
- z-index layers;
- media aspect ratios.

Сохрани совместимые aliases для уже существующих foundation tokens либо мигрируй все их использования в одном PR.

# 2. Типографика

## Требования

- полноценная кириллица;
- отсутствие внешнего font CDN;
- максимум два семейства;
- основной интерфейс и текст остаются читаемыми при недоступном webfont;
- `font-display: swap` при подключении webfont;
- hero и page headings используют fluid `clamp()`;
- основной текст: ориентир 17–19px и line-height 1.65–1.75;
- reading column: 700–760px;
- lead: до 55–65 символов в строке;
- ссылки в тексте отличаются не только цветом.

Разрешено:

1. self-hosted npm font package с кириллицей и зафиксированной лицензией;
2. системный стек `Manrope, Inter, "Segoe UI", Arial, sans-serif` без сетевой загрузки.

Не добавлять внешние запросы к Google Fonts или другим CDN.

# 3. CSS-архитектура

Разделить стили по ясным ролям. Рекомендуемая структура:

```text
src/styles/
  foundation.css
  tokens.css
  reset.css
  typography.css
  layout.css
  utilities.css
  components/
    buttons.css
    cards.css
    badges.css
    navigation.css
    editorial.css
    forms.css
    states.css
```

Можно выбрать близкую структуру, но:

- один hand-written CSS-файл не должен превращаться в общий монолит;
- presentation не хранится в `style="..."` на страницах;
- raw HEX разрешён только в token-файле и документированных тестовых fixtures;
- повторяющиеся значения заменяются токенами;
- `!important` допустим только в узком reduced-motion reset или с отдельным обоснованием;
- component CSS не зависит от конкретного текста тестовой страницы;
- классы имеют смысловые имена;
- основная система работает без CSS-in-JS.

# 4. Обязательные компоненты

Реализовать или привести к единому API:

## Глобальная оболочка

- `Header`;
- нативная mobile navigation;
- `Footer`;
- `Breadcrumbs`;
- `SkipLink`;
- main/reading/wide containers.

## Действия

- `ButtonLink` или эквивалентный компонент;
- variants: primary, secondary, tertiary, rare accent;
- размеры минимум standard/compact;
- disabled/aria-disabled/loading visual states;
- target area около 44px;
- текст кнопки описывает действие.

## Контент

- `SectionHeader`;
- `ProjectCard`;
- `ContentCard`;
- `FactCard`;
- `EvidenceBadge`;
- `StatusBadge`;
- `Timeline` и `TimelineItem`;
- `EditorialQuote`;
- `EditorialCallout`;
- `CTASection`;
- метаданные материала;
- таблица с mobile overflow wrapper.

## Формы и состояния

Только presentation layer, без отправки данных:

- label/input/textarea/select;
- hint/error/required state;
- focus/disabled/read-only;
- loading;
- empty;
- error;
- unavailable external resource;
- expired/review-required;
- success.

Статус всегда передаётся текстом, а не только цветом или иконкой.

## Изображения

До появления утверждённых фотографий использовать только нейтральный геометрический placeholder:

- без лица;
- без силуэта случайного человека;
- без робота или светящегося мозга;
- `aria-hidden="true"`, если чисто декоративный;
- явная подпись «Фотография будет добавлена после проверки прав», если placeholder имеет содержательную роль.

# 5. Контрольные шаблоны

Дизайн-система проверяется на трёх существующих маршрутах с синтетическим foundation-контентом:

```text
/
/projects/test-platform/
/journal/articles/test-article/
```

## Главная оболочка

Разрешено показать:

- имя;
- краткую уже утверждённую формулу;
- три маршрута;
- минимальный нейтральный visual placeholder;
- один демонстрационный ряд карточек компонентов.

Запрещено реализовывать полный `HOMEPAGE_BLUEPRINT.md`, реальные кейсы, биографию, все секции и финальный контент. Это scope Issue №9.

## Проект

Проверить:

- заголовок и lead;
- метаданные;
- статус и доказательность;
- role/period/result/limitations;
- длинный текст;
- contextual CTA;
- mobile order.

## Длинная статья

Проверить:

- reading width;
- title/lead/date/topics;
- H2/H3;
- списки;
- цитату;
- callout;
- ссылку;
- таблицу или технический блок;
- следующий смысловой маршрут.

Синтетические fixtures должны оставаться явно тестовыми и не превращаться в публичные факты об Александре.

# 6. Responsive и mobile

Поддержать минимум:

```text
320px
390px
768px
1024px
1440px
```

Требования:

- mobile — самостоятельная компоновка;
- нет горизонтального overflow при обычном тексте;
- длинные URL и технические строки переносятся;
- карточки не превращаются в тесную desktop-сетку;
- primary CTA остаётся видимым, но не перекрывает интерфейс;
- native mobile menu работает без обязательного JavaScript;
- tables имеют управляемый horizontal scroll;
- media сохраняет aspect ratio;
- порядок контента логичен для screen reader и визуально.

Проверить 200% zoom либо документированный browser-equivalent test.

# 7. Доступность

Обязательно:

- WCAG AA для основных текстовых и action-пар;
- видимый `:focus-visible`;
- логичный Tab order;
- skip link;
- один H1;
- последовательные headings;
- landmarks;
- touch target около 44px;
- текстовый status;
- links отличимы от plain text;
- alt contract;
- labels и errors для controls;
- основной контент доступен без JavaScript;
- `prefers-reduced-motion` отключает декоративное движение;
- 200% zoom не скрывает функции.

Не заявлять полный WCAG-аудит только по regex. Browser audit и keyboard smoke обязательны.

# 8. Motion

Допустимы только функциональные переходы:

- hover/focus;
- раскрытие;
- смена состояния;
- мягкое появление декоративной линии.

Параметры:

```text
fast      120–180ms
standard  180–260ms
complex   до 350ms
```

Запрещены:

- autoplay animation;
- parallax;
- бесконечные частицы;
- reveal каждой карточки;
- блокирующее intro;
- обязательная анимация для понимания контента.

# 9. Social card baseline

Создать нейтральный prelaunch social-card baseline:

- 1200×630;
- имя;
- короткая профессиональная формула;
- тёплый фон, синий текст, редкий медный акцент;
- без лица и вымышленных изображений;
- без неподтверждённых цифр;
- заменяемый реальным портретом на более позднем этапе.

Не коммитить тяжёлый несжатый raster. Допустим оптимизированный SVG baseline или генератор с воспроизводимым output.

# 10. Автоматические проверки

Существующий platform quality contract должен оставаться зелёным.

Добавить design contract из `docs/testing/SITE-DESIGN-QUALITY.md`, включая:

- token usage;
- запрет raw palette вне tokens;
- contrast calculations;
- отсутствие inline presentation;
- component inventory;
- responsive browser smoke;
- keyboard/focus;
- no-JS;
- reduced motion;
- horizontal overflow;
- screenshots desktop/mobile;
- accessibility browser scan.

Скриншоты не коммитить в Git. Загружать как GitHub Actions artifact `design-review-screenshots`.

# 11. GitHub Actions

Разрешено расширить read-only quality workflow или добавить отдельный read-only `design-review.yml`.

Обязательно:

- `contents: read`;
- без Pages permissions;
- без deploy;
- без secrets;
- Chromium устанавливается только для browser-review job;
- screenshots и audit reports загружаются как временные artifacts;
- failed browser/design gate блокирует PASS.

# 12. Non-goals

- полный content-rich homepage;
- реальные фотографии;
- полная биография;
- окончательные business/education pages;
- контактная форма и backend;
- аналитический provider;
- публичный граф;
- dark mode;
- комментарии;
- мультиязычность;
- deploy и домен;
- импорт приватного vault;
- редизайн стратегии и навигации.

# 13. Acceptance Criteria

1. Каноническая палитра реализована семантическими токенами.
2. Raw palette values не размножены по компонентам.
3. Типографическая шкала поддерживает кириллицу и длинное чтение.
4. Три контрольных маршрута используют одну систему.
5. Header/mobile navigation/footer доступны клавиатурой.
6. Primary/secondary/tertiary действия различимы и единообразны.
7. ProjectCard, ContentCard и FactCard имеют документированный API.
8. Evidence/status передаются текстом и цветом.
9. Quote/callout/timeline/CTA/form states реализованы как переиспользуемые компоненты.
10. Нет inline style в контрольных страницах и новых компонентах.
11. Основные контрастные пары проходят AA.
12. Нет horizontal overflow на обязательных viewports.
13. 200% zoom test PASS.
14. No-JS основной контент PASS.
15. Reduced-motion test PASS.
16. Browser keyboard/focus smoke PASS.
17. Browser accessibility scan не имеет serious/critical violations.
18. `npm run quality` PASS.
19. `npm run design:check` PASS.
20. GitHub Actions platform quality и design review PASS.
21. Artifact содержит 6 screenshots: 3 routes × desktop/mobile.
22. PR остаётся Draft до owner review.
23. Issue №9 не начинается.
24. Deploy отсутствует.

# 14. Обязательные команды

```text
npm ci
npm run quality
npm run design:check
npm audit --audit-level=high
git diff --check
git status --short
```

После push дождаться всех GitHub Actions jobs.

# 15. Формат отчёта

```text
TASK: SITE-DESIGN-001
STATUS: PASS | BLOCKED | FAIL
BRANCH:
HEAD:
PR:
ISSUE:
CI_RUNS:
CI_CONCLUSIONS:
TOKEN_FILES:
TYPOGRAPHY_IMPLEMENTATION:
COMPONENTS_IMPLEMENTED:
CONTROL_ROUTES:
CONTRAST_RESULTS:
VIEWPORT_RESULTS:
ZOOM_200_RESULT:
KEYBOARD_FOCUS_RESULT:
NO_JS_RESULT:
REDUCED_MOTION_RESULT:
AXE_RESULT:
SCREENSHOT_ARTIFACT:
QUALITY_RESULT:
DESIGN_CHECK_RESULT:
DEPENDENCY_AUDIT:
LARGEST_HANDWRITTEN_FILES:
KNOWN_LIMITATIONS:
NEXT_ALLOWED_TASK: SITE-HOME-001 after owner review and merge only
NEXT_TASK_STARTED: NO
```

После отчёта остановиться. Не начинать Issue №9.