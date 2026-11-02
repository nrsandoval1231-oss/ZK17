# Director’s cut — Task 2 report

Worker: Codex implementer. Task 1 base: `8ee0633`. Read `task2-brief.md`, `review-findings.md`, `docs/ARRIVAL_DIRECTORS_CUT_BRIEF.md`, Task 1 report and current source. Read live PR 9 unresolved threads through a read-only GraphQL query; saved the response at `/tmp/zk17-directors-live-threads.json`. All five findings still applied. No agents spawned, push, merge, deployment or shared-server changes performed. The controller performed both integration builds and owns the full-suite/capture/metrics gates and independent review.

## Five verified fixes

1. **Tab-only focus correction.** `use-story-motion.ts` tracks one short-lived Tab intent, consumes it on focus and clears it on pointer/touch/other keys. The next-frame correction also checks its generation and actual focused target. Pointer focus on a partly visible button and programmatic `focus({preventScroll:true})` no longer invoke centering; actual Tab focus stays visible. Existing anchor, native-player framing, resize and cleanup behavior remains.
2. **Accurate coverage claims.** `ARRIVAL_CAMPAIGN_QA.md` is explicitly historical. Its old twelve-case blanket claim is corrected: only the eight motion cases ran axe and monitored runtime/HTTP errors; four static cases checked bounds/pin state only. The new collector records exact per-case checks, including no axe execution in no-JS cases and no static-case Film Room/Playoffs claim. Historical CLS numbers are labeled as collected by the superseded sum-based implementation.
3. **Capture isolation.** New evidence goes under `artifacts/arrival-directors-cut`; the old campaign artifacts remain untouched. Full runs publish `full/validation.json` plus images/videos only after every case succeeds. Filtered runs publish only under `filtered/<case>/`. A staged directory is swapped into place after success, preserving previous published output on failure. Unknown/unsafe case names fail before browser launch or output mutation. Successful filtered-run isolation was checked against preexisting canonical JSON and image sentinels, byte for byte.
4. **CLS session windows.** The shared accumulator returns the largest session-window total, excludes `hadRecentInput`, and starts a new window at a gap of **at least 1,000ms** or duration of **at least 5,000ms**. Verified strict `<1000` and `<5000` semantics against Google’s current official implementation: https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/LayoutShiftManager.ts . Units cover separated windows, 999/1000ms boundaries, 4999/5000ms duration and recent-input exclusion.
5. **Metric validity and safe output.** Metric collection requires a 2xx main-document response and exactly one `#arrival[data-arrival-hero]` with `#hero-title`, then writes JSON atomically only after both viewports finish. Real browser/HTTP fixtures reject 404, 500, missing hero and a desktop-success/mobile-missing-hero run, preserving prior output each time. A valid fixture verifies both successful observations are written. Actual preview URLs can be supplied through `ARRIVAL_METRICS_URL` (or `ARRIVAL_CAPTURE_URL`).

## Director’s-cut capture contract

The twelve cases are desktop 1440×900, laptop 1536×1024, tablet 768×1024, mobile 390×844, Android 412×915, small 320×568, landscape 844×390, touch-enabled managed WebKit 390×844, and desktop/mobile no-JS and reduced-motion cases.

Each of the eight motion cases captures initial darkness; development and hold samples for darkness, lights, smoke, silhouette, standing portrait, each of the three individual montage photographs, and the final statement (18 named samples); final composition; complete reverse darkness; orientation; a height-only viewport change; scrolling handoff into the existing Film Room; its final native frame; and Playoffs. Reverse assertions cover lights, both smoke planes, silhouette, all four photo layers, statement and details. Each sample advances the actual scroll offset and observes settled DOM layers. Production uses pin-spacer geometry and data attributes; it does not depend on `window.fixtureScrollTrigger` or force GSAP timeline progress.

Width/orientation checks wait for the new pin distance before checking normalized progress and wait beyond the queued restore before rechecking it. Height-only viewport changes record before/after geometry/progress honestly, without imposing or claiming the width/orientation preservation guarantee. No physical iOS toolbar behavior is proven.

Desktop/mobile/WebKit motion cases record browser videos; each JSON entry maps its recording filename. These videos show automated seeks/holds, not authored playback timing, physical swipes or device recordings. Touch WebKit verifies actual changed scroll position and changed layers through programmatic `window.scrollTo` in a touch-enabled context. Playwright’s inability to inject a real iOS swipe is disclosed.

Motion cases run axe on the final homepage, monitor runtime/HTTP errors across their visits, verify native video controls/Tab visibility and Playoffs placement. Reduced-motion cases run axe and error/HTTP monitoring on the static homepage. No-JS cases check static geometry and HTTP responses with runtime-event listeners present, but no application script execution; axe is explicitly marked not performed. The JSON identifies the scope of every check.

## Integrated failures investigated and repaired

The controller’s first full run recorded 229 passes, 18 preexisting conditional skips and five failures. With explicit controller authorization, this task also made these bounded repairs:

- The black opening hid the only accessible H1. A new built-page heading/axe regression reproduced that failure. The hero now has an always-accessible `sr-only` H1 outside animated content; the visual `#hero-title` retains its tag/id/styles and becomes `aria-hidden`, and the section label points to the stable heading. No photo, visual treatment, timeline or film implementation changed.
- Two return-from-recruiting assertions expected the intentionally hidden visual title immediately. They now assert the actual home URL, live hero and visible home/header control. Existing final-statement tests/captures continue to verify the visual payoff.
- The orientation fixture’s five-second opacity assertion could run before WebKit’s scrub converged. It now uses the existing bounded observation of both trigger and animation progress (15 seconds), without forcing either. Reverse fixture assertions were strengthened to all layers and statement.
- Native-player instrumentation confirmed a real focus bug: at the settled direct film landing, managed mobile WebKit was at scrollY 3213, controls true and tabIndex 0. Tab inside native shadow controls scrolled back 18px to 3195. Releasing the direct-film anchor on that key let the aperture scrub reverse, removed controls/tabIndex and lost video focus. The hook now retains direct-film alignment for Tab originating in the native player; actual Tab focus to another control releases it, as do pointer/manual scrolling. The original native-player assertions were not weakened. Read-only diagnostic scripts/logs are `/tmp/directors-native-focus-{debug,settled}.mjs` and corresponding `.log` files.

## Actual verification

- Before focus fix: `npx playwright test tests/e2e/story-focus.spec.ts --project=desktop-chromium --workers=1 --output=/tmp/directors-focus-red`: **2 failed as expected, 1 passed**. Both unwanted-focus cases moved scrollY 529→909; real Tab visibility already passed.
- Initial source fixture after fix: managed Chromium and WebKit focused command with host-library environment passed **6/6** (`/tmp/directors-focus-green`).
- Final source fixtures: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu npx playwright test tests/e2e/story-focus.spec.ts tests/e2e/arrival-directors-cut.spec.ts --grep 'pointer focus|programmatic preventScroll|real Tab|touch orientation refresh|seven scroll beats' --project=desktop-chromium --project=iphone-webkit --workers=1 --output=/tmp/directors-task2-source-final`: **12/12 passed**, including complete reversal and orientation/convergence.
- Before accessible-heading repair: `npx playwright test tests/e2e/arrival-a11y.spec.ts --project=desktop-chromium --workers=1 --output=/tmp/directors-a11y-red`: **1 expected failure**, no accessible level-1 heading during the dark opening.
- After the controller’s second build: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu npx playwright test tests/e2e/arrival-a11y.spec.ts tests/e2e/completion.spec.ts tests/e2e/cinema-framing.spec.ts tests/e2e/arrival-directors-cut.spec.ts --grep 'dark opening retains|snapshot is reachable|direct film landing lets|touch orientation refresh' --workers=2 --output=/tmp/directors-task2-built-final`: **15 passed, 1 existing conditional WebKit clipboard skip, zero failures**. Log: `/tmp/directors-task2-built-final.log`.
- `npx tsx --test tests/arrival-evidence.test.ts`: **5/5 passed**, including real HTTP/browser failure preservation and a valid success. Earlier development failures exposed a serialized arrow-function helper introduced by the TS test loader (changed to a method), and a missing mobile viewport meta tag in the fixture (corrected); neither failure was suppressed.
- Scoped ESLint on both changed components, both scripts, the shared helper, unit test and all five affected/new browser specs passed. `npm run typecheck` passed after the final product/test edits. An intermediate duplicate local declaration introduced while editing the collector was caught by TypeScript and corrected before the final clean run.
- `git diff --check` on owned files passed.

### Tool smoke runs and invocation

Executed a filtered desktop capture with managed Chromium and a filtered touch-enabled WebKit capture using the environment below; each passed **18 beat samples** plus reverse/orientation/height-resize, film/native focus, Playoffs, axe and runtime/HTTP checks. JSON/images/videos are under `/tmp/directors-capture-tool-smoke/filtered/{desktop,iphone-webkit}/`; logs are `/tmp/directors-capture-tool-{desktop,webkit}.log`. Repeated a successful filtered desktop run with canonical sentinels, confirmed neither canonical file changed, then ran `desktop-no-js` and `mobile-reduced` successfully in the same temporary root. These four smoke cases do **not** establish that all twelve full-run cases passed.

Full canonical invocation (controller-owned):

```sh
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu node scripts/capture-arrival-campaign.mjs
```

Filtered example (keeps canonical JSON/images/videos untouched):

```sh
ARRIVAL_CAPTURE_CASE=iphone-webkit PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu node scripts/capture-arrival-campaign.mjs
```

Use `ARRIVAL_CAPTURE_URL=https://<actual-preview>/` for the preview origin and `ARRIVAL_CAPTURE_OUTPUT=<directory>` for an alternate artifact root. Unknown-case CLI execution was also observed to reject with exit 1.

`node scripts/measure-arrival-campaign.mjs /tmp/directors-metrics-tool-smoke.json` succeeded against the built localhost page. This was a tool smoke sample while other browser work was running, not a canonical isolated benchmark. Final invocation after the controller’s final build/capture:

```sh
ARRIVAL_METRICS_URL=https://<actual-preview>/ node scripts/measure-arrival-campaign.mjs artifacts/arrival-directors-cut/performance.json
```

Metric conditions identify managed Chromium, cold isolated contexts, DPR1, no network/CPU throttling, observation for 2200ms after fonts, no scrolling, and sampled story progress/light opacity. The dark opening’s LCP can come from header/logo, the SSR static fallback or other visible content; it is not completed-story or hero-photo LCP. This is not a field, physical-device, thermal or physical Safari toolbar result. The collector reports the LCP element tag rather than implying it measured the athlete reveal.

## Remaining controller work and limits

The controller has started a fresh full browser run and full twelve-case capture against rebuilt output; their results and final regenerated canonical metrics are not claimed here. Independent review and final visual inspection remain controller-owned. The media remain preview-only with rights/source limitations recorded by Task 1; no release safeguard was bypassed. No original MP4, logo or photo asset bytes changed in this task. Managed browsers were used for all green checks. The WebKit environment skips only host dependency preflight; the browser cases/assertions actually execute.
