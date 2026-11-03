# Two Sides review evidence

Review build dated 2026-11-03. No merge or deployment.

## Screenshots
Captured with Chromium at DPR 1, reduced motion for deterministic final compositions. Desktop: 1440 × 1000 viewport. Mobile: 390 × 844 touch viewport. Discovery captures the full section and hides the fixed header during capture; dedicated pages are full-page captures.

| Experience | Desktop | Mobile |
| --- | --- | --- |
| Discovery | [Desktop](discovery-desktop.png) | [Mobile](discovery-mobile.png) |
| On the Field | [Desktop](field-desktop.png) | [Mobile](field-mobile.png) |
| Beyond 17 | [Desktop](beyond-desktop.png) | [Mobile](beyond-mobile.png) |

Reproduce after `npm run build` and starting `node scripts/serve-static.mjs --port 3100`: `node scripts/capture-two-sides.mjs`. Optional `TWO_SIDES_CAPTURE_URL` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` select host/browser.

## Validation
- `npm test`: 65 passed, 0 failed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed, including 63-game Playoffs validation, brand provenance, static export and existing media audit.
- Release-mode render check: both new routes omit preview-only football/portrait crops when `PREVIEW_MEDIA_MODE=false`.
- Independent source review of final integration with current production main: no Critical/Important findings. Latest cinematic components, their CSS/motion, and Hudl Highlights page unchanged relative to main `8aa7f5a`.
- Browser coverage: **175 distinct cases passed, 1 existing clipboard test skipped on WebKit**, across two recorded passes. The initial expanded 176-case run passed 163, skipped 1, and found 12 failing cases covering discovery-link naming, outdated control assertions, and the removed footer return action. Those causes were corrected. The complete affected five-suite rerun passed **88/88**, including every previously failing case; the other 87 passing cases from the broad run were unaffected by those fixes.
- Raw results: [unit](unit.log), [lint](lint.log), [build](build.log), [initial expanded browser run](broad-browser-run.log), [final affected browser run](final-affected-browser-run.log).
- Final browser command: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright test tests/e2e/two-sides.spec.ts tests/e2e/intro-entry.spec.ts tests/e2e/site.spec.ts tests/e2e/editorial-controls.spec.ts tests/e2e/arrival-campaign.spec.ts --workers=3`.
- Deferred nonfunctional cleanup from review: old gallery/stat/milestone selector names in the homepage ResizeObserver query and an arcade-focus comment refer to removed content. They match no elements and create no triggers.

## Browser scope
Desktop Chromium, touch/mobile Chromium, iPhone 13 WebKit emulation, reduced-motion Chromium. Checks cover opening beat sequence and reverse scroll, native film/deep links, reduced-motion toggles, footer return to intro, seven page destinations, menu/focus/back navigation, six sourced metrics/nine-game log, eight interest categories, responsive image loading, overflow at 320/390/768/1440, axe accessibility, preserved Hudl player geometry and lifecycle, Recruiting/NIL and Playoffs behavior.

Carousel verification uses a test-only three-photo fixture; production contains one accurately captioned sideline portrait until real lifestyle assets arrive. Keyboard/previous-next controls run on every browser. Horizontal wheel gestures and vertical wheel scrolling run on Chromium; mobile WebKit does not support Playwright mouse.wheel. Physical iPhone Safari toolbar behavior and real touch swipe acceptance remain untested. No claim of physical Safari verification is made.

The standard Chromium download was blocked; installed Chromium was used. WebKit was downloaded successfully; missing libraries were extracted locally from Debian packages without changing project dependencies. Browser validation bypassed Playwright's host package inventory check only after WebKit successfully launched with the required libraries.

## Content limits
Approved mockup and lifestyle originals absent; temporary sideline portrait explicitly approved for review. Music, Favorites, Adventure, Family & Friends await answers. MaxPreps source checked 2026-11-03; Dallas News disagreement disclosed and team reconciliation pending. No game rushing values or game-specific photo identities inferred. Existing preview assets still require original/rights completion before public release.

Full photograph inventory and statistic evidence: [handoff](../../docs/TWO_SIDES_REDESIGN.md).
