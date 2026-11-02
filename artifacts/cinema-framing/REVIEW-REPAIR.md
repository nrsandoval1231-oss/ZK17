# PR #8 review repair evidence

Reviewed starting head: `690796516b706c18df3a3c3487ff508d88b128f1`.
Branch: `feat/film-room-framing-playoffs-layout`. Local verification: 2026-11-02 UTC.

## Repairs

- The aperture/copy timeline runs with `film={null}`. Only video scaling, native controls, poster removal, and the final copy exit require a video. A browser fixture mounts the real component with an unpublished film, checks the reveal, and reverses it in all four projects.
- The final 4:5 player fits the area below the header and above the sound button. Below 480px viewport height, the home header scrolls away and the player uses 90% of viewport height. The cover calculation accounts for its offset center and returns a finite identity scale when dimensions or ratio are invalid.
- The capture script supplies `executablePath` only for an explicit `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override. That variable was unset for verification and captures; Chromium came from Playwright's managed browser cache.
- Direct film anchors align the full-height stage without a header scroll offset in reduced motion. Anchor reconciliation survives font/image/pin refresh and resizing, then releases on wheel, touch, pointer, or scroll-key input.

## Direct-anchor failure investigation

The original test iterated three hash navigations under one 30-second test timeout and waited for `networkidle`. A managed Chromium probe recorded the autoplay MP4 request at 382ms, completion at 26,226ms, and the first navigation finishing at 26,725ms. The remaining hash navigations themselves took 2ms each. The original browser test took 28.8s on desktop and 26.9s on mobile even in isolation. Media transfer, rather than anchor readiness, consumed nearly the entire test budget.

The repaired test uses `load`, awaits fonts, and polls actual viewport intersection. It retains all three anchors in the same-document navigation loop and no longer forces a synthetic resize to get a landing. A separate test checks resize while anchored and verifies that visitor scroll input releases the anchor. No direct-anchor test is skipped or given retries.

## Regression evidence

Before the repair, the unpublished-film test observed aperture opacity stuck at `1`, and 180px/240px viewport tests failed the usable, finite player assertion. Header-aware checks also detected video occlusion. Review and screenshot inspection caught both header occlusion and the tablet sound-button overlap; both have explicit assertions now.

Reverse-scroll assertions check aperture opacity and identity transform, restored cover on all four stage edges, disabled controls and tab order. Resize assertions change width and height, verify the new frame dimensions, 4:5 ratio, horizontal centering, unobscured bounds, controls, unchanged source, playback continuity in the capture, and a second reverse/forward cycle.

The isolated fallback fixture supplies a real mobile viewport meta tag and a following section so its scroll range supports the complete reveal. The completion target includes one pixel beyond the boundary to avoid fractional WebKit scroll rounding. Touch scenarios use Playwright's `hasTouch` fixture; mobile WebKit does not implement the mouse-wheel API and reports zero `navigator.maxTouchPoints` in this environment.

## Reproduce

```sh
npm ci
npx playwright install chromium webkit
npx playwright install-deps chromium webkit
npm test
npm run lint
npm run typecheck
npm run build
npm run e2e -- --workers=2
node scripts/serve-static.mjs --port 3100
# In a second shell, with the server above running:
node scripts/capture-cinema-framing.mjs
```

This non-root environment could not run `install-deps`. Debian browser libraries were downloaded and extracted locally and linked into the managed WebKit bundle's `sys/lib`. Browser tests used `LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu` and `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` because the library-cache preflight cannot see that local installation. This bypassed only host-library discovery; the actual managed WebKit and Chromium browsers ran the tests. No browser test was disabled by that setting.

## Captures and measurements

`validation.json` records 1440×900, 1920×1080, 768×1024, and 390×844: six reveal beats, final framing, one-pixel pin release, width/height resize, reverse, restored frame, and Playoffs logo/copy bounds. `short-viewports.json` records 1024×180, 1024×240, and 1024×360. Captures also assert no runtime errors or horizontal Playoffs overflow.

For each regular width:

- `WIDTH-beat-1.png`: completed video framing during playback.
- `WIDTH-final-controls.png`: paused native controls visible for inspection.
- `WIDTH-resized-final.png` / `WIDTH-resized-reverse.png`: changed viewport and reverse reveal.
- `WIDTH-playoffs.png`: official logo and hero copy arrangement.

The capture helper moves the pointer without calling `Locator.hover()`, whose automatic scroll-into-view can change a scroll-driven reveal beat. It asserts that native controls remain enabled after positioning the pointer. Short-screen browser tests also focus the actual video and check controls and keyboard tab order.

Short-screen controls captures are named `1024xHEIGHT-final-controls.png`.

## Final checks

| Check | Result |
| --- | --- |
| `npm test` | 50 passed, zero failures |
| `npm run e2e -- --workers=2` | 126 passed, 18 existing project-specific skips, zero failures |
| `npm run lint` | Exit 0 |
| `npm run typecheck` | Exit 0 |
| `node scripts/capture-cinema-framing.mjs` | Exit 0; four regular and three short viewport sizes |
| `npm run build` | Exit 0; all six static pages generated and export audit completed |

The direct-anchor test and every new regression run in desktop Chromium, mobile Chromium, iPhone WebKit, and reduced motion. The 18 skips are existing platform-specific scenarios (for example desktop-only Playoffs positioning and iPhone-only lazy-loading), not failed scenarios removed from coverage. Full output is in `checks/`.

An independent code review found the header occlusion during the first capture pass; after the framing and footer corrections it reported no actionable findings. No merge or deployment was performed.

## Visual inspection

Key captures: [desktop film](1440-final-controls.png), [mobile film](390-final-controls.png), [desktop Playoffs](1440-playoffs.png), [mobile Playoffs](390-playoffs.png), and [180px-tall native controls](1024x180-final-controls.png).

Inspected the final video and native-control captures at desktop, tablet, and mobile sizes, desktop/mobile Playoffs captures, and the 180px-tall controls capture. Video uses `object-fit:contain`, preserves its 4:5 ratio, clears the header, and does not overlap the sound button. At 180px height the frame remains about 130×162px; native play, seek, and overflow controls are available. On desktop/tablet the official Anna logo sits to the left of the heading; on mobile it remains above the hero copy. Playoffs has no horizontal overflow.

| Viewport | Final video bounds (x, y, width, height), px | Header bottom, px |
| --- | --- | --- |
| 1440×900 | 436.80, 96.00, 566.39, 707.98 | 96 |
| 1920×1080 | 604.80, 96.00, 710.39, 887.98 | 96 |
| 768×1024 | 44.80, 80.00, 678.39, 847.98 | 80 |
| 390×844 | 16.00, 188.25, 358.00, 447.50 | 76 |
