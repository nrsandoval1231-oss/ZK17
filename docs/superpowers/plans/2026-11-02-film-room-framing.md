# Film Room framing implementation plan

**Goal:** Preserve the second story scene and opening choreography, resolve the film into an uncropped native player, and correct desktop Playoffs logo placement.

**Architecture:** Keep one video element and the existing ScrollTrigger owner. Use the official monogram alpha as the aperture; append a contained-player zoom-out and hold before pin release. Reserve the viewing box in CSS and compute cover scale from native video metadata. Reduced motion uses the static final state.

**Constraints:** No homepage relocation, redesign, replacement branding, media transcoding, or merge.

- [ ] Add browser regression coverage for final contain framing, usable controls, and logo placement; reproduce failures.
- [ ] Update arrival component and its scoped CSS; preserve opening timings and playback position.
- [ ] Add desktop-only Playoffs grid placement without changing mobile.
- [ ] Validate full scroll, reverse scroll, resize, reduced motion, desktop 1440/1920, tablet and phone; inspect screenshots.
- [ ] Run lint, typecheck, unit suite, build and browser regressions; record evidence and open an unmerged PR.
