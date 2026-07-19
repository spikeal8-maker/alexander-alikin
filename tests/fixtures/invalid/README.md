## INVALID FIXTURES DIRECTORY

This directory contains deliberately invalid fixtures used by the content validation tests.
Each fixture targets exactly one validation rule.

### Fixtures:
- `project-bad-evidence.md` - Unknown evidenceLevel "verified"
- `project-doc-verified-no-source.md` - document_verified with empty sourceUrls
- `fact-no-period.json` - Fact without period
- `media-no-rights.json` - Media without rightsHolder/alt
- `now-no-reviewat.md` - Now entry without reviewAt
- `news-bad-status.md` - Unknown publication status "deleted"
- `story-draft-leak.md` - Draft content with unique leak detection marker
