# THE ARRIVAL campaign review evidence

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

Controller inspected the actual desktop and mobile final hero, final film framing and Playoffs placement. The film fits below the header with controls visible and separate from the Watch with Sound action. Playoffs retains the official Coyotes logo left of the desktop heading and above the mobile heading. Capture assertions also cover initial/mid/final/reverse/resize/release, face/#17 regions, no horizontal overflow, native controls, reduced/no-JS fallbacks, zero axe violations and zero runtime/HTTP errors across twelve scenarios.

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

Final isolated lab sample after other browser suites ended: desktop 1440×900 LCP248ms, CLS0.00760, encoded image bodies669877 bytes; mobile 390×844 LCP304ms, CLS0.00145, encoded image bodies365183 bytes. Transfer totals include response overhead and are recorded separately in the JSON. These samples establish observed local behavior, not a performance SLA.
