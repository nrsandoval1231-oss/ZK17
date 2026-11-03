import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

async function progress(page: Page, fraction: number) {
  const hero = page.locator('#arrival');
  const distance = await hero.evaluate(el => parseFloat(el.parentElement!.style.paddingBottom));
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), distance * fraction);
}
async function opacity(page: Page, layer: string) {
  return Number(await page.locator(`#arrival [data-arrival-layer="${layer}"]`).evaluate(el => getComputedStyle(el).opacity));
}

test('opening beats resolve in sequence, images decode, and reverse scroll restores earlier beats', async ({ page }) => {
  test.setTimeout(60_000);
  const loaded: string[] = [];
  page.on('response', response => { if (/\/media\/anna-stadium-(mono|color)-(768|1500)\.webp/.test(response.url())) loaded.push(response.url()); });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const hero = page.locator('#arrival');
  await expect(hero).toHaveAttribute('data-arrival-motion', 'ready');
  expect(await opacity(page, 'cold-logo')).toBeCloseTo(.9, 1);
  expect(await opacity(page, 'smoke-back')).toBeCloseTo(.25, 1);
  const beams = hero.locator('[data-arrival-beam]');
  await expect(beams).toHaveCount(4);
  expect(await beams.evaluateAll(nodes => nodes.map(node => Number(getComputedStyle(node).opacity)))).toEqual([0, 0, 0, 0]);
  await progress(page, .09);
  await expect.poll(() => beams.nth(0).evaluate(node => Number(getComputedStyle(node).opacity))).toBeGreaterThan(0);
  await expect.poll(() => beams.nth(3).evaluate(node => Number(getComputedStyle(node).opacity))).toBe(0);
  await progress(page, .12);
  await expect.poll(() => opacity(page, 'cold-logo')).toBeLessThan(.5);
  await progress(page, .37);
  await expect.poll(() => opacity(page, 'stadium-color')).toBeGreaterThan(.1);
  await expect.poll(() => opacity(page, 'stadium')).toBeGreaterThan(.1);
  await progress(page, .39);
  await expect.poll(() => opacity(page, 'athlete')).toBe(0);
  await progress(page, .59);
  await expect.poll(() => opacity(page, 'athlete')).toBeGreaterThan(.9);
  await progress(page, .67);
  await expect.poll(() => opacity(page, 'closeup')).toBeGreaterThan(.6);
  await progress(page, .74);
  await expect.poll(() => opacity(page, 'rear')).toBeGreaterThan(.4);
  await progress(page, .80);
  await expect.poll(() => opacity(page, 'white')).toBeGreaterThan(.6);
  await progress(page, .86);
  await expect.poll(() => opacity(page, 'running')).toBeGreaterThan(.4);
  await progress(page, .96);
  await expect.poll(() => hero.locator('[data-arrival-statement]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await progress(page, .59);
  await expect.poll(() => opacity(page, 'athlete')).toBeGreaterThan(.98);
  await expect(page.locator('.site-header')).toBeHidden();
  const pinCount = await page.locator('.pin-spacer').count();
  const distance = await hero.evaluate(el => parseFloat(el.parentElement!.style.paddingBottom));
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), distance + 2);
  await expect(page.locator('.site-header')).toBeVisible();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.site-header')).toBeHidden();
  await expect.poll(() => page.locator('.pin-spacer').count()).toBe(pinCount);
  const decoded = await hero.locator('[data-arrival-layer="stadium"] img').evaluateAll(async images => {
    return Promise.all(images.map(async image => {
      const img = image as HTMLImageElement;
      await img.decode();
      return { complete: img.complete, width: img.naturalWidth, height: img.naturalHeight };
    }));
  });
  expect(decoded.length).toBeGreaterThanOrEqual(2);
  expect(decoded.every(item => item.complete && item.width > 0 && item.height > 0)).toBe(true);
  const requested = new Set(loaded.map(url => new URL(url).pathname));
  const suffix = (page.viewportSize()?.width ?? 1440) < 900 ? '768' : '1500';
  expect(requested).toEqual(new Set([`/media/anna-stadium-mono-${suffix}.webp`, `/media/anna-stadium-color-${suffix}.webp`]));
  const evidenceDir = process.env.OPENING_EVIDENCE_DIR;
  if (evidenceDir) {
    await mkdir(evidenceDir, { recursive: true });
    for (const [name, fraction] of [['cold-logo', .02], ['stadium-color', .32], ['athlete', .59], ['closeup', .67], ['rear-white-running', .82], ['statement', .96]] as const) {
      await progress(page, fraction);
      await page.screenshot({ path: path.join(evidenceDir, `${name}.png`), fullPage: false });
    }
  }
});
