# Grounded editorial package

This directory separates strategy, source evidence, editorial drafts, and public claims.

## Canonical files

- `SOURCE-REGISTRY.json` — curated source catalogue with public-use restrictions
- `CLAIMS-REGISTRY.json` — claims, verification status, limitations, and approval state
- `MEDIA-EDITORIAL-MAP.json` — page-specific image assignments and prohibited interpretations
- `DRAFT-PROVENANCE.json` — source role and approval status for each editorial block
- `OWNER-QUESTIONS.md` — unresolved facts and decisions requiring owner input

## Strategy sources

Safe extracts from the two owner-provided strategy documents are stored in:

- `src/content/sources/strategy-v1-extract.md`
- `src/content/sources/strategy-v2-extract.md`

The original private documents are not committed.

## Public integration status

The safe, non-quantitative part of the grounded drafts is integrated into the V2 Astro pages in Draft PR #23:

- `/`
- `/business/`
- `/education/`
- `/about/`
- `/projects/`
- `/projects/[slug]/`
- `/collaboration/`

Blocked numerical, biographical, competition, adoption, and commercial-timeline claims remain excluded.

## Content roles

- `owner_statement` — Alexander's own identity, project or method statement
- `strategic_recommendation` — recommended audience, offer or page structure; not a completed client case
- `market_observation` — a target situation; not evidence of personal work
- `editorial_bridge` — connective prose that introduces no new fact
- `hypothesis` — cannot be published as fact before evidence or owner decision

## Superseded files

- `claims.json`
- `page-texts.json`

They remain only as historical snapshots and are not canonical sources.

## Approval rule

`owner_approval: pending` remains the default until the owner explicitly approves the wording or image. Technical CI success does not constitute editorial or visual approval.
