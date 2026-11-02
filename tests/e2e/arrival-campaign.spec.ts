import { expect, test } from '@playwright/test';

test('campaign hero presents its statement, identity and watch action', async ({ page }) => {
  await page.goto('/#arrival');
  const hero = page.locator('#arrival');
  await expect(hero.locator('#hero-title')).toHaveText(/MAKE THEM\s*REMEMBER\./);
  await expect(hero).toContainText('ZEPHYR KREYE');
  await expect(hero).toContainText('ANNA COYOTES');
  await expect(hero).toContainText('PREPARATION');
  await expect(hero.locator('[data-arrival-layer="mark"]')).toBeVisible();
  if (await page.locator('main').getAttribute('data-preview-media') === 'enabled') {
    await expect(hero.locator('[data-arrival-layer="athlete"] img')).toHaveAttribute('src', /arrival-706/);
  }
  await hero.getByRole('button', { name: /watch.*film/i }).click();
  await expect(page.getByRole('dialog', { name: 'Film room' })).toBeVisible();
  await page.getByRole('button', { name: 'Close film room' }).click();
  await expect(hero.getByRole('button', { name: /watch.*film/i })).toBeFocused();
});

test('hero stays within the viewport and responds to motion preference changes', async ({ page }) => {
  await page.goto('/#arrival');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect.poll(() => page.locator('#arrival').evaluate(el => el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
});
