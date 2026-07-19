# Документация платформы

## Каноническая продуктовая спецификация

Начинать работу над интерфейсом, текстами и новыми страницами нужно с этих документов:

1. [Каноническая стратегия сайта](CANONICAL_SITE_STRATEGY.md)
2. [Модель целевых аудиторий](AUDIENCE_MODEL.md)
3. [Спецификации всех страниц](PAGE_SPECIFICATIONS.md)
4. [Blueprint главной страницы](HOMEPAGE_BLUEPRINT.md)
5. [Пользовательские маршруты и CTA](USER_JOURNEYS_AND_CTA.md)
6. [Визуальная система](VISUAL_SYSTEM.md)
7. [План контента и доказательств](CONTENT_AND_EVIDENCE_PLAN.md)
8. [План реализации](IMPLEMENTATION_ROADMAP.md)
9. [SEO, аналитика и эксплуатация](SEO_ANALYTICS_AND_OPERATIONS.md)
10. [Machine-readable execution manifest](SITE_EXECUTION_MANIFEST.yaml)

## Назначение и работа

- [Архитектура репозиториев](REPOSITORY_ARCHITECTURE.md) — модель двух репозиториев и поток данных
- [Карта репозитория](REPOSITORY_MAP.md) — структура публичного репозитория
- [Операционная модель](OPERATING_MODEL.md) — источники истины и процесс принятия решений
- [Управление](GOVERNANCE.md) — роли, правила и контроль изменений
- [Как работает сайт](SITE_RUNTIME.md) — runtime-модель статической генерации
- [Поток данных](DATA_FLOW.md) — маршруты движения контента
- [Критерии успеха](SUCCESS_CRITERIA.md) — метрики foundation-версии

## Контент и публикация

- [Модель контента](CONTENT_MODEL.md) — типы материалов и метаданные
- [Редакционный процесс](EDITORIAL_WORKFLOW.md) — от заметки до публикации
- [Конвейер публикации](PUBLICATION_FLOW.md) — этапы выпуска материала
- [Стандарт качества](CONTENT_QUALITY.md) — требования к публичному контенту
- [Бэклог контента](CONTENT_BACKLOG.md) — накопление и приоритизация материалов
- [План накопления](MATERIALS_PLAN.md) — стратегия накопления материалов
- [Редакционный ритм](CONTENT_CALENDAR.md) — периодичность публикаций
- [Политика доказательности](EVIDENCE_POLICY.md) — иерархия источников и правила

## Контроль и выпуск

- [Конфиденциальность и безопасность](PRIVACY_AND_SECURITY.md)
- [Реестр рисков](RISK_REGISTER.md)
- [Условия запуска](LAUNCH_GATES.md) — gates для публичного запуска
- [Чек-лист выпуска](RELEASE_CHECKLIST.md)
- [Метрики](MEASUREMENT.md)
- [Недостающие входные данные](NEXT_INPUTS.md)
- [Руководство владельца](OWNER_GUIDE.md)
- [Настройки GitHub после слияния](GITHUB_SETTINGS_CHECKLIST.md)
- [Архитектурные и продуктовые решения](DECISIONS/README.md)

## Развитие

- [Дорожная карта](ROADMAP.md) — high-level этапы развития
- [Статус реализации](../IMPLEMENTATION_STATUS.md)
- [Epic версии 1.0](https://github.com/spikeal8-maker/alexander-alikin/issues/5)
- [Приватный публичный контентный пакет](https://github.com/spikeal8-maker/alexander-alikin-vault/issues/5)

## Правило приоритета

При конфликте между ранним общим документом и канонической продуктовой спецификацией приоритет имеют:

1. принятые ADR;
2. `CANONICAL_SITE_STRATEGY.md`;
3. `PAGE_SPECIFICATIONS.md`;
4. `IMPLEMENTATION_ROADMAP.md`;
5. `SITE_EXECUTION_MANIFEST.yaml` для статусов, зависимостей и issue URL;
6. остальные supporting-документы.

Изменение основной аудитории, позиционирования, главной навигации, основного CTA или визуального направления требует отдельного решения, а не скрытого изменения компонента.
