# Independent release gate — PR 11

Verdict: **No release-blocking product defect found** in candidate `78ba2726ecd2714884ce661b6d82f2966c2ce529`. Owner authorization for merge/deployment is supplied by the lead's current task; earlier preview-only instructions in historical reports describe earlier authority. This review does not certify a deployed production commit.

Independent reviewer inspected the main-to-candidate product diff, final motion hooks and affected tests, prior independent integration/Highlights/refined-controls reports, and actual raw verification logs. No implementation, merge or deployment performed. Reviewer owns this report only.

## Candidate and checks

- HEAD independently read twice as `78ba2726ecd2714884ce661b6d82f2966c2ce529`; app/components/content/lib/tests/package working-tree changes are empty. Source/test `git diff --check main...HEAD` passes. The whole repository check reports whitespace in retained historical logs; that is not a product defect.
- Compared with independently reviewed product `7e8f5e41`, current product delta deletes only SCROLL TO EXPLORE markup and its orphan CSS. Affected tests now exercise natural intro completion. GSAP hook/timeline distances are unchanged by that final removal.
- Overall PR changes include the previously reviewed cinematic opening, stable field pin spacer, separate official Hudl Highlights route, shared navigation and refined controls. No game data, lib or dependency changes against main. Owner stadium/action image assets and provenance, navigation content and the preview-photo label type are intentional additions; do not describe the entire PR as having no content/asset changes.
- Current release-scroll/e2e.log: **60 passed**, zero failures, covering desktop/mobile Chromium, iPhone WebKit and reduced motion; includes rotation, forward reveal, completion, client route entry and reduced-motion activation.
- Reviewer independently executed `npx playwright test tests/e2e/arrival-directors-cut.spec.ts tests/e2e/intro-entry.spec.ts --project=iphone-webkit --workers=1`: **8 passed (35.1s)** against localhost:3100. Includes 1440/390/768 collage behavior, rotation progress preservation, reduced-motion unpin, Film/About return, motion reactivation, and direct Film-anchor refresh. Assertions inspect current prompt-free markup and motion state.
- Latest removal build log shows successful static export; remove-explore-tests.log records 36 passing affected cases. Prior refined-controls raw logs record 62 unit passes and 213 browser passes/7 conditional skips. That full suite predates the prompt removal and is supporting unchanged-surface evidence, not a claim of a fresh full-suite run on this HEAD.
- Inspected live-scroll script and JSON: remote alias checks passed forward/reverse movement, mid-intro pin position, header hidden/visible transitions, return-to-top cold logo, zero page errors and zero horizontal overflow in all three browser variants.

## Limits and nonblocking observations

- The live receipt targets mutable `https://cinematic-opening-dev.zk17-review.pages.dev`; JSON alone does not bind results to a deployment commit. Lead must independently bind the served build and verify production against the merged commit. This reviewer has not certified that remote identity.
- Frame sampling uses programmatic scrollTo and requestAnimationFrame, not hardware touch or wheel input. Desktop p95 25.3 ms, mobile Chromium p95 18.1 ms, WebKit p95 47 ms. WebKit has 6/200 frames above 50 ms, max 54 ms. These observations support working scrolling but **do not establish sustained 60 fps or physical-iPhone smoothness**. No frame-time acceptance threshold was supplied; no functional failure accompanies this observation.
- Physical iPhone remains UNKNOWN. WebKit fullscreen and actual PiP remain unverified. Previously reported Hudl aria-prohibited-attr/manual accessibility findings and intermittent vendor diagnostics remain upstream limitations; no blanket accessibility or all-console-clean certification is given.
- Historical QA/current-state files still describe the earlier preview-only delivery and SCROLL TO EXPLORE. The release handoff should distinguish those historical receipts from the currently authorized prompt-free candidate.

No concrete unresolved host-product P1/P2 defect was found in this release gate. Production deployment and post-deployment acceptance remain separate lead actions.
