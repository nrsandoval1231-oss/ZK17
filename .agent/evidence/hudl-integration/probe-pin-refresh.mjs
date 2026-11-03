import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const origin = process.env.PROBE_ORIGIN || 'http://127.0.0.1:3100';
const browser = await chromium.launch();
const results = [];
for (let run = 0; run < 8; run++) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.stack));
  await page.addInitScript(() => {
    window.__pinProbe = { moves: 0, failed: [], loads: 0 };
    const original = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (node, before) {
      if (node.id === 'on-field') window.__pinProbe.moves++;
      try { return original.call(this, node, before); }
      catch (error) {
        window.__pinProbe.failed.push({ parent: this.nodeName + '.' + this.className, node: node.id, before: before?.className, stack: error.stack });
        throw error;
      }
    };
    document.addEventListener('load', event => {
      if (event.target instanceof HTMLIFrameElement && event.target.closest('#on-field')) window.__pinProbe.loads++;
    }, true);
  });
  await page.route('https://www.hudl.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Deterministic iframe lifecycle fixture</title><p>Lifecycle fixture, not Hudl playback</p>' }));
  let actionError = null;
  try {
    await page.goto(origin);
    await page.locator('#arrival[data-arrival-motion="ready"]').waitFor({ timeout: 10000 });
    await page.getByRole('link', { name: 'Skip intro' }).click({ timeout: 3500 });
    await page.locator('#on-field iframe').scrollIntoViewIfNeeded({ timeout: 3500 });
    await page.waitForTimeout(500);
    for (const width of [1200, 1280, 1000]) {
      await page.setViewportSize({ width, height: 720 });
      await page.waitForTimeout(250);
    }
  } catch (error) { actionError = error.message; }
  results.push({ run, errors, actionError, ...await page.evaluate(() => window.__pinProbe) });
  await page.close();
}
await browser.close();
const output = JSON.stringify({ origin, results }, null, 2);
console.log(output);
if (process.env.PROBE_OUTPUT) await writeFile(process.env.PROBE_OUTPUT, output);
process.exitCode = results.some(result => result.errors.length || result.actionError) ? 1 : 0;
