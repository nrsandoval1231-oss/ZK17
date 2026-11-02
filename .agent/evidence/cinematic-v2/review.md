# Independent Cinematic V2 review

Reviewed `15e9c92..b3b279f` against brief/spec/report and owner overrides (retain approved MP4 duration; no deploy/merge; supplied agency inquiry destinations). No product edits, commits, pushes, deployments, or broad test reruns performed.

**Specification verdict: changes required.** The main cinematic, film, contact, and route deliverables are present, but the header requirement fails on a supported navigation path and media-disabled content handling is incomplete.

**Implementation-quality verdict: changes required.** Two functional findings and one cleanup finding below should be addressed before approval. The reported 153 browser / 59 unit passes are useful but omit these states.

## Findings

### P1 — Initialize the home intro state on client navigation

Location: `app/globals.css:156–157` (also descendant rule at 163–164); interaction with `components/route-header.tsx:38` and `components/use-arrival-hero-motion.ts:103–104`.

The hiding selectors require `data-arrival-boot=pending|ready`. That attribute is only initialized by the inline layout bootstrap on an initial `/` document. Loading `/film/` directly and clicking its HOME client-side Link mounts the animated home intro without rerunning that script. The motion hook dispatches `arrival:motion-ready`, but no bootstrap listener exists on this document, so the attribute stays absent. The header and all navigation remain visible throughout the black opening and intro.

Reproduced in Chromium against the existing production static server: `/film/` → `#route-nav a[href="/"]` → await `#arrival[data-arrival-motion="ready"]`. At scrollY 0, the athlete opacity was 0, `data-intro-complete=false`, `data-arrival-boot` undefined, and header computed visibility `visible`. This is a normal primary navigation path, not an artificial error case.

Initialize/clean up the boot and completion state for every home mount (including client entry), while keeping static/failure/reduced-motion fallbacks navigable. Add a route-to-Home regression asserting the header and descendants stay hidden through intro progress and appear after completion. Also cover reduced-motion → no-preference, which can similarly start motion without a bootstrap attribute.

### P2 — Honor the media approval mode on About

Location: `app/about/page.tsx:5–8`.

About renders `previewPhotos.slice(0,3)` unconditionally. Unlike Home and Playoffs, `PREVIEW_MEDIA_MODE=false` does not suppress these review-only derivatives, and approved replacement scene photos are never selected. The documented existing approval boundary is therefore not preserved by this new route. The export audit currently blocks public release while preview binaries remain, so this is not a claim that a prohibited deployment happened; when those files are removed for release, About will still reference missing preview URLs.

Use the same mode/approved-media selectors as the existing routes, render approved gallery assets when available, and omit an empty gallery. Verify both preview-enabled and preview-disabled render output.

### P2 — Remove remaining public original-pending fallback labels

Location: `components/two-worlds.tsx:31–34`.

The photo-caption cleanup leaves `GAME-DAY ORIGINAL PENDING` and `SIDELINE ORIGINAL PENDING` visible when either photo is unavailable. This is the legitimate media-disabled/no-approved-photo state and contradicts the requested removal of public implementation placeholders. The new text smoke test does not match these strings and only runs the default media-enabled build.

Hide unfinished photo modules or use finished, non-editorial content in this branch, including its accessible label. Extend the cleanup coverage to missing media and case-insensitive `original pending` labels.

## Verified coverage and observations

- Inspected all three supplied overview sheets (desktop, iPhone, iPad), covering black opening, lights, accumulation, final composition, Act II, Film, Playoffs, and NIL/Recruiting. Final collage keeps the central athlete clear, with five authentic photographs and late readable headline. Letterboxing is consistent with the explicit full-source preservation requirement.
- The forward reveal timeline only introduces photos; it contains no individual exit or replacement animation. Regression assertions check cumulative opacity at each introduction and compact 2.4/1.6 viewport travel. Normal reverse scrubbing reverses the reveal, which is consistent with a scrubbed scene.
- Fresh-load header timing, skip focus, reduced-motion static composition, fallback guard, and mobile menu Escape/focus trapping have coverage. The missing client-entry initialization explains why the existing direct-load tests all passed.
- Film route, hero, dialog, and snapshot use grayscale/contain presentation. Full MP4 is selected; byte hash/original-source preservation tests and the 34.2-second browser metadata assertion directly support the owner override. No recut should be required.
- Playoffs diff changes the shared header and removes a preview caption; bracket/data/verification/update workflow are preserved. Existing playoff interaction assertions remain, with navigation selectors adjusted.
- NIL and recruiting intents use the supplied email with distinct subjects; the supplied contact page is linked without an invented agency relationship.
- Route titles, active indicators, static-export pages, and browser back/forward coverage exist. Navigation tests mostly use direct `goto` or About ↔ Film and therefore miss route-to-Home behavior.
- No physical iOS/OLED validation or publication was claimed in this review. Existing evidence limitations remain applicable. PR delivery is controller-owned and is not treated as an implementation-agent defect.
