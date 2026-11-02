# Controller adjudication after scoped final review

The separate critic accepted both visual corrections in `5798ff8` and found a load-bearing keyboard issue in the initial integration repair `963bbb5`. The controller accepted that finding and repaired it in `d46943f`; this is not represented as an independent clean verdict on the earlier candidate.

Actual rebuilt-production regression: `tests/e2e/cinema-framing.spec.ts` follows real Tab stops through the native video, requires controls/tabIndex readiness at every internal stop, reaches the next NIL link, requires that focused link to fit the viewport and scroll beyond the film anchor, and requires a later resize not to pull the visitor back. All four projects passed (managed desktop/mobile Chromium, managed iPhone WebKit, reduced motion), 9.5s, log `checks/keyboard-verified.log`.

Releasing on Tab alone was insufficient in actual Chromium: browser native focus scrolling was measured before pin layout settled. The final repair additionally releases on external focus and reconciles an actually offscreen focused control after layout with instant scrolling. Video focus is excluded from this external-control correction. Native focus anchor protection is limited to a pending film anchor with the video actually focused; it no longer locks other story anchors. All listeners are removed on cleanup.

The final header repair uses a layout effect with an immediate breakpoint check to cover an open menu resized before an effect subscription, then focuses Home after CSS/pin refresh. The existing focus/inert/scroll assertions remain unchanged. The fixture's responsive bounds assertion now polls actual settled geometry instead of comparing measurements taken on different resize frames.

The controller owns final integrated command results and captures in `docs/ARRIVAL_CAMPAIGN_QA.md`. The critic's original and scoped reports remain preserved, including their failed verdicts and runtime scope. No new failed assertion was skipped, and no generated anatomy, merge, or deployment was introduced.
