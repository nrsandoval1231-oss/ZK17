# Director's Cut — final integration amendment review

Reviewed HEAD `e1acea9d70429719bf0cccea5e57f977b0a151dc`, specifically `settled-layout-fix.diff` and the appended reduced-motion completion section of `final-fix-report.md`. This report covers the amendment after `a4d4ae1`; the earlier `final-rereview.md` is not represented as having reviewed this later patch.

**SPEC: PASS for the amendment. QUALITY: PASS for the amendment.** No actionable finding in this bounded source/test change.

The product repair addresses the recorded resize race directly. Observing `#film-room` with the existing ResizeObserver requests the existing coalesced refresh after the stage's actual dimensions settle, rather than relying only on a potentially premature window resize callback. Existing observer disconnection and pending-frame cleanup cover the new observation. When native keyboard alignment has no cinema ScrollTrigger, the stage's document position now supplies the same finite, clamped landing used by the ordinary direct-film anchor. This preserves reduced-motion framing without creating a new animation or timing delay.

The new deterministic source fixture changes preceding layout and film height after two animation frames following window resize, then asserts the stage returns to top zero and the video to y96. Its viewport meta matches the application. The unchanged built direct-anchor resize and strong native Tab traversal regressions remain relevant integration checks.

The native-key test correction is appropriate: reduced motion must keep native controls available after manual scrolling, while motion mode may return them to the unrevealed state. Public assertions still require focus, controls/tabIndex readiness, full player bounds, real manual scroll movement and preservation of external `preventScroll` focus. Removing the private token-presence assertions does not waive those user-visible requirements; the added framing assertion strengthens the observable contract. No regression was skipped or its pixel bounds relaxed in this amendment.

Actual evidence inspected, not rerun:

- `/tmp/directors-reduced-completion-cinema-final.log`: **34 passed, two existing conditional skips**, covering all four configured projects, including native traversal and reduced-motion resize/manual release.
- `/tmp/directors-reduced-layout-source-final.log`: **2/2 passed**, managed Chromium and WebKit delayed-layout fixtures.
- `/tmp/directors-reduced-resize-fixed.log`: **6/6** rapid-load/resize observations at scrollY600, stage top0, video top96, tabIndex0 and BODY focus, confirming repair before any Tab input.

No product edits, browser suite/build, broad new review, delegation, push or deployment were performed. The fresh full 288-case run at `/tmp/directors-complete-browser.log`, refreshed canonical captures and final metrics remained controller-owned completion gates when this amendment review was recorded. This PASS does not predeclare that run or alter the existing preview-only media and physical-device limitations.

## Test-harness-only addendum — `bbd4f6b`

**PASS for the one-line reverse-fixture correction and evidence report.** Product source remains `e1acea9`; this addendum does not revise its product review or claim a fresh complete-suite pass.

Reviewed `reverse-fixture-fix.diff`, the current `seekFixture` helper and the appended implementation report. Reverse now uses the same explicit instant-scroll request and bounded observation of actual trigger and scrub-animation convergence as forward seeks. The helper does not assign timeline progress or force the animation into its expected state. All eight darkness opacity checks remain below .01 and the statement must remain exactly opacity 0. No cases are skipped and no visual threshold is loosened.

The report accurately retains the prior 269-pass/18-skip/one-failure full run and distinguishes demonstrated raw/smooth-scroll behavior from the unproven relative contribution of headless WebKit scrub delay. Applying the existing fifteen-second convergence observation to reverse is appropriate for this eventual-state fixture; it is not evidence of a smoothness or device-performance target.

Read `/tmp/directors-final-reverse-fixture.log`: **40/40 passed**, zero skips/failures. No tests/builds were rerun by this reviewer. Fresh full-suite results and regenerated canonical evidence remain controller completion gates.
