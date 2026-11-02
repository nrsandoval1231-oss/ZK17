import { test, expect } from '@playwright/test';

test('film resolves to an uncropped native player in the second story scene', async ({ page }) => {
  await page.goto('/#film-room');
  await page.evaluate(() => document.fonts.ready);
  const video = page.locator('#film-room video');
  await expect(video).toHaveCSS('object-fit', 'contain');
  await expect(video).toHaveJSProperty('controls', true);
  await expect(page.locator('#film-room [data-zk-aperture]')).toHaveAttribute('href', '/brand/zk17-monogram-512-v2.png');
  await expect(page.locator('#film-room svg text')).toHaveCount(0);
  await expect.poll(() => video.evaluate(el => getComputedStyle(el).transform)).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  const box = await video.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThan(0);
  expect(box!.x + box!.width).toBeLessThan(viewport.width);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  expect(await page.locator('#arrival').evaluate(el => el.parentElement?.querySelectorAll('section')[1]?.id)).toBe('film-room');
});

test('Playoffs desktop places official Anna mark left of copy', async ({ page }) => {
  test.skip(page.viewportSize()!.width <= 700);
  await page.goto('/playoffs/');
  const logo = page.locator('[data-playoff-hero] img[alt="Anna Coyotes logo"]');
  const heading = page.locator('#playoffs-title');
  await expect(logo).toBeVisible();
  const mark = await logo.boundingBox();
  const title = await heading.boundingBox();
  expect(mark!.x + mark!.width).toBeLessThan(title!.x);
});
