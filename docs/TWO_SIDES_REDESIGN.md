# Two Sides review handoff — 2026-11-03

Branch: `feat/two-sides-dedicated-pages`. Review preview only; no merge or deployment authorized.

## What changed
- Preserved ArrivalExperience, ArrivalHero, original video bytes and their animation implementation. The homepage now moves directly from its existing opening/cinema into a full-area linked editorial diptych and compact footer.
- Added `/on-the-field/`: existing field hero composition, six 2026 metrics, source notes, three editorial signature performances and nine-game passing log. No video or duplicate highlights section.
- Added `/beyond-17/`: warm editorial portrait hero, eight accessible interest categories, owner-supplied picks and explicit unanswered categories. Native scroll-snap gallery supports keyboard navigation and adjacent-image depth when authentic lifestyle photos are added.
- Shared seven-destination navigation; existing Film/Highlights, Recruiting, NIL, About and Playoffs routes retained. Updated sitemap and recruiting performance link.
- Removed obsolete downstream homepage section pins and selectors. New pages have no GSAP pins, filters animated continuously, custom drag interception or scroll-jacking.

## Authentic asset inventory
No new or generated athlete/family photographs were introduced. Existing crop derivatives are reused byte-for-byte, through responsive AVIF/WebP sources at 360/540/706 widths.

| Photograph | Existing source | Used in | Status |
| --- | --- | --- | --- |
| No. 17 preparing to pass, black uniform | `/media/on-field-706.webp` and AVIF/WebP variants | Homepage left panel, dedicated field hero | Owner-provided football image; existing preview-only crop, originals/rights pending |
| Helmet-off seated sideline portrait | `/media/portrait-706.webp` and AVIF/WebP variants | Homepage right panel, Beyond hero, single accurately captioned gallery frame | User approved temporary review use; existing preview-only crop |
| Existing intro standing/action/rear/white layers | Existing `arrival-directors-cut` assets and campaign closeup | Preserved cinematic intro | Existing preview gates unchanged |
| Original cinematic video | `/media/zephyr-monochrome-full.mp4` | Preserved homepage cinema and existing Film experience | Existing owner-approved media record unchanged |

See `MEDIA_INVENTORY.md`, `PREVIEW_MEDIA_MANIFEST.json`, and `MEDIA_SOURCE_HASHES.json` for original source descriptions/hashes. New photo lookup honors `PREVIEW_MEDIA_MODE=false`; the existing public-release distribution gate remains intact. A clean release still requires approved originals and removal/replacement of all preview-only distributed assets.

The latest approved mockup, smiling restaurant/lifestyle portrait, fishing, home gaming, canyon, Christmas family, Sandbox VR and friends/family images were not present. They have not been fabricated or substituted with unrelated sports images. Exact fidelity to the unseen mockup is not claimed. `content/life.ts` is the empty lifestyle-photo inventory; add approved photographs with caption/source/date there. Only one sideline frame appears until the inventory is populated, so production multi-photo swiping cannot be evaluated with current content. A test-only three-photo fixture exercises the actual carousel without shipping sample family content.

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
- Portrait selection: `content/athlete-photos.ts`, reusing existing approved scene lookup and preview switch.

## Validation and known limits
Detailed final results and screenshots: `artifacts/two-sides/README.md`.
Physical iPhone Safari has not been tested. Automated iPhone WebKit emulation is reported separately. The carousel uses native touch scrolling and does not intercept touchmove, but final gesture review with the real lifestyle photo collection and a physical phone remains necessary.
