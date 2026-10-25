# Football game frozen-candidate validation

Production build, TypeScript, ESLint and19 unit tests pass. Final Chromium43 and WebKit13 browser tests pass, with12 intentional project skips and no unexpected/flaky results. Additional six viewport/engine gameplay and dialog Axe checks pass: Chromium320/390/412/768/1280 and WebKit390, real pointer and keyboard aim/throw, pause/resume, restart, Escape/focus, restored body scrolling,44px controls and no overflow. Actual pointer/Throw/Next Play inputs completed12snaps and scored18 arcade points, with touchdown screenshot; no game-state injection in the real round.

Two test-only repair batches migrated old selectors/states after title/game behavior changed. Failed reports are retained. Runtime stayed unchanged during those repairs; final TypeScript/lint reran after test edits. The hidden-document case injects a visibility event to exercise the handler and does not claim physical tab-switch proof. Physical devices UNKNOWN. Parent helper corrected Axe context initialization; this was not an application defect.

Screenshots in public/concepts/football-game are actual frozen production renders, converted toWebP; copied to export without changing application output. Raw console logs preserved asgzip; plaintext trailing whitespace normalized. Exact-candidate independent review and actual remote preview proof remain open.
