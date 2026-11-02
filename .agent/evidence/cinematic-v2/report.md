# Cinematic V2 implementation report

Branch: `feat/cinematic-experience-v2`. Local changes only. No push, PR, merge, preview, or production deployment was performed by the implementation agent. Every implementation commit uses `[CF-Pages-Skip]`; controller owns independent review and any later publication.

## Implemented

- Replaced the old 15-viewport-height, image-swapping sequence with one contiguous GSAP scene: **2.4 viewport heights of desktop scroll travel**, **1.6 on mobile/tablet**. Removed the separate pinned/zooming cinema transition. Full true-black opening; brief smooth floodlights; low-opacity real stadium photograph; restrained slow smoke; five real photo layers accumulate without exit animations. Headline enters after the collage, followed by a short hold.
- Built the specified composition from existing genuine Zephyr assets: left closeup, left-center rear portrait, dominant central standing athlete, right helmet/uniform portrait, small lower-right action photo, and large approved ZK behind. Images remain source photographs, with feather masks and grayscale blending rather than synthesized anatomy or cutouts. Central portrait stays opaque so the background logo cannot cross the focal face.
- Header and every navigation descendant stay hidden until the intro completes. Discreet “Skip intro” releases directly to the video section and transfers focus. Reduced motion and failed/disabled enhancement keep a static readable composition. Responsive pin cleanup, rotation progress restoration, loading guard, and existing keyboard/focus reconciliation remain.
- Separate static-export routes `/`, `/film/`, `/playoffs/`, `/about/`, `/nil-recruiting/`; preserved `/recruiting/` as the detailed snapshot. Five matching primary destinations, active route markers, page titles/canonicals, sitemap entries, keyboard-safe compact mobile menus and browser history behavior. Non-home headers are immediately available. Route mobile menu manages focus, inert background, Escape and scroll restoration.
- Act II uses a full-height black stage with complete **contain** video framing at every size. Approved black logo sits on a restrained soft light backing. Headline is “EVERY SECOND COUNTS.” All sound CTAs removed. Native accessible controls and a direct Film route provide complete playback; grayscale remains applied throughout.
- Removed public implementation captions from Home, TwoWorlds, and Playoffs. Hidden unfinished Home statistics; retained verified profile, established arcade content, snapshot sharing, playoff bracket, filters, game dialogs, source markers, all tournament data and update workflows.
- Added local static-host MP4 byte-range support because Safari/native seeking requires real range responses. Its isolated HTTP unit regression checks normal ranges, suffix ranges and 416 responses; this affects only local QA server behavior, not Cloudflare configuration.

## Media preservation and provenance

Direct owner instruction overrides the generic spec recut: **no recut, shortening, stretching, fabricated plays, or re-encoding**. The uploaded approved file was copied byte-for-byte to `/media/zephyr-monochrome-full.mp4` and selected in the existing public media record. The prior `/media/zephyr-cinematic.mp4` remains byte-for-byte intact at its original path.

Approved asset: H.264, 512×640 (4:5), 30fps, AAC audio, **34.200 seconds**, **9,147,834 bytes**. SHA-256: `0cee7e98ad6f9408c2a36d19377fa5aaff2540bc82e341bb412468d351cd257f`.

Preserved prior asset SHA-256: `a783dcb56f3a11684a3253ddc8c0768035bb8c9d390e0061a29935c20af8965f`.

Poster is extracted from the approved monochrome upload. Hero and Film playback use the same complete approved source, with CSS grayscale as an additional presentation safeguard. No professional new edit or longer cut is claimed. Existing public-asset delivery conventions were retained (9.1MB source).

## Initial validation at `b3b279f`

Validation before independent review; the correction validation below supersedes these counts:

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | **59 passed, 0 failed** |
| `npm run build` | Passed; all seven application routes plus sitemap exported; release preflight and playoff provenance passed |
| Full Playwright matrix, 4 workers | **153 passed, 0 failed, 7 expected skips** (160 checks; 2.5 minutes) |
| `git diff --check` | Passed |

Browser matrix: desktop Chromium, mobile Chromium, iPhone WebKit, reduced-motion Chromium. The seven existing skips are desktop-only arcade layout cases on other projects (six) and WebKit clipboard permission coverage (one). WebKit uses `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu`; this skips a distro validation guard, not browser execution. Actual WebKit tests and captures ran successfully.

Command for complete browser verification: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu npm run e2e -- --workers=4`. The reused local static server served the freshly completed production export. Logs: `e2e.log`, `unit.log`, `build.log` in this evidence directory. No formatter script exists; ESLint and whitespace validation follow existing repository conventions.

Regression updates replace obsolete expectations for a 15-VH photo-swapping slideshow, aperture zoom, nine anchor-only navigation destinations, color restoration and sound prompts. Current tests instead assert accumulated-layer persistence at each reveal, compact scroll distance, black opening, hidden navigation descendants, skip focus/landing, reduced-motion and failed-loading fallback, rotation, distinct routes/history/active states, mobile menu focus/scroll restoration, approved contact intent URLs, permanent grayscale/contain/native controls and full 34.2-second playback with no scroll recut. Original arcade, playoff bracket/data, source provenance, snapshot sharing, native focus and accessibility coverage remains.

All 24 required desktop/iPhone/iPad screenshots were inspected, including the three overview sheets (`desktop-overview.jpg`, `iphone-overview.jpg`, `ipad-overview.jpg`). Black opening is black except the discreet skip affordance; header stays absent through final composite; final headline is fully visible, central face is clear of the monogram, images retain source geometry, Act II stays contained and monochrome, and the verified tracker and approved inquiry destinations render at all three sizes. Physical-device/display limitations remain below.

## Known limitations / incomplete acceptance

1. Owner supplied public inquiry destinations during implementation: `info@teamsportsagency.com` and `https://www.teamsportsagency.com/contact-us`. Published the email through existing approval gates, distinct NIL and Recruiting subject lines, and the shared external contact page. No representation/agency relationship is claimed.
2. Existing photo derivatives remain review-only under the repository’s existing release/media approval boundary. Public-release preflight still blocks preview-only assets. This implementation does not grant publication rights or remove those gates.
3. Automated iPhone/iPad WebKit viewport coverage approximates Safari; physical iOS hardware, OLED display behavior and native Safari browser-chrome animation were not available. Screenshot inspection verifies the tested viewports, not physical-device certification.
4. Portrait footage intentionally uses black side/letterboxing when aspect ratios conflict. This preserves all action; it is the owner-authorized alternative to destructive cropping.
5. PR opening/pushing is intentionally controller-owned, pending independent review and deployment suppression. No deployment was made.

## Evidence

`plan.md` records implementation/source scope. `capture.cjs` reproducibly captures desktop Chromium 1440×900, iPhone WebKit 390×844 and iPad WebKit 768×1024, at black opening, lights-on, mid-accumulation, final composite, Act II, Film, Playoffs and NIL/Recruiting (24 screenshots). Final frame capture waits for actual reveal opacity convergence rather than forcing animation state.

## Local commits

- `0e4365e` — `[CF-Pages-Skip] Build persistent cinematic reveal, routed showcase and full monochrome film` (implementation, tests, approved media, original-source preservation and final visual/browser/build evidence).
- This report is recorded in a following documentation-only `[CF-Pages-Skip]` commit; see branch `git log` for its exact hash. No push, merge, or deployment.

## Independent-review corrections (after `b3b279f`)

Addressed all three findings recorded in `review.md`:

- **P1, Home client entry and motion activation:** the Home motion owner now initializes `data-arrival-boot` and completion state itself before animation setup, sets ready directly when setup succeeds, and clears its state on media deactivation/unmount. It no longer depends on a document-only head script listener to hide the Home header. Existing finite loading/failure and reduced-motion fallbacks remain. New browser regressions enter Home through client links from both Film and About, assert hidden header and descendants through mid-intro, and verify completion/skip restores navigation. Another regression exercises reduced → normal twice, checking readable reduced-motion state between activations.
- **P2, About media boundary:** About obtains eligible approved photographs through the existing `publicScenePhotos` selector, deduplicates an asset assigned to multiple scenes, and uses review-only fallback photos only when preview mode permits it. Empty galleries are omitted. Actual About render-output tests cover preview on/off, approved replacements in both modes, and duplicate scene assignments.
- **P2, missing-photo cleanup:** TwoWorlds omits a missing photo card and omits the whole module when neither photograph exists. No visual or accessible original-pending placeholder is emitted. Render-output coverage checks both fully absent and partially available photographs; public text cleanup checks now match `original pending` / `original photo pending` case-insensitively.

Targeted checks ran **before** final broad validation:

- `npx tsx --test tests/cinematic-media-gates.test.ts` — **3 passed**, covering actual render output.
- `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu npx playwright test tests/e2e/intro-entry.spec.ts --workers=4` — **12 passed** across all four browser projects (23.1 seconds).

Inspected additional `screenshots/desktop-client-home-opening.png` and `screenshots/iphone-client-home-opening.png`, captured after client navigation from Film. Both show black opening with only Skip intro, `data-arrival-boot=ready`, and computed header visibility `hidden`. Existing 24 visual states retain the same composition/content; the review corrections change state ownership and unavailable-media branches.

The first broad correction run finished with **162 passed, 3 failed, 7 skipped** (172 checks). That diagnostic log is retained as `review-initial-e2e.log`. Two multi-step WebKit collage checks exhausted the original 30-second test budget under parallel load; those tests now allow 60 seconds while retaining all visual assertions and per-stage convergence checks. The other finding was a direct `/#film-room` initialization/refresh state: the explicitly initialized completion flag could remain false when the trigger was already complete. Completion now synchronizes from the trigger’s actual progress both after setup and on every refresh; no animation progress is forced. Added a dedicated direct Film hash regression checking navigation, native controls, containment and refresh alignment.

Before another complete matrix, reran the affected files with `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu npx playwright test tests/e2e/arrival-directors-cut.spec.ts tests/e2e/playoffs.spec.ts tests/e2e/intro-entry.spec.ts --project=iphone-webkit --workers=1` — **15 passed** (1.4 minutes). See `review-recheck-webkit.log`. Then used two workers for the final complete matrix to reduce contention, retaining the same browser projects and all checks.

### Final correction validation

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | **62 passed, 0 failed** |
| `npm run build` | Passed; full static export and existing release/playoff provenance checks passed |
| Full browser matrix: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH=/tmp/zk17-libs/usr/lib/x86_64-linux-gnu npm run e2e -- --workers=2` | **169 passed, 0 failed, 7 existing expected skips** (176 checks; 3.1 minutes) |
| `git diff --check` | Passed |

Final broad log: `review-e2e-final.log`. Supporting final logs: `review-unit.log`, `review-build.log`, `review-lint.log`, `review-typecheck.log`. The initial failing diagnostic log remains separate and is not represented as final validation. Additional client-entry screenshots are reproducible with the same WebKit environment variables and `node .agent/evidence/cinematic-v2/capture-client-entry.cjs`.

Corrections are committed after base `b3b279f` with the `[CF-Pages-Skip]` prefix for scoped independent re-review. No push, merge, PR publication or deployment was performed.
