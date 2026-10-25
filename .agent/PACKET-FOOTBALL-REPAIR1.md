# ZK-14 integration repair1 — test migrations
Full production gates pass and actual browser 12-snap round scored18 with TD screenshot. Chromium suite has10failures, all test-selection/state migrations; evidencechromium-attempt1.json. Runtime remains frozen until actualQA finding.
One Luna owns tests/e2e/arcade.spec.ts, tests/e2e/football-game.spec.ts, tests/e2e/site.spec.ts ONLY corrections below, plus completionrecordnote. No app/runtime/build/art edits. Not alone,preserveparenthelper/evidence.
1. Arcadekeyboardtest focusesMoviesbutdoesnotselect it; native radiofocusdoesnotcheck. RestoreGaming.focus -> ArrowDown -> assertMovieschecked -> Enter. This preservesactualkeyboardselectiontest, noforce.
2. Arcadeeachworldtest usesGaming.check() on hidden1pxinput, label intercepts. Use visibleGamingtextclick thenassertchecked, likepreviouscategorylabels. No forceclick.
3. Footballkeyboard/hiddenpause test still expects2/12 afterfirstresolvedthrow. WaitNextPlayvisible, assert SNAP1/12, clickNextPlay toenterplaying THEN triggerdocumenthidden handler and assertPAUSED. Explicitlylabel eventinjection as handler-levelbrowsercheck, notactualtabproof.
4. Existing site reducedmotionheroheading regexmatchesnewarcadeheading. Scope roleheading level1 (hero) or #hero-title, preservevisibilityassert.
Runfocusedchangedtestlint/diff only. Parent re-runs allPlaywright andhelper; no productionrebuildneeded ifonlytestchanges. Returnimmediately. Two totaldistinctrepairattemptbudget; this1testmigrationbatch.
