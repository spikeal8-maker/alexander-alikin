# TASK-FOUNDATION-EXPAND-001

## Для кого этот документ

Исполнитель: GPT-V4 Pro или другой coding-агент с локальным Git, доступом на запись в `spikeal8-maker/alexander-alikin` и возможностью запускать Node.js/Python.

Этот документ является исполнимым заданием. Не заменять его общими рассуждениями и не начинать следующую задачу после завершения.

## Статус

`ready / merge-blocker`

## Репозиторий и связи

```text
Repository: spikeal8-maker/alexander-alikin
Branch: agent/foundation-architecture
Pull Request: https://github.com/spikeal8-maker/alexander-alikin/pull/1
Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/18
Base branch: main
```

## Цель

Развернуть существующий bootstrap-пакет в обычные просматриваемые файлы репозитория, сохранить более новые канонические документы, удалить одноразовый payload, фактически проверить технический foundation и оставить Pull Request №1 в состоянии Draft для проверки владельцем.

## Видимый результат

После выполнения в head ветки должны быть обычные файлы:

```text
package.json
lockfile выбранного package manager
astro.config.*
tsconfig.json
src/
public/
.github/workflows/quality.yml или эквивалент
.github/workflows/deploy.yml или эквивалент
```

В head ветки не должно быть:

```text
.bootstrap/
.github/workflows/bootstrap-expand.yml
node_modules/
dist/
.astro/
.env
сгенерированных minified bundles
base64-архивов
```

## Обязательное чтение до изменений

1. `AGENTS.md`.
2. GitHub Issue №18.
3. Pull Request №1 и список изменённых файлов.
4. `docs/CANONICAL_SITE_STRATEGY.md`.
5. `docs/PAGE_SPECIFICATIONS.md`.
6. `docs/IMPLEMENTATION_ROADMAP.md`.
7. `docs/SITE_EXECUTION_MANIFEST.yaml`.
8. `IMPLEMENTATION_STATUS.md`.

## Жёсткий scope

Разрешено:

- безопасно реконструировать и проверить bootstrap-архив;
- извлечь технический foundation в обычные файлы;
- сохранить и при необходимости аккуратно объединить конфигурацию;
- удалить `.bootstrap` и одноразовый workflow;
- исправить только те ошибки, которые блокируют установку, quality или build;
- разделить явно чрезмерный hand-written source-файл, если он превышает 400 строк и мешает поддерживаемости;
- обновить README/статус/PR только фактическими результатами этой задачи.

Запрещено:

- переписывать сайт с нуля без доказанного дефекта пакета;
- менять позиционирование, аудитории, навигацию, палитру или CTA;
- начинать `SITE-PLATFORM-001`, дизайн, главную или контентные страницы как отдельную продуктовую работу;
- переносить данные из приватного vault;
- добавлять реальные фотографии без отдельного контентного решения;
- публиковать неподтверждённые числа;
- выполнять merge PR №1;
- закрывать Issue №18 при неполном Acceptance;
- force push;
- стирать неизвестные изменения рабочего дерева.

## Предпочтительный путь

Использовать локальное расширение и обычный push. Не зависеть от GitHub Actions для распаковки.

## Порядок выполнения

### Шаг 0. Ориентация и защита рабочего дерева

В существующем checkout:

```bash
git remote -v
git fetch origin --prune
git checkout agent/foundation-architecture
git status --short
git branch --show-current
git log -1 --oneline
```

Ожидаемая ветка:

```text
agent/foundation-architecture
```

Если `git status --short` показывает неизвестные локальные изменения, не выполнять reset/clean. Завершить отчётом `BLOCKED` с перечнем файлов.

Не создавать новый PR: продолжать PR №1.

### Шаг 1. Проверить наличие частей

Должны существовать:

```text
.bootstrap/part-000.b64
.bootstrap/part-001.b64
.bootstrap/part-002.b64
```

Проверить:

```bash
ls -lh .bootstrap/part-*.b64
wc -c .bootstrap/part-*.b64
```

Если частей другое количество, не угадывать. Сравнить с текущим деревом и сообщить точный blocker.

### Шаг 2. Реконструировать архив во временной директории

Не распаковывать сразу в корень репозитория.

Linux/macOS/Git Bash:

```bash
rm -rf .work/foundation-expand
mkdir -p .work/foundation-expand/archive .work/foundation-expand/output
cat .bootstrap/part-000.b64 .bootstrap/part-001.b64 .bootstrap/part-002.b64 \
  | tr -d '\r\n\t ' \
  | base64 --decode \
  > .work/foundation-expand/archive/foundation.tar.gz
```

Если стандартная `base64` недоступна, использовать Python без изменения содержимого:

```bash
python - <<'PY'
from base64 import b64decode
from pathlib import Path

root = Path('.bootstrap')
parts = [root / 'part-000.b64', root / 'part-001.b64', root / 'part-002.b64']
encoded = b''.join(p.read_bytes() for p in parts)
encoded = b''.join(encoded.split())
out = Path('.work/foundation-expand/archive/foundation.tar.gz')
out.parent.mkdir(parents=True, exist_ok=True)
out.write_bytes(b64decode(encoded, validate=True))
print(out, out.stat().st_size)
PY
```

Добавить `.work/` в `.gitignore`, если её там нет. Временные файлы не коммитить.

### Шаг 3. Проверить архив до распаковки

Выполнить безопасную проверку Python:

```bash
python - <<'PY'
from pathlib import Path, PurePosixPath
import tarfile

archive = Path('.work/foundation-expand/archive/foundation.tar.gz')
max_file = 10 * 1024 * 1024
max_total = 80 * 1024 * 1024
seen = set()
total = 0

with tarfile.open(archive, 'r:gz') as tf:
    members = tf.getmembers()
    if not members:
        raise SystemExit('BLOCKED: archive is empty')

    for member in members:
        raw = member.name.replace('\\', '/')
        path = PurePosixPath(raw)

        if path.is_absolute() or '..' in path.parts:
            raise SystemExit(f'BLOCKED: unsafe path: {member.name}')
        if not path.parts or path.parts[0] in {'.git', '.hg', '.svn'}:
            raise SystemExit(f'BLOCKED: forbidden repository metadata: {member.name}')
        if member.issym() or member.islnk() or member.isdev() or member.isfifo():
            raise SystemExit(f'BLOCKED: unsupported archive member: {member.name}')
        if member.name in seen:
            raise SystemExit(f'BLOCKED: duplicate path: {member.name}')
        seen.add(member.name)

        if member.isfile():
            if member.size > max_file:
                raise SystemExit(f'BLOCKED: file exceeds 10 MiB: {member.name} ({member.size})')
            total += member.size
            if total > max_total:
                raise SystemExit(f'BLOCKED: unpacked payload exceeds 80 MiB: {total}')

    print(f'ARCHIVE_OK members={len(members)} total_bytes={total}')
    for member in members:
        print(member.name)
PY
```

Сохранить вывод списка файлов в локальный отчёт или PR-комментарий. Не коммитить архивный manifest, если он является большим автоматически сгенерированным файлом без дальнейшей ценности.

### Шаг 4. Распаковать только во временную директорию

```bash
python - <<'PY'
from pathlib import Path
import tarfile

archive = Path('.work/foundation-expand/archive/foundation.tar.gz')
out = Path('.work/foundation-expand/output')
out.mkdir(parents=True, exist_ok=True)

with tarfile.open(archive, 'r:gz') as tf:
    for member in tf.getmembers():
        if member.isdir():
            (out / member.name).mkdir(parents=True, exist_ok=True)
            continue
        if not member.isfile():
            continue
        target = out / member.name
        target.parent.mkdir(parents=True, exist_ok=True)
        source = tf.extractfile(member)
        if source is None:
            raise SystemExit(f'BLOCKED: cannot read {member.name}')
        target.write_bytes(source.read())

print(out.resolve())
PY
```

### Шаг 5. Инвентаризация до копирования

Проверить временное дерево:

```bash
find .work/foundation-expand/output -type f -print | sort
```

Обязательно определить:

- какой package manager используется;
- существует ли lockfile;
- существуют ли `package.json`, Astro config, `src/`, `public/`;
- какие workflow находятся в пакете;
- есть ли `.env`, секреты, generated output, бинарные payload;
- какие документы конфликтуют с текущей веткой;
- есть ли hand-written source-файлы более 400 строк.

Проверка крупных файлов:

```bash
find .work/foundation-expand/output -type f -size +1M -print
```

Файл более 1 MiB не является автоматически запрещённым, но должен быть объяснён. Generated bundle, база данных, архив или base64 не коммитятся.

### Шаг 6. Сохранить канонические документы

Архив был создан раньше части текущих стратегических документов. Запрещено слепое `tar -xzf ... -C .`.

Текущая ветка является источником истины для следующих путей:

```text
AGENTS.md
IMPLEMENTATION_STATUS.md
docs/README.md
docs/CANONICAL_SITE_STRATEGY.md
docs/AUDIENCE_MODEL.md
docs/PAGE_SPECIFICATIONS.md
docs/HOMEPAGE_BLUEPRINT.md
docs/USER_JOURNEYS_AND_CTA.md
docs/VISUAL_SYSTEM.md
docs/CONTENT_AND_EVIDENCE_PLAN.md
docs/IMPLEMENTATION_ROADMAP.md
docs/SEO_ANALYTICS_AND_OPERATIONS.md
docs/SITE_EXECUTION_MANIFEST.yaml
docs/DECISIONS/0004-intent-based-information-architecture.md
docs/DECISIONS/0005-editorial-engineering-visual-system.md
docs/DECISIONS/README.md
docs/agent-tasks/TASK-FOUNDATION-EXPAND.md
```

Не перезаписывать их архивными версиями.

Другие документы переносить только после сравнения. Если пакет содержит старый вариант того же документа, сохранить более новую веточную версию и отразить решение в отчёте.

### Шаг 7. Перенести обычные технические файлы

Перенести из временного дерева:

- package manifest и lockfile;
- Astro/TypeScript/configuration files;
- `src/`;
- `public/` без неутверждённых личных медиа;
- скрипты и тесты;
- обычные quality/deploy workflows;
- недостающую техническую документацию, если она не конфликтует с канонической.

Не переносить:

- `.git`;
- `.env`;
- `node_modules`;
- `dist`;
- `.astro`;
- coverage/cache;
- временные файлы;
- архивы;
- base64 parts;
- приватные материалы;
- изображения неизвестного происхождения.

После переноса удалить:

```bash
rm -rf .bootstrap
rm -f .github/workflows/bootstrap-expand.yml
```

### Шаг 8. Проверить модульность

Перед установкой зависимостей проверить:

- нет ли одной монолитной страницы, содержащей весь сайт;
- content хранится отдельно от layout;
- повторяющиеся секции вынесены в компоненты;
- CSS-токены не размножены по страницам;
- нет гигантских hardcoded массивов публикаций;
- нет hand-written source-файлов более 400 строк без обоснования.

Не проводить полный редизайн. Исправлять только явные структурные дефекты foundation.

### Шаг 9. Установка зависимостей

Не менять package manager.

Если есть `package-lock.json`:

```bash
npm ci
```

Если есть `pnpm-lock.yaml`:

```bash
corepack enable
pnpm install --frozen-lockfile
```

Если есть `yarn.lock`:

```bash
corepack enable
yarn install --immutable
```

Если lockfile отсутствует, это не автоматический FAIL. Установить зависимости выбранным в `package.json` manager, создать lockfile и объяснить это в отчёте. Не обновлять зависимости ради новизны.

### Шаг 10. Фактические проверки

Сначала посмотреть scripts:

```bash
node --version
cat package.json
```

Обязательная нормативная команда:

```bash
npm run quality
```

Если проект использует pnpm или yarn, выполнить соответствующую команду, но script должен называться `quality`.

Также выполнить:

```bash
npm run build
git diff --check
git status --short
```

Если `quality` отсутствует, не подменять его одним build. Реализовать минимальный агрегирующий script на существующих проверках проекта либо завершить `BLOCKED`, если foundation принципиально неполон. В отчёте перечислить каждый реально запущенный script и exit code.

### Шаг 11. Проверка утечек и мусора

Проверить, что не коммитятся:

```text
.env
node_modules
dist
.astro
.work
.bootstrap
*.tar
*.tar.gz
*.zip
base64 payload
private keys
API tokens
```

Выполнить поиск высокорисковых маркеров хотя бы по tracked-кандидатам:

```bash
git grep -n -I -E 'BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}' -- . ':!docs/agent-tasks/TASK-FOUNDATION-EXPAND.md' || true
```

Найденный реальный секрет является `BLOCKED`; не маскировать его новым коммитом поверх истории без отдельного плана очистки.

### Шаг 12. Commit и push

Проверить diff целиком. Коммит должен содержать только результат этой задачи.

Рекомендуемое сообщение:

```text
feat: expand and validate personal platform foundation
```

Push:

```bash
git push origin agent/foundation-architecture
```

Не использовать force push.

### Шаг 13. Обновить Issue и PR

В Issue №18 добавить итоговый отчёт по формату ниже.

В PR №1:

- сохранить Draft;
- убрать формулировку, что технический foundation не развёрнут, только если Acceptance полностью выполнен;
- указать точный head SHA;
- привести команды и результаты;
- перечислить известные ограничения;
- не утверждать, что сайт готов к production.

## Acceptance Criteria

1. `.bootstrap/` отсутствует в head.
2. `bootstrap-expand.yml` отсутствует в head.
3. Технические файлы доступны как обычный Git diff.
4. Канонические документы не были заменены более старыми архивными версиями.
5. Нет committed `node_modules`, build output, архивов или base64 payload.
6. Нет необъяснённых hand-written source-файлов более 400 строк.
7. Package manager и lockfile согласованы.
8. `quality` фактически запущен и имеет PASS.
9. Production build фактически запущен и имеет PASS.
10. `git diff --check` PASS.
11. Секреты и приватные материалы не обнаружены.
12. PR №1 остаётся Draft.
13. Issue №18 содержит фактический отчёт и ссылки на commit/PR.
14. Следующая задача не начата.

## Если пакет повреждён или небезопасен

Не пытаться молча восстановить сайт из догадок.

Завершить `BLOCKED` и указать:

- на каком шаге произошла ошибка;
- точную команду;
- exit code;
- проблемный файл или member;
- что уже проверено;
- безопасный рекомендуемый вариант: удалить bootstrap из PR №1 и выполнить `SITE-PLATFORM-001` отдельным обычным PR.

## Итоговый отчёт

```text
TASK: TASK-FOUNDATION-EXPAND-001
STATUS: PASS | BLOCKED | FAIL
REPOSITORY: spikeal8-maker/alexander-alikin
BRANCH: agent/foundation-architecture
HEAD:
PR: https://github.com/spikeal8-maker/alexander-alikin/pull/1
ISSUE: https://github.com/spikeal8-maker/alexander-alikin/issues/18

ORIENTATION:
  original working tree:
  unknown changes:

ARCHIVE:
  parts:
  archive bytes:
  members:
  unpacked bytes:
  unsafe members:

PRESERVATION:
  canonical docs preserved:
  conflicts resolved:

FILES:
  expanded:
  removed:
  files over 1 MiB:
  hand-written files over 400 lines:

DEPENDENCIES:
  node version:
  package manager:
  install command:
  install exit:

TESTS:
  quality command:
  quality exit:
  build command:
  build exit:
  diff check:
  secret scan:

KNOWN_LIMITATIONS:

COMMIT:
PUSH:
NEXT_ALLOWED_TASK: owner review of PR #1 only; do not start SITE-PLATFORM-001
```

После публикации отчёта остановиться.