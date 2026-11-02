# Arrival hero implementation report

Owner: Task 1 implementer (Codex). Base: current feature branch at task start. The controller owns integrated verification, evidence, review and release.

Files: `components/arrival-hero.tsx`, `components/arrival-hero.module.css`, `components/use-arrival-hero-motion.ts`, hero replacement in `components/arrival-experience.tsx`, gated photo prop in `components/site-experience.tsx`, `tests/e2e/arrival-campaign.spec.ts`, and headline assertion in `tests/e2e/site.spec.ts`.

Decision: retain original authentic 706px review crops and use source-preserving masks; no full-body black-uniform source was accessible. The center therefore remains a waist-up portrait, a material fidelity limitation. The collection is passed from the existing preview/approved media gate and accepts replacement sources later. The mark masks the existing approved monogram. Primary image uses eager fetch priority without Next's picture fallback preload, avoiding a redundant preload candidate. Hero animation is an isolated GSAP matchMedia timeline, with a 185% desktop pin and natural mobile/short-viewport scrolling; cleanup responds to motion and viewport changes. Film code remains unchanged except removal of old hero-specific animation and markup.

Validation:
- `npx playwright test tests/e2e/arrival-campaign.spec.ts --project=desktop-chromium --workers=1` before implementation: expected red, old headline was `ZEPHYRKREYE`; the motion/overflow test passed. The server at port 3100 still served the old static build after implementation, so no post-change browser result is claimed. Controller will rebuild and validate.
- `npx tsc --noEmit` passed after implementation.
- `npx eslint components/arrival-hero.tsx components/use-arrival-hero-motion.ts components/arrival-experience.tsx components/site-experience.tsx tests/e2e/arrival-campaign.spec.ts tests/e2e/site.spec.ts` passed after implementation.

Remaining: integrated browser checks, visual evaluation, motion/pin transitions and rights-gated public mode verification are controller-owned. No production build, full suite, push, merge or deploy performed by this worker.

## Repair round 1

Read all six Important findings in `hero-task-review.md`. Replaced the mobile/touch scrub with the complete static frame and require both hover and a fine pointer for desktop pinning. Hero height now accounts for the existing wrapper's responsive header padding, including 320×568. The enhanced desktop frame initializes every portrait, detail and headline line before the scrub timeline; the first frame emphasizes the rear crop. GSAP matchMedia restores styles and pin when preferences or input/viewport conditions change. Radial masks soften secondary crop edges, the approved mark has more unobstructed space, and a source-coordinate polygon isolates the authentic arrival crop while preserving original pixels. Other approved photos use a generic soft mask rather than an arrival-specific polygon.

Regression evidence: before repairs, `npx playwright test tests/e2e/arrival-campaign.spec.ts --project=desktop-chromium --workers=1` against the controller's febf184 build failed as expected for mobile viewport fit (footer bottom 874.25 at 844px), touch tablet pin, and initial rear/portrait opacity; three other tests passed. Added active-pin-to-reduced cleanup, mobile/no-JS viewport bounds, touch tablet, initial sequence and disabled-photo fixture checks. After repairs, `npx playwright test tests/e2e/arrival-campaign.spec.ts --project=desktop-chromium --grep 'unpublished photo fixture' --workers=1` passed using a freshly bundled real component, confirming no preview photo requests. `npx tsc --noEmit` and scoped eslint (same files as above) passed. The remaining new browser regressions require the controller's rebuilt server for green verification; no post-repair integrated green is claimed here. Visual crop and mark legibility also require controller review after rebuild.
