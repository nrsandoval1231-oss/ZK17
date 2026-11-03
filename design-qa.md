# Homepage cinematic polish design QA

final result: blocked

**Blocker:** Exact asset fidelity cannot be completed from the repository. The approved mockup's helmeted throwing portrait, casual lifestyle portrait, smiling lifestyle photograph and close rear stadium original are absent as rights-approved originals. Existing source-preserving football/sideline review crops are retained behind PREVIEW_MEDIA_MODE with visible disclosure. Do not promote these to approved photos or claim an exact match. No generated likenesses or fabricated data were introduced. This is a draft owner-review implementation, not a release certification.

**Source visual truth:** Owner's attached 853 × 1280 approved image in the task conversation. There is no corresponding downloadable source file in the workspace. The parent agent can view the conversation image; the independent Astra critic cannot, so its review does not certify exact source matching. A persisted combined source/implementation comparison is unavailable. No pixel-diff score is claimed.

**Implementation evidence:** `artifacts/homepage-polish/after/853-comparison.jpg`, individual section captures in the same directory, desktop 1440 and mobile 375/390/430, tablet 768, 1024, plus iPhone-sized WebKit 390 captures. CSS viewport and screenshot widths match; deviceScaleFactor=1. Four-section comparison strips stitch browser-rendered section captures without rescaling, excluding the preserved opening/header/footer. Source is a designed composite rather than a browser viewport. Intrinsic section heights necessarily differ from its composite, especially on mobile and for honest unavailable statistics. Oversized-wrapper screenshots were discarded because browser compositing showed stale offscreen carousel frames; authoritative comparisons use the stitched captures and individual frames.

## Fidelity surfaces

- **Typography:** Self-hosted OFL Bodoni Moda medium italic replaces the generic Georgia display fallback for the mockup's high-contrast editorial titles. Existing Barlow Condensed labels and DM Sans body preserve brand continuity. White/purple ON THE FIELD, black/purple BEYOND 17, white/purple FOLLOW THE JOURNEY and closing NEXT CHAPTER use deliberate responsive wrapping.
- **Spacing/layout:** Authentic left portraits/right text on desktop; four-column statistics become 2×2 on phones. Ivory Beyond is compact, with PLAYER17 directly below introduction. Native overlapping photo rail and closing flow without pins or artificial spacers. Mobile images stack without stretching. Natural section flow preserves the existing two opening experiences.
- **Colors/tokens:** Obsidian/charcoal, warm #eee8df ivory, signature purple accents and restrained tinted existing smoke artwork. Thin statistical separators, minimal category rules, soft carousel corners; canonical sword asset unchanged.
- **Images:** Subject, face and uniform are untouched. Existing review crops have insufficient resolution/rights status and differ from mockup lifestyle poses. Closing uses an authentic rear #17 crop with helmet crown and jersey number visible, not generated stadium/athlete content. This remains the principal fidelity blocker.
- **Copy/content:** Required chapter headings/supporting lines, all approved interests and rankings, verified existing contact/recruiting destinations. Minimal introduction derives only from the supplied interest list. Exactly four unavailable 2026 statistics, with no mock values. Social links absent because none are verified. No new commitment announcement.

## Comparison history and fixes

1. Initial layout: Beyond image intrinsic height made the spread too tall; made its picture fill a bounded figure and tightened section proportions. Reduced oversized field/social/closing geometry toward the mockup's compact chapters.
2. Astra found a mobile photo-caption / identity overlap caused by a negative margin. Removed margin; rebuilt check confirmed 9px separation at 390px.
3. Initial closing contain layout exposed hard turf edges. Switched to bounded cover, edge fades and a shorter closing; final 18% focal position keeps complete helmet and number 17 visible at 1440. Mobile crop stays independently composed.
4. Carousel initially used the wrong offset reference for programmed selection. Corrected rail-relative centering; keyboard/dots and independent Astra measurement confirm under 1px center error. Native touch and vertical gestures tested separately.
5. Static reduced-motion retains the layered composition while removing transitions and smooth selection. No continuous autoplay.

## Verification and critic

See `artifacts/homepage-polish/QA.md` for final commands/counts and `astra-review.md` for the explicitly requested Astra critic. The critic independently checked final renders and reports no unresolved P1/P2 functional/layout defects. Physical iPhone hardware was unavailable; Playwright WebKit is engine emulation, not a physical Safari certification. No browser console errors or broken new-chapter images in responsive checks. Dedicated pages remain reachable; accessibility checks cover new chapters and footer.

## Remaining work before visual acceptance

- Owner supplies/approves the matching original photography and scene assignments.
- Owner reviews the remaining pose/crop and reference-composition differences in this draft PR.
- Perform physical iPhone Safari verification before release.
- Populate statistics and social links only when the existing source/approval system has verified records.

No merge or deployment performed.
