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

## Назначение и работа

- [Проект](PROJECT.md)
- [Архитектура](ARCHITECTURE.md)
- [Как работает сайт](SITE_RUNTIME.md)
- [Операционная модель](OPERATING_MODEL.md)
- [Управление](GOVERNANCE.md)
- [Карта репозитория](REPOSITORY_MAP.md)

## Контент и публикация

- [Модель контента](CONTENT_MODEL.md)
- [Редакционная политика](EDITORIAL_POLICY.md)
- [Конвейер публикации](CONTENT_PIPELINE.md)
- [Стандарт качества](CONTENT_QUALITY.md)
- [План накопления материалов](MATERIALS_PLAN.md)
- [Редакционный ритм](CONTENT_CALENDAR.md)

## Контроль и выпуск

- [Границы репозиториев](REPOSITORY_BOUNDARIES.md)
- [Конфиденциальность и безопасность](PRIVACY_AND_SAFETY.md)
- [Реестр рисков](RISK_REGISTER.md)
- [Условия запуска](LAUNCH_GATES.md)
- [Чек-лист выпуска](RELEASE_CHECKLIST.md)
- [Метрики](MEASUREMENT.md)
- [Недостающие входные данные](NEXT_INPUTS.md)
- [Архитектурные и продуктовые решения](DECISIONS/README.md)

## Развитие

- [Дорожная карта foundation-версии](ROADMAP.md)
- [Объём foundation-версии](FOUNDATION_SCOPE.md)
- [Статус реализации](../IMPLEMENTATION_STATUS.md)

## Правило приоритета

При конфликте между ранним общим документом и канонической продуктовой спецификацией приоритет имеют:

1. принятые ADR;
2. `CANONICAL_SITE_STRATEGY.md`;
3. `PAGE_SPECIFICATIONS.md`;
4. `IMPLEMENTATION_ROADMAP.md`;
5. остальные supporting-документы.

Изменение основной аудитории, позиционирования, главной навигации, основного CTA или визуального направления требует отдельного решения, а не скрытого изменения компонента.
