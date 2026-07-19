# Александр Аликин — персональная цифровая платформа

Публичный репозиторий персонального сайта Александра Аликина: цифровой биографии,
авторского медиа, каталога проектов и профессионального центра доверия.

## Задача

Человек, который нашёл имя «Александр Аликин» в поиске, должен быстро понять:

- кто такой Александр;
- чем он занимается сейчас;
- как связаны инженерия, педагогика, предпринимательство и ИИ;
- какие проекты и результаты можно проверить;
- какие идеи и истории стоит прочитать;
- как предложить сотрудничество.

## Текущее состояние

Стратегия, продуктовый контракт и backlog утверждены. Канонические документы
находятся в `docs/`. Техническая реализация сайта (Astro, content collections,
CI/CD) будет выполнена отдельным Pull Request после принятия стратегического
foundation.

Закрытые заметки, исходные документы и доказательства хранятся в приватном
репозитории `alexander-alikin-vault`.

## Канонические документы

- [Стратегия сайта](docs/CANONICAL_SITE_STRATEGY.md)
- [Модель аудиторий](docs/AUDIENCE_MODEL.md)
- [Спецификации страниц](docs/PAGE_SPECIFICATIONS.md)
- [Blueprint главной](docs/HOMEPAGE_BLUEPRINT.md)
- [Маршруты и CTA](docs/USER_JOURNEYS_AND_CTA.md)
- [Визуальная система](docs/VISUAL_SYSTEM.md)
- [Контент и доказательства](docs/CONTENT_AND_EVIDENCE_PLAN.md)
- [План реализации](docs/IMPLEMENTATION_ROADMAP.md)
- [SEO и эксплуатация](docs/SEO_ANALYTICS_AND_OPERATIONS.md)
- [Полный индекс документации](docs/README.md)

## Управление

- [Архитектура репозиториев](docs/REPOSITORY_ARCHITECTURE.md)
- [Операционная модель](docs/OPERATING_MODEL.md)
- [Управление](docs/GOVERNANCE.md)
- [Правила для coding-агентов](AGENTS.md)
- [Статус реализации](IMPLEMENTATION_STATUS.md)

## Следующий шаг

После owner review и merge foundation PR — Issue #7 `SITE-PLATFORM-001`:
технический каркас Astro, content collections и quality gate.
