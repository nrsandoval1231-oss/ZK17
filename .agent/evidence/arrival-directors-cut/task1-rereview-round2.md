# Director’s cut Task 1 — round 2 scoped re-review

Reviewer: Codex (GPT-6 agent). Reviewed 8ee0633, `task1-round2.diff`, appended implementation report, and current rebuilt desktop/mobile action captures.

**SPEC: PASS for the scoped Task 1 findings. QUALITY: PASS for the scoped repair.** No remaining Important/Critical finding in this review scope. Final integrated validation and owner cinematic approval remain separate.

**Desktop action-photo frame — ADDRESSED.** Independent visual inspection of `/tmp/directors-r2-built/desktop-action.png` confirms the formerly hard rectangular panel is concealed by fades applied to the correctly proportioned photo frame. Side/background figures are substantially subdued; Zephyr remains the focal subject. `/tmp/directors-r2-built/mobile-action.png` retains the already improved mobile treatment without a new visible edge. The faint remaining #11 figure and limited original photo detail remain disclosed source limitations, rather than an equal competing focal subject. No cutout anatomy or generated likeness was introduced.

The CSS change now applies frame sizing, intersected horizontal/vertical masks and side shading at all widths. The added regression checks both sizes, actual frame aspect ratio/bounds, masks and shading. No unrelated production behavior is changed in this diff.

The fixture-orientation change cancels a pending restoration through explicit new input before a subsequent intentional seek; separate built-app progress-preservation tests remain intact. The WebKit helper observes trigger/animation convergence rather than forcing animation state. Its 15-second polling bound establishes eventual fixture correctness, **not smoothness or a performance target**; the report honestly retains that limitation. No new blocking test-contract issue found in the scoped changes.

The reported 32/32 director-suite result was read, not rerun. No builds, additional probes, implementation edits, broad review, delegation, push or deployment. Prior orientation/smoke findings remain addressed from round 1. Rights-pending media, physical iOS swipe/address-bar validation, and final whole-branch acceptance remain controller-owned limitations.
