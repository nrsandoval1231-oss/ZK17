# Road to State review evidence

- `baseline/`: existing live ZK17 homepage, desktop/mobile, before the new route.
- `after/`: /playoffs screenshots and interaction recordings, including horizontal bracket navigation, region/list switching and Game Center. Error arrays are empty.
- `retrieval/`: official PDFs and timestamp/hash/change report; raw HTML intentionally ignored by git.
- `sources/`: alignment PDF, extracted bracket page, and observed UIL-linked 2026 bracket excerpt. No actual qualifiers/results were available.
- `unit-results.txt`, `e2e-results.txt`, `build-results.txt`: actual final validation output.
- `fixture-render-results.txt`: isolated synthetic-result browser proof; fixture content was never copied into the actual site artifact.
- `font-shift-before.json`, `font-shift-after.json`: deliberately delayed font loading before/after the reserved numeral geometry.
- `viewport-checks.json`: 320/390/768/1440 widths and reduced motion.
- `lighthouse-mobile-compressed.json`: last compressed local lab check. The other Lighthouse reports retain exploratory uncompressed runs and intermediate investigations.
- `compression-check.json`: local transfer compression negotiation/content equivalence.

See [QA](../../docs/PLAYOFFS_QA.md) and [source/update rules](../../docs/PLAYOFFS_DATA.md). Exact owner Anna logo and canonical mockup are missing; visual acceptance remains blocked. Simulated mobile LCP remains above the earlier 2.5s target. No deployment, field-INP or physical-device claim.
