# Homepage polish verification — 2026-11-03

Implementation branch: `feat/homepage-cinematic-polish`, based on `8aa7f5a74d6537bc14e87227601f48002c5c472e`.
Owner-requested independent critic: **Astra**, using the native collaboration agent harness with the explicitly selected `gpt-6-astra` model. See `astra-review.md`; no unresolved functional/layout P1/P2 defects in its final review. Exact mockup/photography acceptance remains blocked as documented in project-root `design-qa.md`.

## Results

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm test` | 65 passed, 0 failed |
| `npm run build` | Passed; all existing static routes exported |
| Chromium desktop + mobile + reduced-motion regression set | 82 passed, 2 intentional skips |
| Final homepage set after before-paint carousel initialization | 13 passed, 2 intentional skips |
| iPhone 13 WebKit regression set | 19 passed, 2 intentional skips |
| Responsive captures | 375, 390, 430, 768, 853 (reference width), 1024, 1440; no horizontal document overflow or console exceptions |
| New chapters/footer axe checks | Passed in Chromium and WebKit |

Chromium command:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/e2e/homepage-polish.spec.ts tests/e2e/arrival-campaign.spec.ts tests/e2e/completion.spec.ts tests/e2e/site.spec.ts tests/e2e/hudl-highlights.spec.ts tests/e2e/playoffs.spec.ts --project desktop-chromium --project mobile-chromium --project reduced-motion --workers 3
```

WebKit command:

```sh
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright test tests/e2e/homepage-polish.spec.ts tests/e2e/arrival-campaign.spec.ts tests/e2e/completion.spec.ts tests/e2e/hudl-highlights.spec.ts tests/e2e/site.spec.ts --project iphone-webkit --workers 1
```

The WebKit host lacks root package-install access. Real Debian library packages were downloaded and extracted into the scratch directory, then linked into the downloaded Playwright browser's local runtime. Host validation was bypassed because the libraries are not in the system linker cache; WebKit itself successfully ran all listed checks. This is **Linux Playwright WebKit, not a physical iPhone/Safari performance certification**. System Chromium was used because its Playwright Chrome download was blocked. Unit measurement fixtures also used the installed Chromium executable through a local runtime symlink; no repository browser binaries were added.

## Coverage

- Exactly six section IDs: `arrival`, `film-room`, `on-field`, `off-field`, `follow-the-journey`, `next-chapter`; footer follows within the closing composition.
- No `#journey`, Journey navigation anchor, timeline/spacer, timeline CSS or timeline GSAP in the homepage. Verified milestone records remain in the content system.
- No video, iframe, Hudl player or highlight/game-film buttons inside On the Field. Dedicated Film and Highlights remain intact.
- All four statistics labels/order, explicit 2026 scope and honest unavailable state. Separate synthetic adapter tests verify passing+rushing totals, season isolation, duplicate rejection, game-count consistency and named rating method. See `STATISTICS.md`.
- All PLAYER17 categories, supplied picks, Escape/Back and focus restoration.
- Carousel first-load center, Home/End/arrow keys, mouse pagination and native mobile Chromium CDP horizontal swipe. A separate vertical touch gesture over the rail scrolls the document. Mouse wheel is unsupported by Playwright mobile WebKit, so its normal vertical-scroll check uses PageDown. Physical Safari touch remains a release follow-up.
- Every new-chapter image decodes at each width; canonical sword identity is unchanged. Existing images retain their intrinsic proportions and review/approval gates.
- Direct Film, Highlights, About, Playoffs, NIL/Recruiting and recruiting snapshot routes; navigation, menu focus/Escape, film dialog, existing cinematic entry, browser back/forward and dedicated Hudl geometry.
- Reduced-motion initial load and dynamic switch back to a native unpinned document; no new section pinning or continuous carousel animation.

## Test investigation notes

Early runs exposed three harness issues: simultaneous reviewer/test runs cleaned a shared Playwright artifact directory, immediate resize assertions observed geometry before GSAP's existing matchMedia cleanup, and a legacy no-preview-label assertion conflicted with honestly labeled review crops. Final runs use distinct output directories, poll settled geometry, and distinguish review mode from release/dedicated pages. Preview labels remain prohibited outside the explicit homepage preview mode.

WebKit also exposed a carousel initialization race. Initial centering now runs in a layout effect before paint; keyboard coverage waits for the actual native rail position before acting. The existing opening's media-query cleanup was measured independently in five WebKit runs: it removed its pin every time, but software video rendering delayed event delivery by roughly five seconds in four runs. The test now permits 15 seconds for that existing cleanup rather than reporting a false five-second failure. Opening application code and visuals were preserved; this is not a claim of smooth physical Safari performance.

Intentional skips: the CDP-native swipe test runs only in mobile Chromium; WebKit clipboard-permission coverage already skips because that browser API is unsupported. No failed final checks are hidden by retries or skip markers.

## Screenshots and visual limits

`before/` contains reduced-motion desktop/mobile captures of the original homepage. `after/` includes per-chapter screenshots and 1× stitched comparison strips at each viewport. `webkit/` contains the 390px WebKit screenshots. Comparison strips stitch the actual four browser-rendered section captures without resizing. The fixed header and skip-link are hidden only during section captures so they cannot obscure content. The supplied mockup is a conversation attachment, not a workspace source image; no fabricated pixel-diff score is claimed.

Current authentic sideline/football crops differ from the mockup's lifestyle photography and are mostly review-only. Approved lifestyle/smiling/helmeted-throwing originals, plus physical iPhone testing, remain necessary before final visual acceptance. No generated athlete, invented profile, invented statistics or commitment claim was introduced. No merge/deployment performed.
