# Arrival campaign — Task 2 header implementation

Date: 2026-11-02. Worker: Codex header implementer (inherited runtime model identifier is not exposed to this worker). Binding scope: `.agent/PACKET-ARRIVAL-HEADER.md`; campaign packet, approved brief/spec and Task 2 plan read before implementation. Executing-plans, test-driven-development and verification-before-completion guidance applied within the packet's explicit bounded ownership; the controller owns integrated green browser validation and independent review.

## Changes

- Canonical BrandLogo and `ZK17 home` accessible link retained; visible ZEPHYR KREYE wordmark replaces the old location label.
- Outlined WATCH FILM button passes its real HTMLButtonElement through `Header.onWatch` to the existing `openFilm(approvedFilm, opener)` callback. Existing native Film Room rendering and focus restoration are unchanged.
- All seven scene anchors plus Recruiting and Playoffs remain unchanged. Desktop layout keeps all nine links. Wordmark is hidden only at 900–1279px to preserve space, and the mobile action uses a decorative play triangle with its explicit WATCH FILM accessible name.
- Header additions are scoped to `.site-header`; original 96/80/76px heights, canonical logo sizing, 900px breakpoint and short-home-viewport absolute-position rule remain unchanged. Navigation/control targets have minimum 44px dimensions. Mobile navigation scrolls vertically when necessary rather than clipping links.
- Existing menu inert, Escape, focus trap, focus return and body scroll-lock hooks retained. A breakpoint listener closes an open mobile menu on entering desktop, releasing inert/scroll lock and moving focus from the hidden Close control to Home.
- Three tests appended; the previous ten tests remain byte-for-byte unchanged. Added coverage includes native video controls and film focus return, all nine hrefs and desktop bounds at 1024/1280/1440/1536/1920, mobile 320/390 bounds and minimum targets, menu keyboard/inert/scroll behavior, and menu cleanup when resized to desktop.

## Actual validation

- Initial `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/e2e/arrival-campaign.spec.ts --project=desktop-chromium --grep '^header' --workers=1 --timeout=15000`: no tests found because Playwright grep matches the full title. Corrected the grep immediately.
- Before implementation, the same command with `--grep 'header (watch|keeps|mobile)'`: 2 expected failures, 1 pass against the existing production server. The film test failed on absent ZEPHYR KREYE; desktop bounds failed on existing 25px nav targets; existing mobile focus/inert behavior passed. Strengthened mobile test afterwards with an explicit three-control count so a missing film action cannot silently pass, and added breakpoint cleanup assertions.
- Final same targeted Playwright command against unchanged old production output: all 3 expected failures (missing wordmark; existing 25px navigation targets; mobile control count 2 instead of 3). No implementation browser-green claim.
- `npx eslint components/site-experience.tsx tests/e2e/arrival-campaign.spec.ts`: passed twice, exit 0, no lint output.
- `npm run typecheck`: passed twice, exit 0 (`tsc --noEmit`).
- `git diff --check -- components/site-experience.tsx app/globals.css tests/e2e/arrival-campaign.spec.ts`: passed, exit 0.

## Assumptions and limits

- Wordmark suppression at intermediate desktop widths and icon-only mobile film action follow the explicit packet allowances. Existing route labels and hrefs take precedence over reference-only links.
- Production browser green, screenshot inspection, full build and full suite are controller-owned and remain pending against rebuilt output. This worker did not rebuild, alter/restart the server, run full suites, modify film/hero/photo code, add assets/dependencies, spawn agents, push, merge or deploy.
- Reusing the stale production server can demonstrate expected red only; it cannot establish that the new implementation passes browser checks. No visual/behavior green or physical-device result is claimed.

## Repair round 1 — controller integration findings

Read `.agent/PACKET-ARRIVAL-HEADER.md` again and applied receiving-code-review/systematic-debugging guidance. Controller evidence `/tmp/zk17-campaign-header-targeted.log` records 50 passes and 2 failures: the mobile menu resize Home focus assertion on mobile Chromium and iPhone WebKit. `/tmp/zk17-campaign-capture-smoke.log` records axe `label-content-name-mismatch` for the header home link.

Diagnosis: the old resize callback checked whether the Close control remained focused after CSS hid it. Browser blur timing makes that conditional unreliable. A separate Chromium instrumentation run happened to preserve/focus Home, demonstrating the intermittent/browser-sensitive nature rather than disproving the controller failures. The listener now captures current `open` state through `[open]`, handles only an actually open menu, and schedules `Home.focus({ preventScroll: true })` in the next animation frame after closing it. Existing inert and scroll-lock cleanup remains in place. Closed-menu resize leaves existing focus alone, with an added assertion covering that case.

The header home link's accessible name is now `Zephyr Kreye — ZK17 home`, containing its visible wordmark and retaining brand/home intent. This resolves the conflict between preserving the former exact label and WCAG label-in-name requirements; footer naming is outside this header task. A fourth header regression checks the actual accessible name and runs axe's `label-content-name-mismatch` rule against the header. No axe rule is disabled. The original ten hero test bodies remain unchanged.

Actual checks:

- Before implementation: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/e2e/arrival-campaign.spec.ts --project=desktop-chromium --grep 'header home name' --workers=1 --timeout=15000` failed as expected: accessible name was `ZK17 home` and lacked the visible wordmark. The controller's two resize failures were read and retained without weakening the assertion.
- After implementation: `npx eslint components/site-experience.tsx tests/e2e/arrival-campaign.spec.ts`, `npm run typecheck`, and `git diff --check -- components/site-experience.tsx tests/e2e/arrival-campaign.spec.ts` passed with exit 0.
- Fresh source fixture: extracted the current Header function and scene list in memory, bundled the actual BrandLogo with esbuild, and served current header/global CSS through Playwright route fulfillment on the existing server origin. No build, files served by the production server, or server process were changed. The fixture stubs only `onWatch`, because this repair concerns name/focus/menu behavior; full production film integration remains covered by the existing regression/controller rebuild.
- Initial fixture run passed system mobile Chromium but could not launch WebKit due to this shell's missing `libGLESv2.so.2`. Reused the controller's existing libraries and managed browsers, without installing or editing dependencies: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu node --input-type=module < /tmp/zk17-header-repair-fixture.mjs` passed, exit 0, in both managed mobile Chromium and managed mobile WebKit. Each actually executed accessible-name and axe label checks, open-menu resize Home focus, inert/scroll release, and closed-menu focus retention. The skip flag bypassed host dependency preflight only; neither browser scenario nor assertion was skipped.

Rebuilt production checks remain controller-owned and pending for this repair. No build/full suite/server mutation, hero/film/assets edit, agent spawn, push, merge or deployment performed.
