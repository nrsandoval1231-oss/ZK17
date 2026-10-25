# QA attempt 1 — 2026-10-25
Candidate: initial integrated preview, pre-commit. Parent reran lint/unit(3)/audit/build/typecheck: all exit0, production vulnerabilities0. Detector returned [].
Automated Playwright run: 7 passed, 12 failed, 2 intentional project skips. Seven mobile failures came from wrong-engine device configuration (iPhone profile selected uninstalled WebKit). Other failures: direct-child scene count invalid after GSAP wraps; script-text assertion incorrect; mobile menu focus failure; real contrast and accessible-name issues.
CUA confirmed mobile menu defect: fixed nav nested in backdrop-filter header had height156px instead of viewport, menu content and backdrop overlapped hero. Repair packet issued to Luna, not self-repaired by controller.
Capture pass: 1280x720,390x844,412x915 all HTTP200, zero page errors, zero horizontal overflow, all9image nodes loaded. NoJS mobile showed athlete heading and all8scenes. Captures used reduced motion for visibility; they do not prove dynamic motion. Main hero at720height clipped first actions; duplicate rotated labels and tiny text noted. OffField fixed height risk clips media content.
Parent source scan also found gallery buttons selected first film rather than clicked asset; included in same bounded repair.
Next: repair all identified issues together, rebuild/retest exact candidate, then independent review.
