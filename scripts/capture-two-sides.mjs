import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const baseURL = process.env.TWO_SIDES_CAPTURE_URL ?? 'http://127.0.0.1:3100';
const directory = 'artifacts/two-sides';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {});
try {
 for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, isMobile: viewport.name === 'mobile', hasTouch: viewport.name === 'mobile', reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const [name, path] of [['discovery', '/#two-sides'], ['field', '/on-the-field/'], ['beyond', '/beyond-17/']]) {
   const response = await page.goto(new URL(path, baseURL).href);
   if (response?.status() !== 200) throw new Error(`Cannot capture ${path}: HTTP ${response?.status()}`);
   await page.evaluate(() => document.fonts.ready);
   const target = name === 'discovery' ? page.locator('#two-sides') : page;
   const images = name === 'discovery' ? target.locator('img') : page.locator('main img');
   for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async (element) => { await element.decode(); });
   }
   await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
   if (name === 'discovery') await target.scrollIntoViewIfNeeded();
   await target.screenshot({ path: `${directory}/${name}-${viewport.name}.png`, ...(name === 'discovery' ? { style: '.site-header{visibility:hidden!important}' } : { fullPage: true }) });
  }
  await context.close();
 }
} finally { await browser.close(); }
