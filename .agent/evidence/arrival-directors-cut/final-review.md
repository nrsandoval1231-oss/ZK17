# Director's Cut — independent whole-branch final review

Reviewed current product HEAD `f72f858`, base `910bfa5`, on 2026-11-02. Authority is `docs/ARRIVAL_DIRECTORS_CUT_BRIEF.md`, including its new seven-beat/touch story; the older campaign composition is not the current acceptance target. Read the packaged whole-branch diff, current implementation, plan/progress, Task 1 reports and round-2 review, Task 2 report/review, current full capture JSON and relevant tests/tools. Independently inspected actual built captures and performed one targeted initial-load browser probe. No product edits, duplicate build/full suite, delegation, push or deployment.

## SPEC — CHANGES REQUIRED

## QUALITY — CHANGES REQUIRED

Three Important findings remain. These are bounded fixes; no rewrite of the seven-beat concept is recommended.

### 1. Important — rear and white montage images still expose hard source rectangles

Location: `components/arrival-hero.module.css`, generic `.photo .photoFrame picture` reset and montage frame rules (approximately lines 40–47).

Current `artifacts/arrival-directors-cut/full/desktop-montage-rear-hold.png` shows hard vertical photo boundaries around x460 and x980, bright field detail above the subject, and no lateral dissolve. The white hold likewise shows a bright rectangular image around x475–965 with large cropped background lettering. `iphone-webkit-montage-rear-hold.png` and `iphone-webkit-montage-white-hold.png` expose hard horizontal top boundaries below the lights. These two shots visibly depart from the softer standing/action presentation and the binding request to conceal awkward photo boundaries using gradients/masks/smoke.

Cause: the generic photo-frame rule removes the picture mask; replacement aspect-correct frame masks and local shading are supplied only for standing/silhouette and action. Rear and white retain full-viewport frames around contained images, so the outer vertical fade cannot feather the actual left/right/top photo edges.

Bounded fix: give rear and white their own aspect-correct image frames and feather all exposed image boundaries with appropriately restrained background shading. Preserve helmet/#17, actual source pixels and one-photo-at-a-time choreography. Do not substitute automated body cutouts or reconstruct anatomy. Inspect both desktop and WebKit mobile midpoint/hold frames, not only action/standing captures. Add focused bounds/mask coverage for these previously omitted layers.

### 2. Important — managed WebKit still loses native-player keyboard readiness

Locations: `components/use-story-motion.ts:94` and `:134–150`, interaction with existing Film Room controls ownership; regression `tests/e2e/cinema-framing.spec.ts:144`.

The controller's frozen-HEAD full browser run actually completed **237 passed, 18 existing conditional skips, 1 failed**. The failing iPhone-WebKit case is “direct film landing lets keyboard focus leave the native player and scroll to its destination.” While the test still observes the native video as active, its `tabIndex` becomes `-1` instead of `0` and stays there through the five-second assertion. The captured failing DOM also lacks the `controls` attribute. Evidence: `/tmp/directors-final-browser.log` around line 293 and `/tmp/directors-final-browser/cinema-framing-direct-film-0118b-d-scroll-to-its-destination-iphone-webkit/trace.zip`.

The short-lived Tab intent/native-player exception improves the prior behavior, but a focused passing run is not enough to dismiss the current full-run failure. Native control readiness is a binding preservation requirement, and the actual regression remains unresolved at this HEAD. The capture collector's one-Tab film check does not exercise the full downstream traversal, so the twelve capture passes do not contradict this failure.

Bounded fix: investigate the recorded WebKit scroll/focus/control transition and stabilize readiness while native shadow controls retain focus, then permit real external Tab focus to leave the film and remain visible. Preserve pointer/programmatic `preventScroll` behavior and manual-scroll release. Keep the current strong assertions; validate the actual WebKit regression repeatedly in addition to the final integrated suite. Do not solve this by skipping the test, always enabling controls over the opening aperture, or forcing all focus changes to recenter.

### 3. Important — enabled-JS loading can reveal the final portrait/title before the black opening

Locations: static defaults in `components/arrival-hero.module.css` (`.athlete{opacity:.8}`, visible `.copy`) and delayed enhancement in `components/use-arrival-hero-motion.ts` (`useLayoutEffect` initialization).

Independent browser reproduction against the current built server: Chromium 1440×900, normal motion preference, intercept JavaScript requests and delay each by 1800ms, navigate with `waitUntil:'commit'`, inspect after 1000ms. The statement is visible at opacity 1, athlete opacity .8, and hero not yet pinned. After the scripts hydrate, statement opacity becomes 0 and the hero pins. Screenshot: `artifacts/arrival-directors-cut/reviewer-slow-script-initial.png`.

This is not the intentionally static no-JS or reduced-motion fallback. JavaScript is enabled, but first paint exposes the final composition, then abruptly removes it. It spoils the new brief's “start completely black,” “no athlete/logo/early title” opening on slower loading connections. The standard captures begin after load/hydration and therefore do not detect it.

Bounded fix: establish the enhanced initial darkness before the first visible paint when JavaScript is available and normal motion is selected, while explicitly preserving the complete readable reduced-motion and no-JS fallback. Keep the header and accessible heading available. Avoid a permanent blank fallback if enhancement cannot complete. Add a delayed-script initial-paint regression and verify ordinary initial/reverse/reduced/no-JS frames after the change.

## Verified strengths and preserved constraints

- The current timeline implements seven ordered phases, approximately fifteen stable viewport heights, with separate action/rear/white montage intervals. It is scroll-directed on touch as well as desktop, with no hover/fine-pointer gate. Final pullback/hold and reversal are present. The cinematic sword is removed; header branding is preserved.
- Independently inspected built desktop lights, smoke, standing reveal, all montage holds, final statement, desktop no-JS frame, mobile reduced frame, and WebKit final/rear/white frames. Lights occupy the width without strobing; smoke planes cover the viewport and continue drifting in source choreography; standing/action photo fades avoid fabricated cutout anatomy; the final headline is legible. The two untreated montage frames are the visual exception noted above.
- Current `full/validation.json` is marked complete and contains all twelve named cases. Eight motion cases each have eighteen actual scroll samples, reverse, orientation, height-change, film and Playoffs evidence; their errors arrays are empty and final-home axe records zero violations. Two reduced cases declare axe/static coverage; two no-JS cases correctly declare axe not performed and no film/Playoffs coverage. These are emulated/programmatic interactions, not physical swipes.
- The persistent accessible H1 is outside hidden animated copy and the visual duplicate is aria-hidden. Header destinations and real film opener remain. The five prior review repairs are substantively present: Tab-specific intent and pointer invalidation; accurate per-case capture claims; isolated staged filtered/full output publication; maximum CLS session-window scoring with correct strict time boundaries; and metric main-response/hero validation with atomic write after both viewports. No new issue found in the four evidence-tooling repairs; native-video integration still has the separate failure above.
- `arrival-experience.tsx` changes from base remove only the prior hero implementation/motion and mount the new hero; the approved film timeline/framing/source/player is otherwise preserved. Independently recomputed MP4 SHA256 is `a783dcb56f3a11684a3253ddc8c0768035bb8c9d390e0061a29935c20af8965f`; canonical sword asset is `8db76a9993ca32755d1e87a083b2371aa91ef5bd203765b694bae9e881b73593`, both matching the recorded baseline.
- New photo derivatives are crop/resize/WebP encodings of recorded sources, with source hash/crop/output/rights metadata. The procedural smoke is not a likeness asset. Both protected photo directories are enumerated by the guard, all new photos remain preview-only, and the physical release audit is retained. Public-mode prop gating is preserved. Preview authorization does not confer production-media clearance.

## Remaining limits and completion gates

The action source is an authenticated ball-carrying/walking pose, not a verified running original. Standing lower-leg source overlays and residual dim background people are disclosed source limitations. The reviewed changes do not fabricate identity/anatomy. Keep those limitations in owner-facing QA; a cleaner original is the route to stronger fidelity.

Managed touch-enabled WebKit proves actual scroll-offset and layer progression, not physical iOS swipes, Safari dynamic toolbar behavior, GPU/thermal smoothness, or an address-bar hardware guarantee. Headless fixture convergence up to fifteen seconds establishes eventual correctness, not smoothness. Performance collection for the current frozen product was pending; this review makes no current performance-target claim.

Unit/lint/type/build passes are controller-reported. Final browser status is the actual failing result above, not green. Fix the three bounded findings, refresh affected visual/initial-load evidence, run the preserved keyboard regression and appropriate integrated checks, and obtain a scoped final re-review. Keep PR #9 in preview/review; no merge or production release is authorized by this report.
