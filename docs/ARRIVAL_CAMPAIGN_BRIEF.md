# CODEX CLOUD MASTER BUILD PROMPT
## ZEPHYR KREYE — THE ARRIVAL
### Cinematic Homepage Implementation

**Repository:** `nrsandoval1231-oss/ZK17`  
**Website:** https://zephyrkreye.com/  
**Primary objective:** Replace the first-page hero with the approved cinematic athlete showcase, THE ARRIVAL.

## 1. Mission

Build a premium, cinematic, responsive homepage for Zephyr Kreye that feels like an elite professional athlete's personal brand.

This is not a college recruiting website. It is an athlete showcase built around identity, presence, performance, and legacy.

The approved creative concept is:

**THE ARRIVAL**

**Primary headline: MAKE THEM REMEMBER.**

The homepage should look and feel like a major Nike or Jordan athlete campaign, with premium editorial composition, authentic sports photography, sophisticated animation, and outstanding performance.

The user has approved a specific visual mockup. Treat that image as the **canonical design reference**, not general inspiration.

Do not independently redesign it.

## 2. First: Inspect the Repository

Before modifying anything:

1. Inspect the current application architecture, routing, assets, styling, and components.
2. Identify the existing homepage hero and page-two cinematic experience.
3. Locate the ZK brand assets and any uploaded Zephyr photography.
4. Inspect existing GSAP animations and scroll behavior.
5. Identify mobile responsiveness, performance, and accessibility issues relevant to this implementation.
6. Review deployment configuration and existing tests.

Reuse the current stack and working infrastructure.

Do not rebuild the application unnecessarily.

Preserve existing pages, navigation, football content, playoff tracker, and other working features.

## 3. Canonical Visual Design

The final homepage composition must faithfully reproduce the approved reference.

### Background

- Deep cinematic black.
- Subtle stadium atmosphere.
- Directional stadium lighting.
- Carefully controlled smoke and atmospheric depth.
- Metallic highlights.
- Restrained electric-purple accents.
- Premium photographic contrast.

Avoid excessive particles, artificial lens flares, or distracting effects.

### Giant ZK Monogram

Create an enormous metallic ZK identity behind the central athlete.

Requirements:

- Preserve the approved ZK brand geometry.
- Brushed silver / metallic texture.
- Subtle directional highlights.
- Three-dimensional visual depth.
- Integrated into the background, not floating as an unrelated logo.
- Responsive positioning on desktop and mobile.

Use an authentic existing logo asset where available. Do not invent a replacement logo.

### Athlete Composition

The hero should contain multiple authentic photographic perspectives of Zephyr:

**Central figure:** Full-body Zephyr wearing his black Anna Coyotes #17 uniform, positioned prominently in front of the metallic ZK.

**Left background:** Large, dramatic helmet/face close-up, darkened into the background.

**Left-middle:** Rear-facing uniform portrait featuring #17.

**Right background:** Side-profile helmet portrait with purple highlights.

**Lower-right:** A smaller action photograph showing Zephyr in motion.

Use the actual supplied photographs wherever possible.

Do not replace Zephyr with a generated athlete.

Do not alter his identity, facial structure, jersey number, team insignia, or recognizable uniform details.

Photo cutouts and compositing must be clean and professional.

Remove screenshot interface artifacts from derived image assets. Prefer original source photographs where available; do not invent missing photographic detail.

If a suitable original is unavailable, use the best authentic alternative and document the limitation.

## 4. Typography and Copy

Primary copy must be:

**MAKE THEM**  
**REMEMBER.**

This should be enormous, bold, condensed, uppercase typography.

Position on the lower-left portion of the hero, matching the reference.

Secondary identity:

**ZEPHYR KREYE / QB 17**

Supporting identity:

**ANNA COYOTES / QUARTERBACK**

Small editorial footer:

**PREPARATION | DISCIPLINE | RESULTS**

No recruiting language.

No generic motivational paragraphs.

Do not introduce new slogans or replace the approved headline.

Keep the copy visually powerful through scale, spacing, and composition.

## 5. GSAP Cinematic Arrival Sequence

Implement the homepage as a scroll-responsive cinematic reveal.

Use GSAP and ScrollTrigger, reusing existing dependencies when possible.

### Beat 1 — Darkness

The initial viewport is nearly black.

Zephyr's rear-facing silhouette emerges gradually, with the purple helmet and jersey #17 becoming visible.

Use subtle light and opacity transitions.

### Beat 2 — Identity

As the visitor scrolls, the scene transitions toward a front-facing Zephyr.

Use layered photographic transitions rather than an artificial 3D reconstruction of his body.

The giant metallic ZK begins to emerge.

### Beat 3 — The World Opens

The background portraits appear with controlled depth and subtle parallax.

Stadium lighting reveals the scene.

The central athlete becomes the unmistakable focal point.

### Beat 4 — The Statement

The words **MAKE THEM** enter dramatically.

Then **REMEMBER.** resolves into place.

Use bold, controlled typography animation with precision timing.

Avoid excessive bouncing, spinning, or gimmicky effects.

### Beat 5 — The Final Frame

The camera appears to pull backward.

The complete hero composition becomes visible.

**The final frame must match the approved visual reference as closely as possible.**

The viewer must see the full composition rather than remaining excessively zoomed in.

The scroll sequence must end cleanly.

Release scroll pinning and return to normal page behavior.

The finished hero must remain usable and interactive.

### Motion Engineering Requirements

- Smooth GSAP timelines.
- ScrollTrigger with appropriate scrub behavior.
- Avoid nested scroll traps.
- Correct refresh and cleanup behavior.
- Responsive animation distances.
- Reduced-motion support.
- Graceful fallback when JavaScript or advanced animation is unavailable.
- No unnecessary loading screens.
- No animation flicker during hydration.
- No layout shifts.
- Avoid excessive GPU memory usage.

Use transform and opacity animations wherever practical.

## 6. Navigation

Preserve the existing website's working navigation and routes.

Visual direction:

- Premium dark header.
- ZK logo and Zephyr Kreye wordmark at left.
- Clean horizontal navigation.
- Minimal outlined WATCH FILM action at right.
- High-contrast typography.
- Subtle hover and active states.

Do not create dead links.

Do not remove or break the Playoffs section.

The navigation must remain functional during and after the hero animation.

## 7. Mobile Experience

Do not simply crop the desktop composition.

Create a dedicated responsive composition for mobile.

Requirements:

- Zephyr remains the dominant visual.
- His face and jersey number remain visible.
- Headline is large and legible.
- ZK monogram remains recognizable.
- Secondary portraits may be repositioned or selectively omitted.
- Navigation works cleanly.
- No horizontal overflow.
- No clipping of important photographic content.
- Touch scrolling remains smooth.

Mobile should feel intentionally art-directed, not like a reduced desktop screenshot.

Test common iPhone sizes and tablet breakpoints.

## 8. Preserve the Existing Cinematic Experience

The previously approved cinematic video experience must remain on page two.

Its headline remains:

**EVERY SECOND COUNTS.**

Preserve the existing GSAP video experience and its latest approved improvements, including the final zoom-out that reveals the video cleanly.

Do not move the video back into the homepage hero.

Do not overwrite existing video assets.

The two experiences must complement each other:

- **Page 1:** THE ARRIVAL — identity and presence.
- **Page 2:** EVERY SECOND COUNTS — motion and performance.

## 9. Performance

This homepage must be visually ambitious without becoming slow or fragile.

Requirements:

- Optimized image formats and responsive image variants.
- Appropriate image preloading for the primary hero.
- Lazy loading for noncritical assets.
- No unnecessary heavyweight animation libraries.
- Efficient GPU compositing.
- No cumulative layout shift.
- Proper loading fallbacks.
- Avoid downloading full-resolution desktop imagery unnecessarily on mobile.

Measure and report relevant performance results.

Do not claim performance targets were met without measurement.

## 10. Quality and Accessibility

Implement:

- Semantic page structure.
- Accessible navigation.
- Keyboard functionality.
- Appropriate image alt text.
- Sufficient text contrast.
- Reduced-motion handling.
- Stable responsive layouts.
- Graceful handling of missing assets.
- No browser console errors.
- No broken images or routes.

## 11. Validation

Before opening the pull request:

1. Run the existing repository test suite.
2. Run linting and type checking where configured.
3. Run the production build.
4. Inspect desktop and mobile renders.
5. Validate GSAP scroll behavior.
6. Verify the final frame visually against the approved mockup.
7. Verify the page-two cinematic experience remains intact.
8. Verify the Playoffs tab and other existing navigation.
9. Check for layout overflow and broken assets.
10. Report actual results, failures, and unresolved limitations.

Capture screenshots of:

- Initial hero state.
- Mid-animation state.
- Final desktop hero.
- Final mobile hero.

If browser tooling is available, perform visual QA against the reference.

## 12. Implementation Rules

- Work on a dedicated feature branch.
- Reuse existing application patterns.
- Keep components maintainable.
- Separate animation logic from visual presentation where practical.
- Do not introduce unnecessary dependencies.
- Do not fabricate source photographs.
- Do not change unrelated functionality.
- Do not modify credentials or secrets.
- Do not merge or deploy automatically.
- Open a pull request with validation evidence.

## 13. Required Deliverables

Produce:

1. Fully implemented THE ARRIVAL homepage.
2. Authentic Zephyr photography integrated into the composition.
3. GSAP cinematic reveal.
4. Responsive desktop and mobile layouts.
5. Preserved page-two video experience.
6. Visual QA screenshots.
7. Test and build results.
8. Pull request summarizing changes and remaining limitations.

## 14. Final Acceptance Standard

The implementation is complete only when:

- The homepage immediately feels like a premium athlete brand.
- The final composition closely matches the approved reference.
- Zephyr is clearly recognizable as himself.
- Jersey #17 and authentic team details are preserved.
- MAKE THEM REMEMBER. dominates the visual hierarchy.
- The metallic ZK creates a powerful branded backdrop.
- Scroll animation is cinematic, smooth, and controlled.
- Desktop and mobile both look intentionally designed.
- The final frame is fully visible.
- Existing functionality remains intact.
- The production build and relevant tests pass.

**The goal is not merely to build a hero section.**

**The goal is to create an unforgettable arrival.**

Execute the implementation, validate the result, and open a PR for review.