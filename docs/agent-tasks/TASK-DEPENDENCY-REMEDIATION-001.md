# DEPENDENCY-REMEDIATION-001 — устранить high-уязвимости quality toolchain

Issue: https://github.com/spikeal8-maker/alexander-alikin/issues/27  
Branch: `agent/dependency-remediation-001`  
Base: `main`

## Результат

Обновить development toolchain так, чтобы чистый checkout проходил
`npm audit --audit-level=high` без high и critical findings.

## Scope

- ESLint и связанные development dependencies;
- lockfile;
- минимальные совместимые изменения валидаторов;
- полный quality и audit.

## Не входит

- изменение страниц, контента, дизайна или public media;
- ослабление проверок;
- `npm audit fix --force`;
- merge и deploy.

## Acceptance

1. `npm ci` PASS в GitHub Actions.
2. `npm run quality` PASS.
3. `npm audit --audit-level=high` PASS.
4. Нет high/critical vulnerabilities.
5. Generated routes, links, leak, accessibility и file-size gates остаются зелёными.
6. Draft PR содержит точный отчёт.

## Stop rule

После Draft PR и отчёта остановиться. Merge и следующие V4-задачи запрещены до
owner review.
