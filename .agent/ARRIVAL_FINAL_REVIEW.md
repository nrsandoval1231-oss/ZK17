# THE ARRIVAL — independent final review

Verdict: **PASS for the local preview candidate only**. No open material findings remain in the inspected candidate. This is not merge, production deployment, physical-iPhone, or owner visual acceptance.

Reviewed 2026-11-01 America/Chicago by the separately dispatched Astra critic. This reviewer authored no product changes. The controller repaired the finding below; this reviewer then independently exercised the rebuilt result.

## Candidate and scope

- Checkout: `C:/Users/nrsan/Documents/Codex/2026-10-25/zk17-master-build-directive-the-official`.
- Branch: `feature/athlete-showcase-every-second-20261101`; base/HEAD during review `4ca5d0d3c26ee01f16d8eb0c0f67189412133f2f`; integrated uncommitted changes.
- Read global instructions, `.agent/PACKET-ARRIVAL.md`, `.agent/FINISH_CONTRACT.md`, actual tracked diff, new `arrival-experience.tsx`/`arrival.module.css`, motion/integration code, playoff focus repair, tests, capture script, and current evidence files.
- Exact product SHA256 values are recorded in `evidence/arrival/critic-source-manifest.json`. New component/CSS are included even though they are untracked and absent from plain `git diff` output.
- Goal: authentic portrait and existing mark/violet identity; initial sweep/depth; expanding SVG 17 into original film; EVERY SECOND COUNTS; lazy muted playback and explicit native sound controls; natural mobile flow, reduced motion, cleanup, working routes, preserved content/rights gates.

## Finding and independently verified repair

**P1, resolved — desktop film sound button clipped outside the viewport.** The first rebuilt candidate combined CSS `top:50%; transform:translateY(-50%)` with a GSAP `y:35` to `y:0` animation on the same element. My fresh Chromium 1440x900 film screenshot reproduced text at approximately y495–865 and the sound action below the 900px viewport. The pre-repair screenshots remain under `artifacts/arrival-final`.

The controller changed the film copy to an inset flex column centered without a CSS translate. I inspected the changed CSS and reran against `build-final2.log` output. Independent Chromium and WebKit now place the sound button at y650.4375–698.4375 on 1440x900; it clicks, opens native controls, closes on Escape, and restores focus. The repaired screenshots are under `artifacts/arrival-approved` and `evidence/arrival/critic-*-film.png`.

Earlier critic findings concerning zero-length mobile progress, responsive mask, desktop anchor reconciliation and Safari pointer focus were checked on the final source and runtime. They do not remain open. The small playoff change captures the actual clicked button before opening its dialog, rather than relying on Safari pointer focus; the final cross-browser game-center tests pass.

## Deterministic verification

- Independently ran `npm run typecheck`, `npm run lint`, and `npm test` after the centering repair: all exit 0; 29/29 unit tests passed. `git diff --check` also passed.
- Inspected completed `build-final2.log`: optimized production export succeeded for home, recruiting and playoffs. Its explicit non-release media-audit skip is expected for this preview build, not release certification.
- Inspected final `e2e-final2.log`: **96 passed, 16 skipped, 0 failed (42.7s)**. Skips are project-specific coverage and unsupported WebKit clipboard-permission coverage; the final run includes Chromium desktop/mobile, iPhone WebKit and reduced motion. Earlier failing logs are retained and are not pass evidence.
- Independently ran `critic-probe.mjs` against the rebuilt static export at `http://127.0.0.1:3100/`, exit 0. Four contexts: Chromium/WebKit at 1440x900 and mobile 390x844 with `isMobile` and touch enabled. See `critic-runtime.json`.
- Direct `#film-room`, `#journey`, `#off-field` and post-pin in-page Off Field navigation land at the target. Desktop film top is 0; mobile film top is 84; journey/off-field tops are approximately 64–72px. Film action is inside the viewport.
- Muted playback advanced in all four contexts. Touch-enabled WebKit mobile advanced from **0.9567501 to 2.1697503 seconds**, readyState 4, unpaused and muted. Native dialog has controls, is unmuted, and does not autoplay. Focus returns to the explicit sound opener in every context.
- Reduced-motion toggle removes all three desktop pin spacers and the background video source, leaving readable copy. Restoring motion returns exactly three spacers. Mobile has no pins. Resizing through 320/768/1024px causes no horizontal overflow or runtime errors.
- `critic-fallback.json`: JavaScript-disabled Chromium/WebKit at 390 and 1280px retain visible hero/film copy and no overflow. The sound button remains visible but requires JavaScript to operate. Initial background-video source is null; after entry playback advances; leaving for Off Field removes its source and pauses it.
- `critic-routes.json`: actual Recruiting navigation removes arrival video and all home pin DOM; browser Back restores exactly three home spacers, without errors, in both engines. Source inspection confirms animation contexts/matchMedia, media, observer and listener cleanup. This is route/DOM evidence, not a heap-leak profile.
- Inspected the final hero, portal and film screenshots and `artifacts/arrival-approved/arrival-audit.json`: zero recorded Axe violations, overflow or console/page errors across all four capture combinations. That capture script uses viewport-only mobile contexts; independent touch/mobile checks above supplement it.
- Original `public/media/zephyr-cinematic.mp4` SHA256 independently remains **A783DCB56F3A11684A3253DDC8C0768035BB8C9D390E0061A29935C20AF8965F**. Source-backed/rights-approved public-media filtering and labeled preview crops remain in place; content and mark assets were not changed by this candidate.

## Remaining uncertainty and boundary

Physical iPhone Safari smoothness, Low Power Mode autoplay policy, thermal/battery behavior and owner visual approval remain **UNKNOWN**. WebKit automation is not a physical-device test. No performance score or frame-rate claim is made. Final source is locally built, tested and independently reviewed; remote preview parity still requires checking after publication. Production release gates, rights-approved originals and owner approval remain separate.
