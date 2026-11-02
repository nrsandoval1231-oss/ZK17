# Director’s cut Task 2 — independent review

Reviewed `f72f858` against `task2-brief.md`, the five verified PR findings, `docs/ARRIVAL_DIRECTORS_CUT_BRIEF.md`, the supplied diff, implementation report and current source. This review covers Task 2 and its coordinated integration repairs, not the former header task or a new creative acceptance review.

## SPEC — PASS (Task 2 scope)

All five verified findings are addressed:

1. `components/use-story-motion.ts:83` introduces short-lived Tab intent. Focus consumes the intent; pointer/touch and other keys invalidate it. The deferred correction checks generation, current focused element, disposal and real layout before scrolling. Pointer focus and unrelated programmatic `preventScroll` calls therefore do not inherit centering. Cleanup removes the new listeners, cancels intent/anchor/refresh frames and invalidates pending focus callbacks (`components/use-story-motion.ts:165`).
2. `docs/ARRIVAL_CAMPAIGN_QA.md:25` corrects the historical blanket claim and identifies the old CLS limitation. Current collector metadata distinguishes eight motion, two reduced-motion and two no-JS cases; it does not claim axe execution without JavaScript or static Film Room/Playoffs coverage.
3. `scripts/lib/arrival-evidence.mjs:18` rejects unknown/unsafe selections before output mutation/browser launch. `scripts/capture-arrival-campaign.mjs:138` stages the selected run; `scripts/capture-arrival-campaign.mjs:218` publishes only after success. Full and filtered output trees, including screenshots/videos, are separate. Failed scenarios cannot replace prior canonical evidence; the directory swap also attempts rollback if publication fails.
4. `scripts/lib/arrival-evidence.mjs:6` uses the maximum session total, strict `<1000ms` gap / `<5000ms` duration, and excludes recent-input shifts without advancing the eligible-shift window. Boundary/separation/input unit cases match those semantics.
5. `scripts/measure-arrival-campaign.mjs:23` rejects non-2xx/missing-hero responses. Both viewport observations must succeed before the atomic write at line 39. Failure fixtures include a first-success/second-missing-hero case, protecting prior evidence from partial collection. Preview URL overrides and dark-opening LCP limitations are explicit.

The capture contract samples every seven-beat development/hold interval and each of the three montage photographs individually (18 samples), verifies advancing real scroll offsets and observed layers, captures initial/final/film handoff, and checks full reverse darkness, orientation and height-only resize. It uses production DOM/pin geometry rather than fixture-only timeline controls. Native controls, Tab destination bounds and Playoffs placement are checked in motion cases. Desktop/mobile/WebKit recordings are identified as programmatic seeks/holds. Physical iOS swipe, Safari toolbar and hardware smoothness are expressly unproven, consistent with the bounded task direction.

## QUALITY — PASS

No actionable findings at blocking, major or minor severity in the reviewed change.

The coordinated native-player repair is appropriately narrow: Tab originating inside the direct-landed video keeps anchor alignment while focus remains in native controls (`components/use-story-motion.ts:94`); a real Tab focus destination outside that video releases the anchor before visibility correction (`components/use-story-motion.ts:138`). Pointer/manual-scroll release remains. The existing built regression follows variable native Tab stops until an actual downstream link gains focus, then verifies that resize does not restore the old anchor. Its assertions were not weakened.

The stable screen-reader H1 lies outside animated hidden content, labels the section, and suppresses the duplicate visual heading from the accessibility tree (`components/arrival-hero.tsx:33`). Return-from-recruiting assertions now reflect the deliberate dark opening while final-payoff assertions remain elsewhere. The orientation fixture observes bounded trigger/scrub convergence without forcing animation state; reverse assertions are stronger.

## Evidence and limits

Independent review inspected source, focused tests, the built focused-run log (15 passed / one existing conditional skip), and four worker smoke JSON artifacts. Desktop/WebKit smoke outputs each contain 18 samples, video references, zero recorded runtime/HTTP errors and the declared axe/film checks. No-JS and reduced-motion metadata match the actual code paths. Independent lightweight helper assertions passed for 999/1000ms separation, recent-input exclusion and unsafe/unknown filters.

No browser suite, capture run, build or server mutation was repeated. No product code changed. Parent-owned full browser/capture runs, final regenerated canonical metrics and final visual/owner acceptance remain separate gates; the worker report accurately leaves those pending. This review does not turn the smoke subset into a full-run or physical-device claim.
