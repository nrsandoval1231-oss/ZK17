# Scoped independent re-review

Scope: `b3b279f..86bd031`, addressing the three findings in `review.md`. Reviewed the product/test diff, appended report, final validation log summaries, and both new client-entry opening screenshots. No product edits, commits, pushes, deployments, or suite reruns were performed.

**Specification verdict: approved for the reviewed implementation scope.** All three original findings are addressed. Previously documented publication/media-rights and physical-device limitations remain; this is not deployment authorization.

**Implementation-quality verdict: approved.** No new actionable breakage identified in the correction diff.

| Original finding | Verdict | Evidence |
| --- | --- | --- |
| P1: client navigation leaves the intro header visible | Addressed | `use-arrival-hero-motion.ts` now owns pending/ready/completion state on each activation and cleans it up on deactivation/unmount. Completion is synchronized after setup and on refresh, preserving direct Film hash navigation. New browser tests exercise Film and About client entry, header descendants through mid-intro, skip/focus, repeated reduced-motion toggles, and direct hash refresh. Desktop and iPhone client-entry screenshots both show black opening with only Skip intro. |
| P2: About bypasses preview-media approval mode | Addressed | `app/about/page.tsx` selects eligible approved scene photographs first, deduplicates asset IDs, uses preview fallback only when enabled, and omits an empty gallery. Render-output tests cover preview on/off, approved replacements in both modes, and duplicate assignments. |
| P2: original-pending fallback labels remain public | Addressed | `two-worlds.tsx` omits unavailable cards and the fully empty module. Both visible and accessible placeholder markup are removed. Actual render-output tests cover missing and partial media; the general text check now matches original-pending wording case-insensitively. |

Final retained logs confirm **62 unit passes, 169 browser passes, 7 existing skips**, with lint/typecheck/build passing as reported. The report distinguishes the initial diagnostic failures from final validation. Increasing the multi-step collage test's total timeout preserves its assertions; reducing matrix workers does not remove browser projects or checks. The direct-hash issue discovered during validation received both a state synchronization fix and a dedicated regression.

The correction scope does not alter approved film bytes/duration, collage composition, contacts, playoff data/workflows, or deployment configuration. No further changes requested by this scoped review.
