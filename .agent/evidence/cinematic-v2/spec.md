# ZK17 — CINEMATIC EXPERIENCE V2
## Master Builder Prompt | Implement, Validate, and Open PR

You are the principal creative developer, motion designer, frontend engineer, accessibility engineer, and QA owner for the existing ZK17 / Zephyr Kreye athlete showcase website.

**Repository:** `nrsandoval1231-oss/ZK17` (confirm exact repo before changes).
**Current preview reference:** https://c9641529.zk17-review.pages.dev/
**Visual reference:** The owner-supplied reference image depicting a layered football-player collage, giant ZK background monogram, and massive “MAKE THEM REMEMBER.” typography. Ask for the image in your builder environment if it is not accessible; do not invent an alternative approved composition.

## Mission
Refine the *existing* ZK17 experience into a premium, cinematic football-athlete showcase. Do **not** start over, replace the approved brand, remove functional playoff tracking, or add unnecessary features. Preserve real Zephyr imagery and the existing ZK identity. Fix the cinematic pacing, composition, header architecture, video treatment, content polish, and iPhone usability.

## Creative direction — LOCKED
- Act I = **MAKE THEM REMEMBER.** (final payoff of introductory reveal)
- Act II = **EVERY SECOND COUNTS.** (full-screen monochrome video hero)
- Act I black environment throughout; subtle nighttime football stadium emerges only when lights ignite.
- Photographs **accumulate** as permanent layers into one final composition. **No photo falls away, slides out, vanishes, or gets swapped out** when another arrives.
- The submitted owner reference is the visual target of the completed collage, but use actual approved Zephyr photographs rather than AI-generated substitutes.
- Pure black opening, deep blacks, monochrome images, restrained purple as a rare atmospheric accent, premium sports-editorial typography.
- Do not change the approved logo or visual identity.

## 1. Act I: compact GSAP cinematic reveal
**Goal: approximately 2–3 viewport heights of total scroll travel on desktop**, and a shorter equivalent on phones. Current scrolling takes far too long. Avoid extra pinned spacer pages, excessive scrub durations, and dead zones. Tune by actual user testing rather than by arbitrary GSAP configuration alone.

Build **one contiguous pinned/evolving scene** with the following sequence:
1. Start on a true black full-screen viewport (`#000`), without a visible header or surrounding light-colored edges.
2. Floodlights ignite in a cinematic but brief burst of light, with realistic bloom (no seizure-like strobing).
3. A **subtle dark football stadium** is illuminated: faint bleachers, field/turf reflections, distant lights, very soft goalpost outlines where appropriate; stadium visibility should remain roughly 15–25% visually, not as a hard-coded opacity if blending differs. The stadium stays as the underlying scene throughout Act I.
4. Low, slow smoke/fog begins moving through the lights. Keep it subtle, performant, and never so dense that it obscures Zephyr.
5. Reveal the first close-up portrait, then supporting images one by one. Each new image **adds** to the scene, through masked reveal/opacity/very light scale motion. All previously revealed portraits STAY IN PLACE in the final collage.
6. The dominant full-body Zephyr hero enters the center, cleanly and crisply, with background images darker/soft-edged to establish depth. Avoid visibly bad AI cutouts. Prefer approved originals with careful cropping, masks, feathering, shadows, smoke, and dark backgrounds to blend photographic edges.
7. An oversized, integrated ZK monogram rests **behind** the athletes and does not obscure faces. The owner’s reference composition, not a generic slideshow, is the layout target.
8. **Only at the end**, reveal the huge bold headline **MAKE THEM REMEMBER.** Keep text readable and clear of critical faces. Hold the complete collage briefly so users can appreciate it, without adding another entire screen of dead scrolling.
9. Transition naturally into Act II. Avoid blank jumps, header flashes, content shifts, or sudden white backgrounds.

**Layering invariant:** lights/stadium/smoke are foundational atmospheric layers; each image accumulates without leaving; full-body subject remains foreground focal point; monogram is behind players; headline appears late. No scroll-triggered exit animation for individual portraits.

Use GSAP ScrollTrigger in the existing architecture. Scope and clean up triggers; avoid duplicate initialization under React Strict Mode; invalidate/recalculate sensibly on responsive layout changes and after assets load. Prevent scroll hijacking and avoid body-scroll deadlocks.

## 2. Header and routes
- **No visible navigation/header during Act I.** Show it only after the cinematic intro has completed. Once shown, retain sensible normal/sticky behavior through the rest of the site.
- Top navigation links **must navigate to actual separate routes/pages**, not anchor-scroll to sections of the same page. A person who wants to browse Home can scroll its sections naturally.
- Primary route architecture (adjust existing routing library rather than introducing a new framework):
  - `/` — Home: cinematic Act I, Act II, then athlete-showcase content.
  - `/film` — Film: highlights, complete playable film, curated footage.
  - `/playoffs` — Existing verified Anna-focused UIL 5A Division II tracker, functionality preserved.
  - `/about` — Athlete biography, journey, galleries/off-field material.
  - `/nil-recruiting` — Dedicated NIL and recruiting page, professional, credible, working contact path.
- Navigation labels: HOME, FILM, PLAYOFFS, ABOUT, NIL / RECRUITING. Remove menu items that are only on-page sections (e.g. On Field, Journey, Off Field, Numbers, Media) rather than creating unnecessary pages.
- Direct URLs must load correctly on Cloudflare Pages, with browser back/forward, active route indicators, focus management and reasonable page titles. Ensure header is immediately accessible on **non-home routes**—do not make visitors watch the intro to navigate the site.
- Mobile header/menu must be compact, legible, easy to use, and not block the hero.
- Add a discreet accessible “Skip intro” option and honor `prefers-reduced-motion`. Never force returning users to scroll the intro to access content.

## 3. Act II: immersive video hero
- After the Act I payoff, transition into an edge-to-edge **full-screen video hero**. Aim to preserve the central subject and avoid the overly zoomed/cropped treatment currently seen; use responsive composition and `object-position` or art-directed framing. Full bleed is the default; handle aspect-ratio conflicts intentionally rather than clipping essential action.
- **Entire video is black and white**, including the full-length version played after scrolling. Grayscale must remain consistent during playback, on mobile and desktop; preferably encode a monochrome video asset rather than rely only on CSS filters.
- Overlay the approved ZK logo in **black**, reversing the current logo treatment. Its placement must have appropriate light/contrast backing or compositional negative space so a black logo remains readable; do not add a big obvious white logo plate that ruins the cinematic image.
- Headline: **EVERY SECOND COUNTS.** Secondary copy minimal. Remove “WATCH WITH SOUND,” “WATCH WITH SOUND ON,” and any equivalent button from everywhere in the site. Do not replace it with another gratuitous sound prompt.
- Hero playback should be muted, inline, autoplay where allowed, and loop seamlessly. Provide accessible controls or a clear route to full playback on the Film page. Handle mobile autoplay restrictions gracefully.

## 4. Film editing and media outputs
Treat the film recut as an explicit deliverable, **not** simply a CSS change:
- Inspect existing video/media sources and metadata, including quality, length, resolution, aspect ratios, audio, and ownership/license status.
- Build a **15–25 second hero edit** using only the strongest clips: compelling opening, fast but readable action cuts, deliberate pacing, visually clean ending or seamless loop. Monochrome encode; remove redundant setup, black gaps, and dead time. Do not fabricate football plays or replace the athlete with synthetic footage.
- Build a **separate longer highlights cut** for `/film`, if sufficient source material exists; retain contextual plays and good pacing. No arbitrary replay/ending on scroll.
- Keep original sources intact. Output web-optimized assets with a poster image and properly sized variants when useful. Do not commit giant binaries into Git if the project uses external object storage/CDN; follow existing asset delivery conventions.
- If only an already-compressed preview clip exists, do **not** claim a finished professional recut. Implement what can be done non-destructively and clearly report the specific missing source file(s), desired original uploads, and proposed cut list/timecodes.
- Do not obscure, blur, or fake-clean third-party watermarks in a way that leaves ugly artifacts. Prefer licensed, clean originals.

## 5. Clean up and content organization
- Remove publicly visible implementation labels or placeholders such as “PREVIEW CROP · ORIGINAL PENDING” / “Original files pending.” Do not expose internal editorial notes on the live site.
- If verified stats or social/NIL data are missing, hide the unfinished modules or mark unknowns honestly rather than inventing metrics, offers, awards, contact methods, or profiles.
- On `/nil-recruiting`, provide distinct, clear NIL partnership and recruiting inquiry paths. Reuse known, verified contacts; do not invent email addresses, phone numbers, scholarship offers, rankings, or claims. If no validated contact method is available, use an explicit nonfunctional-design placeholder in the implementation PR notes, not a fake live form.
- Consolidate Home to a compelling athlete showcase with natural scrolling, not a stack of repeated navigation-like sections.
- Keep Playoffs intact: bracket, routes, accurate verified data, sourcing markers, mobile interactions, and automated data workflow. Do not imply unverified matchups or results are confirmed.
- Maintain strong semantic markup, accessible contrasts, keyboard behavior, focus states, alt text, video fallbacks, and reduced-motion behavior.

## 6. Mobile and performance quality bar
- Test actual small iPhone viewport patterns (Safari if available), iOS browser UI resize, narrow widths, orientation shifts, iPad, and desktop sizes.
- GSAP should have reliable initialization, correct pin spacing and release, no horizontal overflow, no frozen scrolling, no jump at Act I → Act II, no flicker, no floating/offscreen players.
- Prefer compositing `transform` and `opacity`; avoid expensive full-screen filter animations. Use lightweight precomposed assets where that produces better real-world mobile performance.
- Preload only critical first-frame media; lazy load deeper content; use responsive images, image decode/load synchronization, poster frames, reduced-motion static composition, and sane video `preload` settings.
- Verify the stadium/background blending works on both OLED black screens and normal monitors. It should feel understated, not a bright arena wallpaper.

## 7. Implementation process and constraints
1. Audit existing ZK17 source, routes, media files, animations, deployment settings, and active PRs. Identify the actual current state; do not blindly rewrite or overwrite recent approved work.
2. Document a short implementation plan and specific source-file changes.
3. Create a dedicated feature branch. Reuse existing dependencies and components when possible. Do not make unrelated architectural changes.
4. Implement the intro, image accumulation, atmospheric stadium, header routing, Act II, Film page, NIL/recruiting page, and cleanup.
5. Inspect source video availability and produce edits only if real source media supports it. Clearly separate fully implemented work from blocked media tasks.
6. Run formatting, lint, typecheck, unit tests, build, existing E2E checks, route smoke tests, responsive and interaction QA. Add specific regression coverage for multi-layer persistence and intro/header timing.
7. Capture desktop and mobile screenshots at: black opening; stadium lights-on; mid-accumulation; final “MAKE THEM REMEMBER.” composite; Act II full screen; Film; Playoffs; NIL/Recruiting.
8. Open a PR to main with implementation summary, before/after visuals, validation results, exact known blockers, and media source requests. **Do not merge or deploy production without explicit authorization.** A preview deployment is appropriate if already supported by the repo.

## Acceptance checklist (all required for completion)
- [ ] Act I genuinely takes ~2–3 viewport heights on desktop, shorter/adapted on mobile, with no excessive dead scrolling.
- [ ] Start is edge-to-edge pure black, no visible header.
- [ ] Stadium lights reveal a dark, subtle football stadium and controlled smoke; it persists beneath the whole sequence.
- [ ] Every Zephyr photo remains in the scene once revealed; none slide/fall out or disappear.
- [ ] Final layout matches the user-supplied composition: giant ZK behind players, dominant center hero, supportive portraits, readable late headline “MAKE THEM REMEMBER.”
- [ ] Header appears after Act I and is accessible immediately on other routes.
- [ ] Each primary nav item navigates to a distinct functioning page (not an in-page anchor).
- [ ] Dedicated Film, Playoffs, About, NIL/Recruiting pages all work; Playoffs regression tests pass.
- [ ] Act II is edge-to-edge, monochrome, with black ZK logo legible and “EVERY SECOND COUNTS.”
- [ ] All “WATCH WITH SOUND” buttons removed.
- [ ] Video hero and long playback stay monochrome; actual recut assets delivered where source files permit, otherwise blockers reported precisely.
- [ ] No visible dev placeholders, fake stats, fake contacts, or invented recruiting claims.
- [ ] iPhone/iPad/desktop scroll, layout, route and video QA verified with evidence.
- [ ] Reduced-motion, keyboard access, performance and initial-loading behavior are acceptable.
- [ ] Reviewable PR opened, with no unauthorized production deploy.

**Do not stop at an implementation plan. Make the changes, verify them, and deliver a reviewable PR. Preserve approved existing design quality, keep the runtime simple, and prioritize the final visual outcome over decorative complexity.**
