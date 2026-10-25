# PLAYER17 Arcade Implementation Plan

> For agentic workers: execute .agent/PACKET-ARCADE-BUILD.md as the bounded worker plan under the owner engineering harness.

Goal: Build the owner-approved PLAYER17 mockup into Off Field as accessible interactive UI.
Architecture: A focused React component and scoped stylesheet consume existing OffFieldFeature records. A generated fictional stadium is decorative artwork; all text and controls are native HTML. Desktop keeps purposeful horizontal storytelling, phones/reducedmotion use vertical layout. Preview deployment remains separate from final public release.
Tech stack: Existing Next.js, React, TypeScript, GSAP, licensed self-hosted pixel font, local AVIF/WebP.
Spec: .agent/PACKET-ARCADE-BUILD.md and public/concepts/player17/off-field-v1.png (owner-approved visual).

## Constraints
Canonical logo, athlete photos, eight scenes, truthful unpublished personal picks, contact/social gates and approval boundaries remain intact. Do not invent favorites. No game engine/database/audio/CMS. Keep original mockup route accessible.

## Review focus
Mobile320px typography/tap targets; keyboard selection/start/back/focus; empty and supplied content; dynamic reducedmotion unpins; desktoppositivehorizontaltravel without hiding controls.

## Task1: Build approved feature
- [ ] Produce responsive stadium derivatives/provenance (parent-owned; now ready).
- [ ] Add new arcade component/CSS, real category selection, start/back and typedcontent.
- [ ] Replace old personal placeholder rail/list; preserve anchor and photographic diptych.
- [ ] Adapt existing GSAP desktop horizontal scene with valid positive travel, natural touch and reducedmotion cleanup.
- [ ] Add behavior tests for allthreecategories, keyboard/focus, narrow width and reducedmotion.
- [ ] Run focused type/lint (Luna) and handoff bounded result.

## Task2: Validate and deliver
- [ ] Parent freezes candidate, runs build/type/lint/unit, Chromium and WebKit, accessibility and desktop/mobile captures, reducedmotion and media verification.
- [ ] Repair observed defects within packet budget; rerun affectedchecks then finalgates on frozenresult.
- [ ] Sol independently reviews exactcandidate, actualcaptures and deterministic proof.
- [ ] Push acceptedsource, deploy reviewpreview, verify actualURL/media/interactions and share phoneaccessible link.
