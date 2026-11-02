# Independent opening refinement review

Reviewer: separately dispatched Astra critic, 2026-11-02. Scope: integrated homepage intro candidate on feat/cinematic-opening-refinement relative to 5bfba97. Reviewed owner specification, plan, actual component/test diff, provenance, deterministic logs, independent browser behavior, and screenshot evidence. No merge or deployment approval.

## Product verdict

No remaining material product findings in the repaired candidate. Both independently reproduced P2 findings below are resolved. Full automated acceptance is still pending because the current full-suite run has one failing unrelated fixture; overlapping runs also corrupted test-output artifacts. Do not describe all checks as passing yet.

Reviewed Git blob identities:
- components/arrival-hero.tsx: ad035a883c57061ea9dc69971695b262100138d8
- components/arrival-hero.module.css: d77aeb2872139ab6d59cee7643127f279ad7dea1
- components/use-arrival-hero-motion.ts: 1c28effb78b48c5296eb33ea7fc3d698e8cc6eb2
- tests/playoff-sync.test.ts: 5fdd39643d6cc9ce0fae93df816e670b1ab04037

## Resolved findings

1. **P2 — Mobile fetched both stadium resolutions** (arrival-hero.tsx stadium Image elements). Independently reproduced all four mono/color768/1500 URLs despite rendered768px currentSrc. The redundant1500px pair added 345,598 bytes. Repair uses eager loading without unconditional fallback preload. Independently retested rebuilt site in Chromium and WebKit at 390x844: only the two 768px stadium files requested. Strict resource assertion remains.
2. **P2 — Cold-open smoke stationary before hydration** (arrival-hero.module.css smoke play-state). Independently reproduced paused smoke with unchanged transforms during delayed JavaScript. Repair permits animation during the pending opening. Independently retested Chromium and WebKit with 3000ms script delay: at approximately 700ms and 1500ms boot remained pending, section remained unpinned, animation was running and transforms differed. Reduced-motion fallback still disables smoke animation. The regression now delays scripts 3000ms and confirms pending/unpinned state around the transform samples.

## Evidence and scope

- Source retains one arrival ScrollTrigger and existing 2.4/1.6 viewport travel, existing downstream components/navigation, monochrome approved portraits, and MAKE THEM REMEMBER. Stadium color uses graded derivatives plus opacity, avoiding animated full-screen filters. Cleanup removes image/visibility listeners and queued refresh work; smoke pauses offscreen.
- Independent Chromium progression probe over 0,.27,.37,.49,.59,.96,1.15,.37,0 confirmed ordered reveal, empty stadium before athlete, reversible layers, completion/reentry flags, smoke pause after release/resume on reverse, no horizontal overflow or page errors. Reduced motion removed pins/CSS smoke animation and exposed header.
- Visually inspected regenerated desktop, iPhone-sized WebKit portrait, and landscape overview captures, plus an independent mobile stadium screenshot. Branded cold open, recognizable stadium, restrained color, preserved athlete composition and headline are coherent. visual-checks.json reports no overflow or console/page errors at all three sizes.
- Independently inspected the portability repair in tests/playoff-sync.test.ts. Bash now executes the actual guard via stdin with only git mocked and arguments validated; allow/reject/failing-git assertions are retained. Child-process curl preload isolates only the network boundary; real retrieval/file/hash validation remains and invalid PDF/HTML checks were added. No production logic changes or network side effects identified. unit-final.log records 62 passed, 0 failed.
- Rebuilt site was independently exercised after product repairs. Build/typecheck logs pass. lint-final.log passes without warnings. Opening log records 52 passed on the repaired product, before the latest strengthening of delayed-JavaScript assertions.

## Outstanding verification, not product defects

The earlier full-e2e.log reports 172 passed, 7 skipped, 1 failed; the next serialized full-e2e-final.log reports 171 passed, 7 skipped, 2 failed. Failure is iPhone-WebKit story-focus.spec.ts pointer focus expectation. Inspection shows this fixture bundles only unchanged use-story-motion.ts; the arrival implementation is absent. The fixture now explicitly focuses on the real click after pointerdown using preventScroll. Independently inspected this repair against use-story-motion: hook recentering still fails exact scroll equality, and real Tab/programmatic focus tests remain. The second serialized failure was cinema-framing geometry sampled before resize settled. Its repair polls the same exact width/height bounds and retains transform assertions. Neither test repair weakens the intended acceptance; final suite rerun remains pending.

An overlapping opening run records missing test-results artifact ENOENT errors plus WebKit rotation/navigation timeouts. Independent runs must use separate output directories or run sequentially; those results cannot establish a clean final pass. Final candidate commit and completed verification disposition are pending.

Physical iPhone performance and genuine Safari dynamic chrome remain unverified. Browser-emulated WebKit is not hardware proof. This review certifies neither production release nor deployment.

