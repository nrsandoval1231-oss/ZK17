# ZEPHYR KREYE off-field arcade

The off-field arcade follows the approved concept in `public/concepts/player17/off-field-v1.png`. Its stadium art is decorative illustration, not a photograph or a claim about a real venue. All headings, category choices, status copy, and controls remain HTML. The illustration is loaded responsively from `/media/arcade/player17-stadium-*`.

The Games, Movies and TV Shows choices use `offFieldFeatures` in `content/site.ts`. The owner supplied three picks per category, retained in the supplied order; common title spellings are normalized. Only put a preference in `verifiedDetails` after owner approval. The first three entries render as an ordered list. Empty lists retain an honest coming-soon state. No preference is inferred and no selection is stored between visits.

The horizontal rail is a desktop story transition. On narrow screens and when reduced motion is requested, the intro and CRT stack in normal document flow. Native category buttons open picks immediately by click, touch, Enter or Space. Back/Escape restores focus to the activating category; when Press Start opens the list, focus returns to Press Start.
