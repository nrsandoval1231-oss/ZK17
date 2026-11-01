# ZK17 — Production Completion Audit and Implementation Contract

Status: In progress. Preserve the existing approved cinematic design. This document records verified repository findings, not a claim that tests or production deployment have passed.

## Confirmed implementation
- Next.js 16 / React 19 / TypeScript static export; Cloudflare-compatible.
- GSAP ScrollTrigger, reduced-motion support, keyboard-aware mobile navigation.
- Film Room native video dialog, season filtering, typed highlights and stats.
- Authentic preview photo crops are explicitly review-only.
- Existing release-check and export audit prevent accidental publication of preview derivatives.
- No open pull requests at audit time.

## Verified content blockers
- `content/site.ts` exports empty media, highlights, stats, offers, socials, and partnerships.
- No rights-approved source-backed original athlete photos or film entries are configured.
- Public release intentionally remains disabled and preview indexing blocked.
- Commitment announcement is intentionally null; do not change without publicly approved evidence.
- Existing profile and other owner-provided facts must not be embellished or silently changed.

## Build scope, in priority order
1. Preserve current visuals, brand, scene ordering, and motion. No wholesale redesign, new backend, CMS, or authentication.
2. Implement an accessible, mobile-first Recruiting Snapshot integrated into existing layout, using only verified public fields; provide share/copy link and direct links to existing Film Room and contact section. No fabricated stats, measurements, offers, academic details, or contact info. Handle missing fields elegantly.
3. Make Film Room useful with verified film once provided: responsive season/game navigation, native playback, keyboard access, and shareable deep links. Preserve empty states until approved assets exist.
4. Audit and repair navigation, focus restoration, reduced motion, small screens, media loading, layout shifts, and link correctness.
5. Maintain strict content provenance and media rights gates; never expose private recruiting or commitment details.
6. Run npm ci, typecheck, lint, tests, build, Playwright browser/a11y/mobile QA; record actual results and failures. Do not claim a test passed unless run.
7. Prepare production checklist for original media, film, approved contacts, canonical domain, indexing, Cloudflare deployment, and owner signoff. Do not publish without explicit release approval.

## Acceptance criteria
- Existing approved design remains visually recognizable; attach before/after screenshots for desktop/mobile.
- Snapshot is useful with sparse verified content and links to relevant sections.
- Film room remains safe and functional with zero or multiple verified clips.
- No invented or unverified athlete claims.
- All automated and manual QA evidence included in PR.
- Public release blockers stay enforced until approved.

## Implementation update — 2026-11-01
PR #1 now includes the software implementation and scroll polish, superseding the original documentation-only PR description. Recruiting navigation/share/contact integration, film deep links/on-demand controls, responsive motion and QA are implemented. See `SCROLL_POLISH_QA.md` and `SCROLL_REFERENCE_2026-11-01.md` for measured results and evidence limits. Media/public-release blockers above remain enforced; no public deploy or merge was performed.
