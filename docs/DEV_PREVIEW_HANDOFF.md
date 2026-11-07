# ZK17 desktop handoff — 2026-11-03

## Saved implementation

- Feature branch: `feat/homepage-cinematic-polish`.
- Draft PR: https://github.com/nrsandoval1231-oss/ZK17/pull/14
- Latest application commit before this documentation-only handoff: `65f1c641c3fe6e76121f8171e2ef27f80bd4981e`.
- All homepage/footer implementation, screenshots, verification notes and Astra critic reports are committed and pushed. No merge or production deployment occurred.

The owner stopped deployment work and will continue on a desktop with its Cloudflare token. No verified live dev deployment exists for this revision. Vercel attempts were canceled or failed; the latest pending build was explicitly canceled at the owner's request. A separate unused Vercel project `zk17-dev` was created in the owner's team; production at zephyrkreye.com was untouched. Do not resume that path automatically.

## What is implemented

The homepage has exactly six chapters: existing Arrival / Every Second Counts, then On the Field, Beyond 17, Follow the Journey and Next Chapter with footer. The standalone timeline and its homepage motion/styles are removed; milestone data remains. On the Field contains no embedded highlights. PLAYER17 interests work in a compact editorial presentation. The photo carousel supports native swipe/snap, keyboard/pagination and reduced motion.

The final footer follows the owner's subsequent reference: small sword/statement/Back to Top above a monumental canonical sword and square monochrome sideline portrait, then fine copyright rules and quiet approved recruiting/contact links. Back to Top now resolves the actual Arrival pin start and returns to scrollY=0 by click or keyboard. The opening choreography is preserved.

## Cloudflare dev deployment from desktop

Use the existing **review** Pages project, not the production site. The deployment runbook records `zk17-review` with production branch `owner-approved-release`; check that setting before deploying. Branch `dev` must remain a preview branch.

```bash
git fetch origin
git switch feat/homepage-cinematic-polish
git pull --ff-only
npm ci
PREVIEW_MEDIA_MODE=true PUBLIC_RELEASE=false npm run build
npx wrangler pages project list
npx wrangler pages deploy out --project-name zk17-review --branch dev --commit-hash "$(git rev-parse HEAD)"
```

Use the Cloudflare token already available on the desktop. Do not paste it into chat, source files or command arguments. Upload only `out/`, never the repository root, `.agent/`, scratch files or credentials. The intended alias is `https://dev.zk17-review.pages.dev`; use the actual successful deployment URL from Wrangler and verify it before sharing. Neither that alias nor a new immutable URL is claimed live by this handoff.

Leave preview media enabled so the existing owner-authorized review crops appear. Do not set `PUBLIC_RELEASE=true`, disable content gates, merge PR #14, bind the production domain or promote a deployment as part of this dev test. Cloudflare `_headers` already marks Pages preview hosts noindex/nofollow.

## Verification already completed

- TypeScript, lint, production build: passed.
- Full unit suite: 65 passed.
- Broader Chromium/mobile/reduced-motion regression set: 82 passed, two intentional skips.
- Final homepage/footer set: 16 passed across Chromium/mobile/reduced motion, two intentional non-mobile CDP skips.
- Final homepage/footer WebKit set: five passed, one unsupported CDP skip. Earlier broader iPhone WebKit regression set: 19 passed, two intentional skips.
- Astra independently reviewed the final footer at five widths, accessibility, 44px targets, source gates and ordinary-motion click/keyboard Back to Top. No unresolved functional/layout P1/P2 finding.

Evidence: `artifacts/homepage-polish/QA.md`, `STATISTICS.md`, `astra-review.md`, `footer-astra-review.md`, `footer/QA.md`; screenshots in `before/`, `after/`, `webkit/` and `footer/`. The owner-selected footer reference-width capture is `artifacts/homepage-polish/footer/1206.jpg`.

After Cloudflare deploy, check the six-section order; desktop/mobile footer; PLAYER17; carousel touch/keyboard; Back to Top with ordinary and reduced motion; direct Film, Highlights, About, Playoffs, NIL/Recruiting and recruiting snapshot routes; no broken images/overflow; and native video Range requests. Physical iPhone Safari testing is still outstanding and is a key purpose of this dev preview.

## Content and remaining limits

The existing verified statistics/social arrays are empty. All four 2026 metrics honestly remain unavailable; no social profiles are invented. The adapter sums verified passing+rushing season components and requires a named source calculation for QB rating. See `STATISTICS.md`.

The initial mockup's matching rights-approved lifestyle/helmeted-throwing originals are absent. Current authentic football/sideline review crops retain preview labels and existing gates. Exact acceptance of the whole homepage remains blocked by those assets; see `design-qa.md`. The selected footer uses the authentic existing sideline portrait. Do not generate athlete likenesses or promote preview crops to rights-approved media without evidence.
