# SITE-DESIGN-QUALITY — нормативные проверки дизайн-системы

Этот документ является исполнимым quality contract для Issue №8. Он дополняет, но не заменяет platform quality.

## Baseline

- Node.js 24 LTS;
- npm + committed lockfile;
- существующая команда `npm run quality` остаётся PASS;
- browser tests используют Chromium через Playwright;
- тесты не зависят от приватного vault, внешней БД, домена или секретов;
- внешние font/CDN requests запрещены;
- generated screenshots не коммитятся.

## Нормативные команды

```text
npm run quality
npm run design:static
npm run design:browser
npm run design:check
```

`design:check` запускает static design gates и browser review. Любой FAIL возвращает ненулевой exit code.

## Обязательные Test IDs

| Test ID | Назначение | Минимальный gate |
|---|---|---|
| `TST-DESIGN-TOKENS-001` | обязательные semantic tokens | static validator |
| `TST-DESIGN-RAW-COLOR-001` | нет raw palette вне token files | static validator |
| `TST-DESIGN-INLINE-001` | нет inline presentation | static validator |
| `TST-DESIGN-CONTRAST-001` | канонические пары проходят AA | contrast calculator |
| `TST-DESIGN-COMPONENTS-001` | component inventory и API | static validator |
| `TST-DESIGN-VIEWPORT-001` | 320/390/768/1024/1440 без overflow | Playwright |
| `TST-DESIGN-ZOOM-001` | 200% browser-equivalent layout | Playwright |
| `TST-DESIGN-KEYBOARD-001` | keyboard, focus и mobile nav | Playwright |
| `TST-DESIGN-NOJS-001` | основной контент без JS | Playwright no-JS context |
| `TST-DESIGN-MOTION-001` | reduced motion | Playwright emulation |
| `TST-DESIGN-AXE-001` | serious/critical a11y scan | axe-core/Playwright |
| `TST-DESIGN-SCREENSHOT-001` | шесть контрольных screenshots | Playwright artifact |

## 1. Token gate

Проверить наличие и фактическое использование минимум следующих групп:

```text
colors
foreground/background/surface
status colors
focus
font families
font weights
fluid font sizes
line heights
spacing
containers
gutters
grid gaps
radii
borders
shadows
motion durations
motion easing
interactive target size
z-index
```

Тест должен падать, если обязательный token объявлен, но система продолжает использовать старый hardcoded value в ключевых компонентах.

## 2. Raw color gate

Разрешить raw HEX/RGB/HSL только:

- в каноническом token-файле;
- в тестовом contrast manifest;
- в документации;
- в SVG social-card baseline, если значения синхронизированы с tokens.

Сканировать новые `.css`, `.astro`, `.ts`, `.mjs`.

Запрещено глобально allowlist-ить весь каталог компонентов.

## 3. Inline presentation gate

Новые контрольные страницы и компоненты не должны содержать:

```text
style="..."
set:html с CSS
большие style blocks внутри route page
presentation constants внутри content data
```

Допустимы:

- CSS custom property как узкий dynamic API, если компонент документирует её;
- JSON-LD и безопасный HTML, не относящийся к presentation.

Каждое исключение должно быть точечным и объяснённым.

## 4. Contrast gate

Рассчитать WCAG contrast ratio программно.

Минимальные обязательные пары:

```text
text on background
primary on background
muted on background
surface text on surface
surface text on primary
surface text on accent
verified text/status on approved background
warning text/status on approved background
error text/status on approved background
focus ring against background and surface
```

Требования:

- обычный текст: не менее 4.5:1;
- крупный текст: не менее 3:1;
- UI boundaries/focus: не менее 3:1, где применимо;
- медный обычный текст проверяется отдельно.

Результат должен выводить фактические ratios.

## 5. Component inventory gate

Проверить наличие и импортируемость:

```text
Header
Footer
Breadcrumbs
ButtonLink
SectionHeader
ProjectCard
ContentCard
FactCard
EvidenceBadge
StatusBadge
Timeline
TimelineItem
EditorialQuote
EditorialCallout
CTASection
FormField или эквивалент
StatePanel или отдельные state components
ImagePlaceholder
```

Тест не должен проверять только имя файла. Минимум три контрольных route должны реально использовать ключевые компоненты.

## 6. Browser routes

Контрольные URL с учётом base path:

```text
/alexander-alikin/
/alexander-alikin/projects/test-platform/
/alexander-alikin/journal/articles/test-article/
```

Browser test запускается против production static build через локальный server.

## 7. Viewport gate

Для каждого контрольного маршрута проверить:

```text
320×800
390×844
768×1024
1024×900
1440×1200
```

Условия:

- `scrollWidth <= clientWidth + 1` для основного документа;
- H1 видим;
- header/footer видимы;
- primary content не перекрыт sticky elements;
- controls не выходят за viewport;
- cards не имеют непреднамеренного fixed width;
- таблица использует специальный overflow wrapper, а не растягивает body.

## 8. 200% zoom gate

Использовать документированный browser-equivalent:

1. viewport, эквивалентный удвоенному масштабу desktop;
2. либо Chromium CDP/page scale;
3. либо CSS zoom test только как дополнительный smoke.

Проверить:

- навигация остаётся доступной;
- H1 и CTA не обрезаны;
- нет горизонтального overflow body;
- текст не перекрывает соседние элементы;
- footer доступен;
- focus target не исчезает.

В отчёте указать применённый метод.

## 9. Keyboard и focus gate

Проверить реальным browser test:

- первый Tab открывает или достигает skip link;
- skip link переводит focus к `main`;
- logo, navigation и CTA доступны Tab;
- native mobile `<summary>` получает focus;
- Enter/Space открывает mobile menu;
- ссылки внутри открытого menu доступны;
- focus indicator вычисляется как видимый;
- нет keyboard trap;
- disabled controls не выглядят активными;
- Tab order соответствует DOM order.

Не подменять browser behavior поиском строки `focus-visible`.

## 10. No-JS gate

Создать browser context с `javaScriptEnabled: false`.

Для трёх маршрутов проверить:

- страница загружается;
- title, H1, main text доступны;
- навигация через native HTML доступна;
- проектные и редакционные метаданные видимы;
- нет сообщения, блокирующего весь контент из-за JS.

Поиск и будущие progressive features могут не работать, но основной материал обязан работать.

## 11. Reduced motion gate

В контексте `prefers-reduced-motion: reduce` проверить:

- decorative animation duration близка к нулю;
- infinite animation отсутствует;
- transition не является необходимой для раскрытия состояния;
- controls остаются работоспособными.

## 12. Accessibility browser scan

Использовать `@axe-core/playwright` или эквивалентный проверяемый browser scanner.

Для трёх маршрутов и двух viewports минимум:

- desktop 1440;
- mobile 390.

Exit gate:

- serious violations = 0;
- critical violations = 0;
- moderate/minor перечисляются в отчёте и не скрываются;
- color contrast rules не отключаются без узкого документированного основания.

## 13. Screenshot gate

Создать шесть PNG screenshots:

```text
home-desktop.png
home-mobile.png
project-desktop.png
project-mobile.png
article-desktop.png
article-mobile.png
```

Параметры:

- desktop: 1440px width;
- mobile: 390px width;
- full-page либо документированная viewport strategy;
- одинаковый deterministic font/runtime;
- без реального лица и приватных данных;
- нет плавающих debug panels.

Загрузить как GitHub Actions artifact:

```text
design-review-screenshots
```

Retention может быть коротким. PNG не коммитить в репозиторий.

## 14. Social-card baseline test

Проверить:

- размер или viewBox 1200×630;
- канонические цвета;
- имя и формула не обрезаны;
- нет внешнего image URL;
- нет сгенерированного лица;
- файл оптимизирован и обозрим в diff либо воспроизводим генератором.

## 15. GitHub Actions

Разрешён отдельный job/workflow `Design Review`.

Минимальные шаги:

```text
checkout
setup Node 24
npm ci
npm run quality
install Chromium
npm run design:check
upload design-review-screenshots artifact
```

Permissions:

```text
contents: read
```

Запрещено:

- Pages write;
- deployment environment;
- secrets;
- `continue-on-error` для acceptance gates;
- загрузка screenshots в репозиторий.

## 16. File-size gate

Сохраняются правила `AGENTS.md`.

Дополнительно:

- component `.astro` целевой максимум 180 строк;
- component CSS целевой максимум 220 строк;
- static design validator максимум 250 строк;
- Playwright spec может быть разделён по keyboard/responsive/screenshots;
- один общий CSS-файл более 300 строк требует разделения.

## 17. Отчёт

PASS допустим только при:

- platform `npm run quality` PASS;
- все 12 design Test IDs PASS;
- dependency audit PASS;
- GitHub Actions jobs success;
- screenshot artifact существует;
- PR Draft;
- Issue №9 не начата;
- нет deploy workflow.

Отчёт обязан включать:

- команды и exit codes;
- CI URLs;
- contrast ratios;
- viewports;
- метод 200% zoom;
- axe counts;
- screenshot artifact;
- известные ограничения, включая отсутствие реального портрета.