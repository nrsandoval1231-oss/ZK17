# Independent review: refined controls

Status: IN PROGRESS. No final verdict while product files remain mutable and the server still serves the earlier export.

Reviewer: independent Astra critic, requested high reasoning. Scope: owner spec.md and approved-reference.png, plan.md, diff against dc7739e4bead6179042ac3589dfa2c77e13c1dea. No product edits, merge, or deployment performed by reviewer.

## Initial findings sent for repair

- P2: Film dialog CLOSE inherited old 10px body type and no 44px minimum target height after removal of its taller multiplication glyph.
- P2: Custom statistics dropdown chevron remained in .select-wrap:after while native appearance was disabled; owner permits native affordances only.
- P2: Shared business inquiry retained the older padded outline; shared text/menu/contact controls lacked a pressed state.
- P2: Playoff utility/section actions retained 8–9px body typography and CLOSE lacked 44px minimum width, inconsistent with the approved editorial controls.
- P2: Arcade BACK underline scaled across its wide button rather than fitting its text.
- Verification defects: new mobile test opened menu without closing before interacting with inert main; arcade test inspected a category after it unmounted; existing playoff test still looked for removed Close game center accessible name.

These were source findings on the initial mutable candidate. Repairs are in progress and must be checked against the final export.

## Independently inspected constraints

Diff leaves content/data, navigation destination source, logos/media assets, Hudl component, package and lockfile untouched. Intro motion diff deletes only removed Skip intro handler/listener; timeline positions and duration remain unchanged. Removed WATCH FILM header/hero controls remain absent. Functional media play triangle remains allowed.

Initial lint/type logs show no diagnostics; unit log records 62 passed, zero failed. These logs predate later repair edits and do not certify the final candidate. Before capture manifest contains all 29 desktop/portrait/landscape screenshots from immutable https://00b39a31.zk17-review.pages.dev.

## Pending

Final candidate identity; rebuild; independent browser audit and visual inspection; final lint/type/unit/build/full e2e evidence; real Hudl playback and iframe identity evidence. Physical iPhone testing is UNKNOWN unless separately performed. Deployment acceptance is outside this source-review verdict.

## Independent browser pass, initial rebuilt export

Against http://127.0.0.1:3100 after lead confirmed rebuild:
- 21 combinations: seven routes at 1440x900, 390x844, 844x390, reduced motion. No document horizontal overflow.
- All 14 mobile route/viewport combinations: menu initial CLOSE focus, body overflow hidden, Shift+Tab to final link, Escape to MENU passed. Landscape menu scrollHeight404/clientHeight390; vertical menu scrolling remains available.
- Playoff Region III produces15 cards; round1 produces4; selected underline computed transform identity. Game CLOSE44.5625x44 and film CLOSE44x44 with Barlow Condensed.
- Four arcade categories each show three items; BACK restores focused selected category with2px underline.
- Animated intro at96%: SCROLL TO EXPLORE reaches #film-room at viewport top0, introComplete=true. Native anchor leaves activeElement BODY; prior explicit focus was only Skip intro handler. Tests must distinguish default anchor behavior from removed Skip behavior.

Additional P2 findings sent for repair:
- Home footer logo link34x34 desktop/29x29 portrait; recruiting snapshot and playoffs footer logo links40x40. All-control44px requirement still unmet.
- Light-surface business-inquiry pressed color becomes rgb(172,124,255) on rgb(238,236,232), insufficient contrast. Use existing dark purple for light-surface pressed/focus states.
- Evidence correction: after portrait/landscape mobile-menu images show CLOSE only. Runtime links are visible and hit-testable after settled layout, so screenshots require recapture.

First full e2e receipt:190 passed,7 skipped,23 failed. Most failures are tests treating late-reveal SCROLL TO EXPLORE like removed always-visible Skip intro; arcade test incorrectly demands exact44px minimum instead of at least44. Final acceptance requires repaired assertions and rerun; no failing receipt is accepted here.

Further P2 from settled mobile-menu visual review: both trigger and internal CLOSE stay visible when open. At390x844 home, internal CLOSE rectangle x300.28/y20/58.53x44 overlaps trigger CLOSE x313.47/y15.5/58.53x44,z42; center hit testing returns trigger. Route header has MENU over CLOSE instead. Reproduced after650ms on home/About and both390/844 widths. Requires hiding the expanded trigger while keeping internal close, focus trap, and return focus. This was obscured by earlier blank menu screenshots.

Final-built repair checks already verified: three logo links44x44; light-surface pressed color rgb105,64,170; film-room tabindex-1. Chromium and WebKit both navigate/focus FilmRoom at top0, mark introComplete=true, and reverse to coldlogoopacity0.9/introComplete=false.
