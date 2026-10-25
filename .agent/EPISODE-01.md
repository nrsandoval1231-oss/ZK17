# Episode 01 — integrated preview QA
STATE: empty repo/no media -> initial static app -> owner-authorized screenshot crops -> integrated candidate ba76838.
DECISION: preserve owner's eight-scene brief; clean crops for review only; public release remains separate.
ACTION: Luna built; parent reran deterministic gates and browser tests; parent inspected desktop/mobile/Android-class captures; Sol independently reviewed actual source and captures.
OUTCOME: compile/type/lint/unit/audit passed; UI tests exposed menu overlay/focus, contrast, labels and test setup defects. First repair improved runtime to13pass4fail4intentional skips. Sol FIX added exported previewfile boundary and approved-photo scene assignments.
DETERMINISTIC EVALUATION: failures retained in evidence/qa-attempt2-e2e.json. No static green gate counted as runtime success.
ATTRIBUTION: backdrop-filter ancestor constrained fixed nav; focus attempted before nav computed visibility; shared light-surface text color failed after gallery moved to dark scene; filtering references did not remove public asset distribution.
CANDIDATE LESSON: overlay geometry/focus and output distribution need behavioral assertions, not only content/source checks. Named metrics: browser unexpected failures toward0; axe violations toward0; preview-release bypass rejection towardtrue.
VALIDATE/PROMOTE: pending final repair validation. Do not promote yet or claim measured improvement beyond observed run counts. Reversible through ordinary source/test changes.
NEXT DIRECTION: CORRECT via PACKET-REPAIR-02; freeze, revalidate, Sol verdict, then review preview deployment.
