# QA matrix — final local export
Build environment: SITE_URL=https://review.zk17-review.pages.dev, PUBLIC_RELEASE=false, PREVIEW_MEDIA_MODE=true, commitment disabled/null. See .agent/FINAL_GATES.json and raw logs.

| Gate | Result |
| --- | --- |
| Production static build | PASS incl sitemap.xml and export audit |
| TypeScript / ESLint | PASS / PASS |
| Content / release tests | 7 passed |
| Production dependency audit | 0 vulnerabilities |
| Chromium suite | 17 passed, 4 project-specific intentional skips, 0 failures/flaky |
| Mobile WebKit iPhone13 profile | 5 passed, 2 project-specific intentional skips, 0 failures/flaky |
| Axe | 0 violations in all tested browser profiles |
| 1280x720 / 390x844 / 412x915 captures | All8scenes, zero pageerrors, zero horizontal overflow, all9imageinstancesloaded |
| Reduced motion | Static visibility and dynamic removal of pin spacers PASS |
| No JavaScript mobile | Athlete heading and all8scenes readable |
| CUA interactive | Hero film availability dialog opens/closes; Journey anchor changes destination |
| Real approved athlete video | NOT SUPPLIED; actual playback acceptance remains content-dependent |
| Physical devices / real Safari | UNKNOWN; WebKit emulation is not physical Safari proof |
| Deployed runtime | PASS: 73 remote assets match export SHA-256; desktop pins, mobile menu/Journey and film dialog verified |
| Mobile Lighthouse lab | Performance 98 / accessibility 100 / best practices 100; SEO 69 reflects deliberate noindex |
| Lab timing | FCP 0.9s, LCP 2.1s, TBT 30ms, CLS 0.065; not field measurements |

Screenshots: .impeccable/review/{desktop,mobile,android}.png, corresponding full-page and scene captures, now from the actual immutable deployment. Reduced-motion capture ensures no hidden entry frames; separate tests prove motion cleanup. Sol closed visual findings at ee9877de49b10f7c969c6494a71c959b546b96c3. See .agent/DEPLOYMENT_RECEIPT.json.
