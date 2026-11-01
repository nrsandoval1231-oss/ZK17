# ZK17 scroll polish evidence

See [QA report](../../docs/SCROLL_POLISH_QA.md) for methodology, actual test results, measurements and limitations, and [reference study](../../docs/SCROLL_REFERENCE_2026-11-01.md) for observed behavior versus unknowns.

- `before/`: untouched PR head 185e0eb, desktop/mobile screenshots and native wheel recordings.
- `after/`: final software, screenshots, scroll recordings and runtime error arrays.
- `reference/`: research-only screenshots, measured scroll transform samples and interaction recording. No reference assets are used by the website.
- `performance/`: paired Lighthouse reports and last code commit recheck.
- Top-level Lighthouse reports: initial exploratory runs; see QA report for variation.
- `browser-qa.json`: sampled pin/release/scale/overflow and Chromium DevTools Performance-domain metrics.
- `e2e-results.txt`, `build-results.txt`: final command output.

These are local lab/emulated-browser artifacts, not proof of physical-device or field Core Web Vitals performance. No public deployment is included.
