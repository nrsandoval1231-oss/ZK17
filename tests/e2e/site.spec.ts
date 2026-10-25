import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('renders eight scenes, preview labels, and no unverified performance content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#arrival, #on-field, #film-room, #off-field, #journey, #numbers, #next-chapter, #closing')).toHaveCount(8);
  await expect(page.getByRole('heading', { name: /the story is still being written/i })).toBeVisible();
  await expect(page.getByText('NO VERIFIED SEASON DATA YET')).toBeVisible();
  await expect(page.locator('.responsive-photo').first()).toContainText('PREVIEW CROP · ORIGINAL PENDING');
  await expect(page.locator('main')).toHaveAttribute('data-preview-media', 'enabled');
  const structuredData = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(structuredData.name).toBe('Zephyr Kreye');
  expect(JSON.stringify(structuredData)).not.toContain('UNCOMMITTED');
});

test('main navigation names the six requested destinations', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('#site-nav a');
  for (const [index, label] of ['Home', 'On Field', 'Off Field', 'The Journey', 'Film Room', 'Media'].entries()) await expect(links.nth(index)).toHaveAttribute('aria-label', label);
  if (page.viewportSize()!.width >= 900) await expect(links.first()).toBeVisible();
});

test('mobile navigation opens accessibly, traps focus, and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Menu' });
  for (const width of [320, 390, 412, 768, 899]) {
    await page.setViewportSize({ width, height: 844 });
    const bounds = await trigger.boundingBox();
    const label = await trigger.locator('span').boundingBox();
    const icon = await trigger.locator('svg').boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(label && icon && label.x + label.width).toBeLessThanOrEqual(icon?.x ?? 0);
    expect(label && icon && icon.x + icon.width).toBeLessThanOrEqual((bounds?.x ?? 0) + (bounds?.width ?? 0));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await trigger.click();
  await expect(page.locator('#site-nav button.nav-close')).toBeVisible();
  await expect(page.locator('#site-nav button.nav-close')).toBeFocused();
  const navBounds = await page.locator('#site-nav').boundingBox();
  expect(navBounds?.height).toBeGreaterThan(800);
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#site-nav a').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#site-nav button.nav-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-nav')).not.toHaveClass(/nav-open/);
  await expect(trigger).toBeFocused();
});

test('film dialog explains the empty state and closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ENTER FILM ROOM' }).click();
  await expect(page.getByRole('dialog', { name: 'Film room' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /film arrives when it’s ready/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('reduced motion leaves content visible and removes pinned scenes', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'reduced-motion') test.skip();
  await page.goto('/');
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.hero-title')).toHaveCSS('opacity', '1');
});

test('changing to reduced motion removes desktop pin spacers immediately', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-chromium') test.skip();
  await page.goto('/');
  await expect(page.locator('.pin-spacer').first()).toBeAttached();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.field-lockup')).toBeVisible();
});

test('layout has no horizontal overflow and passes automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('two-world diptych routes to the existing field and personal content without adding a scene', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#arrival, #on-field, #film-room, #off-field, #journey, #numbers, #next-chapter, #closing')).toHaveCount(8);
  await expect(page.locator('.two-worlds')).toBeVisible();
  await expect(page.locator('.world-card-on .world-photo img')).toHaveAttribute('alt', /Zephyr Kreye/);
  await expect(page.locator('.world-card-off .world-photo img')).toHaveAttribute('alt', /sideline/);
  await expect(page.locator('.two-worlds')).toContainText('PREVIEW CROP · ORIGINAL PENDING');
  await page.getByRole('link', { name: 'SEE HIM ON FIELD' }).click();
  await expect(page).toHaveURL(/#on-field$/);
  await page.getByRole('link', { name: 'EXPLORE PERSONAL' }).click();
  await expect(page).toHaveURL(/#offfield-personal$/);
});

test('NIL inquiry anchor always works and empty social/contact states contain no outbound links', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'NIL & BUSINESS INQUIRIES' }).click();
  await expect(page).toHaveURL(/#nil-inquiries$/);
  await expect(page.locator('#nil-inquiries')).toContainText('Representative contact details coming soon.');
  await expect(page.locator('#nil-inquiries')).toContainText('Social profiles will appear here when links are ready');
  await expect(page.locator('#nil-inquiries a[href^="mailto:"], #nil-inquiries a[href^="https:"]')).toHaveCount(0);
});
