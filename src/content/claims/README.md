# Editorial source and claims system

This directory separates strategic recommendations, owner statements, verified evidence, editorial bridges and hypotheses.

## Canonical files

- `SOURCE-REGISTRY.json` — curated source catalogue. Test fixtures are excluded from public use.
- `CLAIMS-REGISTRY.json` — public claims and strategic messages with verification and approval status.
- `MEDIA-EDITORIAL-MAP.json` — one editorial purpose per image, with documentary/visualized separation.
- `DRAFT-PROVENANCE.json` — paragraph-level origin and editorial role for seven page drafts.
- `OWNER-QUESTIONS.md` — only decisions that still require the owner or additional evidence.

## Strategy sources

Safe extracts from the two owner-provided strategy documents are stored in:

- `src/content/sources/strategy-v1-extract.md`
- `src/content/sources/strategy-v2-extract.md`

The original private documents are not committed.

## Roles

- `owner_statement` — Alexander's own identity, project or method statement.
- `strategic_recommendation` — recommended audience, offer or page structure; not evidence of completed client work.
- `market_observation` — a description of a target situation; not a client case.
- `editorial_bridge` — connective prose that introduces no new fact.
- `hypothesis` — cannot be published as fact before evidence or owner decision.

## Publication rules

- `owner_approval` stays `pending` until explicit written approval.
- Unsupported numbers and commercial terms use `publishable: false`.
- A strategy scenario cannot be presented as Alexander's completed case.
- Visualized media illustrates a concept and never proves an event.
- Documentary media requires an accurate year and context.
