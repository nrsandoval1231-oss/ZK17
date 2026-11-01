# Road to State — data and verification

Season: 2026. Competition: UIL Conference 5A Division II. Route: `/playoffs/`. No database, authentication or live-score backend.

## Sources actually inspected

| Source | Use | Finding / limit |
| --- | --- | --- |
| [UIL 2026–28 alignment](https://realignment.uiltexas.org/alignments/2026/5AD2FB2026.pdf) | Anna classification/district/region | Anna is District 4, Region I, 5A Division II. Alignment is not playoff qualification. PDF archived with hash in `artifacts/playoffs/retrieval/report.json`. |
| [UIL blank brackets, page 5](https://realignment.uiltexas.org/alignments/2026/FB_BB_VB_Blank_Brackets.pdf) | Actual tournament graph | Football 2A–5A D1/D2: 16 districts × four qualifiers, 64 positions, 63 games, six rounds. Regional winners I/II and III/IV feed the two state semifinals. |
| [UIL 5AD2 bracket](https://www.uiltexas.org/football/playoff-brackets/5AD2) | Authoritative 2026 competition entrypoint | Raw page explicitly links a 2026 UIL MaxPreps bracket. Scraped main content alone omitted the embedded bracket. |
| [UIL-linked 2026 bracket](https://www.maxpreps.com/tournament/view.aspx?tournamentid=7a33d24f-4de2-43eb-aa37-7987d5c334ab&ssid=2286cd80-c46d-4739-8dd1-92a67ca8daa7&bracketid=15f0b8b4-192d-4208-828c-4f26f39ce6a8) | Cross-check exact progression and current participant availability | Explicitly labelled 2026; district-finish placeholders and Winner G1…G62, no actual qualifiers or scores observed. Research excerpt archived under `sources/uil-linked-2026-bracket.md`; unrelated promotional video excluded. |
| [Official Anna football](https://www.gocoyoteu.com/sport/football/boys/) | Identity, official team navigation | Schedule/results ticker lacks an explicit season label in retrieved main content. No ticker score promoted as a verified 2026 playoff result. Raw official HTML confirms `?tab=schedule`, `?tab=roster`, `?tab=staff` links. Current-season coaching remains unverified. |

The generic postseason manual also describes four qualifiers but includes 2025 dates. It was not used to supply 2026 dates. Official date windows, kickoff, opponent, venue and coaching stay pending until explicitly verified. No prior-season teams were imported.

## Graph, not a sample

`lib/playoffs/tournament.ts` builds 32 bi-district games, 16 area, eight regional, four state quarterfinals, two state semifinals and one championship. Every game has immutable ID, season/division, region, round, feeder IDs and next game/slot. Regions have 15 games each; state stage has three. All 63 are available through All regions and the list alternative.

First-round ordering per region (offset districts by 4 per subsequent region): W1/F2, R4/T3, W2/F1, R3/T4, W3/F4, R2/T1, W4/F3, R1/T2. Labels mean first/second/third/fourth district finish, not a school name or a confirmed home-field assignment. Internal home/away fields mean the two bracket positions; venue is independently verified.

Teams, sources, reviewed observations, season and verification scope live separately in `content/playoffs/verified.json`. No observation is configured today. Anna has a verified alignment record but is not seeded into a playoff game. Unassigned positions remain useful by naming the district/finish or upstream game. Anna highlights only follow actual verified assignments and wins; future rounds never light by assumption.

## Update workflow

1. `npm run playoffs:retrieve` retrieves four fixed official URLs with HTTPS, time/size limits, content-type/PDF checks, SHA-256, retrieval time, errors and change flags. It does not execute source scripts, follow arbitrary URLs or parse/guess scores. The HTML files are ignored by git; hashes and PDFs are review evidence. A changed hash means “review required,” not “result changed.” Some HTML contains volatile content, so false-positive change flags are expected.
2. The supplied GitHub Actions workflow runs on manual dispatch or every six hours **after it is available on the default branch**. It has read-only repository permissions and uploads source snapshots for human review. This feature branch does not activate a production schedule, publish data, or deploy a site. Each scheduled checkout compares to the last committed reviewed report; local consecutive retrievals can compare their prior report.
3. A reviewer checks the actual season, bracket, participating identities, scores/status, explicit winner, kickoff timezone and source. Add a source record/verified team registry entry as necessary. Use UIL first, then official school athletics, then explicitly labelled secondary sources. Official-source classification is a reviewed inventory decision, not guessed from a name.
4. Prepare one complete observation JSON using the `Observation` type. `sourceId`, `verifiedAt` with timezone and `reviewedBy` are mandatory. `homeTeamId`/`awayTeamId` are stable registry IDs. Optional `homeTeamName`/`awayTeamName` are normalized and resolved through exact known aliases; unknown/ambiguous names and ID/name conflicts fail. No fuzzy merging or automatic creation of schools.
5. `npm run playoffs:update -- apply /path/to/reviewed-observation.json` validates the existing artifact, applies one observation transactionally, updates only its legitimate next slot after a verified final, validates the whole graph, and atomically writes the reviewed artifact. Unrelated games remain unchanged. `npm run playoffs:validate` runs in prebuild, reconstructing the clean static tournament from the journal. The app uses the same reconstruction/validation.
6. Review the data diff, source snapshots and tests, commit to a review PR, rebuild and publish only through the owner-authorized release workflow. Fetching sources alone never updates the displayed Last verified time. The timestamp is scoped; game-specific verification time is distinct from alignment/source retrieval.

Final scores require two known distinct participants, nonnegative integer scores, a non-tied complete score and an **explicit** winner matching that score. Live/incomplete/tied scores never advance. Scheduled games require kickoff; postponed/canceled games carry no scores/winner. Source/review times cannot be future or stale. Football scores above 200 require special manual model review and are rejected by the initial validator. District/region conflicts, duplicate first-round placements, malformed graph relationships, missing propagated winners and occupied downstream slots fail closed.

Conflicting finals are rejected, including a secondary source trying to replace an official result. Identical repeated finals are no-ops. For a genuine official correction, retain the conflicting snapshots, review and correct the affected journal record in a dedicated PR, then replay/validate the complete downstream graph. Do not force-overwrite the generated next-game state; existing dependent results may require explicit correction too. Git preserves the correction audit trail.

Keep private notes and credentials outside public artifacts. Reviewer labels should be safe public audit labels. Test fixtures remain under tests or isolated `/tmp` builds; never put fixture opponents/scores in `content/playoffs/verified.json`.

## Artwork and release

The owner supplied the exact coyote image on 2026-11-01. Its original JPEG is now integrated with source checksum and byte-identical web delivery; no generated/recolored/redrawn/substitute artwork is used. The original has an opaque white background, not transparency, and that appearance is preserved. The latest canonical Road to State mockup remains unavailable, so final visual-match acceptance is still pending. See docs/BRAND.md for logo provenance.

`content/playoffs/brand.json` is the integration point: immutable original path/SHA, approved local `/brand/` web image path, actual dimensions, owner approval and canonical mockup path. The prebuild asset validator checks source hash, output dimensions, aspect ratio and alpha preservation. Retain the original unchanged and use a lossless web derivative with the same artwork; confirm visually against the supplied original before setting ownerApproved. Anna cannot fall back to an arbitrary team-registry logo when owner approval is absent.

The original-logo provenance check now passes. Public builds still fail while the canonical mockup is absent. Existing preview-photo, commitment, noindex and exported-file gates remain unchanged. The hero uses the already authorized on-field preview only in review mode, with its label; approved scene photography takes precedence. No AI Zephyr image, new commitment information or public deployment is included.

Approved game film: add a verified/published source/date relationship `{ gameId, assetId, verified, published, source, sourceDate }` to `content/playoffs/game-films.json`. The asset must independently pass the existing rights-approved local-video publication gate. Unknown games, pending rights and unverified relationships are filtered out. Game Center links eligible film into the existing Film Room player rather than autoplaying media or inventing clips.
