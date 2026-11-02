import { expect, test, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

async function openHero(page: Page) {
  const bundle = await build({ stdin: { contents: `import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

for (const touch of [false, true]) {
  test(`seven scroll beats progress and reverse on ${touch ? 'touch' : 'desktop'}`, async ({ browser }) => {
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
    const scrollBeat = (fraction: number) => page.evaluate(value => { const trigger = (window as unknown as { fixtureScrollTrigger: { getById: (id: string) => { start: number; end: number } } }).fixtureScrollTrigger.getById('arrival-hero'); scrollTo(0, trigger.start + (trigger.end - trigger.start) * value); }, fraction);
    await scrollBeat(.22);
    await expect.poll(() => opacity('lights')).toBeGreaterThan(.2);
    await scrollBeat(.55);
    await expect.poll(() => opacity('athlete')).toBeGreaterThan(.3);
    const photoHeight = (await hero.locator('[data-arrival-layer="athlete"] img').boundingBox())!.height;
    expect(photoHeight).toBeLessThan(heroHeight * 1.1);
    await scrollBeat(.70);
    await expect.poll(() => opacity('running')).toBeGreaterThan(.35);
    await scrollBeat(.79);
    await expect.poll(() => opacity('rear')).toBeGreaterThan(.35);
    await scrollBeat(.86);
    await expect.poll(() => opacity('white')).toBeGreaterThan(.35);
    await scrollBeat(.97);
    await expect.poll(() => hero.locator('[data-arrival-statement]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
    await page.evaluate(() => scrollTo(0, 0));
    await expect.poll(() => opacity('lights')).toBeLessThan(.01);
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
  await expect.poll(() => hero.evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const spacer = (await hero.locator('..').boundingBox())!;
  const height = (await hero.boundingBox())!.height;
  expect(spacer.height - height).toBeGreaterThan(14 * 390);
  await page.evaluate(y => scrollTo(0, y), (spacer.height - height) * .97);
  await expect.poll(() => hero.locator('[data-arrival-statement]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await context.close();
});
