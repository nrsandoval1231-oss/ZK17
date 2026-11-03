# Refined controls / no arrows — QA

Implements the owner-approved control reference while preserving canonical branding, routes, page content, photos/videos and all data. Five Luna builders owned shared controls, playoffs, arcade, hero and tests; a separate Astra critic audited implementation/runtime. A second Astra repaired test migrations after the explicitly removed Skip intro changed the available navigation path.

## Final behavior

Site-owned decorative arrows/chevrons/pointers and obsolete imports/styles are removed. Native media icons, native select affordances and Hudl controls remain. Existing navigation labels/destinations, active aria-current and canonical ZK image stay. Shared controls use readable condensed uppercase text, label-fit thin underlines, selected noncolor cues, sharp primary fills and explicit hover/focus/pressed/disabled states. The arcade retains pixel typography/four categories, selected purple underline, PRESS START and BACK. Playoff data/bracket behavior and game-center links remain intact; PREVIOUS/NEXT/CLOSE are words.

Touch targets are at least44×44 where audited, including expanded logo anchor hit areas without enlarging the artwork. Mobile open navigation exposes one CLOSE and six links, keeps the brand visible, traps focus/locks scrolling and restores MENU focus on Escape or pointer close. Light-paper pressed/focus uses dark purple for contrast. Native FilmRoom anchor is focusable for keyboard continuation.

Skip intro is removed. SCROLL TO EXPLORE remains a late statement detail, revealing at the original .86–.94 point. Tests now complete the actual scroll story before using that anchor; no early shortcut, motion timing or added scroll length was introduced. Mobile hero side photographs move outward while the central athlete remains the focal point. All original/new action photos remain and the color photo stays color.

## Verification

Final build, lint, TypeScript and62unit tests pass. Final full browser suite:213passed,7existingconditional skips,0failures across desktop/mobileChromium, iPhoneWebKit and reducedmotion. Earlier190pass/23fail run was retained: tests mistakenly treated the late scroll action as the old early Skip link, assumed homepage nav visible before completion, and required exact44px where valid controls were larger. These were corrected to actual user journeys/minimum geometry without dropping cold-state/focus/timing assertions. Subsequent48pass/4fail and4case repaired activation evidence is preserved; final fullsuite is authoritative.

Independent runtime audited default/hover/pressed/focus, selected underlines, menu/focus/Escape, all arcade choices, playoff region/round/view/previous/next/gamecenter, media close and overflow on desktop/portrait/landscape. Actual Hudl starts paused/time0 and advances after click in Chromium/WebKit; desktop fullscreen works, homepage has noHudlrequests. Latest live receipt has no pageerrors or overflow. An earlier WebKit live probe emitted vendorAdError1101 while media advanced; retained as upstream diagnostic, not silently discarded. Physical iPhone, PiP and sustained hardware performance remain unverified. Prior vendor accessibility incomplete findings remain third-party limits; no axe rules were disabled.

Protected-surface check: git diff dc7739e -- content lib public brand package.json package-lock.json is empty. No game-data, source/hash, asset, dependency or canonical-logo changes. GSAP timeline distances/positions remain unchanged; only removed Skip handler/focusable anchor changed.

## Before / after evidence

[Interactive comparison](../.agent/evidence/refined-controls/visual-review.html) covers navigation, links/primary, mobilemenu, playoffs, arcade/category/BACK, media and utility families.29baseline and29final screenshots cover1440×900,390×844 and844×390. Baseline comes from immutableDEV00b39a31/product2ec0a703; final shots are from the tested local build. Mobile menus are captured only after links/transform/fonts settle. Screenshots are actual browser captures, not mockups. Approvedreference/spec and initial/final logs are adjacent.

DEV-only deployment and exactcommit/URL/remoteverification are recorded below after delivery. Production/main are not authorized for changes and PR11 remains unmerged.
