# BRAND-RESET-001 — бренд-платформа и архитектура V4

Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/25  
Branch: `agent/brand-reset-v4`  
Base: `main`

## Результат

Зафиксировать утверждаемый фундамент полного ребрендинга без изменения
пользовательских страниц.

## Deliverables

- `docs/BRAND_PLATFORM_V4.md`;
- `docs/SITE_ARCHITECTURE_V4.md`;
- `docs/VISUAL_CONTRACT_V4.md`;
- `docs/REBRAND_ROADMAP_V4.md`;
- `docs/DECISIONS/0006-personal-workshop-v4.md`;
- обновлённые индекс, manifest, task state и implementation status.

## Ограничения

- не изменять Astro, CSS и public media;
- не экспортировать приватный vault;
- не публиковать контакты и неподтверждённые факты;
- не начинать следующую Issue;
- не выполнять merge или deploy.

## Acceptance

1. Одна центральная роль связывает все направления работы.
2. Определены аудитории, обещание, голос и границы.
3. Зафиксированы новая навигация и шаблоны страниц.
4. Установлена документальная медиаполитика.
5. Реализация разбита на независимые этапы.
6. Документы не противоречат правилам доказательности и двух репозиториев.
7. Проверки репозитория и `git diff --check` имеют фактический отчёт.

## Stop rule

После Draft PR и отчёта остановиться. `CONTENT-EXPORT-001` начинается только
после owner review и merge.
