# THE ARRIVAL Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement the owner's approved photographic campaign hero and cinematic scroll reveal without changing the approved second film scene.
**Architecture:** New isolated hero component/style/motion owner mounted by ArrivalExperience. Existing static export, photo gates, and film timeline remain authoritative. Repo `.agent` task packets and independent review provide the requested harness; controller owns evidence and integration.
**Tech Stack:** Existing Next.js, React, TypeScript, CSS modules, GSAP/ScrollTrigger, Playwright.
**Spec:** `docs/superpowers/specs/2026-11-02-arrival-campaign-design.md` and `docs/ARRIVAL_CAMPAIGN_BRIEF.md`.

## Global Constraints

- Primary headline: MAKE THEM / REMEMBER.
- Secondary identity: ZEPHYR KREYE / QB 17.
- Supporting identity: ANNA COYOTES / QUARTERBACK.
- Editorial footer: PREPARATION | DISCIPLINE | RESULTS.
- Preserve EVERY SECOND COUNTS, the existing source MP4, original brand geometry, native controls, no-film reveal, short viewport framing, and all existing routes.
- Authentic photographs only. No generated athletes, identity/uniform changes, invented missing body detail, or screenshot interface chrome. Keep review/public media gates intact.
- Existing stack; no unnecessary dependencies. Dedicated feature branch. Open PR with evidence; do not merge or deploy.

## Review Focus

- Late fonts/resize/direct anchors must finish at usable hero/film geometry.
- Reduced motion toggled after an active hero pin must restore static readable content.
- 320px and short landscape screens must preserve face/#17 and accessible navigation without overflow.
- Preview-media disabled must never expose preview-only photographs.
- Hero and film pins must release independently; real keyboard/native video controls remain usable.

### Task 1: Photographic hero and five-beat motion

**Files:** new `components/arrival-hero.tsx`, `components/arrival-hero.module.css`, `components/use-arrival-hero-motion.ts`; modify `components/arrival-experience.tsx`, `components/site-experience.tsx` only the gated props/interface needed for hero; new `tests/e2e/arrival-campaign.spec.ts`; update stale hero-title assertions in existing site tests only as necessary.
**Interfaces:** `ArrivalHero({profile:PublicProfile,photo?:PreviewPhoto|ScenePhoto,photos?:Array<PreviewPhoto|ScenePhoto>,onWatch:(button:HTMLButtonElement)=>void})`. Existing ArrivalExperience film props unchanged except optional photos collection.
- [x] Write browser regressions for statement and identity, authentic image sources, responsive bounds/face/#17, static reduced motion, dynamic pin removal, direct #arrival, and native watch action.
- [x] Demonstrate relevant assertions fail against current output.
- [x] Implement layered photographic composition and responsive dedicated mobile arrangement using source-preserving CSS masks.
- [x] Implement isolated five-beat motion with responsive cleanup and static fallback.
- [x] Keep all PR #8 film logic intact; run targeted lint/typecheck and report.
- [x] Independent task review: spec and quality; repair important findings.

### Task 2: Reference-aligned header integration

**Files:** `components/site-experience.tsx` Header only, `app/globals.css` scoped header rules, relevant navigation tests. Preserve Task1 photo plumbing.
**Interfaces:** Header accepts onWatch callback; `onWatch` opens existing native Film Room dialog and returns focus to real opener. Keep all original scene links plus recruiting/playoffs; add athlete wordmark and outlined WATCH FILM action. No invented reference-only About/Academics routes.
- [x] Add behavior checks for header watch action and preserved nav/menu focus.
- [x] Implement responsive header on the existing component, maintaining mobile inert/Escape/focus handling and short viewport header behavior.
- [x] Run scoped lint/typecheck/tests, then independent task review.

### Task 3: Integrated validation, visual inspection and PR

**Files:** controller-owned capture/performance script, `.agent/evidence/arrival-campaign/`, `artifacts/arrival-campaign/`, docs and PR.
- [x] Freeze source and check video/logo hashes against recorded baseline.
- [x] Run unit suite, lint, typecheck, production build and full browser suite; repair failures, never skip to obtain green.
- [x] Capture initial/mid/final/reverse/resize hero and preserved film at desktop/tablet/mobile, reduced motion and no JS; inspect images against owner reference.
- [x] Record actual LCP/CLS, image transfers and console/accessibility results with limitations.
- [x] Independent whole-branch review and address actionable issues.
- [x] Commit, push feature branch, open new review PR with measured evidence and authentic-photo fidelity limitation. No merge/deploy.
