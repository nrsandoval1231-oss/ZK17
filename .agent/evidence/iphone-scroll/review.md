## Deployed candidate clarification and reversal verification

Deployed product:35379f0e4c787aa6be27de8541a43ea1c8af16c5 at https://78c08eb7.zk17-review.pages.dev. Independently confirmed current app/components/lib/content/public/package worktree diff against this commit is empty, and hero hook SHA256 remainsBC61A62987D142AC71394FEEE0F67884F24719EB2A6308971963B13B87DB8D36. No product change was needed for the following verification-script failure.

The first live script falsely reported a missing cold logo after reversal. Its rotation check examined only scrollY/travel≈0.5, which also held before the new geometry applied. Independent exact-script instrumentation showed: landscape viewport844 still had old heroheight844/travel1350/y675; immediate return to portrait also passed; reversal initially reachedy0/logo0.9, then an outstanding180ms rotation timer restoredy675/logo0. This was a scripted programmatic-scroll race, not evidence that timeline invalidation lost its start state. Native touch/wheel/keyboard input already cancels pending rotation restoration.

The corrected script waits for landscape travel624/height390 and portrait travel1350/height844 before checking normalized position and reversal. Independent remote checks against the unchanged deployed product passed desktop original sequence5/5 and WebKit geometry-aware rotation/reversal3/3; each finishedy0/logo0.9/all six inspected athlete-photo layersopacity0, including a further400ms check. latest live-dev.json independently read: desktop/WebKit early scroll and forward/reverse pass, WebKit rotation pass, no pageerrors, no overflow, noindex present.

Verdict remains READY FOR DEV PHYSICAL-PHONE RETEST. These checks verify the exact development candidate; physical-iPhone smoothness and production acceptance remain unverified. A test-only regression addition may follow without changing this product verdict.

---
# Final scoped verdict: READY FOR DEV PHONE RETEST

No unresolved material findings on the frozen local source reviewed below. This accepts a development preview for owner physical-iPhone evaluation; it does not establish that the reported physical-device jitter is resolved and does not approve production deployment.

Candidate base:2b788fcf6e70a3706b47fd325e014da9aea25fc1, branch fix/iphone-cinematic-scroll. Product/test SHA256 values independently read after final checks:

- components/use-arrival-hero-motion.ts:BC61A62987D142AC71394FEEE0F67884F24719EB2A6308971963B13B87DB8D36
- components/use-story-motion.ts:BF73E1C4D68B31E4858825246D2F4E2F5744631273C018E0622CEDC3777A635A
- components/arrival-hero.module.css:3ADB703780BC14511345064E835C560696409BCEF94B11E2E59D7864823959C3
- tests/e2e/arrival-directors-cut.spec.ts:8B2FE96FA6E89E830E54FE0ABFAF4F9460A6F516B8037992CC7E5C3A38B9A4A5

## Final verification

Independent rerun:12/12 passed, repeating rotation/reduced-motion, toolbar geometry, and immediate-first-scroll tests twice in Chromium and WebKit. Output directory:C:/Users/nrsan/AppData/Local/Temp/zk17-iphone-independent-final. This ran against the final rebuilt localhost3100 export with targeted initial refresh and width guard.

Independent six fresh WebKit sessions: each had1350.001px pin travel immediately when ready, retained scrollY600 after immediate scroll and initial settling, and registered zero window.scrollTo calls after dispatching load on all10 hero images. Travel remained1350.001px. Earlier equivalent image-load check passed in Chromium too.

Parent integrated e2e-verified.log was independently read:67 passed/1 failed. Its sole failure was ENOENT while closing the browser context and saving trace artifacts, not a product assertion. The failed desktop cinematic case was rerun in an isolated output directory: e2e-artifact-recheck.log records1 passed. The initial failure is retained and not represented as a clean68-test run.

Final lint/typecheck logs are clean and dated after final hook edits; unit log records62 passed. git diff --check passed. Protected content/lib/public/package paths have no changes. The final diff preserves imagery, authored effect styling, timeline beats, desktop2.4/mobile1.6 travel multipliers, native scrolling, reduced-motion fallback, and existing anchor ownership.

## Findings resolved

- P2: height-only viewport changes recomputed mobile travel and visibly moved scrub progress at unchanged scrollY. Stable measured mobile scene geometry and width-gated refits address this reproduced failure.
- P2: image load/decode could globally refresh pins and explicitly restore scroll during a swipe. Removed because hero geometry is reserved; actual story layout/Font observers remain.
- P2: rotation snapshot relied exclusively on potentially stale lastProgress. It now captures current progress against the old trigger geometry, with lastProgress as fallback, and measures fresh100svh independently of GSAP inline pin dimensions.
- P2: readiness could precede the first nonzero pin spacer; instrumentation caught scrollTo675 while padding was0, followed by an unintended jump past the intro before rotation. Targeted timeline.scrollTrigger.refresh() now commits hero pin geometry after tween construction and before readiness. The immediate-first-scroll regression checks this directly.
- Width gating prevents same-width orientation events from remeasuring the frozen height. Direct standalone toolbar instrumentation did not itself reproduce a spurious orientation event; the guard enforces the intended invariant without claiming that hypothesis was proved.

## Remaining uncertainty

Physical iPhone validation is UNKNOWN. Native asynchronous scroll/compositor scheduling, toolbar behavior, and GPU blend/mask cost can still differ from software WebKit. Timing isolation showed only48/46/48ms p95 variation and does not support a60fps claim. No artwork/effect simplification or scroll normalization was introduced. Owner phone retest on the exact development deployment is still required before calling the physical symptom resolved. Production remains outside this verdict.

---

# Historical review and failed-candidate evidence
# Independent iPhone scroll repair review

Status: IN PROGRESS. Candidate based on2b788fcf6e70a3706b47fd325e014da9aea25fc1; source still undergoing scoped race correction.

## Root cause and scope

The before toolbar receipt shows unchanged scrollY600 with height664→754 changing travel1062→1206 and athleteopacity0.90→0.45. The prior end expression used mutable innerHeight. Explicit global story resize refresh bypassed GSAP's built-in touch-only small-height-change filter. Hero image load/decode handlers also refreshed all pins and explicitly restored scroll even though hero images have absolute/reserved geometry. Removing those hooks is justified; story font/ResizeObserver refreshes still cover real layout changes.

New mobile scene height is measured from a separate100svh probe, avoiding ScrollTrigger's inline pin height during rotation. End distance uses the scene height; geometry is remeasured on width changes and released under reduced motion. No imagery/effects or native touch ownership change. Effect-isolation timings48/46/48ms do not establish compositor improvement or physical-device smoothness.

## Independent evidence so far

- Source reviewed: hero CSS/hook, story hook, and toolbar regression test.
- Independent WebKit run of13 relevant tests:12 passed, rotation failed with newtravel624 while scrollY675 stayed fixed (normalized1.08173 instead of0.5). This is retained as a failed candidate receipt, not a pass. Trace: C:/Users/nrsan/AppData/Local/Temp/zk17-iphone-independent/arrival-directors-cut-rota-2bac8-ced-motion-releases-the-pin-iphone-webkit/trace.zip.
- Independent repeated image-load dispatch on all10 hero images at y600: WebKit and Chromium both record zero window.scrollTo calls and unchanged y600/heroHeight664.
- Builder's current-progress snapshot correction is under review. Repeated instrumentation of latest built chunk27c8bf85345ba23d produced9 correct rotations followed by an invalid initial test state: data-motion-ready was present but spacerpadding0 at requestedscroll675; shared initial pin refresh moved page to2025 then1810 before rotation. Rotation then correctly treated the page as outside the intro.
- Recommendations sent: wait for fonts and settled nonzero pin geometry; verify actual requested normalized scroll before rotation; sample every toolbar step (height, top, travel, scrollY, opacity), with animation settlement rather than a fixed short sleep. Do not weaken equality/tolerance assertions or assume physical-iPhone smoothness.

Pending: final candidate freeze, independent rerun, parent integrated deterministic checks, scoped final verdict. Physical iPhone smoothness and hardware frame rate remain UNKNOWN; DEV preview is for owner phone retest, not production acceptance.
