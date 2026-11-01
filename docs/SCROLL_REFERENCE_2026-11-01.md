# Live reference inspection — 2026-11-01

Source: https://landonorris.com/ (current site, not an assumed historical version).
A Firecrawl live Chromium session inspected real DOM/scroll transforms. Its session expired before the requested follow-up summary/screenshots. A separate local headless Chromium browser then captured screenshots at 1440×900 and 390×844, using native scroll positions. Evidence: `artifacts/scroll-polish/reference/`; measured transform samples: `observations.json`.

## Five useful principles
1. **Bounded sticky narrative.** Hero remained at top 0 at scroll 0/500 then released at 1000; the on/off-track sticky item was at top 0 at scroll 6700 and had released by 7200. ZK17: preserve its hero layout and use a single short desktop On Field pin.
2. **Horizontal photo storytelling.** At desktop y=3400/4100/5000, the photo archive stayed at viewport top while its x transform changed from approximately −1473 to −2173 to −3073 px. Asymmetric images and captions remain separate editorial elements. ZK17: retain its existing personal arcade rail; do not add another forced horizontal chapter.
3. **Layered composition.** Oversized identity, photographs, captions and backgrounds create separate depth planes across the reference story. ZK17: independently transform photo, number and title; do not reproduce reference artwork or sequence.
4. **Progressive typography.** Text is split into line wrappers in the live document; scrolling exposes line-based editorial statements. ZK17: semantic, pre-rendered line spans in Field and Film Room, no character-splitting dependency. Exact proprietary timing/easing was not measured.
5. **Change the rhythm and adapt mobile.** Desktop archive is horizontal; mobile screenshot at y=2000 shows a vertical, asymmetric image/caption composition. Dark statement/light archive and on/off-track photography change the mood. ZK17: keep approved dark/light palette transitions, soften personal photo drift, remove pins on narrow/short screens.

## Evidence limits
The reference hero WebGL scene did not render fully in local headless Chromium (background/nav did render). The on/off-track photograph composition and horizontal archive rendered. Screenshots document sampled states, not exact frame-by-frame easing or a complete implementation audit. No claims about reference performance, device-native Safari, or all mobile animation sequences. The prior `REFERENCE_STUDY.md` remains historical evidence, not silently promoted to current observations.

No images, scripts, typography, proprietary geometry or reference branding were reused in the website. Reference screenshots are review evidence only. ZK17 native scrolling remains authoritative; no Lenis or scroll lock was added.
