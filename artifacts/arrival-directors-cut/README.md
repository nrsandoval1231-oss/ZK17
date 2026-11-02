# Director’s-cut review evidence

Product source: `e1acea9`; subsequent `bbd4f6b` changes only the test seek helper. Full capture: twelve successful scenarios, eight motion cases with eighteen midpoint/hold samples each, plus no-JavaScript and reduced-motion cases. Exact checks and limitations are in [validation.json](full/validation.json).

- [Desktop story sheet](full/desktop-story-contact.jpg)
- [Mobile story sheet](full/mobile-story-contact.jpg)
- [Desktop Film Room](full/desktop-film-final.png) · [Mobile Film Room](full/mobile-film-final.png)
- [Desktop Playoffs](full/desktop-playoffs.png) · [Mobile Playoffs](full/mobile-playoffs.png)

- [desktop recording](full/videos/page@a7a028b21388a6ee1bb0572c77a7b591.webm)
- [mobile recording](full/videos/page@1b88612fbb3468fb442f5bf6a003b32f.webm)
- [iphone-webkit recording](full/videos/page@6ab45853424eced2babc5b0a08fd22ec.webm)

Recordings show automated browser scroll seeks/holds, not physical-device swipes or an authored autoplay film. Touch-enabled WebKit validates scroll-driven state changes; physical Safari toolbar behavior and hardware smoothness remain unverified. Final source/fidelity/media limitations and owner checklist are in [QA](../../docs/ARRIVAL_DIRECTORS_CUT_QA.md). `reviewer-slow-script-initial.png` is historical pre-fix regression evidence, not the final opening.

Live deployment: https://c9641529.zk17-review.pages.dev. [Remote checks and asset hashes](remote/verification.json); remote desktop/mobile story, film and Playoffs screenshots in `remote/`. WebKit film screenshot verifies geometry/controls, not decoded video appearance.
