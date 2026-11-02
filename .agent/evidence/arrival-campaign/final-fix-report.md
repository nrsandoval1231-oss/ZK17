# Final review fixwave

The stadium's static treatment is now opacity .14 and brightness .4; enhanced desktop initializes it at zero and reveals it alongside the portraits. Reversing the timeline returns it to zero. Reduced-motion and other static presentations retain the subdued completed CSS state. Missing stadium layers are handled without a GSAP null target.

At desktop widths of at least 900px and heights of at least 651px, the first headline line uses a smaller desktop scale and REMEMBER. is 1.25 times that size. The copy and editorial footer are raised; existing mobile and short-screen rules remain in effect. No source photographs, image masks, film or header were changed.

Evidence from current-source esbuild fixtures against the running server:

- Before the fix, the two new focused Chromium tests failed on initial stadium opacity .32 (expected below .01) and equal headline font sizes (expected ratio at least 1.2).
- After the fix, `npx playwright test tests/e2e/arrival-campaign.spec.ts --project=desktop-chromium --grep 'stadium reveals|desktop static statement' --workers=1 --output=/tmp/arrival-final-fix-tests` passed 2/2. The tests cover reveal, reverse, reduced-motion restoration, hierarchy, desktop placement, and 900×700 watch/footer separation and overflow.
- `npx eslint components/use-arrival-hero-motion.ts tests/e2e/arrival-campaign.spec.ts` passed; `npm run typecheck` passed.
- An intervening focused run collided with another concurrent Playwright run's shared `test-results` trace directory and failed on ENOENT during context close; the isolated-output rerun above passed.

The controller owns the production rebuild, full suite, actual page captures, and independent visual re-review. This worker did not rebuild or mutate the controller's server and did not independently verify no-JS screenshots or claim reference pixel equivalence.
