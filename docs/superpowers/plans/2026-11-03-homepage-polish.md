# Homepage Cinematic Polish Implementation Plan

**Goal:** Implement the owner-approved supplied mockup within the existing homepage, preserving Arrival, Every Second Counts, identity, content gates and dedicated routes.
**Architecture:** Keep existing opening and Header. Replace homepage chapters 03–06 with focused editorial components, a four-metric verified season adapter, native scroll-snap photography, compact PLAYER17 and a combined closing/footer. No new routes, dependencies or deployment.
**Spec:** Owner's supplied six-section brief and attached visual reference, 2026-11-03.

- [x] Capture existing desktop/mobile homepage before changes.
- [x] Test statistics adapter: 2026 season totals require verified passing+rushing components; reject duplicate metrics, differing game scopes and undefined rating calculations. Empty content produces four unavailable states.
- [x] Implement sections in exact sequence; remove timeline markup, props, spacers, styles and GSAP. Preserve milestone records in content.
- [x] Reuse existing photographs under existing approval/preview gates; disclose missing lifestyle/smiling originals. Never generate likenesses. Keep PLAYER17 choices functional in compact inline presentation.
- [x] Implement photo rail with native touch scrolling, snap, keyboard selection, accessible pagination, active depth and reduced motion. No autoplay or scroll hijacking.
- [x] Combine closing scene and footer with canonical mark and verified contacts; no commitment claims.
- [x] Update DESIGN.md and PRODUCT.md; run typecheck, lint, full unit suite, build and relevant browser tests.
- [x] Capture 375/390/430/768/1024/1440 widths, touch/keyboard/mouse, WebKit and reduced motion; inspect screenshots against supplied reference. Record limitations and missing assets.
- [ ] Commit on feature branch, push, open owner-review PR with evidence; do not merge/deploy.
