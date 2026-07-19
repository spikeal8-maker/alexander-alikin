# SITE-PLATFORM-QUALITY — нормативные проверки

Этот документ является исполнимым quality contract для Issue №7. Команда `npm run quality` должна запускать все локальные обязательные проверки в детерминированном порядке.

## Baseline

- Node.js 24 LTS.
- npm + committed `package-lock.json`.
- чистая установка: `npm ci`.
- проверки не зависят от приватного vault, внешней БД или секретов.
- тесты не совершают обязательных внешних сетевых запросов.

## Обязательные Test IDs

| Test ID | Назначение | Минимальная команда |
|---|---|---|
| `TST-PLATFORM-FORMAT-001` | формат исходников и конфигурации | `npm run format:check` |
| `TST-PLATFORM-LINT-001` | lint Astro/TS/JS | `npm run lint` |
| `TST-PLATFORM-TYPE-001` | Astro и TypeScript typecheck | `npm run typecheck` |
| `TST-PLATFORM-CONTENT-001` | схемы всех collections и негативные фикстуры | `npm run test:content` |
| `TST-PLATFORM-ROUTES-001` | соответствие route manifest каноническим маршрутам | `npm run test:routes` |
| `TST-PLATFORM-LINKS-001` | внутренние ссылки и anchors | `npm run test:links` |
| `TST-PLATFORM-LEAK-001` | отсутствие draft/blocked/private в output | `npm run test:leaks` |
| `TST-PLATFORM-SECRET-001` | секреты и запрещённые файлы | `npm run test:secrets` |
| `TST-PLATFORM-BUILD-001` | production static build | `npm run build` |
| `TST-PLATFORM-DIST-001` | HTML, canonical, sitemap, RSS, robots, search index | `npm run test:dist` |
| `TST-PLATFORM-A11Y-001` | статический accessibility smoke | `npm run test:a11y` |
| `TST-PLATFORM-SIZE-001` | размер hand-written файлов | `npm run test:file-size` |

## Нормативная команда

```bash
npm run quality
```

Порядок:

```text
format:check
→ lint
→ typecheck
→ test:content
→ test:routes
→ test:links
→ test:secrets
→ build
→ test:leaks
→ test:dist
→ test:a11y
→ test:file-size
```

`quality` завершается при первом FAIL и возвращает ненулевой exit code.

## Требования к негативным тестам

В `tests/fixtures/invalid/` должны быть отдельные минимальные случаи:

- неизвестный `evidenceLevel`;
- `document_verified` без источника;
- Fact без периода;
- Media без прав или alt;
- Now без `reviewAt`;
- неизвестный публикационный статус;
- абсолютный внутренний URL, нарушающий base path;
- ссылка на отсутствующий маршрут;
- draft-маркер, искусственно помещённый в тестовый output.

Каждая фикстура должна проверять конкретную ошибку. Один огромный «всё сломано» fixture запрещён.

## Проверка маршрутов

Источник истины — типизированный route manifest. Тест сравнивает обязательные маршруты задачи с реально созданными страницами.

Dynamic route считается существующим, если:

- route file присутствует;
- `getStaticPaths` использует только published entries;
- тестовая published fixture создаёт ожидаемый URL;
- draft fixture URL не создаётся.

## Leak gate

После build проверить весь `dist/`, включая:

- HTML;
- JSON;
- JavaScript bundles;
- source maps, если существуют;
- sitemap;
- RSS;
- search index;
- generated data files.

Запрещённые маркеры из тестовых draft/blocked fixtures не должны встречаться ни в одном файле.

## Secret gate

Проверяются как минимум:

- `.env` кроме безопасного `.env.example`;
- private keys;
- GitHub, OpenAI, Google, AWS и Slack token patterns;
- прямые `password=`, `api_key=`, `token=` с непустым значением;
- ZIP, base64 payload, vault paths и приватные документы;
- `node_modules`, `dist`, `.astro`, coverage и caches в Git index.

Ложноположительное исключение оформляется узким allowlist с причиной. Глобальное отключение pattern запрещено.

## Static accessibility smoke

Generated HTML проверяется минимум на:

- `lang="ru"`;
- один `main`;
- один видимый H1;
- непустые title и description;
- skip link;
- label для интерактивных контролов;
- отсутствие пустых `href`;
- отсутствие смысла, переданного только цветом в статусах;
- no-JS доступность основного текста.

Полный browser accessibility audit относится к следующим UI-задачам и не имитируется здесь.

## File-size gate

По умолчанию FAIL:

- source > 300 строк;
- route page > 160 строк;
- validator > 250 строк.

Допустимое исключение требует:

- комментария в файле;
- объяснения в PR;
- доказательства, что разделение ухудшает поддержку.

Generated lockfile, schema snapshots и нормативная документация не считаются hand-written source.

## Dependency audit

Фактический отчёт должен включать:

```bash
npm audit --audit-level=high
```

High/critical vulnerability → FAIL либо точный `BLOCKED` с advisory, затронутой зависимостью и планом устранения. Нельзя скрывать audit failure из-за того, что `npm run quality` локально зелёный.

## GitHub Actions

Quality workflow выполняет:

```text
checkout
→ setup Node 24
→ npm ci
→ npm run quality
→ npm audit --audit-level=high
```

Permissions: только `contents: read`.

Deploy, Pages write permissions и environment в этом workflow запрещены.

## Итоговый gate

PASS допустим только при:

- всех 12 Test IDs PASS;
- `npm ci` PASS;
- dependency audit без high/critical;
- чистом `git diff --check`;
- отсутствии неизвестных изменений;
- Draft PR с фактическим отчётом.
