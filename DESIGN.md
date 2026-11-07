# ZK17 — approved cinematic homepage

The owner-supplied November 3, 2026 mockup is the visual authority for sections 03–06. This is a targeted homepage redesign, not a rebuild. Preserve the existing MAKE THEM REMEMBER Arrival and EVERY SECOND COUNTS experiences, their motion ownership, canonical ZK sword monogram, dedicated routes and verified content gates.

## Six chapters, in order

1. MAKE THEM REMEMBER — existing cinematic Arrival, unchanged.
2. EVERY SECOND COUNTS — existing hero and film experience, unchanged.
3. ON THE FIELD — obsidian, authentic monochrome athlete portrait on the left, large italic editorial serif ON THE / purple FIELD on the right, THE COMPETITOR and ZEPHYR KREYE / QB / #17. Finish with a single four-column statistical strip: TOTAL YARDS, TOTAL TD, QB RATING, COMP %. No embedded highlights, Hudl, Game Film or extra statistics section.
4. BEYOND 17 — warm ivory editorial spread, authentic personal photograph on the left, black BEYOND / purple 17 on the right, supporting line “Beyond the lights. Beyond the game. Beyond 17.” Compact PLAYER17 categories preserve Games, Movies, TV Shows and Anime, approved rankings, Back/Escape and focus restoration. No duplicated personal introduction, giant cabinet or pinned horizontal rail on the homepage. The reusable full arcade remains available in its component.
5. FOLLOW THE JOURNEY — dark atmospheric photography rail, editorial white/purple headline and THE STORY CONTINUES. Centered dominant photograph, overlapping receding neighbors, native horizontal swipe and scroll snapping. Keyboard Left/Right/Home/End and accessible 44px pagination. Verified social destinations only; no widgets, counts, decorative arrows or autoplay.
6. NEXT CHAPTER — dark stadium atmosphere, authentic rear-facing #17 photograph when available, THE STORY IS STILL BEING WRITTEN, canonical sword identity and compact footer with existing recruiting destinations. No commitment announcement.

The standalone Journey timeline, its anchor, spacers, triggers and homepage styles are removed. Verified milestone records remain in `content/site.ts` for potential future reuse; do not create a Journey page.

## Visual system

Obsidian #09090D and charcoal; warm ivory #eee8df; restrained signature purple and lavender. Self-hosted OFL Bodoni Moda italic supplies the high-contrast editorial serif (Georgia fallback), Barlow Condensed remains the small uppercase campaign labeling, DM Sans remains the body face. Preserve self-hosted licensed fonts and existing brand assets. Photography is the primary visual; no generic cards or generated athlete likenesses.

Canonical identity remains the exact owner-supplied square ZK sword monogram. Do not trace, redraw or add a competing wordmark. See `docs/BRAND.md`.

## Photography and evidence

Existing preview crops remain review-only under PREVIEW_MEDIA_MODE; they retain visible original-pending labels and are never promoted to approved media. Approved scene assignments take precedence. No generated faces, stock athletes, inferred biography or synthetic alterations. The repository currently lacks the mockup’s helmeted throwing portrait, casual lifestyle and smiling lifestyle originals. Use authentic existing football and sideline photography for review and disclose the mismatch. Rear-facing review photography already exists in the director’s-cut assets.

Statistics use the explicit 2026 season adapter in `content/homepage-stats.ts`. Passing and rushing components must be verified complete-season totals for the same season/game count, with exactly one record per metric. Never sum an already-aggregated total with a component. QB rating requires the source’s named calculation; do not infer or convert rating systems. Unverified values show an em dash with NOT YET VERIFIED. No mockup numbers. Current verified stats and social profiles are empty.

## Motion, responsive and accessibility

Natural vertical flow throughout chapters 03–06. Preserve opening GSAP behavior, but no field pin, timeline motion or personal rail pin. Reuse existing atmospheric smoke artwork with bounded transforms and opacity; no continuous animations. Carousel uses native scroll, never cancels vertical touch gestures; reduced motion removes depth transitions and uses instant selection. No forced smooth scrolling in reduced motion.

At 375/390/430px, stack field photography and typography, render 2×2 statistics, stack Beyond imagery and introduction, and show adjacent carousel photos. At 768/1024px retain deliberate split compositions when readable; desktop mirrors mockup proportions. Respect subject visibility, readable labels, intrinsic image dimensions and no horizontal document overflow. Preserve accessible menus, visible focus, semantic headings and touch targets >=44px.

## Review

Typecheck, lint, production export, unit/content tests, browser route/interaction checks, responsive captures and WebKit/reduced-motion verification precede handoff. Screenshots and statistics notes accompany the feature PR. No merge or deployment before owner review. Asset omissions and physical iPhone limitations must be stated honestly.

## Owner-selected identity footer — November 3

Replace the compact footer with the supplied dark identity-footer reference: small sword at upper left, the three-line story / ZEPHYR KREYE · QB1 / BIGGER STAGE statement centered, prominent underlined BACK TO TOP at upper right, monumental canonical sword on the left and authentic monochrome sideline portrait on the right. Thin horizontal rules frame the copyright baseline; approved recruiting/contact links remain quiet at the bottom. This belongs to the existing closing/footer experience, not a seventh chapter. Phones stack the monumental mark and portrait with readable statement and 44px targets. Retain photo approval/preview gates.
