# Independent opening refinement review

Reviewer: separately dispatched Astra critic, 2026-11-02. Reviewed candidate commit **ccaab62e193b570bd3ac52db9af848124b32540a**, relative to 5bfba97. Inspected the owner specification, plan, actual component/test diff, asset provenance, deterministic logs, independent browser behavior, and screenshot evidence.

## Verdict

**No remaining material findings. Ready for owner/PR review within the documented local verification limits.** Both independently reproduced P2 findings are resolved and independently retested. This is not merge or deployment authorization. A subsequent report-only commit does not change the product candidate reviewed here.

Reviewed product Git blobs were rechecked after the final commit:
- components/arrival-hero.tsx: ad035a883c57061ea9dc69971695b262100138d8
- components/arrival-hero.module.css: d77aeb2872139ab6d59cee7643127f279ad7dea1
- components/use-arrival-hero-motion.ts: 1c28effb78b48c5296eb33ea7fc3d698e8cc6eb2

## Resolved findings

1. **P2 — Mobile fetched both stadium resolutions** (arrival-hero.tsx stadium Image elements). Independently reproduced all four mono/color 768/1500 URLs despite rendered 768px currentSrc. The redundant 1500px pair added 345,598 bytes. Repair uses eager loading without unconditional fallback preload. Independently retested the rebuilt site in Chromium and WebKit at 390x844: only the two 768px stadium files were requested. The strict resource assertion remains.
2. **P2 — Cold-open smoke stationary before hydration** (arrival-hero.module.css smoke play-state). Independently reproduced paused smoke with unchanged transforms during delayed JavaScript. Repair permits animation during the pending opening. Independently retested Chromium and WebKit with 3000ms script delay: at approximately 700ms and 1500ms boot remained pending, section remained unpinned, animation was running and transforms differed. Reduced motion still disables smoke animation. The regression now confirms pending/unpinned state around both transform samples.

## Independent inspection and verification

- Source retains one arrival ScrollTrigger and existing 2.4/1.6 viewport travel, downstream components/navigation, approved monochrome portraits, and MAKE THEM REMEMBER. Stadium color uses graded derivatives plus opacity, avoiding animated full-screen filters. Cleanup removes image/visibility listeners and queued refresh work; smoke pauses offscreen.
- Independent Chromium progression over 0, .27, .37, .49, .59, .96, 1.15, .37, 0 confirmed ordered reveal, empty stadium before athlete, reversible layers, completion/reentry flags, smoke pause after release/resume on reverse, no horizontal overflow or page errors. Reduced motion removed pins/CSS smoke animation and exposed the header.
- Visually inspected regenerated desktop, iPhone-sized WebKit portrait, and landscape overview captures, plus an independent mobile stadium screenshot. Branded cold open, recognizable stadium, restrained color, preserved athlete composition and headline are coherent. visual-checks.json records no overflow or console/page errors at the three sizes.
- Inspected the Windows portability repair in tests/playoff-sync.test.ts. Bash executes the actual workflow guard via stdin with only git mocked and arguments validated; allow/reject/failing-git assertions remain. Child-process curl preload isolates only the network boundary; real retrieval/file/hash validation remains and invalid PDF/HTML checks were added. No production logic changes or external network side effects identified.
- Inspected the final browser harness repairs against owning use-story-motion code. The cinema resize test polls identical width/height limits and retains transform assertions. The focus fixture generates focusin on a real click after pointerdown using preventScroll; hook recentering still fails exact scroll equality. Real Tab and programmatic-focus tests remain. These repairs preserve the intended acceptance criteria.

Final deterministic evidence inspected directly:
- full-e2e-accepted.log: **173 passed, 7 existing conditional skips, 0 failed**. The skipped cases are in unchanged arcade/completion test files; no acceptance tests were newly skipped.
- unit-final.log: **62 passed, 0 failed**.
- story-focus-final.log: **16 passed**; cinema-recheck.log: **8 passed**.
- lint-final.log and typecheck-final.log: successful, no lint warnings.
- opening-build.log: successful application build after final product edits. Later edits were test/report changes.

Earlier failed runs remain as debugging evidence and are not the acceptance result. They exposed duplicate downloads, Windows test portability, output-directory collisions between overlapping runs, native WebKit button-focus behavior, and a resize assertion sampled before settling. Final tests were run after the relevant repairs, and the committed source/test identities were inspected.

## Remaining uncertainty

Physical iPhone/Safari smoothness, dynamic toolbar behavior, thermal/memory use and frame-rate comparison with the previous version remain unverified. Local Chromium/WebKit emulation cannot establish those claims. The recorded build uses preview media mode; this review does not certify production configuration or deployment. Owner-supplied stadium provenance is preserved; its real-photo status and production-use authorization come from the owner's confirmation. No merge or deployment occurred as part of this review.
