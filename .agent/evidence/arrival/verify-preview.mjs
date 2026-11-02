import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium, webkit } from '@playwright/test';
const base = 'https://91c43688.zk17-review.pages.dev';
const receipt = { base, sourceCommit: '62d77511bde03fae91576bd6c2ceb09b610cc415', verifiedUtc: new Date().toISOString(), pages: [], assets: [], browsers: [] };
for (const path of ['/', '/playoffs/', '/recruiting/']) {
  const response = await fetch(base + path);
  const html = await response.text();
  const noindex = /noindex/.test(response.headers.get('x-robots-tag') ?? '');
  if (!response.ok || !noindex) throw new Error(`Preview page/header failed: ${path}`);
  receipt.pages.push({ path, status: response.status, noindex, arrival: path === '/' ? html.includes('EVERY') && html.includes('hero-title') : undefined });
}
for (const path of ['/media/zephyr-cinematic.mp4', '/media/arrival-706.webp', '/brand/zk17-monogram-512-v2.png']) {
  const response = await fetch(base + path);
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = data => createHash('sha256').update(data).digest('hex');
  const remoteHash = hash(bytes);
  const localHash = hash(await readFile(`public${path}`));
  if (!response.ok || remoteHash !== localHash) throw new Error(`Asset parity failed: ${path}`);
  receipt.assets.push({ path, status: response.status, bytes: bytes.length, sha256: remoteHash, matchesLocal: true });
}
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/#film-room`);
  const watch = page.getByRole('button', { name: /WATCH WITH SOUND/ });
  await watch.click();
  const dialog = page.getByRole('dialog');
  if (!await dialog.isVisible() || !await dialog.locator('video').getAttribute('controls').then(value => value !== null)) throw new Error('Native film dialog failed');
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.activeElement?.textContent?.includes('WATCH WITH SOUND'));
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('#site-nav').getByRole('link', { name: 'Playoffs', exact: true }).click();
  await page.waitForURL('**/playoffs/');
  if (!await page.getByRole('heading', { level: 1 }).isVisible() || errors.length) throw new Error('Preview navigation failed');
  receipt.browsers.push({ engine: name, touchMobile: true, nativeDialog: true, openerFocus: true, playoffsNavigation: true, errors });
  await browser.close();
}
await writeFile('.agent/evidence/arrival/PREVIEW_RECEIPT.json', JSON.stringify(receipt, null, 2));
console.log('Immutable preview headers, route smoke, media hash parity and touch-mobile journeys passed.');
