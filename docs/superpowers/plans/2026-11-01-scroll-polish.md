# Cinematic scroll polish Implementation Plan

**Goal:** Execute the owner’s ZK17 master builder prompt V2 without changing the approved visual identity.
**Architecture:** Reuse GSAP/ScrollTrigger in a scoped motion hook. Native scrolling, responsive matchMedia, static reduced-motion fallback. Server-side verified-content gates stay authoritative.
**Tech Stack:** Existing Next.js static export, React, GSAP, Playwright.
**Spec:** Owner master builder prompt V2; docs/PRODUCTION_COMPLETION_AUDIT.md.

## Global constraints
Preserve sword logo, palette, typography, hero, all eight chapters, arcade controls and contact. No new motion dependency, fabricated facts, copied reference assets, public deploy or merge.

## Review focus
- Deep links/back navigation must leave content readable, including after pin measurement.
- Dynamic reduced-motion and viewport changes must remove pins and inline transforms.
- Sparse media must retain usable dialog and snapshot; no autoplay audio.
- Font/image/filter layout changes must refresh measurements without duplicate triggers.
- Keyboard navigation must reach gallery, snapshot and arcade without scroll interference.

## Tasks
- [ ] Capture reference/browser observations and baseline screenshots, recording and comparable mobile lab measurements. Preserve evidence limits.
- [ ] Add regression tests for snapshot navigation/copy/contact, pin release/mobile overflow and film deep links. Run against baseline to establish missing behavior.
- [ ] Extract existing motion into components/use-story-motion.ts. Choreograph hero layers; one bounded On Field timeline; progressive Film Room lines/frame/captions; playful diptych/retain arcade rail; extending journey/milestones; verified stat row reveals; restrained Next Chapter depth. Refresh after fonts/images and data-layout changes; revert on cleanup.
- [ ] Complete existing recruiting route using shared tokens/editorial typography and reusable verified facts. Add navigation and share/copy with honest fallback. Add film hash links and user-initiated native video with focus restoration.
- [ ] Run npm ci/typecheck/lint/test/build/e2e plus desktop/mobile/reduced-motion browser QA, console/a11y/layout checks. Capture final screenshots and recordings; comparable lab measurements (no field CWV claim).
- [ ] Review diff, incremental commits, push existing PR branch only after checking deployment hooks; update draft PR with evidence, tests and remaining media/physical-device limitations.

Execution: same session, as explicitly requested by owner; no further design approval round.
