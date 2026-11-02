import { expect, test } from '@playwright/test';
import { build } from 'esbuild';

test('campaign hero presents its statement, identity and watch action', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#arrival');
  const hero = page.locator('#arrival');
  await expect(hero.locator('#hero-title')).toHaveText(/MAKE THEM\s*REMEMBER\./);
  await expect(hero).toContainText('ZEPHYR KREYE');
  await expect(hero).toContainText('ANNA COYOTES');
  await expect(hero).toContainText('PREPARATION');
  await expect(hero.locator('[data-arrival-layer="mark"]')).toBeVisible();
  if (await page.locator('main').getAttribute('data-preview-media') === 'enabled') {
    await expect(hero.locator('[data-arrival-layer="athlete"] img')).toHaveAttribute('src', /arrival-campaign\/front-640\.svg/);
  }
  await hero.getByRole('button', { name: /watch.*film/i }).click();
  await expect(page.getByRole('dialog', { name: 'Film room' })).toBeVisible();
  await page.getByRole('button', { name: 'Close film room' }).click();
  await expect(hero.getByRole('button', { name: /watch.*film/i })).toBeFocused();
});

test('hero stays within the viewport and responds to motion preference changes', async ({ page }) => {
  await page.goto('/#arrival');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect.poll(() => page.locator('#arrival').evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
});

async function withinViewport(locator: import('@playwright/test').Locator, height: number) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(height + 1);
}

test('active desktop pin reverts all reveal styles when motion is reduced', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, isMobile: false, hasTouch: false, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(() => scrollTo(0, 400));
  const hero = page.locator('#arrival');
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
  for (const el of await hero.locator('#hero-title span, [data-arrival-layer="athlete"]').all()) {
    await expect(el).toHaveCSS('opacity', '1');
    await expect(el).toHaveCSS('transform', 'none');
  }
  await context.close();
});

test('mobile final frame and small no-JS frame fit the viewport', async ({ browser }) => {
  for (const [width, height, javaScriptEnabled] of [[390, 844, true], [320, 568, false]] as const) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, javaScriptEnabled });
    const page = await context.newPage();
    await page.goto('/#arrival');
    const hero = page.locator('#arrival');
    await withinViewport(hero.locator('#hero-title'), height);
    await withinViewport(hero.getByText(/PREPARATION.*DISCIPLINE.*RESULTS/), height);
    await withinViewport(hero.locator('[data-arrival-layer="athlete"]'), height);
    await expect(hero.locator('[data-arrival-layer="athlete"] img')).toHaveAttribute('alt', /number 17/i);
    await expect(hero.locator('#hero-title span').first()).toHaveCSS('opacity', '1');
    await expect(hero.locator('#hero-title span').last()).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await context.close();
  }
});

test('touch tablet scrolls naturally without a hero pin', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(() => scrollTo(0, 300));
  await expect(page.locator('#arrival')).not.toHaveClass(/pin-spacer/);
  await expect.poll(() => page.locator('#arrival').evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
  await context.close();
});

test('desktop enhancement begins with rear silhouette and both headline lines initialized', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, isMobile: false, hasTouch: false, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  const hero = page.locator('#arrival');
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
  const opacity = (selector: string) => hero.locator(selector).evaluate(el => Number(getComputedStyle(el).opacity));
  expect(await opacity('[data-arrival-layer="rear"]')).toBeGreaterThan(await opacity('[data-arrival-layer="athlete"]'));
  expect(await opacity('#hero-title span:first-child')).toBe(0);
  expect(await opacity('#hero-title span:last-child')).toBe(0);
  await context.close();
});


test('unpublished photo fixture makes no preview image requests', async ({ page }) => {
  const bundle = await build({ entryPoints: ['tests/e2e/arrival-fixture.tsx'], bundle: true, write: false, outdir: '/tmp/arrival-fixture', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' } });
  const requests: string[] = [];
  page.on('request', request => { if (/\/media\/(arrival-campaign\/|(?:arrival|portrait|throwing|running|on-field)-)/.test(request.url())) requests.push(request.url()); });
  await page.route('**/arrival-fixture*', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('.js') || path.endsWith('.css')) {
      const file = bundle.outputFiles!.find(file => file.path.endsWith(path.endsWith('.js') ? '.js' : '.css'))!;
      await route.fulfill({ contentType: path.endsWith('.js') ? 'text/javascript' : 'text/css', body: Buffer.from(file.contents) });
    } else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/arrival-fixture.css"><div id="root"></div><script src="/arrival-fixture.js"></script>' });
  });
  await page.goto('/arrival-fixture');
  await expect(page.locator('#hero-title')).toHaveText(/MAKE THEM/);
  await expect(page.locator('#arrival img')).toHaveCount(0);
  expect(requests).toEqual([]);
});


test('short landscape keeps copy and watch action visible and separate', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/#arrival');
  const hero = page.locator('#arrival');
  const watch = hero.getByRole('button', { name: /watch.*film/i });
  const footer = hero.getByText(/PREPARATION.*DISCIPLINE.*RESULTS/);
  for (const el of [hero.locator('#hero-title'), hero.getByText(/ANNA COYOTES/), watch, footer]) await withinViewport(el, 390);
  const buttonBox = (await watch.boundingBox())!;
  const footerBox = (await footer.boundingBox())!;
  expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(footerBox.y);
  await context.close();
});

test('keyboard focus never lands on a visually hidden hero control', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, isMobile: false, hasTouch: false, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el.closest('#arrival')) return null;
      const style = getComputedStyle(el);
      return { opacity: Number(style.opacity), visibility: style.visibility };
    });
    if (state) { expect(state.opacity).toBeGreaterThan(0); expect(state.visibility).toBe('visible'); }
  }
  await context.close();
});


test('watch action is unobstructed in static responsive frames', async ({ browser }) => {
  for (const [width, height] of [[1536, 1024], [390, 844], [320, 568], [844, 390]] as const) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 900, hasTouch: width < 900, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/#arrival');
    const hero = page.locator('#arrival');
    const watch = hero.getByRole('button', { name: /watch.*film/i });
    await withinViewport(watch, height);
    await expect(watch).toBeVisible();
    await watch.click();
    await expect(page.getByRole('dialog', { name: 'Film room' })).toBeVisible();
    await context.close();
  }
});
