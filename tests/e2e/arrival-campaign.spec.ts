import { expect, test } from '@playwright/test';
import { build } from 'esbuild';
import AxeBuilder from '@axe-core/playwright';

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

const headerDestinations = ['#arrival', '#on-field', '#journey', '#off-field', '#numbers', '#film-room', '#media', '/recruiting/', '/playoffs/'];

test('header watch opens native Film Room and restores its opener focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#arrival');
  const header = page.locator('.site-header');
  await expect(header).toContainText('ZEPHYR KREYE');
  const watch = header.getByRole('button', { name: 'WATCH FILM', exact: true });
  await watch.click();
  const dialog = page.getByRole('dialog', { name: 'Film room' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('controls', '');
  await page.getByRole('button', { name: 'Close film room' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(watch).toBeFocused();
});

test('header keeps all nine destinations within desktop widths', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const width of [1024, 1280, 1440, 1536, 1920]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/#arrival');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    expect(await nav.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(headerDestinations);
    const controls = page.locator('.site-header .brand, .site-header .header-watch, .site-header .site-nav a');
    let right = 0;
    for (const control of await controls.all()) {
      await expect(control).toBeVisible();
      const box = (await control.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
    // Separate horizontal regions must fit without overlapping.
    for (const region of [page.locator('.site-header .brand'), nav, page.locator('.header-watch')]) {
      const box = (await region.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(right);
      right = box.x + box.width;
    }
  }
  await context.close();
});

test('header mobile controls fit and menu preserves keyboard, inert and scroll behavior', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 568 });
    await page.goto('/#arrival');
    const controls = page.locator('.site-header .brand, .header-watch, .menu-toggle');
    await expect(controls).toHaveCount(3);
    for (const control of await controls.all()) {
      await expect(control).toBeVisible();
      const box = (await control.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    await toggle.click();
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const close = nav.getByRole('button', { name: /Close/ });
    await expect(close).toBeFocused();
    expect(await nav.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(headerDestinations);
    await expect(page.locator('.site-content')).toHaveJSProperty('inert', true);
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await page.keyboard.press('Shift+Tab');
    await expect(nav.getByRole('link', { name: 'Playoffs' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(page.locator('.site-content')).toHaveJSProperty('inert', false);
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  }
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.locator('.site-content')).toHaveJSProperty('inert', true);
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator('.site-content')).toHaveJSProperty('inert', false);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.setViewportSize({ width: 390, height: 568 });
  const watch = page.locator('.header-watch');
  await watch.focus();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(watch).toBeFocused();
  await context.close();
});


test('header home name includes the visible athlete wordmark', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#arrival');
  const home = page.locator('.site-header .brand');
  await expect(home).toHaveAccessibleName(/ZEPHYR KREYE.*ZK17 home/i);
  const accessibility = await new AxeBuilder({ page }).include('.site-header').withRules(['label-content-name-mismatch']).analyze();
  expect(accessibility.violations).toEqual([]);
});

// Bundle the current source independently of the controller's running export.
async function openCurrentHeroFixture(page: import('@playwright/test').Page) {
  const bundle = await build({
    stdin: { contents: `import React from 'react';
      import { createRoot } from 'react-dom/client';
      import ArrivalHero from './components/arrival-hero';
      import { profile } from './content/site';
      import { arrivalCampaignPhotos } from './content/arrival-campaign';
      import './app/globals.css';
      createRoot(document.getElementById('root')).render(<main style={{paddingTop: 96}}><ArrivalHero profile={profile} photos={arrivalCampaignPhotos} onWatch={() => {}}/><div style={{height:'150vh'}} /></main>);`, resolveDir: process.cwd(), sourcefile: 'arrival-current.tsx', loader: 'tsx' },
    bundle: true, write: false, outdir: '/tmp/arrival-current', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
    loader: { '.woff2': 'dataurl' }, conditions: ['style'],
  });
  await page.route('**/arrival-current*', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('.js') || path.endsWith('.css')) {
      const file = bundle.outputFiles!.find(file => file.path.endsWith(path.endsWith('.js') ? '.js' : '.css'))!;
      await route.fulfill({ contentType: path.endsWith('.js') ? 'text/javascript' : 'text/css', body: Buffer.from(file.contents) });
    } else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/arrival-current.css"><div id="root"></div><script src="/arrival-current.js"></script>' });
  });
  await page.goto('/arrival-current');
}

test('stadium reveals subtly, reverses and restores its static state on reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, isMobile: false, hasTouch: false, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await openCurrentHeroFixture(page);
  const stadium = page.locator('[data-arrival-layer="stadium"]');
  const opacity = () => stadium.evaluate(el => Number(getComputedStyle(el).opacity));
  await expect.poll(opacity).toBeLessThan(.01);
  await page.evaluate(() => scrollTo(0, 2000));
  await expect.poll(opacity).toBeGreaterThan(.05);
  expect(await opacity()).toBeLessThanOrEqual(.2);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(opacity).toBeLessThan(.01);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(opacity).toBeGreaterThan(.05);
  expect(await opacity()).toBeLessThanOrEqual(.2);
  expect(await stadium.evaluate(el => { const m = new DOMMatrix(getComputedStyle(el).transform); return [m.a, m.b, m.c, m.d, m.e, m.f]; })).toEqual([1, 0, 0, 1, 0, 0]);
  await context.close();
});

test('desktop static statement emphasizes the second line and keeps editorial controls together', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 1024 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await openCurrentHeroFixture(page);
  const hero = page.locator('#arrival');
  const lines = hero.locator('#hero-title span');
  const sizes = await lines.evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  expect(sizes[1] / sizes[0]).toBeGreaterThanOrEqual(1.2);
  const identity = (await hero.getByText(/ZEPHYR KREYE/).boundingBox())!;
  const footer = (await hero.getByText(/PREPARATION.*DISCIPLINE.*RESULTS/).boundingBox())!;
  const watch = (await hero.getByRole('button', { name: /watch.*film/i }).boundingBox())!;
  expect(identity.y).toBeLessThan(520);
  expect(footer.y).toBeLessThan(920);
  expect(watch.y + watch.height).toBeLessThanOrEqual(footer.y);
  await expect(hero.getByRole('button', { name: /watch.*film/i })).toBeVisible();
  await page.setViewportSize({ width: 900, height: 700 });
  await expect.poll(async () => {
    const shortWatch = (await hero.getByRole('button', { name: /watch.*film/i }).boundingBox())!;
    const shortFooter = (await hero.getByText(/PREPARATION.*DISCIPLINE.*RESULTS/).boundingBox())!;
    return shortWatch.y + shortWatch.height <= shortFooter.y;
  }).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(900);
  await context.close();
});
