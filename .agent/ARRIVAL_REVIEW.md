# Arrival review and bounded escalation

Candidate: feature/athlete-showcase-every-second-20261101, base 4ca5d0d3; uncommitted integrated worktree.

Status: FIX / RE-REVIEW REQUIRED. This reviewer inspected the initial integrated diff, source, first browser log and screenshots independently, then accepted a bounded root-cause escalation to repair arrival-experience.tsx and arrival.module.css. The repaired files consequently require a fresh independent critic. No production acceptance, merge, or deployment is certified.

## Initial findings

- P1: Mobile portal has a zero-length scroll range. A 100svh cinema with start `top top` and end `bottom bottom` gives equal boundaries. A fresh 390x844 Chromium/WebKit probe showed the mask unchanged at scrollY600 and the entire transition jumping at scrollY844. Repaired to `top 85%` through `top 10%`, without pinning.
- P1: Direct anchors land outside their target after desktop pin refresh. Fresh Chromium 1440x900 navigation to /#film-room settled at scrollY54 with film top922 and copy hidden. /#off-field settled with target top3029; /#journey top1306. Assigned to the integration builder. The cinema trigger now has stable ID `arrival-cinema` to support reconciliation to its resolved state.
- P2: iPhone pointer activation does not establish document.activeElement as the film button; restoring that element fails focus return. The first full browser log reproduces the WATCH WITH SOUND focus failure. Arrival buttons now pass event.currentTarget to onWatch; integration owns storing/restoring that opener.
- P2: First supplied mobile cinema-end screenshots show blank lower film/footer and on-field, without the intended film heading. Fresh DOM probes differed from those capture coordinates. These screenshots cannot certify the repaired result; regenerate against the rebuilt candidate and verify actual viewport geometry.

## Escalation changes

- Responsive percentage-based SVG mask coordinates and CSS number sizing preserve the 17 in portrait viewports.
- Reduced motion returns before constructing a cinema ScrollTrigger, while preserving visible film copy and no background playback.
- The light sweep now animates an actual element with transform instead of repainting a custom background position.
- Persistent underlying poster retains a visual fallback during delayed/blocked video startup.
- Header offsets match the existing desktop/tablet/phone heights; mobile preview disclosure moves above the overlapping title.

## Evidence checked

- Read packet, local agent rules and finish contract; independently inspected changed motion/integration files and new arrival source/CSS.
- First full browser log: 83 passed, 12 skipped, 9 failed. This is failed initial-candidate evidence, not a final pass.
- Inspected desktop hero and WebKit mobile cinema-end screenshots and capture JSON; zero Axe results there do not prove choreography or playback.
- Fresh local Chromium and WebKit probes reproduced mobile transition geometry. Both engines reached readyState4 with video currentTime advancing after film entry; media remained unset initially.
- After escalation edits: `npx tsc --noEmit` exit0; `npx eslint components/arrival-experience.tsx` exit0.
- Final production rebuild, screenshots, full affected tests, direct-anchor recheck and independent final review remain required.

Physical iPhone Safari smoothness, battery/thermal behavior and owner visual acceptance remain UNKNOWN. Emulated WebKit is not physical-device evidence.
