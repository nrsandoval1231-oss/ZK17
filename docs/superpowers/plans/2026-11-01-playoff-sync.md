# Source-backed playoff sync

Goal: Populate the existing 2026 bracket from UIL-linked published evidence without inventing qualifiers, results or kickoff times.

Architecture: A server-side HTML adapter checks the exact UIL competition link, bracket size, every seed and every feeder edge. It emits the existing Observation schema and uses applyObservation/validateTournament through a shared artifact transaction. Unknown/ambiguous layouts or conflicts abort the entire batch. The static app and deployment stay unchanged.

Constraints: no UI/branding changes; retain the manual apply command; immutable source attribution; no fixture facts in production; inexpensive seasonal polling; data-only PRs rather than direct writes to main.

Approaches considered: scraping generic page text loses identity/graph context; a new live backend adds hosting and duplicate state. Chosen: extend existing retrieval/update tooling with a strict DOM adapter and reusable batch transaction.

- [x] Test exact placeholder snapshot, named qualifiers, partial pair, results/advancement, duplicates, changed/conflicting evidence, wrong season/division, missing nodes, broken edges, ambiguous school identity, absent timezone and transaction rollback.
- [x] Implement shared artifact replay/batch validation and atomic persistence; retain manual apply/validate commands.
- [x] Implement guarded HTML normalization and bounded allowlisted retrieval with immutable hashes and run reports.
- [x] Upgrade existing seasonal workflow to maintain one data-only PR, with no deployment changes. Document local/external scheduling and correction fallback.
- [x] Run complete tests, typecheck, lint, production build, real-source dry run and fixture CLI transaction. Review diff and open implementation PR.
