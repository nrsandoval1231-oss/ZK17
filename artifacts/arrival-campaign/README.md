# THE ARRIVAL — frozen product d46943f

Final verification: 51 unit tests and 194 browser tests passed; 18 existing conditional browser skips; zero failures. Lint, typecheck and production build passed. Playwright-managed Chromium is the default; WebKit also ran.

`validation.json` covers twelve captured scenarios: desktop, laptop, tablet, mobile, Android-sized, small, landscape, iPhone WebKit, desktop/mobile no-JS and desktop/mobile reduced motion. Desktop sequence captures include initial, midpoint, final, reverse and resize. Each interactive viewport also has preserved film-framing and Playoffs-logo captures. Controller inspected the six representative desktop/mobile hero, film and Playoffs images after the last product repair. Earlier `reviewer-*` images belong to the independent review and are historical candidate evidence.

`performance.json` is the final isolated local lab measurement after other browser suites ended: desktop LCP248ms/CLS0.00760, mobile LCP304ms/CLS0.00145; image encoded bytes669877/365183 respectively. Headless managed Chromium, DPR1, no CPU/network throttling, local static server. These are not field or physical-device guarantees. Desktop LCP is the intentional initial state before scroll, not the completed reveal.

Original video, canonical logo and five original review crops retain their baseline hashes. Supplied portrait UI covers lower legs; the presentation fades before occlusion without generating missing anatomy. Source resolution and canonical sword-logo differences remain explicit limitations. All new derivatives stay preview-only and the public distribution audit blocks them.

Full method, regressions and review decisions: [QA report](../../docs/ARRIVAL_CAMPAIGN_QA.md). Raw command logs and independent review reports: `.agent/evidence/arrival-campaign/`. No campaign merge or deployment was performed.
