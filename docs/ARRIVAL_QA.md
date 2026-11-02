# THE ARRIVAL — implementation and review

## Scope and source
Continues draft PR #5 on `feature/athlete-showcase-every-second-20261101`, starting at `4ca5d0d3c26ee01f16d8eb0c0f67189412133f2f`. The supplied ZK17 workspace held deployment reports; the existing clean Git checkout was `C:/Users/nrsan/Documents/Codex/2026-10-25/zk17-master-build-directive-the-official`. All existing Next App Router pages, shared components, media schemas, preview/release guards and GSAP hook were inspected. Film Room and Journey are homepage anchors; `/playoffs/` and `/recruiting/` are standalone routes. Existing interests were retained from current source, rather than older notes.

## Experience
`ArrivalExperience` owns the authentic portrait, editorial name, jersey identity, light sweep, depth motion, and expanding SVG 17 aperture. A single deferred muted video continues beneath the film headline. Desktop has a bounded ScrollTrigger pin; mobile uses a natural, unpinned range. Every Second Counts resolves to a native sound-enabled player on explicit user action. The approved mark remains the existing asset. On Field, Journey, personal interests, gallery, verified numbers, next chapter and contact remain available. No commitments, statistics or contact destinations were invented.

Motion uses scoped GSAP contexts and matchMedia cleanup. Reduced motion keeps a static poster and accessible film action without background video loading. An IntersectionObserver and visibility/motion listeners control background playback. No scroll event React state or scroll hijacking was added. Native anchors receive a one-shot geometry correction after pin measurement; arbitrary scrolling remains native.

## Media integrity and performance
The original tracked `public/media/zephyr-cinematic.mp4` is unchanged: SHA256 `a783dcb56f3a11684a3253ddc8c0768035bb8c9d390e0061a29935c20af8965f`, 18,368,268 bytes. No watermark-removal/transcoded version was created or substituted. Native controls preserve access to the source presentation. The 18.4 MB original remains a meaningful mobile transfer cost once approached; this scope preserves its bytes and uses deferred loading rather than transcoding. Responsive portrait sources, explicit dimensions and a persistent poster support early rendering. Browser playback progression, no pre-approach video request, and overflow are checked in retained evidence. No measured FPS, physical-device smoothness or Lighthouse score is claimed.

Photographs retain their existing `PREVIEW CROP / ORIGINAL PENDING` disclosures. Existing release/media evidence gates remain unchanged; this candidate is for review, not unrestricted production release.

## Failures and repairs
The first component pass did not implement a working scroll portal; it was rejected before acceptance. Initial browser run: 83 passed, 12 skipped, 9 failed. Repairs addressed the zero-length mobile animation range, explicit Safari opener focus, pin-aware native anchors, and unsupported cross-browser test assumptions. A newly exercised existing Playoffs pointer-focus defect was fixed without altering tournament data. Second suite: 90 passed, 16 skipped, two mobile closed-menu query failures. Independent screenshot review also found the desktop watch action clipped by CSS/GSAP centering interaction; flex centering replaces that conflict. Earlier evidence is retained and does not certify the repaired candidate.

## Final evidence
Final build/check logs are under `.agent/evidence/arrival/`; final screenshots and playback/axe audit are in `artifacts/arrival-approved/`. Independent final review is `.agent/ARRIVAL_FINAL_REVIEW.md`. Final test counts and immutable Cloudflare preview receipt are recorded in the current-state record and PR once verified.

## Remaining approval boundary
No merge or production deployment is authorized by passing local tests. Physical iPhone Safari smoothness and the owner's creative approval remain outstanding. Preview publishing follows independent validation only. Contact/social destinations and additional verified athletic records remain governed by existing evidence gates.

Final local validation: production build (`build-final2.log`), TypeScript, ESLint and all 29 unit tests passed. Full Playwright matrix: 96 passed, 16 intentional project/browser skips, zero failures (`e2e-final2.log`, 42.7 seconds). Skips cover project-specific scenarios and unsupported WebKit clipboard permission success; the WebKit selectable-address fallback runs and passes. The matrix includes Chromium desktop/mobile, iPhone 13 WebKit and reduced motion. Four final screenshot audits report no Axe violations, runtime errors or horizontal overflow; original muted film playback advances in every capture, with zero requests before approach. Final images: `artifacts/arrival-approved/`.
