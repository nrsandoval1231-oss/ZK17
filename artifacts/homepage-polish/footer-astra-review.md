# Astra independent footer review

**Final disposition: no unresolved P1/P2 defect found.** Footer composition, controls and source gates pass. The navigation defect identified during review is resolved. Reviewed the footer-only source diff and rebuilt static export after `/workspace/scratch/zk17-footer-build.log` completed. No product files edited.

## Finding

- **Resolved P2 — ordinary-motion Back to Top stopped inside the pinned Arrival sequence.** At 1206px, clicking or keyboard-activating the footer link sets `#arrival` but settles at `scrollY=2088`, rather than the document top; the hero is visible but the header is absent. Reduced motion returns correctly to `scrollY=0`. In `components/use-story-motion.ts`, `reconcileAnchor` (lines 54–56) computes the anchor from the pinned element’s viewport top plus current scroll position. The fix now resolves this anchor from the `arrival-hero` ScrollTrigger start, falling back to document top. Final direct Chromium rechecks at 1206px and 390px returned to `scrollY=0` and `#arrival` for both click and keyboard Enter with ordinary motion enabled. This behavior predates the footer-only markup change but is exposed by its Back to Top control. Before evidence: `footer-astra-backtop-motion.jpg`. Fixed evidence: `footer-astra-backtop-fixed-1206.jpg` and `footer-astra-backtop-fixed-390.jpg`.

## Composition

The final spacing pass was rechecked at all five widths and the screenshot evidence refreshed. The rendered footer follows the described reference: exact `#09090d` background; small canonical sword at the upper left; three-line statement in the center; large underlined Back to Top at the right; monumental sword beside a square monochrome smiling sideline portrait; and thin rules around the copyright row. At 375/390px the identity row stacks cleanly, with the complete sword and the athlete's face visible. At 768px it retains the two-column identity layout without overlap. The quiet recruiting/contact links remain below.

The owner attachment was unavailable to this reviewer. This confirms the described composition, not exact pixel fidelity to the attachment.

## Verification

- Used direct Playwright with `/usr/bin/chromium` against port 3100, without the shared CLI output directory.
- Checked 1206, 1440, 390, 375 and 768px. Document width matched viewport width at every size; images decoded and the portrait remained square without stretching.
- Every footer link measured at least 44px in both dimensions. The smallest contact target was approximately 48.4×44px. The home mark was 56×56px on mobile and 84×84px on larger layouts.
- Axe reported zero footer violations at all five widths. Images retain descriptive alternatives, and contact/recruiting links use a named navigation region.
- Clicking Back to Top returned to `#arrival` with `scrollY=0` at all five sizes under reduced motion. Final ordinary-motion click and keyboard Enter activation now also reach `scrollY=0` at 1206/390px after the supporting navigation fix.
- The footer uses the canonical `BrandLogo` asset twice, without substituting a recreated mark (`components/homepage-chapters.tsx`, lines 36 and 41; `content/brand.ts`).
- The portrait receives the existing `personalPhoto` selection and remains conditional (line 42). That selection still uses approved scene photos or gated preview crops through `resolveScenePhoto`; this change does not bypass the preview/rights gates. The preview caption remains visible. An approved original portrait is still required before treating this crop as production-approved imagery.
- Contact remains conditional on `nilContact` (line 46), supplied through `publicNilContact` in `app/page.tsx`. Existing approved destinations and recruiting routes are preserved.
- Source changes comprise the footer markup, its styles, documentation, and the focused Arrival-anchor destination correction in `use-story-motion.ts`; other anchor branches are preserved. The homepage still contains six sections.

The implementation agent additionally reports **16 passed / 2 skipped** in its final focused Chromium/mobile/reduced-motion suite, including a regression test for ordinary-motion Back to Top. This is implementation-agent evidence, separate from the direct reviewer checks above.

## Evidence

Screenshots in this directory: `footer-astra-1206.jpg`, `footer-astra-1440.jpg`, `footer-astra-390.jpg`, `footer-astra-375.jpg`, and `footer-astra-768.jpg`.

This footer review covers Chromium. No claim of independent WebKit or physical-device validation is made here.
