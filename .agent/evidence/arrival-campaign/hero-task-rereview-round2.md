# Task 1 scoped re-review — repair round 2

Reviewer: Codex (GPT-6 agent; no independent version measurement). Date: 2026-11-02. Scope: round 2 implementation at commit 74b60b0, current controller-owned campaign assets and provenance manifest, and the repaired static server at port 3100. The source-photo availability constraint has changed: the newly supplied originals are now accessible and were inspected.

**SPEC: CHANGES REQUIRED. QUALITY: CHANGES REQUIRED.** One remaining Important compositing/presentation finding. No Critical finding. Landscape fit and invisible keyboard focus are fixed.

## Open finding dispositions

### Prior #3 — clean compositing and central presence: NOT ADDRESSED completely

Central presence is substantially improved: the authentic front figure now fills the tall desktop anchor (measured near-final layer y122.99–950.57 at 1536×1024) and the face/#17 are recognizable. The former angular black halo is gone. The canonical ZK/sword is recognizable behind the subject, including on mobile. These parts are addressed.

The remaining **Important** issue is the presentation of missing source regions. `public/media/arrival-campaign/front-640.svg:1` masks three original repost overlays as circular alpha exclusions, and `components/arrival-hero.module.css:15–19` shows the entire result without a concealment fade/crop. In the desktop final composition, two large circular background holes interrupt both knees and leave separated shins/feet below; the same disconnection is prominent at 390×844 and 320×568. This is an honest source limitation, not invented pixels or a mistaken allegation that the source was damaged by implementation: I viewed source-01.jpg and confirmed those regions are obscured in the upload. However, displaying the holes as the main figure's silhouette does not satisfy clean professional compositing. Conceal unavailable regions with an appropriately placed dark fade/crop or overlapping composition, preserving face/#17 and the current figure scale. Do not reconstruct missing legs.

The left close-up also ends in a conspicuous oval edge beneath the chin, reading as a floating detached helmet/head. `components/arrival-hero.module.css:15,17` removes soft masks from campaign layers. A restrained side/lower fade would integrate this source into the dark background while retaining the authentic face. This is part of the same compositing finding, not a request to change the approved composition.

Evidence: `/tmp/hero-r2-desktop-motion-end.png`, `/tmp/hero-r2-mobile-static.png`, `/tmp/hero-r2-small-static.png`, `/tmp/hero-r2-landscape.png`.

### Prior #4 — short landscape copy/action clipping: ADDRESSED

At 844×390 the new compact layout (`components/arrival-hero.module.css:27`) fits all primary content inside hero y64–374. Measured headline y197.5–278.5; school y283.5–297.5; watch y303.5–327.5; footer y350.70–364.70. No overlap between watch and footer. Clicking the actual watch button opened the Film room dialog. Portrait 390×844 and 320×568 also fit; a separate 320×568 no-JS capture was inspected. Face/#17 remain visible.

### Prior #7 — invisible keyboard focus on unrevealed controls: ADDRESSED

`components/use-arrival-hero-motion.ts:23,33` now uses autoAlpha. On initial desktop, the unrevealed controls have visibility hidden and are skipped by sequential keyboard focus. A real 24-Tab probe found zero hero controls focused with opacity 0 or nonvisible visibility. Static and reduced-motion controls remain visible. No invisible-focus regression observed.

## Additional scoped checks

- Desktop pin holds the hero below header clearance: initial and near-final measured hero top=96, bottom=1024 at 1536×1024. Active-pin resize was separately probed at scrollY800 to 1440×900; the hero remained pinned at y96 with bottom900 after resize. No header overlap observed in desktop final screenshot. At scroll positions beyond the resized sequence end, normal release is expected.
- Dynamic reduced motion after the desktop final beat removes the spacer and restores athlete/headline opacity 1 and transform none. Mobile uses the immediate complete static frame. Touch 1024×768 has no hero pin.
- No document horizontal overflow measured at 1536×1024, 768×1024, 390×844, or 320×568. No-JS desktop and 320px compositions render.
- Source photos 01, 08 and 10 were visually inspected and compared with their displayed subject identities. All five source hashes in `docs/ARRIVAL_CAMPAIGN_MEDIA_MANIFEST.json` matched their local originals. SVG inspection shows an embedded AVIF image and coordinate mask paths; no reconstructed athlete detail was found. Compression equivalence was not scored or treated as byte equality.
- `app/page.tsx:8` supplies campaignPhotos only in preview mode; SiteExperience likewise excludes campaign and preview collections when preview mode is disabled. Source review finds no new public-mode leak. Campaign files remain explicitly preview-only/rights-pending in the manifest. A separate disabled-preview production build was not run here.
- Round 2 does not change ArrivalExperience film logic or its existing primary photo/poster input. Canonical mark geometry continues to come from brand.monogram.src. No unrelated route change found in the scoped source diff.
- New test cases cover landscape layout, sequential keyboard focus, and unobstructed static watch actions. I did not run the controller's targeted test suite and do not claim its outcome.

## Evidence and limits

Standalone Node/Chromium scripts: `/tmp/hero-task-r2-review.cjs`, `/tmp/hero-r2-extra.cjs`, and inline landscape/watch/Tab/resize probes. Captures: `/tmp/hero-r2-*.png`. Reviewed requested desktop final 1536×1024, mobile 390×844, small mobile 320×568, and landscape 844×390, plus tablet, no-JS, reduced motion and dynamic cleanup. No implementation edits, asset changes, build, full suite, push, merge or deployment. No WebKit/physical-device/performance claim. Header design remains Task 2 and is excluded from this verdict.
