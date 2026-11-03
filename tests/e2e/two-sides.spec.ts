import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('discovery links to two dedicated worlds and keeps the cinematic opening', async ({ page }) => {
 await page.goto('/');
 await expect(page.locator('#arrival')).toBeAttached();
 await expect(page.locator('#film-room video')).toHaveAttribute('src', '/media/zephyr-monochrome-full.mp4');
 const discovery = page.getByRole('region', { name: 'Two sides. One Zephyr.' });
 await expect(discovery.getByRole('link', { name: /ON THE FIELD/ })).toHaveAttribute('href', '/on-the-field/');
 await expect(discovery.getByRole('link', { name: /BEYOND 17/ })).toHaveAttribute('href', '/beyond-17/');
 await expect(page.locator('#offfield-personal, #journey, #media, #numbers')).toHaveCount(0);
});

test('dedicated worlds load with source references, eight interests and no duplicate highlights', async ({ page }) => {
 const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
 expect((await page.goto('/on-the-field/'))?.status()).toBe(200);
 await expect(page.getByRole('heading', { name: /ON THE\s*FIELD/ })).toBeVisible();
 await expect(page.locator('[data-season-metric]')).toHaveCount(6);
 await expect(page.locator('table tbody tr')).toHaveCount(9);
 await expect(page.locator('video, iframe')).toHaveCount(0);
 await page.getByText('ABOUT THE RECORD & SOURCES').click();
 await expect(page.getByText(/Dallas News reports different/)).toBeVisible();
 expect((await page.goto('/beyond-17/'))?.status()).toBe(200);
 await expect(page.getByRole('tab')).toHaveCount(8);
 await page.getByRole('tab', { name: 'Movies', exact: true }).click();
 await expect(page.getByRole('tabpanel')).toContainText('Interstellar');
 await page.getByRole('tab', { name: 'Family & Friends', exact: true }).click();
 await expect(page.getByRole('tabpanel')).toContainText('Awaiting Zephyr');
 await page.getByRole('tab', { name: 'Games', exact: true }).focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab', { name: 'Movies', exact: true })).toBeFocused();
 expect(errors).toEqual([]);
});

test('worlds respect reduced motion, load images, and fit the viewport', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 for (const route of ['/on-the-field/', '/beyond-17/']) {
  await page.goto(route);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const images = page.locator('main img');
  for (const image of await images.all()) {
   await image.scrollIntoViewIfNeeded();
   await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
 }
});

test('all seven navigation destinations resolve to actual pages', async ({ page }) => {
 for (const route of ['/', '/on-the-field/', '/beyond-17/', '/highlights/', '/recruiting/', '/nil-recruiting/', '/playoffs/']) {
  expect((await page.goto(route))?.status()).toBe(200);
  await expect(page.locator('main')).toBeVisible();
 }
});

test('photo carousel supports keyboard, horizontal wheel gestures and native vertical scrolling', async ({ page, browserName, isMobile }) => {
 const { build } = await import('esbuild');
 const bundle = await build({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import LifeGallery from './components/life-gallery';import{previewPhotos}from'./content/site';const photos=previewPhotos.slice(0,3).map((photo,index)=>({id:String(index),photo,caption:'Test frame '+(index+1),source:'Test-only supplied photo fixture',verifiedAt:'2026-11-03',approved:false}));createRoot(document.getElementById('root')).render(<LifeGallery photos={photos}/>);`, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, outfile: 'gallery-fixture.js', jsx: 'automatic', loader: { '.css': 'local-css' }, define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' } });
 const js = bundle.outputFiles!.find(file => file.path.endsWith('.js'))!.text;
 const css = bundle.outputFiles!.find(file => file.path.endsWith('.css'))!.text;
 await page.route('**/gallery-fixture', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="en"><title>Gallery fixture</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#eee}*{box-sizing:border-box}:root{--display:Arial;--body:Arial}.spacer{height:300px}${css}</style><div class="spacer"></div><main id="root"></main><div class="spacer"></div><script>${js}</script></html>` }));
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/gallery-fixture');
 const rail = page.getByRole('region', { name: 'Life outside the lines photographs' });
 await rail.scrollIntoViewIfNeeded();
 await page.getByRole('button', { name: 'Next photograph' }).click();
 await expect(page.locator('[aria-live="polite"]')).toHaveText('2 / 3');
 await rail.focus(); await page.keyboard.press('ArrowRight');
 await expect(page.locator('[aria-live="polite"]')).toHaveText('3 / 3');
 await expect(page.getByRole('button', { name: 'Next photograph' })).toBeDisabled();
 if (browserName === 'webkit' && isMobile) {
  test.info().annotations.push({ type: 'limitation', description: 'Mobile WebKit has no mouse.wheel support. Keyboard and controls verified; physical swipe pending.' });
  return;
 }
 const before = await page.evaluate(() => scrollY);
 await rail.hover(); await page.mouse.wheel(0, 250);
 await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
 await rail.scrollIntoViewIfNeeded(); await rail.hover();
 await page.mouse.wheel(-900, 0);
 await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeLessThan(100);
});
