# Состояние реализации

## Текущий этап

`FOUNDATION-CONSOLIDATE-001 — in_progress`

Канонический стратегический, редакционный и governance-фундамент подготовлен в ветке
`agent/foundation-architecture`. Draft PR №1 содержит только утверждённую стратегию,
backlog и supporting-документацию.

От старого bootstrap-пакета осталось только reference-значение в истории коммита
`8ff507d`; технический scaffold удалён из конечного diff и будет реализован отдельно.

## Технический merge-blocker

Issue №19: <https://github.com/spikeal8-maker/alexander-alikin/issues/19>

Технический scaffold (Astro, src/, workflows, package files) исключён из PR.
Он будет реализован по Issue №7 после owner review и merge foundation PR.

## Что входит в PR №1

- каноническая продуктовая спецификация: стратегия, аудитории, страницы, homepage, визуальная система, контент и доказательства, roadmap;
- governance и операционные документы;
- supporting-документация (контентная модель, редакция, политики, чек-листы, риски);
- архитектурные решения (ADR 0001–0005);
- правила для coding-агентов (AGENTS.md);
- machine-readable execution manifest;
- backlog и статусы задач.

## Что не входит в PR №1

- Astro-код, компоненты, страницы, стили;
- CI/CD workflow;
- package.json и зависимости;
- реальные фотографии и контент.

Технический scaffold из commit `8ff507d` сохранён в истории только как reference.

## Реализовано на уровне стратегии и спецификации

- цель сайта и критерии успеха;
- приоритеты целевых аудиторий;
- отдельные маршруты личности, бизнеса, образования, проектов, журнала и СМИ;
- назначение, доказательства, CTA и аналитика каждой страницы;
- blueprint главной страницы;
- редакционно-инженерная визуальная система;
- план контента, фотографий, фактов и кейсов;
- поэтапная программа реализации;
- SEO, аналитика и эксплуатационный цикл;
- machine-readable execution manifest;
- Epic и задачи реализации в GitHub Issues.

## Канонические ссылки

- Draft PR: <https://github.com/spikeal8-maker/alexander-alikin/pull/1>
- Epic V1: <https://github.com/spikeal8-maker/alexander-alikin/issues/5>
- Strategy task: <https://github.com/spikeal8-maker/alexander-alikin/issues/6>
- Consolidation task: <https://github.com/spikeal8-maker/alexander-alikin/issues/19>
- Private content task: <https://github.com/spikeal8-maker/alexander-alikin-vault/issues/5>

## Следующая допустимая задача

После owner review и merge foundation PR:

`SITE-PLATFORM-001 — Astro-каркас, content collections и нормативный quality gate`

Issue: <https://github.com/spikeal8-maker/alexander-alikin/issues/7>

Контентный трек выполняется параллельно в приватном vault, но публичные страницы с доказательствами не считаются готовыми до утверждения реальных материалов.

## Контрольные принципы

- публичный репозиторий содержит только утверждённый открытый контент;
- приватный vault является источником заметок, реестров и редакционной подготовки;
- прямой автоматической публикации из vault нет;
- сильные факты маркируются уровнем доказательности;
- бизнес и образование имеют отдельные целевые страницы;
- главная представляет человека и маршрутизирует намерение;
- один Task соответствует одному пользовательскому результату, ветке и Draft PR;
- `main` соответствует опубликованной версии;
- публикация выполняется через Pull Request и GitHub Actions;
- следующий Task не запускается автоматически до merge и owner review зависимости.

## Что ещё не реализовано

- развёрнутый и проверенный Astro-код;
- production-код канонических страниц;
- финальная дизайн-система в CSS и компонентах;
- реальные фотографии;
- утверждённые биографии;
- три доказательных кейса;
- рабочий контекстный контакт;
- GitHub Pages, домен и public launch.

Этот файл служит контрольной меткой: стратегия и backlog подготовлены, но сайт версии 1.0 ещё не считается реализованным или опубликованным.
