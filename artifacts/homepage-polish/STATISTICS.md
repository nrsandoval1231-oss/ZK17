# Homepage statistics verification

Scope: **2026 complete season**, not career and not the separate playoff bracket data.
Source system: `content/site.ts` (`stats` / `publicStats`); presentation adapter: `content/homepage-stats.ts`.

The existing `stats` array is empty. Therefore all four metrics render **— / NOT YET VERIFIED**, with an explicit 2026 season / verified record pending label. No illustrative mockup numbers, inferred game results, external scraped totals or invented rating are used.

| Display metric | Required source records | Verification |
| --- | --- | --- |
| TOTAL YARDS | `passing-yards` + `rushing-yards` | One verified, published, sourced complete-season record per component; same 2026 season and game count. No precombined total is summed again. |
| TOTAL TD | `passing-td` + `rushing-td` | Same complete-season, unique-component and matching-game-count checks. Passing and rushing touchdowns only. |
| QB RATING | `qb-rating` and nonblank `ratingMethod` | Display the source-defined value and named method verbatim; never calculate or substitute NCAA efficiency, NFL passer rating or QBR. |
| COMP % | `completion-percent` | Verified complete-season percentage in 0–100; no average across games/seasons. |

All records must satisfy the existing verified + published + nonempty source + valid sourceDate gate. Legacy rows without explicit `metric` and `scope: 'season-total'` remain unavailable in the homepage adapter. Duplicates or differing game counts withhold the metric rather than guessing. Tests cover empty/unverified input, season isolation, passing+rushing sums, duplicate records, mismatched games, missing scope and missing rating definition. Test fixture numbers are synthetic and are not public athlete statistics.

Verified social profiles are also empty in the current content system. No accounts, follower counts, contact claims or social destinations have been fabricated.
