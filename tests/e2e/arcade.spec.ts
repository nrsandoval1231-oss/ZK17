import { test, expect } from '@playwright/test';

test('category buttons and Press Start open picks and restore keyboard focus', async ({ page }) => {
  await page.goto('/#offfield-personal');
  const root = page.locator('#offfield-personal');
  await root.getByRole('button', { name: 'Games', exact: true }).focus();
  await page.keyboard.press('Tab');
  const movies = root.getByRole('button', { name: 'Movies', exact: true });
  await expect(movies).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(root.getByText('Interstellar', { exact: true })).toBeVisible();
  const back = root.getByRole('button', { name: 'BACK TO MENU' });
  await expect(back).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(movies).toBeFocused();
  await root.getByRole('button', { name: 'PRESS START' }).focus();
  await page.keyboard.press('Space');
  await expect(root.getByText('Interstellar', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(root.getByRole('button', { name: 'PRESS START' })).toBeFocused();
});

test('each category opens its owner-supplied top three directly', async ({ page }) => {
  await page.goto('/#offfield-personal');
  const root = page.locator('#offfield-personal');
  const picks = [
    { category: 'Games', titles: ['Madden', 'GTA 6', 'The Last of Us'] },
    { category: 'Movies', titles: ['A Bronx Tale', 'Interstellar', 'Step Brothers'] },
    { category: 'TV Shows', titles: ['Berserk', 'Attack on Titan', 'Demon Slayer'] },
  ];
  await expect(root.getByRole('button', { name: 'Music', exact: true })).toHaveCount(0);
  for (const { category, titles } of picks) {
    await root.getByRole('button', { name: category, exact: true }).click();
    const items = root.getByRole('listitem');
    await expect(items).toHaveCount(3);
    for (const [index, title] of titles.entries()) await expect(items.nth(index).getByText(title, { exact: true })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await root.getByRole('button', { name: 'BACK TO MENU' }).click();
    await expect(root.getByRole('button', { name: category, exact: true })).toBeFocused();
  }
});

test('320px arcade stays within the viewport with touch-sized controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/#offfield-personal');
  const geometry = await page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('#offfield-personal')!;
    const cabinet = root.querySelector<HTMLElement>('[class*="cabinet"]')!;
    const start = root.querySelector<HTMLButtonElement>('button[class*="start"]')!;
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
