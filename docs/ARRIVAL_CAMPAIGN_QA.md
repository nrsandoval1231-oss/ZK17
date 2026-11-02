# THE ARRIVAL campaign review evidence (historical five-beat candidate)

This document records the earlier five-beat campaign candidate. It does not describe the current seven-beat director’s cut; current evidence is tracked in [ARRIVAL_DIRECTORS_CUT_QA.md](ARRIVAL_DIRECTORS_CUT_QA.md).

Feature branch: `feat/arrival-campaign-hero`, based on merged PR8 (`910bfa5`). Product candidate: `d46943f` (visual fixes `5798ff8`, anchor/focus repairs `963bbb5` and `d46943f`). No deployment or merge was performed for this campaign.

## Result and source fidelity

The homepage now uses the owner-supplied photographs from Zpics.zip in a layered campaign composition with MAKE THEM / REMEMBER., the existing sword monogram, live navigation and the native Film Room action. Desktop fine-pointer screens receive the five-beat scroll sequence; touch, short screens, reduced motion and no JavaScript receive the complete static composition. The second film scene retains its aperture, original MP4, native controls and responsive framing.

The ZIP's full-body black-uniform portrait contains repost UI over its knees/lower legs. The presentation fades before the occlusion; it does not reconstruct anatomy. It therefore cannot reproduce the reference's unobscured full-body stance. The close-up is limited by the supplied image resolution. The authentic sword monogram differs from the reference's lettermark. These are review limitations, not claims of exact reference equivalence.

Original source hashes and crop/clip provenance are in [the media manifest](ARRIVAL_CAMPAIGN_MEDIA_MANIFEST.json). Source preparation uses delivery encoding and vector clipping, with no generated athlete. All campaign derivatives are preview-only. An actual disabled-preview production build loaded zero hero photographs and requested no campaign images; the physical release audit correctly rejected 84 preview-only files. This is not a public-release-ready media distribution.

## Validation

Final command logs are preserved under `.agent/evidence/arrival-campaign/checks/`; capture results are in `artifacts/arrival-campaign/validation.json`. Final results on product d46943f: 51/51 unit tests; 194 browser tests passed, 18 existing conditional skips, zero failures; lint, TypeScript and production build passed. All twelve capture scenarios passed. No new skip was added.

Browser execution uses Playwright-managed Chromium by default and managed WebKit. The cloud host requires extracted WebKit system libraries via LD_LIBRARY_PATH; PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS skips only the host dependency preflight. The browsers and assertions actually run. No failing test was disabled. Existing conditional skips remain visible in the full-suite log.

The first integrated run found six failures. Two assertions depended on the old hero's parent DOM or its always-visible action. The others exposed direct-anchor resize and native-focus timing: Chromium could scroll 18px after native player focus and reverse the final state. Pending anchors now reconcile native scroll movement until actual visitor scrolling releases them, and resize refreshes alignment even with reduced motion. Tests retain the direct-anchor/manual-scroll assertions and now verify delayed native focus still has controls and tabIndex 0. Earlier failed logs remain in evidence.

## Visual evidence

Controller inspected the actual desktop and mobile final hero, final film framing and Playoffs placement. The film fits below the header with controls visible and separate from the Watch with Sound action. Playoffs retains the official Coyotes logo left of the desktop heading and above the mobile heading. Coverage differed by scenario. The eight JavaScript motion cases checked initial/mid/final/reverse/resize/release, face/#17 regions, no horizontal overflow, native film controls and Playoffs placement, ran axe on the final homepage, and monitored page runtime errors and HTTP error responses across their visits. The four static cases (desktop/mobile reduced motion and desktop/mobile no JavaScript) checked final text/control bounds and absence of a hero pin only. They did not run axe, monitor runtime/HTTP errors, or visit Film Room/Playoffs. The prior claim that all twelve cases had those checks was too broad. No-JS output cannot establish axe coverage because axe requires JavaScript.

Representative captures:

- [Desktop final](../artifacts/arrival-campaign/desktop-final.png), [mobile final](../artifacts/arrival-campaign/mobile-final.png)
- [Desktop film](../artifacts/arrival-campaign/desktop-film-final.png), [mobile film](../artifacts/arrival-campaign/mobile-film-final.png)
- [Desktop Playoffs](../artifacts/arrival-campaign/desktop-playoffs.png), [mobile Playoffs](../artifacts/arrival-campaign/mobile-playoffs.png)

Independent task reviews required and verified motion/layout/compositing and header focus/accessibility repairs. The separate final critic required a subdued, timed stadium reveal and corrected desktop typography/placement. Fix and scoped re-review reports are in `.agent/evidence/arrival-campaign/`.

## Performance limits

`artifacts/arrival-campaign/performance.json` records actual local lab LCP, CLS and image transfer measurements. Conditions: managed headless Chromium, static local HTTP, isolated cold contexts, DPR1, no CPU/network throttling, observation for 2200ms after fonts. Desktop LCP describes the intentional initial rear-silhouette frame, not completion of the interactive sequence. These are not field, mobile-network, physical-device or thermal results. No zero-CLS or physical iPhone claim is made.

## Controller decisions

- Used the already-selected reference without another design approval gate; a mistaken interpretation remains reversible in this review branch.
- Used existing authentic review crops until the ZIP arrived, then replaced the campaign presentations with supplied sources; the temporary cost was reduced fidelity in earlier candidates.
- Preserved the real sword mark instead of inventing the reference's different lettermark; the cost is a documented visual difference.
- Rejected the background-removal experiment because it changed athlete details; the cost is working within the available source material.
- Used delivery-encoded source pixels in vector silhouettes and faded before the UI-covered lower legs; the cost is encoding loss and an incomplete lower-body silhouette. No missing athlete detail was invented.

Historical isolated lab sample after other browser suites ended (the original CLS collector summed all observed shifts rather than using session windows; its CLS values are not standards-compliant and are superseded by director’s-cut measurements): desktop 1440×900 LCP248ms, CLS0.00760, encoded image bodies669877 bytes; mobile 390×844 LCP304ms, CLS0.00145, encoded image bodies365183 bytes. Transfer totals include response overhead and are recorded separately in the JSON. These samples establish observed local behavior, not a performance SLA.

## Director's-cut collector coverage

The replacement collector writes a separate `artifacts/arrival-directors-cut/full/validation.json`; filtered runs write `filtered/<case>/validation.json` with their own images/videos. A full successful run is required before publishing canonical full-run evidence. Failed runs leave previous published evidence in place. Unknown or unsafe case names fail before browser launch.

Eight motion cases sample each of seven beats at development/hold points, including the three individual montage photographs, then check complete reverse darkness, orientation retention after pin geometry settles, height-only viewport emulation, scrolling into the native Film Room, and Playoffs placement. Desktop 1440×900, mobile 390×844 and touch-enabled WebKit recordings show automated seeks/holds. Touch contexts verify changed layers and real scroll offsets through programmatic scrolling; these are not physical swipe, Safari toolbar, hardware smoothness or authored pacing measurements. The height-only resize records actual before/after progress without claiming the width/orientation progress guarantee.

Motion cases run axe on the final homepage and monitor runtime/HTTP errors across their visits. Two reduced-motion cases check static bounds/no pin, run axe on the homepage and monitor runtime/HTTP errors there. Two no-JS cases check static bounds/no pin and HTTP responses, with runtime-event listeners present but no application script execution; axe is explicitly not performed. Static cases do not claim Film Room or Playoffs coverage. Each JSON entry identifies its actual checks. The controller owns the complete production run and final visual review; focused worker smoke runs do not establish all twelve cases passed.
