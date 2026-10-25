# Narrow audit correction
Objective: close sole Sol visual finding, film source caption overlaps action.
Ownership: Luna app/globals.css and EOF whitespace content/site.ts only. Parent owns docs/evidence. No other work, no parallel builder, no external side effect.
Dependency: Sol REVIEW-02 on e412de3. Constraint: two absolute labels shared bottom-left; prior ARIA changes did not move the actual caption. Alternate safe path: move source caption beneath top frame index, leave action at bottom. This is a PRD-aligned legibility repair, not reduced acceptance.
Validation: focused lint/diffcheck, then parent full frozen gates, recapture samefilmroom desktop/mobile, Sol scores original fix only. Completed scoped implementation; awaiting Sol rescore.
