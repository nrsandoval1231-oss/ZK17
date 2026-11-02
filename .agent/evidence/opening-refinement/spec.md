# ZK17 — Cinematic Opening Refinement
## Engineering Build Specification

**Repository:** `nrsandoval1231-oss/ZK17`  
**Production:** https://zephyrkreye.com/  
**Priority:** High  
**Scope:** Existing homepage GSAP cinematic sequence only

### PRIMARY DIRECTIVE

The current ZK17 website is approved. **DO NOT redesign, restructure, or replace it.**

We are making a targeted creative and technical improvement to the existing scroll-driven cinematic introduction.

Preserve the established visual identity, black-and-white athlete photography, typography, page layouts, navigation, supporting content, and overall user experience.

Our goal is to improve the opening narrative:

**Atmosphere → Stadium → Athlete → Statement**

The current introduction begins with an entirely black screen, which can initially appear broken or unloaded. Replace that empty opening with subtle cinematic smoke and the existing ZK logo, then reveal Anna ISD's stadium before transitioning into the existing Zephyr photography.

Use the provided stadium photographs as source assets.

---

## 1. APPROVED CINEMATIC SEQUENCE

### BEAT 0 — THE COLD OPEN

**Visual:**
- Nearly black, full-viewport background.
- Subtle drifting grayscale smoke across the screen.
- Existing ZK logo centered prominently.
- Very faint backlighting behind the logo.
- No navigation header.
- No visible website content.
- No intrusive loading indicators.

**Animation:**
- Smoke should be visibly moving immediately.
- Logo appears through the haze.
- Subtle opacity and scale animation.
- Maintain a dark, premium cinematic appearance.

**Important:** The first rendered frame must never look like an empty or broken page.

### BEAT 1 — IGNITION

**Visual:**
- Existing logo begins fading away.
- Stadium floodlights emerge through smoke.
- Bright white lights bloom against the dark environment.
- Haze briefly becomes more visible as the lights illuminate it.

**Animation:**
- Lights activate progressively.
- Use restrained bloom and atmospheric lighting.
- Logo fades completely before the full stadium reveal.
- Avoid excessive white flashes or strobing.

### BEAT 2 — ANNA STADIUM REVEAL

**Visual:**
- Reveal an empty Anna ISD Coyote Stadium.
- Stadium floodlights illuminated.
- Purple end zone visible.
- Stadium architecture recognizable.
- Atmospheric twilight sky.
- Subtle fog near field level.

**Color treatment:**

Begin with a predominantly monochrome stadium image.

As the user scrolls, progressively introduce a small amount of original stadium color.

Emphasize:
- Anna's purple end zone.
- Muted purple/pink twilight sky.
- Natural white stadium lighting.

Keep the overall scene dark and cinematic.

**Animation:**
- Smooth grayscale-to-muted-color transition.
- Subtle camera push-in or parallax.
- Brief visual hold before the athlete reveal.
- No athletes visible during the empty stadium beat.

Use the provided stadium photographs rather than inventing a replacement stadium.

### BEAT 3 — ZEPHYR ARRIVAL

**Visual:**
- Stadium darkens slightly.
- Zephyr emerges as a black-and-white silhouette.
- Stadium lighting creates separation between athlete and background.
- Light smoke remains visible.

**Animation:**
- Subtle foreground emergence through opacity, scale, and depth.
- Smooth transitions.
- No exaggerated flying or falling athlete images.

The athlete should feel integrated into the scene rather than pasted on top.

Use existing approved Zephyr image assets.

### BEAT 4 — HERO REVEAL

**Visual:**
- Transition into the strongest existing Zephyr hero image.
- Keep the image black and white.
- Preserve the approved photography and image treatments.
- Maintain recognizable facial features and uniform details.

**Animation:**
- Cinematic image reveal.
- Controlled scale and motion.
- Smooth transition from silhouette to hero.
- Avoid awkward crops on mobile.

### BEAT 5 — MEMORY MONTAGE

Preserve the existing supporting Zephyr photographs.

**Requirements:**
- Images remain predominantly black and white.
- Supporting images enter sequentially.
- Images accumulate into the existing cinematic composition where appropriate.
- Do not make photos fall off-screen.
- Avoid large empty areas.
- Preserve the existing premium editorial styling.

Light purple atmospheric accents are permitted, but Zephyr remains the focal point.

### BEAT 6 — THE STATEMENT

The final cinematic headline remains:

# MAKE THEM REMEMBER

**Requirements:**
- Preserve the current approved typography direction.
- Bold, high-contrast white lettering.
- Restrained purple accent if appropriate.
- Preserve the athlete imagery behind or alongside the headline.
- Allow the final composition to breathe.

Do not replace this statement with alternate copy.

### BEAT 7 — CINEMATIC RELEASE

At the completion of the cinematic sequence:

- Transition smoothly into the existing homepage experience.
- Show the navigation header only after the cinematic finishes.
- Preserve the existing navigation destinations.
- Maintain the separate pages already established.
- Do not introduce an additional unnecessary transition screen.

---

## 2. COLOR DIRECTION

**Target visual balance: approximately 85% monochrome / 15% selective color.**

Keep:
- Black-and-white Zephyr photography.
- Dark charcoal backgrounds.
- White typography.
- Gray smoke and haze.

Introduce selective color through:
- Anna's purple end zone.
- Muted twilight sky.
- Subtle purple lighting accents.

Do not apply full saturation to the entire cinematic.

Do not recolor Zephyr's photographs into bright purple or use exaggerated neon effects.

The result should feel like a premium sports documentary, not a gaming website.

---

## 3. SCROLL TIMELINE

Inspect the existing GSAP implementation before editing.

**Reuse the current ScrollTrigger architecture wherever possible.**

Requirements:

1. Preserve scroll-controlled cinematic progression.
2. Redistribute the existing scroll distance between the revised beats.
3. Do not significantly increase overall cinematic length.
4. Preserve smooth forward and reverse scrolling.
5. Avoid abrupt jumps between scenes.
6. Prevent premature release of pinned sections.
7. Ensure navigation appears at the correct completion threshold.
8. Handle fast scrolling, direction reversals, and viewport resizing.
9. Eliminate competing scroll handlers or animation conflicts.

The goal is a more coherent sequence, **not a longer sequence**.

Do not add multiple extra scroll screens just to accommodate the stadium reveal.

---

## 4. IPHONE AND MOBILE PERFORMANCE

Mobile smoothness is a top priority.

Inspect and correct any performance problems in the current cinematic implementation.

**Technical requirements:**
- Prefer transform and opacity animation.
- Avoid layout-triggering animation properties.
- Avoid expensive full-screen filter animations during scrolling.
- Optimize image decoding, loading, and asset dimensions.
- Avoid excessive simultaneous smoke or blur effects.
- Use lightweight atmospheric overlays.
- Limit persistent GPU layers and memory consumption.
- Ensure ScrollTrigger refreshes correctly after asset loading.
- Properly clean up all GSAP timelines, triggers, and listeners.
- Account for Safari dynamic browser chrome and viewport changes.
- Respect reduced-motion preferences.
- Ensure animations remain smooth on real iPhones.

If the full atmospheric treatment is too expensive for mobile, simplify effects without sacrificing the cinematic sequence.

**Do not sacrifice scroll responsiveness for visual effects.**

---

## 5. ASSET HANDLING

Use the uploaded Anna stadium reference photographs.

Choose the best available high-resolution image for the empty stadium reveal.

Prioritize the image with:
- Empty stadium.
- Recognizable Anna ISD architecture.
- Stadium lights.
- Purple end zone.
- Twilight sky.

The lower-resolution photos may be used as composition references, but should not be stretched into blurry full-screen backgrounds.

Use original, approved ZK logo and Zephyr photography already in the repository.

Do not replace the real Zephyr photography with AI-generated likenesses.

Do not use the generated storyboard or mockup as production imagery. They are creative direction references only.

If images require new crops or color grading, create optimized derivatives and preserve the originals.

---

## 6. PRESERVE THE EXISTING WEBSITE

Explicitly preserve:
- Existing homepage design outside the cinematic.
- Navigation architecture and destinations.
- Recruiting page.
- NIL-related content.
- Playoffs tracker.
- Media/video presentation.
- Contact information.
- Footer.
- Mobile layout and responsive behavior.
- Existing approved branding and copy.

No unrelated redesigns.

No new dependencies unless clearly justified.

No unnecessary architectural refactoring.

---

## 7. VALIDATION AND QA

Run the existing project validation suite.

Perform browser-level visual and interaction testing for:

**Desktop**
- Initial render.
- Full cinematic progression.
- Slow scrolling.
- Fast scrolling.
- Reverse scrolling.
- Header visibility.
- Transition into page content.

**Mobile**
- iPhone-sized Safari viewport.
- Portrait orientation.
- Responsive landscape behavior.
- Touch scrolling.
- Dynamic viewport changes.
- Image cropping.
- Animation smoothness.
- ScrollTrigger pinning and release.
- Reduced-motion fallback.

Verify that the intro does not introduce major layout shifts, horizontal overflow, blank frames, hydration errors, or console errors.

Test the transition from grayscale stadium imagery into muted color.

Where genuine iPhone/Safari testing is unavailable, clearly distinguish simulator or browser-emulation results from real-device validation.

---

## 8. ACCEPTANCE CRITERIA

The work is complete when:

- [ ] The cinematic no longer opens on an apparently blank page.
- [ ] Smoke and the centered existing ZK logo are visible immediately.
- [ ] Stadium lights ignite as the logo fades.
- [ ] The actual Anna stadium appears before Zephyr.
- [ ] The stadium begins monochrome and transitions subtly into color.
- [ ] Zephyr's existing photography remains black and white.
- [ ] Silhouette, hero, and supporting photo transitions feel cohesive.
- [ ] “MAKE THEM REMEMBER” remains the final statement.
- [ ] The existing website layout is preserved.
- [ ] The cinematic is not materially longer than before.
- [ ] Mobile scrolling and animation performance meet the existing baseline or improve.
- [ ] All available automated tests pass.
- [ ] Desktop and mobile QA findings are documented.

---

## 9. EXECUTION REQUIREMENTS

1. Inspect the current main branch and identify the existing cinematic implementation.
2. Document the current timeline, scroll distance, image assets, and relevant mobile performance risks.
3. Implement the smallest practical set of changes.
4. Integrate the provided stadium assets.
5. Validate across desktop and mobile.
6. Capture screenshots of each major beat.
7. Summarize what changed and what was deliberately preserved.
8. Open a pull request with the implementation, test results, and visual evidence.

**Do not merge or deploy automatically.**

Leave the finished PR ready for review.

### FINAL CREATIVE DIRECTION

This is not a website redesign.

The current ZK17 experience is already approved.

We are improving its cinematic storytelling by adding an atmospheric opening, introducing the actual Anna stadium, and making Zephyr's arrival more dramatic.

**Smoke → Logo → Lights → Stadium → Zephyr → MAKE THEM REMEMBER.**

Keep it dark. Keep it restrained. Keep it premium.

**Make the current website better — not different.**