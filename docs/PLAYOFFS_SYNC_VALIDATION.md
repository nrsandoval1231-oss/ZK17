# Playoff source sync validation — November 1, 2026 (America/Chicago)

Implemented against main `6fe5f24` on `feat/playoff-source-sync`.

## Verified outcomes

- Locked installation: `npm ci --ignore-scripts --no-audit --no-fund` passed.
- Entire unit/regression suite: `node --import tsx --test tests/*.test.ts` — **45 passed, 0 failed**.
- `npm run typecheck`, `npm run lint` and `git diff --check` passed.
- Release preflight, existing journal validation and Anna asset provenance checks passed.
- Static production build/export passed using `npm run --ignore-scripts build`, after running each prebuild gate explicitly. Routes include `/playoffs`; no UI, Anna artwork or deployment configuration changed.
- Workflow YAML parsed; all five shell steps passed `bash -n`. The authenticated hosted workflow/PR-token settings are not exercised by local validation.
- Live-source dry run and subsequent `npm run playoffs:sync -- --apply` both accepted the UIL entrypoint plus its exact MaxPreps canonical redirect. They found **zero changed observations, zero warnings and no artifact write**. `content/playoffs/verified.json` remains unchanged. The retained apply receipt is `artifacts/playoffs/source-sync-live-check.json` (timestamps are UTC; the local date was November 1).

The environment denies the standalone `tsx` CLI's IPC socket. Tests and prebuild validation used Node's supported `--import tsx` loader, exercising the same TypeScript files without the CLI socket. Existing user commands remain unchanged; the new sync command/workflow use that loader directly.

## Controlled paths

The tests use an independent empty-artifact fixture, so they remain valid once real production observations arrive. A captured factual 2026 placeholder subtree supplies the exact source graph. Isolated copies test explicit partial qualifiers, exact school UUID binding, names/aliases, complete matchups, result markers, timezone-bearing JSON-LD schedules, reversed home/away details, missing detail pages, invalid/previous-season dates, duplicate polling, unknown names, changed seeds, incomplete graphs and wrong winner edges.

A complete synthetic tournament imports 64 fixture teams and all 63 finals, including state semifinals/championship, through the unchanged advancement model. No synthetic facts enter production content. The real CLI is tested with temporary files for dry-run, atomic apply, journal replay, repeated no-op and byte-preserving rollback on conflicting scores. The existing manual retriever is exercised with controlled HTML/PDF network responses, verifying successful hash/byte metadata and changed/unchanged reports.

Independent review found a manual-retrieval metadata regression and calendar-date normalization edge case. Both have failing-then-passing regression tests and are fixed. Review also led to durable per-source bracket/detail evidence hashes, contradictory-kickoff rejection and a reused-branch file allowlist before executing automation code.

## Publication boundary

The implementation must be merged before the scheduled workflow changes become active. The workflow maintains one data-only review PR; merging it follows the existing live deployment path. It never commits to main, invents playoff qualifiers, auto-merges or changes credentials. Actions must be permitted to create PRs; otherwise the job reports the failure and leaves the validated branch available for a manual PR. Venues, unsupported game statuses and genuine conflicting corrections retain the existing reviewed manual fallback.
