# Hudl pin lifecycle escalation and repair

2026-11-02. Scope: the current uncommitted Hudl integration on `feat/cinematic-opening-refinement`, based on `e2820d3`. Only `components/site-experience.tsx` and `components/use-story-motion.ts` were edited for this repair. Cinematic components and styles were not changed.

## Reproduced cause (P1)

The exception is thrown inside GSAP ScrollTrigger, not React reconciliation. Browser instrumentation captured `.site-content.insertBefore(#on-field, .pin-spacer)` throwing `NotFoundError` from `_swapPinOut` during global refresh. The local GSAP implementation at `node_modules/gsap/ScrollTrigger.js:621` reparents a dynamically pinned section on refresh; its native-spacer branch restores styles without moving the section.

The iframe is inside that section. Reparenting reloads its browsing context, and the existing captured element `load` listener requests another ScrollTrigger refresh. The resulting repeated reload/refresh cycle is independently measured in `pin-probe-before.json`: two of eight fresh Chromium pages threw and could not activate Skip intro; the other six succeeded at the actions but recorded 80–84 iframe loads and 89–92 section moves during the short probe. The exact nested browser event that makes `insertBefore` throw is not isolated; the unsafe repeated iframe detach/reload mechanism and thrown operation are established.

## Repair

- Pre-render a stable wrapper around `#on-field` and supply it as ScrollTrigger's native `pinSpacer`. Refresh and breakpoint changes retain the iframe document.
- Remove GSAP's added `pin-spacer` class when its trigger is killed, preserving the existing reduced-motion no-pin behavior while keeping the ordinary DOM wrapper.
- Retain the original one-second field timeline duration with a terminal hold after obsolete photo tweens were removed. The field pin distance, text timing and cinematic source remain unchanged.
- Keep existing image-load and geometry refresh listeners. No exception suppression or skipped acceptance checks.

## Verification against repaired static candidate

- `npm run build`: exit 0 (`build-repair.log`).
- `npm run typecheck`: exit 0 (`typecheck-repair.log`).
- `npx eslint components/site-experience.tsx components/use-story-motion.ts`: exit 0 (`lint-repair.log`).
- `probe-pin-refresh.mjs` against rebuilt localhost:3100: eight of eight fresh normal-motion desktop pages completed startup, Skip intro, field scrolling and three desktop resizes. Each had zero errors, zero field reparent operations and exactly one iframe load (`pin-probe-after.json`). This uses an explicitly labeled deterministic iframe fixture, not actual Hudl playback.
- An earlier separate development-server experiment had no errors or iframe moves but failed all eight waits for the arrival-ready selector. It is retained as `pin-probe-dev-after.json` and is not acceptance evidence. Static production-build checks above passed.

The separate critic owns independent real Hudl playback, responsive refresh and fullscreen evidence. Parent owns the final integrated regression suite and review disposition. No merge or deployment was performed.

## Subsequent test-only escalation

The first final Hudl focused run passed seven of eight tests; desktop-to-portrait layout failed a corner hit assertion. The helper cached an iframe bounding box and then checked its points across separate browser evaluations, allowing responsive pin/scroll restoration and header visibility to change between those operations. It also positioned against a header snapshot taken before the scroll.

Updated only `tests/e2e/hudl-highlights.spec.ts`: each poll measures the currently visible header, corrects scroll when the player is outside the usable viewport, waits two animation frames, then reads current player geometry and all five hit targets in a single browser evaluation. The same snapshot still requires the entire player within the viewport, 16:9, no horizontal page overflow, and all four inset corners plus center hitting the iframe. Persistent obstruction still fails; no skip, tolerance relaxation, product edit or assertion removal was introduced.

`npx playwright test tests/e2e/hudl-highlights.spec.ts --workers=2 --output=<unique absolute TEMP path>` passed all eight tests across desktop Chromium, mobile Chromium, iPhone WebKit and reduced motion in 15.7 seconds (`hudl-focused-accepted.log`). Scoped test ESLint passed. Final integrated suite remains parent-owned.
