# Director's Cut — scoped final re-review

Reviewed product HEAD `a4d4ae15c4091daf7f62590ea7d1280594a8871e` against `f72f858`, the three Important findings in `final-review.md`, `final-fix.diff`, `final-fix-report.md`, current source, actual built montage captures and focused verification logs.

## SPEC — PASS (scoped fixes)

## QUALITY — PASS (scoped fixes)

All three original findings are addressed. No new actionable blocking or Important defect found in the repair diff. This is a scoped code/visual/evidence verdict, not a claim that the controller's still-running full suite, refreshed canonical capture set, metrics or owner review have completed.

### 1. Rear/white photo rectangles — addressed

Independently viewed all eight actual built images in `/tmp/directors-final-wave-visual/`: desktop and managed WebKit, rear and white portraits, midpoint and hold. Both photographs now dissolve at their actual left/right/top/bottom boundaries; the prominent hard panels identified in the original review are concealed. Helmet and #17 remain visible. The white background lettering is subdued and the rear field remains recognizable context rather than a hard rectangular insert.

The CSS uses source-aspect frames, intersected horizontal/vertical fades and local edge shading. No photo bytes, body shape or anatomy are modified; standing/action treatments and timeline order are unchanged. Frame-aspect/bounds/mask/shading assertions cover the formerly omitted layers. Residual original field/background detail remains appropriate to the approved source-preserving approach.

### 2. Native WebKit keyboard readiness — addressed

The repair adds a narrowly acquired native keyboard token while an already-ready player is focused, then lets Film Room's existing control owner honor it during WebKit's delayed focus-scroll interval. It prevents controls from disappearing during the transient BODY/shadow-focus state that defeated the prior active-element-only alignment. It does not activate controls before the opening aperture has completed.

The token is released on actual external HTMLElement focus, including document-level header/skip controls; this listener only releases state and does not recenter. Pointer/touch, wheel, page-scroll keys, anchor changes and effect cleanup also release it. Tab-only story visibility correction remains separately guarded by short-lived intent and focused-target checks. Cleanup removes the added document listener and clears the attribute/alignment frame. Native key handling can reacquire readiness without relying on a pending hash, while deliberate manual reverse scrolling remains able to disable the player.

Read actual logs: `/tmp/directors-final-native-repeat.log` reports **8/8** passes of the unchanged strong managed-WebKit Tab traversal test with two workers, concurrent with the covering run. `/tmp/directors-final-loading-controls.log` reports **16/16** passes in Chromium/WebKit covering loading/fallback, seek/volume/play keys, external skip-link `preventScroll` focus, readiness reacquisition, manual release, pointer/programmatic focus and real Tab visibility. The prior failing assertion was retained rather than removed. Source review and these repeated observations adequately address the scoped failure; they do not establish physical-device performance.

### 3. Pre-hydration final-frame flash — addressed

The homepage-only inline head bootstrap selects pending enhancement before body paint for normal-motion JavaScript-enabled loads. Scoped CSS hides cinematic layers/copy/details while retaining header and the stable accessible H1. The hook reports ready only after it has installed its dark initial state and timeline.

No-JS never executes the bootstrap, and reduced motion bypasses it. A five-second watchdog releases failed/blocked enhancement into the readable static frame. Late hydration detects that fallback and does not hide it again. Initialization exceptions revert partial GSAP state and select the same fallback. The fix therefore avoids both the early title spoiler and a permanent blank document.

The corrected loading regression takes an immediate 1000ms snapshot while JavaScript responses are delayed 1800ms; it cannot pass by retrying until hydration. Built Chromium/WebKit logs confirm that test, blocked-JavaScript finite fallback and no-JS/reduced static cases pass. The deliberate failed-enhancement source fixture verifies style reversion without a pin/page error. Test structure preserves accessible heading/header assertions and normal subsequent enhancement.

## Scope and remaining gates

No product edits, additional browser suite/build, broad review, delegation, push, merge or deployment were performed by this reviewer. The eight screenshots were independently visually inspected; focused test results were verified from their real logs, not rerun. Full browser validation at `/tmp/directors-release-browser.log` was still in progress when this review was recorded. The controller must use its eventual actual result and regenerate the canonical twelve-case capture set and final metrics for this product revision before publishing completion claims.

Original photo/UI-occlusion and verified-carrying-versus-running limitations, preview-only rights/release guard, and unverified physical iOS swipe/toolbar/thermal behavior remain unchanged. This scoped PASS approves the three repairs for continued review; it does not authorize production release or replace owner cinematic approval.
