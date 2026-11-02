# THE ARRIVAL campaign hero — approved design implementation

Authority: owner build prompt in `docs/ARRIVAL_CAMPAIGN_BRIEF.md` and the owner-supplied 1536×1024 reference image in the conversation. The owner has selected this visual and requested implementation, not ideation. Preserve merged PR #8 (base `910bfa51e9c934a544748e2182d978de34e6fb88`).

## Composition and approach

Implement a layered, real DOM/CSS photographic composition in the existing Next/React/GSAP site. It must remain editable and responsive; do not turn the mockup into a background screenshot or generate a replacement person. Keep the authentic existing sword ZK mark (the reference's different ZK lettering does not authorize discarding the approved brand geometry). Mask that actual mark with a silver gradient, restrained texture/highlights and offset shadow for metallic depth.

Reference proportions on desktop: header 9% height; large dark helmet close-up left (x0–35%, y9–49%); rear portrait x27–44%, y25–57%; central athlete x48–69%, y11–90%; side portrait x75–97%, y23–66%; action x75–94%, y57–86%; enormous ZK backdrop x37–87%, y16–65%. Statement lower left (x7–50%, y50–74%), exact two-line MAKE THEM / REMEMBER. Identity above, school below, editorial footer near bottom-left, restrained scroll cue bottom-center. Black ground, white/silver typography, electric purple details, subtle stadium light and atmosphere.

Use authentic owner photography only, preserving identities and source detail. The subsequently uploaded `Zpics.zip` supplies a full-body black-uniform portrait, white #17 rear portrait, black-uniform helmet profile, close-up, clean black rear figure, and real night-game stadium context. `content/arrival-campaign.ts` exposes preview-only source-coordinate SVG presentations, with embedded AVIF for delivery and vector clipping to exclude screenshot chrome. No body/face is generated or painted. The full-body black source has repost graphics across portions of the lower legs: those covered pixels are transparent, and the hero fades before them rather than showing detached boots or inventing missing anatomy. This is a material final-reference limitation requiring a clean original to eliminate. All derivatives are included in `docs/PREVIEW_MEDIA_MANIFEST.json`; public mode passes no campaign photos and the physical output audit still blocks distributing review assets. Existing clean 360/540/706 crops remain valid fallback photographs.

Mobile: deliberately reduce secondary imagery, center the recognizable authentic athlete in the upper portion with face and #17 visible, move the headline into a clear lower region, preserve mark recognizability and portrait depth. Typography scales to 320px width without overflow. Tablet gets a balanced intermediate composition. Header retains all existing destinations and adds wordmark/watch action without copying dead reference links.

## Motion

A new hero-only GSAP matchMedia/context owns five scrubbed beats: near-black rear silhouette; identity/metal mark; portraits/stadium; two statement lines; final pullback/full composition. Pin only sufficiently tall desktop screens. Natural scrolling on touch/mobile/short screens. Reduced motion and no JavaScript show the complete static final composition immediately. Initial SSR is visible and meaningful; enhancement starts a deliberate reveal, not a blank loading screen. No new video in the hero. Use transform/opacity, cleanup, resize invalidation, and a short bounded scrub. Scrolling and direct #arrival anchors must release and remain usable.

## Interfaces and preservation

Create `ArrivalHero({profile, photo?, photos?, onWatch})`. ArrivalExperience keeps its current film-room rendering, refs, video source, native controls, coverScale, no-film aperture reveal, pin release and playback observer intact. Only replace its first hero section and remove the obsolete hero-specific animation. Pass gated preview/approved photo collections through SiteExperience. Keep #arrival, #hero-title, #film-room, native sound dialog and all other route/section IDs. The hero accessible headline includes MAKE THEM REMEMBER; identity remains visible and exposed to assistive tech.

## Acceptance

Exact approved copy, authentic pixels, current brand geometry, no horizontal overflow, no hidden face/#17, static and dynamic reduced motion, no-JS final frame, keyboard/menu/film action, independent header/hero/film pin cleanup. Unit, lint, typecheck, production build, full Playwright suite. Preserve MP4 and canonical logo SHA256 bytes. Capture initial/mid/final desktop and mobile, tablet, reverse, resize, existing film frame, Playoffs. Measure actual image bytes/LCP/CLS where tooling permits; physical-device/thermal smoothness remains unverified. Open a new PR with evidence; no merge or deployment.
