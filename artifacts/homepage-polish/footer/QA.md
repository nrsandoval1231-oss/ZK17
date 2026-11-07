# Owner-selected footer refinement

Reference: the owner's 1206px-wide dark footer attachment supplied after PR #14. This replaces only the footer composition, retaining Next Chapter and the six-section homepage.

- Small canonical sword, three-line statement, prominent underlined Back to Top.
- Monumental canonical sword beside the authentic monochrome smiling sideline portrait.
- Fine copyright rules, quiet approved contact/recruiting links at the baseline.
- Natural stacked layout on phones; photo and canonical identity remain intact.
- Existing photo rights/preview gates and visible original-pending disclosure remain.

Captured final footer screenshots at 375, 390, 430, 768, 1024, 1206 (reference width) and 1440px. All images decoded, with no horizontal document overflow. Compare `1206.jpg` with the conversation reference; no image rescaling or generated athlete imagery was used.

Validation: TypeScript, lint and production build passed; the full unit suite has 65 passing tests. The final homepage suite passed 16 checks across desktop Chromium, mobile Chromium and reduced motion (two intentional non-mobile CDP skips), plus five iPhone WebKit checks (one unsupported CDP skip). Axe coverage includes the new footer.

Astra independently reviewed five widths, 44px targets, exact canonical identity, portrait visibility, source gates and click/keyboard behavior. See `../footer-astra-review.md`.

Astra found a pre-existing pinned-anchor issue exposed by the prominent Back to Top link: the pinned Arrival's top:0 measurement could preserve a late scroll offset. A new regression test failed before the correction. `use-story-motion.ts` now resolves #arrival through the Arrival ScrollTrigger's start, with document-top fallback. The same test passes on Chromium and WebKit; independent click and keyboard activation reach scrollY=0 at desktop/mobile widths. Other anchor branches and the opening animation choreography remain unchanged.

No merge or deployment performed. Physical iPhone Safari verification and the other homepage's missing original photographs remain as previously documented; neither is represented as resolved by this footer update.
