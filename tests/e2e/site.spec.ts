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
  await trigger.click();
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
  await expect(page.getByRole('heading', { name: /Zephyr Kreye/i })).toBeVisible();
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
