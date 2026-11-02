# Arrival extended director’s cut — review record

This revision follows [the owner’s director’s-cut brief](ARRIVAL_DIRECTORS_CUT_BRIEF.md) on PR #9, branch `feat/arrival-campaign-hero`. It supersedes the earlier short hero and static touch presentation. This is a review preview, not a production release.

## Choreography and photographs

The introduction uses seven scroll-directed beats: darkness, sequential stadium lights, layered smoke, silhouette, authentic standing portrait, individual supporting photographs, and the final statement/hold. The pin spans approximately fifteen stable viewport heights. Header branding remains; the sword does not appear in the cinematic sequence. Reduced-motion and no-JavaScript visitors receive a static composition.

The source list and exact crop coordinates are recorded in [the media manifest](PREVIEW_MEDIA_MANIFEST.json). The standing portrait comes from `zephyr_cinematic_bw_01.png`, the black-uniform rear view from `zephyr_cinematic_bw_03.png`, the white-uniform rear view from `zephyr_cinematic_bw_08.png`, and the action photograph from original `source-11.jpg`. Derivatives are generated separately; original assets are not overwritten. Smoke is a procedural texture, not a generated photograph or athlete.

The verified action source depicts carrying/walking with the ball, not the running pose in the supplied visual benchmark. The four-portrait composite and earlier reference-derived running crop are not used as likeness sources for this sequence. Other supplied frames are omitted to keep the montage focused and avoid obstructing social-media overlays. The standing source includes an overlapping teammate; treatment must preserve Zephyr’s actual anatomy rather than reconstruct hidden details.

All new photo derivatives remain `preview-only`, with rights pending. A public production release is blocked until the documented media approval/distribution requirements are met. An image-free export is not an acceptable substitute for approval.

## Validation status

Product candidate: `e1acea9`. Independent task reviews and the scoped whole-branch re-review passed after repairs to rotation, all photo frames, pre-hydration darkness, and native WebKit keyboard readiness. The earlier full-run native-player failure was investigated: transient backward scrolling into the aperture removed focused shadow controls. An explicit keyboard hold now preserves an already-ready player until real external focus or manual scrolling releases it. Eight repeated WebKit traversals passed under two-worker load alongside sixteen loading/fallback/focus checks. A later full-run reduced-motion resize failure exposed a second timing issue: the window resize event could precede final CSS stage geometry. Observing the film stage’s settled size fixed it without relaxing the framing test. The latest full cinema run passed 34 checks with two existing viewport-specific skips; six rapid resize probes and both late-layout fixtures passed.

Unit tests: 56/56 passed. Lint, standalone TypeScript checking, and the production build passed. Final full browser run on test harness `bbd4f6b`: **270 passed, 18 existing conditional skips, zero failures** (5.1 minutes). The unchanged skips cover browser-specific clipboard, motion-specific, arcade and desktop-only placement cases; no failing test was skipped. The final reverse fixture uses the same explicit instant seek and bounded measured timeline convergence as forward scrolling, retaining every darkness assertion.

The refreshed canonical capture passed **all twelve cases**. Eight motion cases each include eighteen development/hold samples, all three montage photographs, reverse darkness, orientation, height-only viewport emulation, Film Room handoff/framing, and Playoffs. Two reduced-motion and two no-JS cases cover the static composition. Axe ran on eight motion and two reduced-motion homepages with zero violations; it did not run with JavaScript disabled. Every case records runtime/HTTP monitoring and exact coverage. Static cases do not claim Film Room/Playoffs checks.

The controller inspected current desktop/mobile story sheets, film framing, Playoffs placement and mobile reduced motion. Three valid VP9 browser recordings are retained. See [capture index](../artifacts/arrival-directors-cut/README.md), [canonical validation](../artifacts/arrival-directors-cut/full/validation.json), and [verification logs](../.agent/evidence/arrival-directors-cut/checks/).

All four selected source hashes were matched to exact entries inside the uploaded archives. All seven protected pre-existing asset hashes, including the original MP4 and header monogram, remain unchanged. The public distribution audit was deliberately run with public-release flags and correctly rejected the preview-only files with exit code 1. Evidence is under `.agent/evidence/arrival-directors-cut/`.

Touch-enabled WebKit with programmatic scroll offsets can verify that scroll position drives the sequence. It does not establish physical iPhone swipe behavior, Safari browser-chrome behavior, or device performance. Viewport resize/orientation emulation must be labeled separately from physical address-bar testing.

## Owner visual review

- Scroll slowly from darkness through all seven beats, then reverse through the sequence.
- Check that Zephyr’s face and number remain the focal point and that image edges dissolve into smoke.
- Rotate a physical phone mid-sequence and test Safari’s expanding/collapsing address bar.
- Follow Watch the Film and direct Film Room links; verify native video controls and comfortable framing.
- Open Playoffs and confirm Anna branding and navigation.
- Approve the photographic treatment and resolve media rights before any production release.


## Measured sample

After browser/capture work ended, isolated managed Chromium contexts measured the initial dark opening over 2200ms after fonts, without CPU/network throttling: desktop 1440×900 LCP188ms, session-window CLS0.0012601, image bodies430836 bytes; mobile390×844 LCP128ms, CLS0, image bodies367918 bytes. Both samples had story progress0 and lights opacity0. The LCP element was an image (header/initial visible content), not the completed portrait reveal. These are local lab observations, not field performance or physical-device guarantees. [Raw measurements and conditions](../artifacts/arrival-directors-cut/performance.json).

## Review status and harness

Independent implementation-task reviews, the whole-branch repair re-review, and the settled-layout/test-harness amendment review passed. Reports are in `.agent/evidence/arrival-directors-cut/`. Two existing implementation workers were reused after fresh-agent startup failed; each received a bounded task brief and independent review. The cost of that harness ruling was possible inherited-context contamination, checked through explicit scope and fresh evidence. The workspace and evidence are retained for owner review.

The same PR #9 branch will publish through its existing Cloudflare review integration. Live deployment verification is recorded separately after publication; no merge or production promotion is authorized.
