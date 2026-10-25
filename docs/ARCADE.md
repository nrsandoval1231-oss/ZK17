# PLAYER17 off-field arcade

The off-field arcade follows the approved concept in `public/concepts/player17/off-field-v1.png`. Its stadium art is decorative illustration, not a photograph or a claim about a real venue. All headings, category choices, status copy, and controls remain HTML. The illustration is loaded responsively from `/media/arcade/player17-stadium-*`.

The three category choices come from `offFieldFeatures` in `content/site.ts`. Only put a preference in `verifiedDetails` after it passes the existing owner and evidence approval gates for published profile content. Empty lists render a category-specific “coming soon” state. The arcade does not infer favorites from placeholder copy or store a selection between visits.

The horizontal rail is a desktop story transition. On narrow screens and when reduced motion is requested, the intro and CRT stack in normal document flow. Native radio controls provide category selection; Escape returns from a category screen, and the back control restores focus to Press Start.
