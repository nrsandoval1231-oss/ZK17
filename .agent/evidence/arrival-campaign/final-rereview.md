# Scoped final re-review

Reviewed 2026-11-02: visual correction `5798ff8`, integration correction `963bbb5`, supplied `final-fix.diff` and `anchor-integration-fix.diff`, current source/progress ledger, refreshed production screenshots, and targeted read-only Chromium interaction against server 3100. No product edits, build, full suite, push, merge, or deployment by reviewer.

## Verdict

**Visual findings: PASS / resolved.**

**Anchor integration at built commit 963bbb5: CHANGES REQUIRED.** One new Important keyboard regression was independently reproduced. The controller accepted it and is adding a bounded Tab-release repair and regression coverage. That follow-up requires rebuilt runtime verification; the current screenshots and browser observations must not be represented as evidence for an unbuilt edit.

## Original visual findings

1. Stadium/opening beat: resolved. The stadium begins at opacity zero in the enhanced timeline and reveals to .14 during the world-opening beat. Static CSS is also .14 with brightness .4. Refreshed `desktop-initial.png` shows a dark rear-silhouette opening without the competing referee/game scene. Refreshed `desktop-final.png` and `mobile-final.png` keep the stadium subordinate to the central athlete and typography. Reverse/reduced-motion reversion is covered by focused tests, and the conditional target guards preserve a missing-photo fallback.
2. Statement hierarchy/placement: resolved within the bounded review request. Desktop REMEMBER. now has 1.25× type scale; copy and editorial footer are raised. The refreshed 1536×1024 screenshot clearly gives the second line greater emphasis and brings the identity/statement/footer closer to the documented reference proportions. The footer is around y885 rather than the previous y980. Mobile retains its intentionally separate fitting layout. The supplied patch does not change source masks, media assets, header, or film implementation.

The result is not an exact reproduction of the canonical mockup. The clean-original limitation and actual sword-logo geometry remain explicitly documented; no request to fabricate missing anatomy is implied. As in the original review, direct canonical-file pixel comparison is unavailable in this reviewer context.

## Integration finding: Important — direct-anchor reconciliation overrides keyboard focus scrolling

Locations: `components/use-story-motion.ts`, new window `scroll` listener and `onScrollKey` release list at built `963bbb5`.

Reproduction against a fresh page (not a same-URL navigation reusing released-anchor state):

1. Open `/#film-room` at 1024×180 in Chromium and wait for the direct landing.
2. Focus the native video. After 1000ms it remains at scrollY 513 with controls=true, tabIndex=0, and focus on the VIDEO. Thus the original native-focus correction works.
3. Press Tab through the native controls. The next page control is WATCH WITH SOUND, still visible.
4. Press Tab again to NIL & BUSINESS INQUIRIES. After 700ms, that link is focused at viewport y1995.42 while scrollY is forcibly restored to 513.
5. Subsequent Tabs focus SEE HIM ON FIELD at y2607.84, EXPLORE PERSONAL at y2807.80, and Games at y3242.80, while scrollY remains 513.

Cause: Tab/Shift+Tab are deliberate keyboard navigation but were absent from the pending-anchor release conditions. The newly added scroll listener therefore reverses the browser's focus-scroll on every later control. This is an accessibility regression: focus advances into invisible content while the viewport remains locked to the film. The previous refresh-only behavior did not constantly override that focus-scroll.

Required bounded correction: release pending-anchor ownership for deliberate keyboard navigation or when keyboard focus leaves the target section, while preserving native-video focus stabilization and manual wheel/touch/pointer release. Add an actual sequential-keyboard regression, not only `locator.focus()`: tab through native controls and the film action into subsequent content, assert the focused control is in the viewport, and assert a subsequent resize does not snap back. Keep controls usable during internal video tab stops as well.

Controller response: accepted, adding Tab to release keys and a regression that follows real Tab navigation to the later inquiry link. This is a proportionate local correction; it does not require another visual redesign or a new film timeline. The cost if it regresses is native-control focus scrolling again, so verify native controls stay ready at intermediate video tab stops as well as the eventual external focused link. Built-runtime confirmation of this follow-up was pending when this report was written.

## Other integration assessment

- Explicit resize refresh resolves the prior gap where reduced-motion/direct-anchor landings lacked a ScrollTrigger-driven resize refresh. The new resize/scroll listeners are cleaned up with the existing effect lifecycle.
- The changed section-order assertion now checks actual document section order through a GSAP pin wrapper. It preserves the original requirement that Film Room is the second scene.
- The pending-film reopen test now uses the persistent header film action; this is appropriate after introducing a scroll-revealed hero action.
- Delaying the short-video focus assertion makes the original test stronger by observing browser-native deferred scroll behavior.
- An independent actual pointer click on the native player at 1024×180 remained scrollY513, controls=true, tabIndex=0 and focused after 600ms. The hypothesized pointer-release failure was not reproduced and is not a finding.
- Full integrated validation is controller-owned and was still running. This scoped review does not claim all suites are green.
