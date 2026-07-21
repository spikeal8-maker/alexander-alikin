# Claims Audit

This directory contains an audit of all public claims across the site.

## Structure

- `claims.json` — One entry per factual claim, with source, evidence level, and publishability
- `page-texts.json` — Full text inventory for each of the 7 public pages

## Claims fields

| Field | Description |
|-------|-------------|
| text | The claim text as it appears on the page |
| page | Which page the claim appears on (one of 7 public routes) |
| source | Where the claim originates (Content Collection, component text, etc.) |
| evidence_level | `author_statement`, `public_source`, or `document_verified` |
| publishable | Whether the claim is OK to publish publicly |
| image | Associated image filename, if any |

## Evidence levels

- **author_statement** — Claim made by the site owner, not independently verified
- **public_source** — Backed by a publicly available third-party source
- **document_verified** — Verified by review of original documents or materials

## Page texts

`page-texts.json` provides a complete inventory of all text content per page, organised into:
- `title` — Page title
- `headings` — All heading text (h1, h2, etc.)
- `body` — Descriptive text and content
- `cta` — Call-to-action button and link text
