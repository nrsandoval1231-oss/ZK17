# Two Sides review handoff — 2026-11-03

Branch: `feat/two-sides-dedicated-pages`. Review preview only; no merge or deployment authorized.

## What changed
- Preserved ArrivalExperience, ArrivalHero, original video bytes and their animation implementation. The homepage now moves directly from its existing opening/cinema into a full-area linked editorial diptych and compact footer.
- Added `/on-the-field/`: existing field hero composition, six 2026 metrics, source notes, three editorial signature performances and nine-game passing log. No video or duplicate highlights section.
- Added `/beyond-17/`: warm editorial portrait hero, eight accessible interest categories, owner-supplied picks and explicit unanswered categories. Native scroll-snap gallery supports keyboard navigation and adjacent-image depth when authentic lifestyle photos are added.
- Shared seven-destination navigation; existing `/highlights/` Hudl experience and `/film/`, Recruiting, NIL, About and Playoffs routes retained. Updated sitemap and recruiting performance link.
- Removed obsolete downstream homepage section pins and selectors. New pages have no GSAP pins, filters animated continuously, custom drag interception or scroll-jacking.

## Current production integration
The provided checkout started at `5bfba97`; a fresh remote audit found two newer releases. Merged `origin/main` at `8aa7f5a` before delivery. The current production ArrivalExperience, ArrivalHero, their CSS and motion code, original media, and dedicated Hudl Highlights page are unchanged relative to that release. Native video focus and mobile width-only resize handling from the scroll-stability release are preserved. The requested seven navigation items now use `/highlights/` for Highlights; `/film/` and `/about/` remain available directly.

## Authentic asset inventory — updated 2026-11-03
Owner requested these selections for PR13 and explicitly excluded the restaurant image. The homepage discovery field panel now uses the real standing Anna17 photograph; the dedicated field hero uses the separate real throwing-action photo. Beyond17 uses a standard editorial crop of original `IMG_4944(1).jpeg`, with its full birthday frame available in the gallery. Five original personal library photographs replace the prior repeated football sideline fallback.

| Role | Original | Processing/status |
| --- | --- | --- |
| Discovery field | `2026-10-06_instagram_DeIdiOjDl_s-3.jpg` | Existing local Media photograph; responsive encodes |
| Dedicated field hero | `2026-09-28_instagram_Dd2BzvLm11i-4.jpg` | Existing local Media photograph; responsive encodes |
| Beyond/discovery personal portrait | `IMG_4944(1).jpeg` | Original library birthday photograph; documented 700x1050 editorial crop |
| Personal gallery | `IMG_1782.jpeg`, `IMG_5274(1).jpeg`, `IMG_3041.jpeg`, `IMG_1545.jpeg`, `IMG_4944(1).jpeg` | Original library home, stadium, outing, golf and birthday images; full aspect ratio preserved |
| Cinematic opening | Existing intro/video assets | Assignments and media unchanged |

Original library files were retrieved through the owner's authenticated ChatGPT file viewers. Original filenames and SHA-256 values, source dimensions, crop rectangle and exact output hashes are in `docs/SELECTED_PHOTOS.json`. No raw original or embedded EXIF/GPS metadata is distributed. No generated person, restaurant image, or invented family relationship is used. Captions stay neutral.

Eight selection records produce36 AVIF/WebP derivatives under `/media/selected/`; widths are360,706,1280 where the source supports them, including actual smaller native widths. Metadata is stripped; no upscaling. `scripts/prepare-selected-photos.mjs <local-photo-spec.json>` reproduces the assets from local originals. Input paths stay in an untracked local spec; committed provenance contains original basenames and hashes. See `content/selected-photos.json` for exact responsive paths and per-image focal points.

Owner selection for this PR is separate from final public-release rights approval. All new selections are suppressed by `PREVIEW_MEDIA_MODE=false`, and every derivative is registered in `PREVIEW_MEDIA_MANIFEST.json` as preview-only so `PUBLIC_RELEASE=true` rejects distribution until separately cleared. No merge or deployment is authorized. Outgoing update commits use `[CF-Pages-Skip]` to suppress automatic Cloudflare deployments.

## Statistics evidence
Every displayed metric/game carries its own source URL and verification date in `content/performance.ts`. Verification date: **2026-11-03**. Primary record: [MaxPreps Anna athlete statistics](https://www.maxpreps.com/tx/anna/anna-coyotes/athletes/zephyr-kreye/football/stats/?careerid=ns0up151d9jp9), explicitly labeled coach-entered, updated Nov. 2, 2026, 7:35 a.m. PT. Coverage: nine games through Oct. 30, **in-season**, not a completed season.

| Metric | MaxPreps-reported value | Verification |
| --- | --- | --- |
| Passing yards | 1,774 | 2026-27 Passing table; nine game entries sum to 1,774 |
| Passing touchdowns | 21 | Passing table; nine game entries sum to 21 |
| Rushing yards | 227 | 2026-27 Rushing table |
| Rushing touchdowns | 7 | Rushing table |
| Total offensive yards | 2,001 | Total Yards table: 1,774 pass + 227 rush; zero receiving |
| Completion percentage | 64.8% | Reported C% .648; 164 completions / 253 attempts |

Independent [Dallas News 2026 Anna stats](https://www.dallasnews.com/high-school-sports/schools/anna/football/2026/stats-player/) reports 1,806 passing yards / 19 passing TD / 233 rushing yards / 8 rushing TD / 163 completions / 255 attempts. **The providers disagree.** We consistently show the attributed MaxPreps record, never mix providers, and disclose the discrepancy in the page source notes. Team reconciliation is outstanding; these are source-checked reported figures, not an independently certified official record.

[MaxPreps athlete profile](https://www.maxpreps.com/tx/anna/anna-coyotes/athletes/zephyr-kreye/?careerid=ns0up151d9jp9) supplies all nine dated passing entries. Selected performances: Aug. 28 vs Colleyville Heritage (231 yards, 4 TD), Sept. 18 vs Emerson (313 yards, 1 TD), Oct. 30 vs Celina (227 yards, 3 TD). Images cannot be reliably assigned to those games, so none are falsely captioned as those performances. Individual rushing lines remain unverified and show a dash, never zero. The Oct. 23 Denison report independently repeats the profile's 245 yards / 2 TD; it is retained as evidence but is not an independent provider.

Retrieved public evidence is retained under `docs/evidence/two-sides/`. MaxPreps includes a stale unrelated 2025 'Last Game' widget and an article links to a 25-26 team schedule; neither is used to infer season. Only the explicit 26-27 tables and dated 2026 game entries are used. Older Guyer records are excluded.

## Content updates
- Season/game data: `content/performance.ts`; update evidence and dates together. Missing values remain null. Unit tests enforce eligibility and unknown-value handling.
- Existing four interest categories: owner-supplied `content/site.ts` picks. Music, Favorites, Adventure, Family & Friends await Zephyr's answers; no opinions invented.
- Photo selection: `content/athlete-photos.ts` assigns separate discovery/field/personal roles and retains the preview switch; `content/life.ts` selects the original personal gallery.

## Validation and known limits
Detailed final results and screenshots: `artifacts/two-sides/README.md`.
Physical iPhone Safari has not been tested. Automated iPhone WebKit emulation is reported separately. The carousel uses native touch scrolling and does not intercept touchmove, but final gesture review on a physical phone remains necessary; the selected original-photo gallery is exercised in automated browser checks.
