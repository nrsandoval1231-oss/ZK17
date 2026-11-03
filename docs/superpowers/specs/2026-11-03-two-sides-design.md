# ZK17 — Two Sides / dedicated pages

Status: proposed for review. No product implementation yet.

## Intent and scope
Preserve the existing ArrivalExperience cinematic homepage opening, logo, local Barlow Condensed/DM Sans fonts, black/ivory palette and purple accents. Follow it with a compact editorial discovery experience linking to dedicated performance and lifestyle pages. Preserve Film/Highlights, Recruiting, NIL and Playoffs functionality. No merge or deployment.

## Audit findings
- Next.js App Router, static export, React 19, GSAP ScrollTrigger and local responsive AVIF/WebP assets.
- Homepage composed in components/site-experience.tsx; opening isolated in components/arrival-experience.tsx.
- Existing On the Field hero is a homepage section; TwoWorlds links to homepage anchors. OffFieldArcade, journey, photo gallery and optional statistics extend the homepage.
- Current routes: /, /film/, /about/, /recruiting/, /nil-recruiting/, /playoffs/. Header destinations are duplicated in homepage and RouteHeader.
- useStoryMotion owns field pinning, personal horizontal rail and other section-specific triggers. Removing homepage sections requires removing or guarding their triggers. Arrival motion must retain its independent owner.
- Reuse BrandLogo, RouteHeader focus management, existing field hero composition, responsive photo derivatives, content eligibility gates and owner-supplied interests.
- content/site.ts statistics array is empty. No figures may be inferred from historical image graphics. Verification requires external evidence before publication.
- Existing photo inventory explicitly records preview-only crops, pending final original/rights records. Smiling restaurant portrait, fishing, gaming, canyon, Christmas, VR and family originals and latest approved mockup are absent from repository assets inspected.
- Four interest categories contain owner-supplied picks. Music, Favorites, Adventure, Family & Friends need explicit pending copy unless further evidence is supplied.

## Approaches
1. Recommended: retain opening; replace subsequent redundant field/personal homepage sections with discovery; add /on-the-field/ and /beyond-17/; reuse existing photographs only as temporary review assets where originals are absent. This enables review but cannot establish final visual fidelity or supply missing lifestyle content.
2. Same architecture, defer visual implementation until approved mockup and originals arrive. More faithful first review, but blocks build on unavailable assets.
3. Retain homepage sections and append pages: rejected because it duplicates content and retains excessive page length.

## Proposed implementation
Homepage: opening followed by TWO SIDES. / ONE ZEPHYR. on warm ivory. Full-width desktop photographic diptych with subtle diagonal division; full-area semantic links to each dedicated route; no buttons or arrows. Dark field panel and warmer personal panel, large labels and exact requested subtitles. Mobile uses two stacked independently tappable panels. Hover uses gentle transform zoom and purple divider emphasis, disabled for reduced motion. Preserve compact closing/contact treatment.

On the Field: relocate/reuse existing cinematic field hero without introducing a long pin. 2026 performance typography supports all six requested metrics. Typed season and game records carry source URL, verification date, coverage and publication eligibility. Missing values are pending, never zero. Game table and editorial signature performances display only verified records; no highlights embed or duplicate video section.

Beyond 17: exact requested headline, subtitle and copy. Existing sideline portrait may serve only as a documented temporary preview image if accepted. Eight accessible category selectors reveal a content panel with short opacity/transform transitions; use supplied picks and explicit pending text. Native horizontal scroll-snap gallery, centered large photograph and partial adjacent frames; keyboard controls, touch pan and visible captions. No fabricated lifestyle moments or football photos miscaptioned as family activities. Missing lifestyle inventory is documented.

Navigation: shared destination list, all seven requested destinations resolve to dedicated pages; retain existing /film/, /recruiting/, /nil-recruiting/, /playoffs/ compatibility. Avoid mobile header crowding. Update sitemap as needed.

## Validation and delivery
Run baseline and final unit tests, typecheck, lint and production export audit. Add meaningful data validation and navigation/interaction coverage. Capture desktop and mobile screenshots. Check Chromium and WebKit mobile emulation, reduced motion, overflow, image requests, touch carousel versus vertical scroll, and unchanged opening. Physical iPhone Safari testing must be reported separately if unavailable. Include audit, photo inventory, stat evidence log, results and limitations in PR; never claim unperformed verification.

## Open inputs
Approved reference image and authentic lifestyle originals are unavailable. External source verification is outstanding. Implementation approval and temporary-photo preference are pending. Missing content must remain explicit rather than invented.
