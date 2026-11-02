import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('arrival resolves from athlete hero through portal to the film room', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#arrival')).toBeVisible();
  await expect(page.locator('#hero-title')).toHaveText(/ZEPHYR\s*KREYE/);
  await expect(page.locator('#film-room')).toContainText(/EVERY\s*SECOND\s*COUNTS/i);
  await expect(page.locator('#media')).toBeAttached();
  await revealFilmCopy(page);
  await expect(page.getByRole('button', { name: /WATCH WITH SOUND/i })).toBeVisible();
  await page.getByRole('button', { name: /WATCH WITH SOUND/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Film room' });
  await expect(dialog).toBeVisible();
  const video = dialog.locator('video');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video.locator('source')).toHaveAttribute('src', '/media/zephyr-cinematic.mp4');
  const bounds = await page.getByRole('button', { name: /WATCH WITH SOUND/i }).boundingBox();
  const viewport = page.viewportSize()!;
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('navigation remains usable while the arrival experience is scrolled', async ({ page }) => {
  await page.goto('/');
  await revealFilmCopy(page);
  if (page.viewportSize()!.width < 900) await page.getByRole('button', { name: 'Menu' }).click();
  await page.locator('#site-nav').getByRole('link', { name: 'Off Field', exact: true }).click();
  await expect(page).toHaveURL(/#off-field$/);
  await expect(page.locator('#site-nav')).not.toHaveClass(/nav-open/);
});

test('reduced motion removes pinning and keeps film unloaded', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'reduced-motion') test.skip();
  const mediaRequests: string[] = [];
  page.on('request', request => { if (/\.mp4(?:$|\?)/i.test(request.url())) mediaRequests.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.locator('#film-room').scrollIntoViewIfNeeded();
  expect(mediaRequests).toEqual([]);
});

test('switching to reduced motion removes an active desktop pin', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-chromium') test.skip();
  await page.goto('/');
  await page.locator('#film-room').scrollIntoViewIfNeeded();
  await expect(page.locator('.pin-spacer').first()).toBeAttached();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
});

test('normal-motion iPhone does not request film before the cinema is near', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'iphone-webkit') test.skip();
  const mediaRequests: string[] = [];
  page.on('request', request => { if (/\.mp4(?:$|\?)/i.test(request.url())) mediaRequests.push(request.url()); });
  await page.goto('/');
  expect(mediaRequests).toEqual([]);
  await expect(page.locator('#film-room')).toBeAttached();
});

test('current navigation keeps the media gallery and story destinations reachable', async ({ page }) => {
  await page.goto('/');
  if (page.viewportSize()!.width < 900) await page.getByRole('button', { name: 'Menu' }).click();
  for (const label of ['Home', 'On Field', 'Off Field', 'The Journey', 'Numbers', 'Film Room', 'Media']) {
    await expect(page.locator('#site-nav').getByRole('link', { name: label, exact: true })).toHaveCount(1);
  }
  if (page.viewportSize()!.width < 900) await page.keyboard.press('Escape');
  await expect(page.locator('#media')).toContainText('THE STORY, IN FRAMES.');
  await expect(page.locator('main')).toHaveAttribute('data-preview-media', 'enabled');
  await expect(page.locator('#media .responsive-photo').first()).toContainText('PREVIEW CROP · ORIGINAL PENDING');
  await expect(page.locator('.two-worlds .world-card-on img')).toHaveAttribute('alt', /Zephyr Kreye/);
  await expect(page.locator('.two-worlds .world-card-off img')).toHaveAttribute('alt', /sideline/i);
  const structuredData = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(structuredData.name).toBe('Zephyr Kreye');
  expect(JSON.stringify(structuredData)).not.toContain('UNCOMMITTED');
});

test('direct film, journey, and off-field anchors resolve to visible viewport bounds', async ({ page }) => {
  for (const id of ['film-room', 'journey', 'off-field']) {
    await page.goto(`/#${id}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await page.waitForTimeout(250);
    const bounds = await page.locator(`#${id}`).evaluate(element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, viewportWidth: innerWidth, viewportHeight: innerHeight };
    });
    for (const value of Object.values(bounds)) expect(Number.isFinite(value)).toBe(true);
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(bounds.viewportWidth);
    expect(bounds.y).toBeLessThan(bounds.viewportHeight);
    expect(bounds.y + bounds.height).toBeGreaterThan(0);
  }
});

test('two-worlds links still reach field and personal content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.two-worlds')).toBeVisible();
  await page.getByRole('link', { name: 'SEE HIM ON FIELD' }).click();
  await expect(page).toHaveURL(/#on-field$/);
  await page.getByRole('link', { name: 'EXPLORE PERSONAL' }).click();
  await expect(page).toHaveURL(/#offfield-personal$/);
});

test('NIL inquiry anchor remains reachable and contains no invented contact links', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'NIL & BUSINESS INQUIRIES' }).click();
  await expect(page).toHaveURL(/#nil-inquiries$/);
  await expect(page.locator('#nil-inquiries')).toContainText('Representative contact details coming soon.');
  await expect(page.locator('#nil-inquiries')).toContainText('Social profiles will appear here when links are ready');
  await expect(page.locator('#nil-inquiries a[href^="mailto:"], #nil-inquiries a[href^="https:"]')).toHaveCount(0);
});

test('layout has no horizontal overflow and the arrival page passes axe', async ({ page }) => {
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('recruiting and playoffs remain directly navigable', async ({ page }) => {
  await page.goto('/recruiting/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Zephyr Kreye');
  await page.goto('/playoffs/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ROAD TO STATE.');
});

test('mobile navigation opens accessibly, traps focus, and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Menu' });
  await trigger.click();
  await expect(page.locator('#site-nav button.nav-close')).toBeVisible();
  await expect(page.locator('#site-nav button.nav-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-nav')).not.toHaveClass(/nav-open/);
  await expect(trigger).toBeFocused();
});

async function revealFilmCopy(page: import('@playwright/test').Page) {
  await page.locator('#film-room').evaluate(element => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    const progress = window.innerWidth >= 900 ? window.innerHeight * 0.85 : window.innerHeight * 0.1;
    window.scrollTo({ top: top + progress, behavior: 'instant' });
  });
  await page.waitForTimeout(500);
}
