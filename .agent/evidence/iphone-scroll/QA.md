# iPhone cinematic scroll repair

Owner reports real iPhone jitter after release2b788fc. Automated browser validation did not establish physical-device smoothness.

## Reproduced cause
On production WebKit at width390 and unchanged scrollY600, height-only resize664→754 changed intro travel1062→1206px and athlete opacity0.90→0.45. See toolbar-before.json. Hook used changing innerHeight for scroll distance while the scene used100svh; global story resize handler also refreshed pins every resize. Hero image load/decode callbacks refreshed and wrote scroll position for absolutely positioned images, potentially interrupting native momentum.

Effect isolation on software WebKit showed only a modest timing difference removing blend/filter/smoke (p9548→46→48ms); no evidence justifies changing approved artwork as the primary repair.

## Repair scope
Capture mobile scene height on mount and true width changes, use scene height for travel, retain desktop responsive behavior and normalized rotation restoration. Remove hero decode/load scroll restoration and redundant story image-load refresh; retain font and observed layout-size refreshes. Ignore mobile height-only story resize refresh. Preserve scene media/order/effects, native touch gestures, reduced motion, header release and anchors.

## Acceptance boundary
Fresh typecheck/lint and browser checks required on final source. DEV preview plus physical iPhone retest is the handoff; browser-emulated frame timing is not a promise of physical-iPhone60fps. Production remains the previously released commit until this repair is accepted.

## Final validation
Lead final typecheck and lint exit0; 62 unit tests pass. Integrated68 checks:67 passed; one assertion-complete case failed at context.close with Playwright trace-copy ENOENT because a builder job concurrently cleaned shared test-results. That exact desktop cinematic case passed on an isolated-output rerun1/1. Failed intermediate candidate logs are retained. Independent reviewer reran12/12 across Chromium/WebKit (rotation, toolbar and early swipe twice) plus6 fresh WebKit immediate-scroll/image-load probes. No image-event scrollTo writes, positive1350px travel at ready, y600 remains stable. Final source retains all new regression cases on every browser project; none skipped.

Additional causes corrected: spurious same-width orientation events cannot refit frozen scene; normalized rotation snapshot captured synchronously; timeline's deferred initial pin refresh is completed before publishing ready. Early-input regression checks positive travel and unchanged first-scroll position across font readiness. All receipts are browser evidence; owner physical iPhone swipe testing remains required to validate perceived smoothness.

## Deployed DEV verification
DEV deployment78c08eb7-ac06-41d1-9ab5-f0b913cb3605 serves product35379f0 at https://78c08eb7.zk17-review.pages.dev and the cinematic-opening-dev alias. Production remains2b788fc/a8a5f16c. PR12 opened for phone retest.

Live desktop and iPhone-sized WebKit checks pass: positive pin travel at ready, early scroll remains600, completed rotation retains half progress, header releases/reverses, cold logo returns0.9, no page errors/horizontal overflow, preview noindex header present. Live toolbar probe reproduces stable height664/travel1062/opacity0.8998 across viewport664/724/754/724/664. See live-dev.json and toolbar-live-dev.json.

A first live script produced a false negative by polling normalized progress against old bounds before180ms rotation handling had settled. It then rotated back and programmatically reversed while the rotation timer was pending. Reviewer traced the event sequence; corrected script first awaits new624px and1350px travel for each rotation, then normalized progress. Exact unchanged deployed source passes. Independent remote repetitions also pass5desktop/3WebKit. No invalidateOnRefresh source change retained. The corrected live probe covers geometry-aware rotation and reverse state; the exploratory additional test was discarded with no product change.
