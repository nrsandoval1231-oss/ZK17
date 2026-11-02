# Independent whole-branch review — THE ARRIVAL

Reviewed 2026-11-02, branch `feat/arrival-campaign-hero`, HEAD `30d45890006a9d048c44747a10acb0685ef33aa9`, base `910bfa5`.

## Verdict: CHANGES REQUIRED

Two bounded visual corrections are required before claiming the approved composition is implemented. No additional blocking film, media-boundary, navigation, or accessibility defect was found in this review. The controller's integrated validation remains authoritative for the full suite; this review did not run a duplicate build/full suite.

## Required findings

### 1. Important — Stadium subjects compete with Zephyr and bypass the darkness/reveal sequence

Locations: `components/arrival-hero.module.css:32`, `components/use-arrival-hero-motion.ts:17`, `components/use-arrival-hero-motion.ts:32`.

Evidence: `artifacts/arrival-campaign/desktop-initial.png` shows a giant referee and numerous clearly recognizable game figures across essentially the entire opening frame. These are already visible behind the rear silhouette before any scroll. `desktop-final.png` shows the same enlarged referee beside the central athlete, plus players and field lines crossing the headline/composition. Independent screenshots `reviewer-mobile.png` and `reviewer-small.png` also show this competing scene throughout the lower mobile frame.

The stadium layer is permanently at `.32` opacity with `brightness(.55)` and is absent from the timeline's reveal list. Its only timeline participation is the final scale applied to all layers. The brief requires near-black rear-silhouette opening, stadium lighting revealed in Beat 3, and subtle background atmosphere in the final image. This is a visible behavioral and compositional miss, not a limitation of the supplied photos.

Bounded fix: substantially subordinate the stadium photo with opacity/gradient treatment, preserve enough authentic ground/stadium context to support the scene, initialize it near invisible in the enhanced opening, and reveal it to the subdued final treatment with the portrait/world-opening beat. Keep static reduced-motion/no-JS presentation readable and intentional. Do not add a generated background or alter source identity details. Inspect actual initial/final desktop and mobile screenshots; add a focused assertion that the opening stadium state differs from its subdued completed state.

### 2. Important — Desktop statement hierarchy and editorial vertical placement miss the reference

Locations: `components/arrival-hero.module.css:10`, `components/arrival-hero.module.css:21`.

Evidence: in the 1536×1024 `desktop-final.png`, both headline lines have essentially equal letter height and nearly equal rendered width. The first line begins around y582 and the second around y690; identity is around y545 and editorial footer around y980. The documented canonical extraction places MAKE THEM around y513, REMEMBER around y626, identity around y478, and editorial footer around y860; it also specifies the second line is about 25% larger. The implementation gives both spans the same font size, places the copy with `bottom:15%`, and anchors the footer independently at `bottom:4%`. The result has the statement lower than the approved reference and isolates the editorial footer in a large lower gap.

Bounded fix: tune the desktop final composition so REMEMBER. carries the visibly larger second-line emphasis, lift the identity/statement toward the documented reference proportions, and bring the editorial footer into the intended relation with the statement/school line. Retain the requested working film action and bottom scroll cue without collisions. Scope the hierarchy/placement rules to desktop or provide deliberate breakpoint overrides; do not sacrifice the currently fitting 320px, short landscape, or short desktop arrangements. Validate final animated and static frames after the change. Exact pixel identity is neither expected nor claimed, but these large, controllable hierarchy differences should be corrected.

## Positive verification and preserved boundaries

- Read the packaged full branch diff, owner brief, design spec, plan, progress ledger, and controller reference comparison; inspected current implementation and tests. No unrelated film animation edits are present: `arrival-experience.tsx` removes the old hero-only code and mounts `ArrivalHero`; its existing film player, aperture, timeline, cleanup, native controls, and poster fallback remain unchanged. `arrival.module.css` and `lib/cinema-geometry.ts` have no branch diff.
- Independently recomputed SHA256: `public/media/zephyr-cinematic.mp4` remains `a783dcb56f3a11684a3253ddc8c0768035bb8c9d390e0061a29935c20af8965f`; `public/brand/zk17-monogram-512-v2.png` remains `8db76a9993ca32755d1e87a083b2371aa91ef5bd203765b694bae9e881b73593`. Both match the recorded baseline. The actual sword mark geometry is preserved.
- `app/page.tsx` passes no campaign collection when preview mode is disabled. `SiteExperience` independently selects only scene photos in that mode. Every new physical derivative is listed as preview-only in the release manifest, and the existing physical public/export audit is unchanged. Source preparation verifies supplied-file hashes and uses AVIF encoding plus source-coordinate clipping; no generated person or reconstructed anatomy appears in the reviewed preparation code. The controller separately reports an actual disabled-preview runtime check with zero hero images/campaign requests and a public-release rejection of the physical review files.
- Header keeps all nine original destinations and routes. Its film callback uses the real opener; menu focus/inert/resize cleanup and visible-name accessible label have dedicated regressions. The controller reports the final header repair independently passed managed Chromium/WebKit re-review.
- Independent read-only Playwright inspection against the existing server captured 390×844, 320×568, 768×1024, 900×700, and 1536×651 reduced-motion frames. All have no document horizontal overflow; statement remains visible, face and #17 remain recognizable in inspected mobile/small/short-desktop screenshots, and the 900px header boundary fits. Evidence: `.agent/evidence/arrival-campaign/final-review-geometry.json` and `artifacts/arrival-campaign/reviewer-*.png`.
- The hero's matchMedia boundary excludes touch/mobile/short screens, uses a dedicated timeline, initializes hidden controls with autoAlpha, and reverts the context for reduced-motion/cleanup. Existing regressions cover dynamic preference change, reverse/release, no-JS layout, keyboard focus, watch dialog, and viewport fit. Source inspection found no new shared film pin ownership.
- Measured performance evidence candidly reports nonzero CLS and unthrottled local results (current artifact: desktop LCP 3004ms/CLS .00799, mobile LCP 1328ms/CLS .00145). These are lab measurements, not a claim of zero layout shift or field performance. Controller is refreshing integrated evidence.

## Explicit limitations and review scope

The supplied front image has repost graphics over lower legs. The implementation fades before those occlusions; it does not fulfill an unobscured full-body silhouette. A clean original is needed to remove that material fidelity limitation. This was expressly documented in the approved implementation spec and is not a request to fabricate missing anatomy. Low-resolution close-up detail and the authentic sword mark's difference from the reference lettermark likewise must remain transparent in PR evidence.

The owner canonical mockup is not present as a local file in this reviewer context. Candidate screenshots were independently inspected; exact reference position comparison relies on the supplied design specification and controller's documented coordinate extraction. No pixel-diff score or direct independent canonical-image comparison is claimed.

This review made no product edits, no dependency changes, no push/merge/deployment, and no duplicate full-suite/build. It wrote only review evidence and targeted screenshots. Full integrated validation was still in progress when this verdict was recorded. After the two fixes, refresh captures and obtain a focused re-review of both findings plus affected responsive/static/motion cases.
