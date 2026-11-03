# Independent integrated-candidate review

Status: IN PROGRESS. Final source freeze, rebuilt runtime, completed integrated checks and screenshot inspection are pending. This is not a clean-check certification or merge/deployment approval.

Reviewer: separately dispatched Astra critic. Baseline: `e2820d3`, branch `feat/cinematic-opening-refinement`. Scope includes official Hudl integration, exact header WATCH FILM removal, stable field pin lifecycle, removal of the later montage monogram while retaining cold open, additional color action photo while retaining all existing photos/timing, and transparent white Film Room logo. Reviewer owns this report only.

## Findings during integration

- P2: Initial new-photo patch replaced the existing running photo in component and timeline. Builder repair is in progress. Final acceptance requires both photographs remain visually present, not merely two DOM nodes in the same position.
- P2: Initial new-photo patch hardcoded a PreviewPhoto inside the component and bypassed the established preview-media filtering. Current source uses campaign photo lookup instead; final provenance and preview-distribution manifest checks remain pending.
- Verification defect: Initial new test used `.blackLogo`, although the class is CSS-module generated. Reported for correction before final run.
- Known upstream accessibility limitation: earlier real Hudl iframe scan reports serious `aria-prohibited-attr` on its cross-origin JW Player. Final integrated scan result must be reported without exclusions or clean accessibility claims.

## Direct inspection so far

- Reviewed actual source/test diff, existing lifecycle probe code and JSON, and real-playback capture code and JSON. Earlier logs predate the additional montage/logo changes and do not certify this final candidate. `e2e-accepted.log` currently ends mid-run without a final summary.
- Canonical `public/brand/zk17-monogram-512-v2.png` independently decoded with Sharp: 512x512 RGBA, 217923 fully transparent pixels, 44221 white nontransparent pixels, zero nonwhite nontransparent pixels. CSS removes the blackening filter, radial background and padding.
- Viewed `public/media/zephyr-color-action.webp`; independently decoded as 540x474 RGB. Original-source identity/provenance and final layout verification remain pending.
- Source retains the Hudl iframe descriptive title, lazy loading, fullscreen/PiP permissions, strict-origin referrer policy and absence of autoplay permission. Header action removal retains navigation and separate hero action. Field native pin spacer avoids dynamic reparenting; earlier probe JSON records eight zero-error, zero-reparent, one-load runs, but final candidate requires fresh verification.

Remaining uncertainty: final integrated browser results, visual montage composition, actual Hudl lifecycle after final rebuild, physical iPhone/fullscreen/PiP behavior. No merge or deployment performed by reviewer.
