import { test, expect } from '@playwright/test';

test('arcade selection, start, Escape, and back restore focus', async ({ page }) => {
  await page.goto('/#offfield-personal');
  await page.getByRole('radio', { name: 'Gaming' }).focus();
  await page.keyboard.press('ArrowDown');
  const movies = page.getByRole('radio', { name: 'Movies' });
  await expect(movies).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(page.locator('#offfield-personal').getByRole('heading', { name: 'ZEPHYR KREYE', exact: true })).toBeVisible();
  await expect(page.getByText('Movies details are coming soon.')).toBeVisible();
  const back = page.getByRole('button', { name: 'BACK TO MENU' });
  await expect(back).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'PRESS START' })).toBeFocused();
  await expect(movies).toBeChecked();
  await page.keyboard.press('Space');
  await expect(page.getByText('Movies details are coming soon.')).toBeVisible();
});

test('each world opens its truthful empty state and returns to selection', async ({ page }) => {
  await page.goto('/#offfield-personal');
  for (const category of ['Movies', 'Music']) {
    await page.getByText(category, { exact: true }).click();
    await expect(page.getByRole('radio', { name: category })).toBeChecked();
    await page.getByRole('button', { name: 'PRESS START' }).click();
    await expect(page.getByText(`${category} details are coming soon.`)).toBeVisible();
    await page.getByRole('button', { name: 'BACK TO MENU' }).click();
    await expect(page.getByRole('button', { name: 'PRESS START' })).toBeFocused();
    await expect(page.getByRole('radio', { name: category })).toBeChecked();
  }
  await page.getByText('Gaming', { exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Gaming' })).toBeChecked();
  await page.getByRole('button', { name: 'PRESS START' }).click();
  await expect(page.getByRole('dialog', { name: 'POCKET PASS' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'PRESS START' })).toBeFocused();
});

test('320px arcade stays within the viewport with touch-sized controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/#offfield-personal');
  const geometry = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('#offfield-personal')!;
    const cabinet = root.querySelector<HTMLElement>('[class*="cabinet"]')!;
    const start = root.querySelector<HTMLButtonElement>('button')!;
    return {
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      cabinetRight: cabinet.getBoundingClientRect().right,
      startHeight: start.getBoundingClientRect().height,
      startWidth: start.getBoundingClientRect().width,
    };
  });
  expect(geometry.document).toBeLessThanOrEqual(geometry.viewport);
  expect(geometry.cabinetRight).toBeLessThanOrEqual(geometry.viewport);
  expect(geometry.startHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.startWidth).toBeGreaterThanOrEqual(44);
});

test('reduced-motion desktop arcade stacks its heading and cabinet', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-chromium') test.skip();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#offfield-personal');
  const positions = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('#offfield-personal')!;
    return {
      intro: root.querySelector<HTMLElement>('[class*="introPanel"]')!.getBoundingClientRect(),
      cabinet: root.querySelector<HTMLElement>('[class*="cabinetPanel"]')!.getBoundingClientRect(),
    };
  });
  expect(positions.cabinet.top).toBeGreaterThanOrEqual(positions.intro.bottom);
  await expect(page.locator('.offfield-rail .pin-spacer')).toHaveCount(0);
});

test('JavaScript-disabled desktop stacks title and CRT within the viewport', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop-chromium') test.skip();
  const browser = page.context().browser();
  if (!browser) throw new Error('Browser context is unavailable');
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const noJsPage = await context.newPage();
  try {
    await noJsPage.goto(new URL('/#offfield-personal', testInfo.project.use.baseURL as string).toString());
    const bounds = await noJsPage.evaluate(() => {
      const root = document.querySelector<HTMLElement>('#offfield-personal')!;
      const heading = root.querySelector<HTMLElement>('#arcade-heading')!;
      const range = document.createRange();
      range.selectNodeContents(heading);
      const textRects = [...range.getClientRects()];
      return {
        viewport: document.documentElement.clientWidth,
        titleLeft: Math.min(...textRects.map((rect) => rect.left)),
        titleRight: Math.max(...textRects.map((rect) => rect.right)),
        cabinet: root.querySelector<HTMLElement>('[class*="cabinetPanel"]')!.getBoundingClientRect().toJSON(),
      };
    });
    expect(bounds.titleLeft).toBeGreaterThanOrEqual(0);
    expect(bounds.titleRight).toBeLessThanOrEqual(bounds.viewport);
    expect(bounds.cabinet.left).toBeGreaterThanOrEqual(0);
    expect(bounds.cabinet.right).toBeLessThanOrEqual(bounds.viewport);
  } finally {
    await context.close();
  }
});
