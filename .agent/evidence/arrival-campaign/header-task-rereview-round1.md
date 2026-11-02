# Task 2 independent header re-review — repair round 1

Reviewed `30d4589` against `.agent/evidence/arrival-campaign/header-fix-round1.diff`, the updated implementation report, current source and rebuilt production output on port 3100. This scoped re-review supersedes the initial review's conclusions about accessible naming and cross-browser resize focus.

## SPEC — PASS

The home link now exposes `Zephyr Kreye — ZK17 home`, including the visible ZEPHYR KREYE wordmark while preserving ZK17/home intent (`components/site-experience.tsx:50`). This is a justified accessibility correction to the packet's former exact label. The native BrandLogo and visible presentation remain intact.

The resize handler now uses actual open-menu state and schedules Home focus after closing, avoiding reliance on whether CSS already blurred the hidden Close button (`components/site-experience.tsx:38`). Closed-menu resizes leave existing focus alone. Existing inert/scroll-lock cleanup remains unchanged.

## QUALITY — PASS

No actionable findings in the repair. The added accessible-name/axe regression and closed-menu focus assertion directly cover the reported failures without weakening the existing resize assertion.

Independent checks ran against the actual rebuilt production page, using managed mobile Chromium with Pixel 7 settings and managed WebKit with iPhone 13 settings:

- Both browsers passed the home accessible-name assertion and header-scoped axe `label-content-name-mismatch` rule at 320, 390, 1024 and 1280px.
- Both browsers passed five repetitions of opening the mobile menu, confirming Close focus, resizing to 1024px, confirming Home focus and restored content inert/body overflow state, returning to mobile with menu closed, then confirming a closed-menu resize retained WATCH FILM focus.
- Browser command exited 0. Managed WebKit used existing libraries via `LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu`; `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` skipped host dependency preflight only. Both browsers and every assertion actually ran.

No rebuild, full suite, fixture substitution, server mutation, source edit, dependency installation, push, merge or deployment occurred. This is scoped repair validation; parent-owned integrated/full-suite checks remain separate.
