# Road to State implementation plan

Goal: deliver /playoffs within existing ZK17, on feature/road-to-state-2026 stacked on PR #1.
Architecture: static Next.js page, typed tournament graph and reviewed JSON observations. Existing GSAP only; native scroll and accessible list alternative.
Spec: owner master builder prompt, README.md, DESIGN.md, PRODUCT.md and docs/RELEASE_GATES.md.

Constraints: no invented qualifiers/results, no substituted Anna logo, no homepage redesign, no public deploy/merge/indexing. Exact owner logo and canonical mockup are missing from this thread/repository; request originals and continue independent implementation. Pending artwork is visibly disclosed; visual acceptance cannot be claimed until supplied.

- [x] Research official alignment and blank bracket, inspect live preview at desktop/mobile and capture baseline.
- [x] Test and implement 63-game graph, exact district-seed pairings, normalization, provenance, result validation/conflicts, explicit-winner advancement, Anna path and full-region filtering. Fixtures stay in tests only.
- [x] Build HQ, six-round road, complete region/state bracket, round selection, native horizontal navigation, list alternative, shareable game center, verified team information and source timestamps. Add primary navigation without replacing current behavior.
- [x] Implement bounded scheduled source retrieval with hashes/change detection and a controlled observation validation/publish CLI. Retrieval never promotes scraped results. Static artifact validation runs before build.
- [x] Validate missing assets without approximating them. Integrate supplied original only if available; document missing canonical visual reference.
- [x] Run npm ci/typecheck/lint/test/build/e2e, browser a11y/mobile/reduced-motion/regression checks, capture screenshots/recordings/performance and limitations.
- [x] Incremental commits, dedicated stacked PR against PR #1 branch, source inventory and review evidence. No deploy or merge.

Review focus: ties/incomplete scores cannot advance; changed results cannot corrupt later games; official conflicts require explicit review; unseeded Anna has no assumed path; modal/hash/back and mobile keyboard controls remain usable.

Visual acceptance remains blocked on the exact owner logo and canonical mockup. The missing-asset investigation and integration hooks are complete; this does not mean the unseen artwork has been implemented. See docs/PLAYOFFS_QA.md.

Owner logo received 2026-11-01 and integrated byte-identically (256×276 JPEG). Exact-logo acceptance now verified; canonical Road to State mockup and production LCP signoff remain pending.
