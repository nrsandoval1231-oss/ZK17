# Cinematic opening refinement — inspection checkpoint

2026-11-02. Owner specification is the attached Cinematic Opening Refinement Engineering Build Specification. No product edits, dependency installation, tests, push, PR, merge or deployment performed.

Repository: nrsandoval1231-oss/ZK17. Clean main checkout at 5bfba97 (Deploy owner-approved Cinematic V2 to production), cloned into the source directory within the owner's ZK17 workspace. No open PRs at inspection.

## Existing implementation
components/arrival-hero.tsx, components/arrival-hero.module.css and components/use-arrival-hero-motion.ts own the introduction. app/layout.tsx bootstraps startup state; app/globals.css gates the header.
Single arrival-hero ScrollTrigger pins top/top, scrub .18, ending after innerHeight * 2.4 at >=900px or *1.6 below. Preserve these distances. Initial GSAP state sets all layers to zero; pending CSS also hides every layer. This explains the empty cold open.
Lights begin .025, stadium .06, smoke .08, monogram .18. Photos begin .16 with .11 spacing; statement .79; timeline holds to 1. Current stadium is arrival-campaign/stadium-640.svg, not an Anna stadium photograph. Canonical logo is brand.monogram from content/brand.ts; authentic existing portraits remain required.

## Required implementation boundaries
Keep one scrub timeline, current distances, header completion logic, navigation and all subsequent content. Add immediate visible logo and drifting lightweight smoke; fade logo before full real stadium reveal; stagger lights, monochrome stadium then muted color via opacity crossfade (no full-screen filter tween); restrained athlete emergence, hero and accumulating montage; retain MAKE THEM REMEMBER. Preserve original assets and use optimized derivatives. Respect reduced motion and static/no-script fallback.

## Risks and verification
Check initial prepaint and delayed JavaScript, image decode/refresh, forward/reverse/fast scroll, completion/header threshold, rotation and Safari height changes, repeated mounting and reduced-motion toggles. Existing rotation and focus/film ownership logic must not be casually replaced. CSS masks/blends, multiple photo surfaces, smoke layers and viewport-height end calculation need mobile inspection. Current mobile pinning is intentional under the CURRENT user brief; older natural-mobile documentation is historical, not authority for removing it.
Run existing lint/typecheck/unit/build and appropriate Playwright desktop/mobile/WebKit suites after final changes. Capture each major beat, portrait/landscape, reduced-motion and release. Physical iPhone performance remains UNKNOWN until tested on hardware.

## Blocker and next action
The attachment directory contains only Pasted text.txt; the workspace Media directory is empty. No uploaded real Anna stadium photograph was found in the repository assets. Requested original photo paths/attachments from owner. Do not substitute the illustrative SVG or fictional arcade stadium. Resume implementation when real source arrives; partition bounded implementation/test/asset work with Luna builders and independently review the integrated candidate with Astra. Open review-ready PR only after implementation, checks and evidence. No merge/deploy authorized.
