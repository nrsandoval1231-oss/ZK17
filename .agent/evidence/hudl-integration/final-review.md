# Independent integrated-candidate review

Verdict: READY FOR REVIEW-ONLY PR, with the upstream accessibility finding retained. No outstanding material defect found in the owned integration after repairs. This is not an all-checks-green result, owner visual approval, merge approval, or deployment approval.

Reviewer: separately dispatched Astra critic. Reviewed product commit: 57e2b812da0939a5509562b5d86d1ff6c5681be6, baseline e2820d3, branch feat/cinematic-opening-refinement. Scope: official Hudl integration and exact header WATCH FILM removal; stable field pin lifecycle; removal of the later montage monogram while retaining the cold open; additional color photo while preserving existing photos and duration; transparent white Film Room logo. Reviewer edited this report only.

## Open finding and uncertainty

- P2, upstream accessibility: final-e2e.log lines 239-268 report serious aria-prohibited-attr inside the real Hudl iframe. Its focusable div.jwplayer has aria-label="Video Player" without a valid role. Host iframe title is correct. The cross-origin document is not editable by this integration. Existing axe assertion remains intact; no exclusion or waiver was introduced. Full-page accessibility cannot be certified clean.
- Third-party diagnostics: final screenshots record desktop report-only CSP messages for Google IMA/ad-quality frames and DNS failures. A separate reviewer run captured request/console origins and traced reproduced DNS failures to securepubads.g.doubleclick.net and pubads.g.doubleclick.net; report-only CSP explicitly takes no blocking action. An earlier capture contained bare ZH strings without origin/stack; those did not reproduce and their exact origin remains unknown. Reviewer desktop/WebKit playback runs collected zero page errors, which does not establish an all-console-clean result.
- Physical iPhone playback, fullscreen and PiP remain UNKNOWN. Chromium native fullscreen was exercised successfully; PiP permission presence is verified, actual PiP operation is not. Owner visual approval remains outstanding.

## Resolved findings

- Initial photo replacement corrected: existing running photo retains its original source, position and .76 reveal. The new color photo is additional, separately positioned and reveals at .82-.89. All original montage photographs remain; timeline duration and pin distance are unchanged.
- Initial hardcoded preview bypass corrected: new photo comes from the existing campaign collection and preview filtering. PREVIEW_MEDIA_MANIFEST.json includes its output and original SHA-256 with review-only usage and no invented final-release rights approval. The previously failing media-boundary unit test now passes.
- Initial sharp rectangular edges refined: the foreground image uses top/horizontal feather masks over a separate blur(6px) layer. The athlete has no blur filter. Final desktop, portrait and landscape screenshots were inspected; background edges blend while the athlete and older running image remain visible. This is edge softening, not a claimed semantic athlete cutout.
- New test's invalid CSS-module .blackLogo locator corrected to stable image/parent lookup.
- Stable native field spacer remains in actual source. Fresh final real-player runs preserve the iframe document across responsive changes, captured image loads and reduced-motion changes. No recurrence of the earlier reparent/reload failure was observed.

## Verification

Read actual final source/test diff and current logs, inspected regenerated screenshots, and ran fresh real-browser checks against localhost:3100 after the final mask refinement. Builder summaries were not treated as verification.

- final-build.log: successful static build and TypeScript build step. final-lint.log and final-typecheck.log: no errors. final-unit.log: 62 passed, zero failed, including preview-distribution protection. git diff --check: no errors.
- final-focused.log: 40 passed after the final mask change. Covers directors-cut progression, cinema framing, new photo/logo behavior and Hudl layout/lifecycle across all four configured projects.
- final-e2e.log: the full suite immediately before the final mask-only CSS refinement completed 188 passed, 7 conditional skips, 1 failure (upstream axe issue above). This is historical evidence for the preceding candidate, not a claim of a fresh full-suite pass for the final candidate. Post-change affected checks and fresh runtime checks support the final CSS refinement.
- Fresh final desktop Chromium (1440x900) and iPhone-sized WebKit (390x844): new image loaded at natural width 540; foreground filter none; background blur(6px); both feather masks active; old running opacity .72; later monogram count zero; cold logo returns to .9 on reverse scroll; no horizontal overflow or page errors. Pin travel measured 2160 and 1350.001 pixels, preserving desktop/mobile ratios. Earlier same-integration checks confirmed header hidden during intro/reverse and visible after Skip.
- Fresh final real Hudl playback: desktop time advanced .313895 -> 1.082339, WebKit .395125 -> 1.1236042, remaining unpaused with the same reviewer-set iframe document marker after landscape resize, captured image-load refresh and reduced-motion activation. These were real vendor players, not the deterministic layout fixture.
- Separate Chromium fullscreen check: parent document.fullscreenElement was IFRAME; child JW player had jw-flag-fullscreen. It preceded only the hero mask refinement, which does not touch player code. An immediate observation before the asynchronous fullscreen transition settled returned null; waiting confirmed actual fullscreen.
- Inspected regenerated final-screenshots/desktop-statement.jpg, iphone-webkit-statement.jpg and landscape-webkit-statement.jpg. Final captures preserve existing photos, headline and separate hero action, with later monogram absent.
- Canonical white PNG independently decoded: 512x512 RGBA, 217923 fully transparent pixels, 44221 white nontransparent pixels, zero nonwhite nontransparent pixels. Film Room CSS removes blackening, background and padding.
- Original photo hash independently matches manifest d9db62797ecbac643f5dbd7a6a952742192c121f856337c954957a9b7539061d. PNG and WebP are both 540x474 RGB. Mean absolute decoded channel difference is 1.684/255, consistent with the supplied photo's lossy WebP conversion.

## Final candidate identity

Commit verified directly: 57e2b812da0939a5509562b5d86d1ff6c5681be6. Final arrival-hero.module.css SHA-256: 33a925ec2bc6961981b5537c1d733542b40ee3ccdbfc16dfc1cc5117eaaa5482.

Reviewer aggregate fingerprint: cda7f3fd895f3cd6ca4c04b8da3f92110cb7f2987f3376974f1b12475970447d. Computed as SHA-256 of JSON for sorted [relativePath, fileSha256] pairs covering 16 files: app/globals.css; six changed components (arrival-hero.module.css, arrival-hero.tsx, arrival.module.css, site-experience.tsx, use-arrival-hero-motion.ts, use-story-motion.ts); content/arrival-campaign.ts; content/site.ts; docs/PREVIEW_MEDIA_MANIFEST.json; public/media/zephyr-color-action.webp; five E2E specs (arrival-directors-cut, cinema-framing, completion, hudl-highlights, final-cinematic-edits).

No merge or deployment performed by reviewer. Ready for owner review with upstream failure and device limits stated plainly.
