# Independent Highlights review

Verdict: READY FOR AUTHORIZED DEVELOPMENT PREVIEW. No outstanding material defect found in the owned product changes. This is not a production, merge, physical-device, or blanket accessibility certification.

Reviewer: separately dispatched Astra critic. Baseline/HEAD during review: bc3546d5326ff7bd26bfafa78f4ef7ff979d413a, branch feat/cinematic-opening-refinement; candidate changes were uncommitted. Reviewer edited this report only. Read the actual integrated diff/new files, plan, existing repository rules and raw verification logs; performed independent browser checks against the freshly rebuilt localhost:3100 export. Earlier stale export was explicitly excluded.

## Findings and uncertainty

- P2, upstream accessibility/manual review: fresh awaited-player Axe runs return zero violations but retain serious `aria-prohibited-attr` as INCOMPLETE inside `iframe > .jwplayer`: “aria-label attribute is not well supported on "div" elements with no valid role attribute.” The real vendor root remains a focusable div with tabindex=0 and aria-label="Video Player", without a role. Earlier integration recorded this as a failing violation; latest runs do not establish vendor repair. Current incomplete checks also include title color contrast (gradient prevents measurement) and video captions (availability requires checking). No host-side exclusion or waiver was added. Full-page accessibility cannot be certified clean.
- P2 verification uncertainty, not a reproduced product defect: the first full browser run recorded one WebKit RSC access-control pageerror for `__next.__PAGE__.txt`. The affected direct-route test and all other affected tests passed on the subsequent run; reviewer fresh home/player runs also collected zero page errors. The original log is retained. Exact underlying cause remains unproven; a successful rerun does not erase the event.
- Physical iPhone playback/fullscreen/PiP remain UNKNOWN. Browser-engine checks use automated Chromium and WebKit. PiP permission is present; actual PiP was not exercised. Owner visual approval and deployed-preview verification remain the lead's subsequent steps.

## Resolved review issues

- The new navigation test originally kept `#site-nav` after navigation to a page using `#route-nav`, causing four failures. Corrected assertion inspected; all four project variants pass in the final affected run.
- Initial new player test sampled corners before bringing the player below the fixed header. It now checks header-aware positioning and viewport/corner geometry atomically. The design permits normal page scrolling; the full player fits below the header at tested short heights.
- New homepage assertion initially confused the retained Skip intro link with the removed hero WATCH THE FILM button. Final assertion checks the intended removed button, while retaining the valid intro-skip regression test.

## Source and runtime evidence

- `/highlights/` has its own h1, canonical, sitemap entry, exact existing official Hudl URL, descriptive iframe title, lazy loading, fullscreen/PiP permission, referrer policy, and no autoplay permission. Six destinations come from the shared navigation module in both headers. FILM stays a separate cinematic route.
- Homepage on-field JSX matches approved e2820d3 composition, except for the intentionally retained stable native pin wrapper. Every final field/on-field CSS segment independently matches approved e2820d3. Existing photo resolver and preview gates remain unchanged; no content/photo asset bytes or cinematic source files were changed by this packet. Photo/mark/caption motion is restored.
- Fresh Chromium and WebKit geometry checks at 900x650, 1280x600, 1440x900, 390x844 and 844x390: no horizontal overflow; player ratio approximately 1.7778; all four corners hit the iframe after normal header-aware scrolling. At 1280x600 the player measures approximately 853.33x479.98, with its bottom below 585px. At landscape 844x390 it measures approximately 426.66x239.98 and ends at 382.17px. Six desktop links fit at 900px; the last link ends at x=873. Mobile menu Shift+Tab reaches the sixth destination and Escape closes it.
- Fresh real Hudl playback: both engines initially paused at time 0. After a real play-control click, Chromium advanced 1.427745 to 2.492242; WebKit advanced .8562084 to 1.879896; neither paused and no page errors were collected. Chromium fullscreen confirmed parent fullscreenElement=IFRAME and child fullscreenElement=DIV with jw-flag-fullscreen after allowing the transition to settle. An initial 500ms observation was null; a separate settled check succeeded.
- Fresh homepage checks in Chromium 900x650 and WebKit 390x844: zero Hudl requests, zero iframes, zero horizontal overflow/page errors; approved on-field image successfully loaded as AVIF/WebP. Motion-enabled intro independently reaches ready with the header hidden and no removed hero watch button.
- Inspected current desktop and iPhone-WebKit screenshots. Desktop capture is scrolled and crops the heading/player edge; this capture alone is not full-player geometry evidence. Independent corner/viewport checks above establish fit. Mobile composition is readable and unobstructed.

## Deterministic checks and candidate identity

- build.log: successful static export including /highlights; lint.log and typecheck.log: no errors. unit.log: 62 passed, zero failed. Reviewer `git diff --check`: no errors.
- e2e.log before the final test-only locator repair: 192 passed, 7 skipped, 5 failed (four locator errors and the WebKit RSC error above). This was not a green full-suite run.
- affected-recheck.log after that repair: 28 passed across all four browser projects, covering the entire Hudl and site specs, including every formerly failing case. Product source stayed unchanged; the full suite was not repeated after the test-only edit. Build/lint/unit evidence applies to unchanged product source; affected browser evidence applies to the final corrected test.

Final aggregate SHA-256: c9329ab3c63bd331b20a3f02ed76567f814df4666fcd1d5b0ce2d237c774edf7. Computed as SHA-256 of JSON of sorted [relativePath, fileSha256] pairs for these 11 files: app/globals.css; app/highlights/highlights.module.css; app/highlights/page.tsx; app/sitemap.ts; components/route-header.tsx; components/site-experience.tsx; components/use-story-motion.ts; content/navigation.ts; tests/e2e/arrival-campaign.spec.ts; tests/e2e/hudl-highlights.spec.ts; tests/e2e/site.spec.ts. Final Hudl spec hash: 64a8ce287b79e31f33c3935a92d7f72e8278434e6d62bc528e3f7c7d3c66d3cc. Final globals hash: 883f36ec6e5ec71f1b01d8b1719f967f4900fc4fe5d18713bd87d701d8045f0f.

No merge, deployment, production change, or routine implementation performed by reviewer.
