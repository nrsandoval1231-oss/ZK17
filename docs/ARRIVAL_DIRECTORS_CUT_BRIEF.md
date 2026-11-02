# ZK17 — THE ARRIVAL: Extended Director's Cut

## Objective
Revise existing open PR #9 in `nrsandoval1231-oss/ZK17` on its current feature branch. Do not start a parallel implementation, merge, modify production, or deploy to production. Replace the current rushed/static-on-iPhone Arrival hero with a slow, immersive, seven-beat scroll-directed cinematic introduction. Preserve existing Film Room (original MP4, native controls, framing), Playoffs tab and Anna logo placement, navigation, accessibility, and site functionality.

## Canonical owner direction
- Start completely black. Build tension slowly over multiple scroll gestures per beat.
- Then ignite massive stadium lights across the entire screen; controlled bloom, no dangerous strobe or rapid flashing.
- Then rolling, layered smoke across the viewport.
- Then a mysterious silhouette of Zephyr.
- Then the authentic standing hero portrait revealed from the smoke.
- Then introduce other authentic photographs ONE AT A TIME, with slow layered transitions; particularly use the approved running-photo treatment as the quality reference: athlete sharp, surrounding environment dark/soft, lower edge dissolving into black and smoke.
- Finish with the bold statement **MAKE THEM REMEMBER.** and a slow pullback/hold before the existing Film Room.
- Remove the sword logo from the *cinematic sequence* entirely; keep normal header branding.
- Monochrome black-and-white images, deep blacks, subtle restrained purple highlights, soft backgrounds, cinematic grain and smoke. Do not make every scene identically monochrome if the approved running photo uses restrained purple. Preserve Zephyr's actual appearance and uniform. Do not synthesize his likeness or invent missing legs, hands, faces or other anatomy.
- Do NOT attempt poor automatic full-body cutouts. Use source-photo crops, localized background blur/soft focus, black gradients, masks and smoke to conceal awkward photo boundaries. Avoid accidentally featuring other athletes as Zephyr. Reuse the uploaded assets without unnecessary editing or damaging the originals.

## Proposed story timeline — tune creatively but keep sequence
1. **TOTAL DARKNESS** — ~2 viewport heights. Start true black. Almost invisible grain and the faintest stadium detail near the end. No athlete/logo/early title.
2. **LIGHTS ON** — ~2 viewport heights. Stadium lamps power on sequentially with broad white beams and transient tasteful bloom; then settle, no flashes/strobe.
3. **SMOKE ROLLS IN** — ~2 viewport heights. Atmospheric smoke in multiple depth planes drifts across the entire screen, slowly occluding and revealing light shafts.
4. **SILHOUETTE** — ~2 viewport heights. A nearly black outline of Zephyr appears through smoke; hold before revealing identity. Make silhouette from an authentic existing photo, not generated anatomy.
5. **HERO REVEAL** — ~2–3 viewport heights. Slowly reveal the real standing #17 portrait, with deliberate lighting and a subtle camera push. Portrait dominates, but crop is intentional and flaws/overlaps fade into black.
6. **LEGACY MONTAGE** — ~3 viewport heights or more if needed. Bring in running shot and supporting real photos individually, each with its own time to breathe and mild depth/parallax. Avoid a collage that appears all at once. Preserve clear focal hierarchy.
7. **MAKE THEM REMEMBER.** — ~2 viewport heights. Slow camera pullback, smoke parting, text resolves. Hold the final composition and then unpin smoothly into the *existing* Film Room without jumping, overscaling the MP4, or trapping keyboard focus.

These are **scroll distances, not timed autoplay durations**. Total target ~15–16 viewport heights, adjustable after real-device review. Each beat should have a beginning, development, and hold, rather than completing on one wheel tick. Respect the user's agency: reverse scrolling reverses the scene without glitches; momentum and fast-scroll do not leave broken states. Avoid physically enforcing a count of mouse-wheel swipes (different devices emit different deltas).

## iPhone and mobile — non-negotiable
The existing PR explicitly makes touch devices static. That must change. Implement true scroll-driven progression on iPhone Safari and modern Android, with adaptive choreography and optimized asset sizes. Prefer GSAP + ScrollTrigger with transform/opacity 2.5D depth layers (translate3d/scale), not heavy WebGL or a general 3D engine. Do not rely on hover, fine-pointer detection, wheel-only listeners, autoplay video, or desktop viewport assumptions. Avoid scroll jank, rubber-band snapping, pin-spacing jumps, orientation bugs, zoomed-out/oversized faces, horizontal overflow, and Safari dynamic-toolbar layout errors. Use appropriately chosen stable viewport sizing and ScrollTrigger.refresh on orientation/resize. Mobile can reduce layer count, blur and particle density, but **must still animate all seven beats through scrolling**. Test a real or emulated iPhone WebKit scrolling interaction; verify scrolling moves the story rather than only rendering a static poster.

## Assets and visual fidelity
Inputs from owner to be attached by builder:
- `Zpics_Cinematic_BW.zip`: existing black-and-white photos, originals are valuable and must remain unchanged.
- The owner's *approved running-shot reference image* (`image(20261102-155317).png` if available): composition/lighting benchmark, not necessarily a verified source for reconstructed photo details.
- If available `Zpics.zip` original source archive to improve crop precision or background softness without degrading faces.
Do not use `arrival_cutouts_DRAFT.zip` or any AI-created four-portrait composite as production likeness assets. Use strong existing photo frames (e.g., standing #01/#09, running/other candidates assessed against actual files); verify athlete identity for each crop. Where Instagram overlays obscure original content, crop or fade them into black; do not hallucinate hidden anatomy.
Deliver optimized WebP/AVIF and suitable fallback assets as permitted by existing repo conventions; ensure the actual production distribution path is authorized and working. PR #9 QA explicitly says preview-only campaign photos are blocked from public release: fix or document a valid release-ready media route, do not bypass the safeguard or silently ship an image-free production build. If media rights/approvals are unresolved, keep PR in review and explicitly flag the blocker.

## Engineering constraints
Keep functionality isolated and avoid needlessly rewriting the rest of the site. Ensure header and nav function at every beat. Protect scrolling and focus for native Film Room controls and anchors. Focus must not be recentered on pointer/programmatic focus; keyboard navigation must remain visible. Respect `prefers-reduced-motion` with a polished static composition and immediate access to the Film Room. Provide a no-JS fallback. Smoke should be lightweight layered image/gradient animation, preferably pre-rendered textures; do not create a GPU-heavy particle simulation. Use pointer-events:none on visual overlays. Avoid excessive blur filters on mobile and ensure readable contrast for all text. Avoid CLS and preload only critical first-beat media.

## Review findings to address before merge
Five unresolved CodeRabbit findings on PR #9: focusin recentering should be keyboard-Tab-specific; make capture-coverage claims accurate; filtered captures must not overwrite canonical twelve-case validation evidence; CLS measurement must follow largest session-window scoring; metric collection must reject error pages and verify presence of campaign hero. Independently verify each still applies at current head before fixing. Re-run independent review on current HEAD (prior Codex review was against an earlier commit).

## Deliverables and acceptance criteria
1. Implement on PR #9 feature branch; push commits updating the same PR. No automatic merge or production deploy.
2. Produce desktop 1440x900 and mobile iPhone 390x844 screenshots/video captures of beginning, every beat midpoint/hold, final title, transition into Film Room, plus reverse-scroll and reduced-motion cases.
3. Verify true touch scroll progression in WebKit (not just screenshots) and full pointer/keyboard navigation on desktop. Validate both portrait and landscape/orientation changes and mobile address-bar interactions.
4. Run lint, typecheck, build, unit/e2e, screenshot/capture checks; preserve proof in QA docs. Confirm original MP4 untouched and all existing sections retain correct order and branding (Anna logo remains left on desktop Playoffs).
5. Document used source files, crop coordinates, generated derivative files, rights/distribution status, and which images are hidden or intentionally omitted. Distinguish real photos from visual mockup references.
6. Provide the updated preview URL and concise owner review checklist. Do not claim production readiness while campaign media are preview-only. Do not merge until owner approves the cinematic result.

## Creative quality bar
This should feel like a high-budget athlete film opening: long tension, stadium lights, slowly rolling smoke, mystery silhouette, real hero image, deliberate montage, a powerful typography payoff. Less visual noise, more pacing and anticipation. The key decision is **extended scroll-directed storytelling**, not adding more special effects.
