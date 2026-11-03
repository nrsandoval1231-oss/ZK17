# Photo update verification — 2026-11-03

Base PR head: 747c2776ff376d1731f151dbe5c0c3b15e9f631e. Working branch: fix/pr13-photo-selections; destination: existing feat/two-sides-dedicated-pages / PR13.

## Final checks
- npm test:68/68 pass.
- npm run typecheck and npm run lint: pass.
- npm run build: pass; final rebuilt after portrait focal correction;12 static outputs including two new routes.
- npx playwright test tests/e2e/selected-photos.spec.ts tests/e2e/two-sides.spec.ts --workers=4:28/28 pass on final rebuilt export, desktop Chromium/mobile Chromium/iPhone13 WebKit/reduced motion.
- Impeccable detector on changed UI files:[] findings.
- git diff --check: pass.
- All36 derivative files match source ledger hashes and review-only distribution entries; EXIF/IPTC/XMP absent, no upscaling. SelectedPhotos gating and public-release audit independently verified.

## Visual verification and independent review
Lead captured desktop1440x1000/mobile390x844 using scripts/capture-two-sides.mjs; images now decode before screenshots to avoid blank capture races. Updated discovery, field and Beyond screenshots are in this directory.

Independent Astra reviewed code/assets/release boundary and inspected discovery/Beyond at1440x900,1920x1080,390x844. Initial portrait head clipping was corrected to top-biased50%0% focal point; final six state re-review passed with no outstanding material findings. Mobile field throwing image confirmed visible after decoding. Five-photo mobile gallery advanced through all frames, disables Next on last frame, no errors/overflow. Physical iPhone Safari touch/toolbar behavior remains untested.

## Scope and source truth
Eight selections/36 derivatives: two local football originals, five original personal library photos, plus one documented crop of the birthday original. No restaurant image, synthesized person, inferred relationship or raw embedded original metadata. User originals remain outside Git; source basenames/hashes and crop rectangle are in docs/SELECTED_PHOTOS.json. All new selections are review-only until a separately authorized final release. Existing cinematic scene implementation/video, performance content and navigation destinations remain unchanged.

Three Luna builders handled bounded media/UI/tests scopes; lead integrated and ran final checks; Astra reviewed independently. Early test failures were test-loader/stale expectation/lazy-load-state issues and were corrected before final passing run.

Owner authorized PR update only: no merge/deploy. Every outgoing commit uses [CF-Pages-Skip] prefix to suppress Cloudflare automatic deployment. Old remote preview remains the earlier version. This evidence proves local reviewed behavior, not live deployment of this update.
