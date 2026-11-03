# Opening refinement implementation plan

Goal: atmosphere → real Anna stadium → athlete → MAKE THEM REMEMBER, refining only the approved homepage intro. Current owner build specification governs; no merge/deployment.

Architecture: keep the existing single GSAP ScrollTrigger and 2.4/1.6 viewport-height travel. Immediate logo/smoke survive startup; staged lights, monochrome stadium and muted-color opacity overlay precede athlete. Existing final montage and downstream site remain intact. No dependencies added.

Asset decision: owner confirmed the supplied 1500x1001 PNG is a real photograph and authorized use. Preserve original under brand/anna-stadium, track SHA-256 provenance, derive 768/1500 WebP monochrome and muted-color variants. Four small JPGs remain references, not production assets.

Ownership / work:
- Luna opening_motion owns only use-arrival-hero-motion.ts: timeline, decode refresh, lifecycle, preserved pin/header/rotation.
- Luna opening_visuals owns arrival-hero.tsx/module.css: canonical opening logo, light smoke, real stadium layers, responsive crop and fallback.
- Luna opening_tests owns focused opening/loading/intro E2E specifications: order, first paint, accumulated images, reverse/fast/rotation/reduced motion.
- Sol integrates assets, documentation, runs final gates and visual inspection, repairs only integration issues.
- Astra independently reviews exact integrated candidate after checks and visual evidence.

Checkpoints (normalized timeline): logo .00-.14, ignition .06-.18, stadium reveal .15-.27, color .27-.36, empty stadium hold to .40, athlete silhouette .40-.49 and hero .49-.58, supporting portraits .57-.85, statement .86-.94, final hold to1. Preserve portraits, copy, routes, film, recruiting, playoffs, footer and all homepage sections outside intro.

Acceptance: visible branded nonblank startup; true supplied stadium before any athlete; subtle selective color; monochrome athletes; no added scroll distance; forward/reverse/fast scrolling, rotation and reduced motion work; no horizontal overflow, console/hydration issues; original assets unchanged. Run typecheck/lint/unit/build and existing full E2E suite, inspect desktop/mobile beat screenshots including landscape. Record physical iPhone performance UNKNOWN. Open finished review PR after independent review; do not merge/deploy.
