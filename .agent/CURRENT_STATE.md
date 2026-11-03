# ZK17 production release completed

PR #11 squash merged at 2026-11-03T01:59:53Z. Deployed source: 2b788fcf6e70a3706b47fd325e014da9aea25fc1. Cloudflare production deployment: a8a5f16c-4444-40eb-a8da-99606c98c479. Live: https://zephyrkreye.com/. Local checkout is main at the deployed merge commit.

Validation: 60 scrolling E2E checks passed before release; independent Astra release review passed 8 WebKit checks. Live production forward/reverse GSAP pin/header behavior passed on desktop Chromium, mobile Chromium, and iPhone-sized WebKit without page errors or horizontal overflow. Production 200-frame p95: desktop20.3ms, mobile Chromium17.8ms, WebKit49ms; WebKit7 frames exceeded50ms. Prior baseline comparison showed no regression. Physical iPhone and sustained hardware60fps are unverified.

Production desktop/mobile controls checks passed: removed prompts/buttons absent, active underline, mobile menu focus/Escape, playoff region controls. Initial supplemental control script used the wrong case-sensitive accessible name PREVIOUS; corrected to actual Previous bracket section and reran successfully. No product changes were needed.

Live Hudl playback advanced on desktop/mobile WebKit; desktop fullscreen entered iframe. All seven checked routes HTTP200 with production canonicals and no noindex header. Original image assets byte-match local build. CSS chunks differ between existing Cloudflare Turbopack and local webpack builds, so byte parity is not claimed; live rendered controls were verified.

Post-deploy receipts and scripts are in .agent/evidence/release-scroll/ (local, not committed). Earlier unrelated untracked evidence retained. No further product work pending.

## iPhone jitter follow-up
Owner reports physical iPhone jitter despite prior browser checks. Branch fix/iphone-cinematic-scroll based on deployed2b788fc. Scope: investigate native scroll pin, toolbar geometry, late decode refreshes and compositor cost; retain approved scene and desktop behavior. Single Luna builder owns tightly coupled hero lifecycle/styles/tests; separate Astra will review. Lead gathers effect-isolation baseline. Acceptance: native mobile scroll with stable geometry across toolbar changes, forward/reverse/rotation/reduced-motion passing, no overflow/errors; deploy DEV for physical-phone owner validation before claiming resolved. Prior release report retained above.

## Repair ready for DEV phone retest
Final source reviewed by independent Astra; no unresolved material findings. Lead build/typecheck/lint pass, unit62pass. Integrated67pass plus1artifactcleanupfailure; affected case isolated rerun1pass. Independent12browserchecks+6earlyloadprobes pass. Evidence .agent/evidence/iphone-scroll/QA.md and review.md. Desktop behavior, rotation/reducedmotion/anchors retained. Physical-iPhone symptom not yet confirmed fixed; publish DEV and open PR, keep production2b788fc unchanged pending owner retest.

DEV deployed product35379f0 as78c08eb7, immutable https://78c08eb7.zk17-review.pages.dev; alias https://cinematic-opening-dev.zk17-review.pages.dev. Live desktop/WebKit startup/rotation/forwardreverse/nooverflow/noerrors pass; preview noindex verified. PR12 https://github.com/nrsandoval1231-oss/ZK17/pull/12. Production unchanged2b788fc. A live script rotation-settlement false negative was diagnosed and corrected, no additional product edit. Await owner physical iPhone swipe retest before merge/release. Evidence in iphone-scroll/QA.md.

## Photo update in progress — 2026-11-03
Objective: update existing draft PR13 with owner-selected real football/personal originals; exclude restaurant. Base747c277; local branch fix/pr13-photo-selections. Three Luna builders active (assets/UI/tests); lead retrieves originals and verifies. Final tests and Astra review pending. Owner explicitly prohibits merge/deployment. Push commits must use [CF-Pages-Skip] prefix. Main checkout's unrelated dirty evidence preserved. Next: integrate/capture/check, review, push existing PR only.

Photo update verified:8selections/36derivatives,5original personal gallery photos, restaurant excluded. 68unit/28affected-browser checks plus typecheck/lint/build and independent Astra final review pass. Portrait clipping corrected and recaptured. QA artifacts/two-sides/PHOTO_UPDATE_QA.md. Ready to commit/push PR13 with [CF-Pages-Skip]; no merge/deploy. Physical iPhone verification pending.
