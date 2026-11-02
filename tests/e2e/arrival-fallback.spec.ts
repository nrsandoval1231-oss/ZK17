import { test, expect } from '@playwright/test';
import { build } from 'esbuild';

// Mount the real component with the supported unpublished-film prop, without
// adding a test route or publication override to the production application.
test('an unpublished film still reveals its fallback and reverses the aperture', async ({ page }) => {
  const bundle = await build({
    entryPoints: ['tests/e2e/arrival-fixture.tsx'], bundle: true, external: ['/media/*'], write: false,
    outdir: '/tmp/arrival-fixture', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}'  },
  });
  await page.route('**/arrival-fixture*', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('.js') || path.endsWith('.css')) {
      const file = bundle.outputFiles!.find(file => file.path.endsWith(path.endsWith('.js') ? '.js' : '.css'))!;
      await route.fulfill({ contentType: path.endsWith('.js') ? 'text/javascript' : 'text/css', body: Buffer.from(file.contents) });
    } else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0}</style><link rel="stylesheet" href="/arrival-fixture.css"><div id="root"></div><script src="/arrival-fixture.js"></script>' });
  });
  await page.goto('/arrival-fixture');
  const stage = page.locator('#film-room');
  const mask = stage.locator('svg').first();
  await expect(stage).toContainText('ZK17');
  await expect(stage.locator('video')).toHaveCount(0);
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!reduced) {
    await expect.poll(() => mask.evaluate(el => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
    await stage.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + innerHeight * 1.85 + 1, behavior: 'instant' }));
  }
  await expect(mask).toHaveCSS('opacity', '0');
  if (!reduced) {
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await expect(mask).toHaveCSS('opacity', '1');
    await expect.poll(() => mask.evaluate(el => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
  }
});
