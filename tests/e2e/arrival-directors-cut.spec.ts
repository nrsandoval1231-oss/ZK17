import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

type FixtureWindow = Window & { fixtureScrollTrigger: { getById: (id: string) => { start: number; end: number; progress: number; animation: { progress: () => number } } } };

async function openHero(page: Page, failEnhancement = false) {
  const bundle = await build({ stdin: { contents: `import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { gsap } from 'gsap';
    if (${failEnhancement}) gsap.timeline = () => { throw new Error('Deliberate enhancement failure'); };
    (window as any).fixtureScrollTrigger = ScrollTrigger;
    import Hero from './components/arrival-hero';
    import { profile, previewPhotos } from './content/site';
    import { arrivalCampaignPhotos } from './content/arrival-campaign';
    import './app/globals.css';
    createRoot(document.getElementById('root')).render(<main style={{paddingTop:96}}><Hero profile={profile} photos={[...arrivalCampaignPhotos,...previewPhotos]} onWatch={()=>{}}/><section id="film-room" style={{height:'100vh'}}>Film Room</section></main>);`, resolveDir: process.cwd(), sourcefile: 'directors-fixture.tsx', loader: 'tsx' }, bundle: true, external: ['/media/*'], write: false, outdir: '/tmp/directors-fixture', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' }, loader: { '.woff2': 'dataurl' }, conditions: ['style'] });
  await page.route('**/directors-fixture*', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('.js') || path.endsWith('.css')) {
      const file = bundle.outputFiles!.find(f => f.path.endsWith(path.endsWith('.js') ? '.js' : '.css'))!;
      await route.fulfill({ contentType: path.endsWith('.js') ? 'text/javascript' : 'text/css', body: Buffer.from(file.contents) });
    } else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/directors-fixture.css"><div id="root"></div><script src="/directors-fixture.js"></script>' });
  });
  await page.route('**/media/arrival-directors-cut/*.webp', async route => {
    const path = new URL(route.request().url()).pathname;
    await route.fulfill({ contentType: 'image/webp', body: await readFile(`public${path}`) });
  });
  await page.route('**/media/arrival-directors-smoke.png', async route => {
    await route.fulfill({ contentType: 'image/png', body: await readFile('public/media/arrival-directors-smoke.png') });
  });
  await page.goto('/directors-fixture');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(() => document.fonts.ready);
}

async function seekFixture(page: Page, fraction: number) {
  await page.evaluate(value => { const trigger = (window as unknown as FixtureWindow).fixtureScrollTrigger.getById('arrival-hero'); scrollTo({ top: trigger.start + (trigger.end - trigger.start) * value, behavior: 'instant' }); }, fraction);
  // Observe both trigger and scrub convergence; never force animation state.
  await expect.poll(() => page.evaluate(value => { const trigger = (window as unknown as FixtureWindow).fixtureScrollTrigger.getById('arrival-hero'); return Math.max(Math.abs(trigger.progress - value), Math.abs(trigger.animation.progress() - trigger.progress)); }, fraction), { timeout: 15_000 }).toBeLessThan(.035);
}

for (const touch of [false, true]) {
  test(`seven scroll beats progress and reverse on ${touch ? 'touch' : 'desktop'}`, async ({ browser }) => {
    test.setTimeout(90_000);
    const context = await browser.newContext({ viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: touch, hasTouch: touch, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await openHero(page);
    const hero = page.locator('#arrival');
    await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
    const spacer = (await hero.locator('..').boundingBox())!;
    const heroHeight = (await hero.boundingBox())!.height;
    const distance = spacer.height - heroHeight;
    expect(distance / (touch ? 844 : 900)).toBeGreaterThan(14);
    await expect(hero.locator('[data-arrival-layer="mark"]')).toHaveCount(0);
    const opacity = (layer: string) => hero.locator(`[data-arrival-layer="${layer}"]`).evaluate(el => Number(getComputedStyle(el).opacity));
    expect(await opacity('lights')).toBeLessThan(.01);
    expect(await opacity('athlete')).toBeLessThan(.01);
    const scrollBeat = (fraction: number) => seekFixture(page, fraction);
    await scrollBeat(.22);
    await expect.poll(() => opacity('lights')).toBeGreaterThan(.2);
    await scrollBeat(.58);
    await expect.poll(() => opacity('athlete')).toBeGreaterThan(.3);
    const photoHeight = (await hero.locator('[data-arrival-layer="athlete"] img').boundingBox())!.height;
    expect(photoHeight).toBeLessThan(heroHeight * 1.1);
    await scrollBeat(.71);
    await expect.poll(() => opacity('running')).toBeGreaterThan(.35);
    await scrollBeat(.80);
    await expect.poll(() => opacity('rear')).toBeGreaterThan(.35);
    await scrollBeat(.87);
    await expect.poll(() => opacity('white')).toBeGreaterThan(.35);
    await scrollBeat(.97);
    await expect.poll(() => hero.locator('[data-arrival-statement]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
    await seekFixture(page, 0);
    for (const layer of ['lights', 'smoke-back', 'smoke-front', 'silhouette', 'athlete', 'running', 'rear', 'white']) await expect.poll(() => opacity(layer)).toBeLessThan(.01);
    await expect(hero.locator('[data-arrival-statement]')).toHaveCSS('opacity', '0');
    await context.close();
  });
}


test('reduced motion restores the complete static frame after an active pin', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await openHero(page);
  const hero = page.locator('#arrival');
  await page.evaluate(() => scrollTo(0, 3500));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
  await expect(hero.locator('#hero-title')).toBeVisible();
  await expect(hero.getByRole('button', { name: /watch.*film/i })).toBeVisible();
  await expect.poll(() => hero.locator('[data-arrival-layer="athlete"] img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  await context.close();
});


test('touch orientation refresh keeps the story scrollable and bounded', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await openHero(page);
  const hero = page.locator('#arrival');
  await page.evaluate(() => scrollTo(0, 4000));
  await page.setViewportSize({ width: 844, height: 390 });
  await page.evaluate(() => dispatchEvent(new Event('orientationchange')));
  await page.touchscreen.tap(10, 10); // New user input cancels any queued orientation restoration.
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const spacer = (await hero.locator('..').boundingBox())!;
  const height = (await hero.boundingBox())!.height;
  expect(spacer.height - height).toBeGreaterThan(14 * 390);
  await expect.poll(() => hero.evaluate(el => parseFloat(el.parentElement!.style.paddingBottom))).toBeCloseTo((height + 96) * 15, 0);
  await page.waitForTimeout(400);
  await seekFixture(page, .97);
  await expect.poll(() => hero.locator('[data-arrival-statement]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await context.close();
});

test('built touch story retains its normalized beat through rotation', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  const hero = page.locator('#arrival');
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
  const distance = () => hero.evaluate(el => parseFloat(el.parentElement!.style.paddingBottom));
  await page.touchscreen.tap(10, 400);
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), (await distance()) * .5);
  await expect.poll(async () => (await page.evaluate(() => scrollY)) / await distance()).toBeCloseTo(.5, 1);
  await expect.poll(() => hero.locator('[data-arrival-layer="silhouette"]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.1);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(distance).toBeCloseTo(5850, 0);
  await expect.poll(async () => (await page.evaluate(() => scrollY)) / await distance(), { timeout: 6000 }).toBeCloseTo(.5, 1);
  await page.waitForTimeout(400);
  expect((await page.evaluate(() => scrollY)) / await distance()).toBeCloseTo(.5, 1);
  await expect(hero.locator('[data-arrival-layer="silhouette"]')).toHaveCSS('opacity', /^(0\.[1-9]|1)/);
  await context.close();
});


test('built story can retain progress after rotating at the opening', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  const hero = page.locator('#arrival');
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
  const distance = () => hero.evaluate(el => parseFloat(el.parentElement!.style.paddingBottom));
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(distance).toBeCloseTo(5850, 0);
  await page.touchscreen.tap(10, 200);
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), (await distance()) * .5);
  await expect.poll(() => hero.locator('[data-arrival-layer="silhouette"]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(distance).toBeCloseTo(12660, 0);
  await expect.poll(async () => (await page.evaluate(() => scrollY)) / await distance(), { timeout: 6000 }).toBeCloseTo(.5, 1);
  await page.waitForTimeout(400);
  expect((await page.evaluate(() => scrollY)) / await distance()).toBeCloseTo(.5, 1);
  await context.close();
});

test('smoke drifts during the central story', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await openHero(page);
  const smoke = page.locator('[data-arrival-layer="smoke-back"]');
  const bounds = (await smoke.boundingBox())!;
  expect(bounds.x).toBeLessThan(0);
  expect(bounds.x + bounds.width).toBeGreaterThan(390);
  const seek = (fraction: number) => page.evaluate(value => { const t = (window as unknown as { fixtureScrollTrigger: { getById: (id: string) => { start: number; end: number } } }).fixtureScrollTrigger.getById('arrival-hero'); scrollTo({ top: t.start + (t.end - t.start) * value, behavior: 'instant' }); }, fraction);
  await seek(.5);
  await expect.poll(() => smoke.evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.8);
  await page.waitForTimeout(500);
  const before = await smoke.evaluate(el => getComputedStyle(el).transform);
  await seek(.62);
  await expect.poll(() => smoke.evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
  await context.close();
});

test('action photo uses a bounded, faded frame at desktop and mobile sizes', async ({ browser }) => {
  for (const [width, height, touch] of [[1440, 900, false], [390, 844, true]] as const) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: touch, hasTouch: touch, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await openHero(page);
    const frame = page.locator('[data-arrival-layer="running"] picture').locator('..');
    const box = (await frame.boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(Math.min(width, height * .7));
    expect(box.height / box.width).toBeCloseTo(450 / 400, 1);
    await expect(frame).toHaveCSS('mask-image', /linear-gradient/);
    const shade = await frame.evaluate(el => getComputedStyle(el, '::after').backgroundImage);
    expect(shade).toContain('gradient');
    await context.close();
  }
});

test('rear and white montage fades follow each source image frame', async ({ browser }) => {
 for(const [width,height] of [[1440,900],[390,844]]) {
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage();
  await openHero(page);
  for(const [layer,ratio] of [['rear',650/1050],['white',470/805]] as const) {
   const frame=page.locator(`[data-arrival-layer="${layer}"] picture`).locator('..');
   const box=(await frame.boundingBox())!;
   expect(box.width).toBeLessThan(width*.95);
   expect(box.width/box.height).toBeCloseTo(ratio,2);
   await expect(frame).toHaveCSS('mask-image',/linear-gradient.*linear-gradient/);
   expect(await frame.evaluate(el=>getComputedStyle(el,'::after').backgroundImage)).toContain('gradient');
  }
  await context.close();
 }
});


test('failed hero enhancement reverts partial styles to the readable fallback', async ({ page }) => {
 const errors: string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.emulateMedia({reducedMotion:'no-preference'});
 await openHero(page,true);
 await expect(page.locator('#arrival')).toHaveAttribute('data-arrival-motion','fallback');
 await expect(page.locator('#hero-title')).toBeVisible();
 await expect(page.locator('[data-arrival-statement]')).toHaveCSS('opacity','1');
 await expect(page.locator('[data-arrival-layer="athlete"]')).toHaveCSS('opacity','0.8');
 expect(await page.locator('#arrival').evaluate(el=>el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
 expect(errors).toEqual([]);
});
