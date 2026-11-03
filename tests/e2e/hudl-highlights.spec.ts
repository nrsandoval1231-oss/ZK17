import { test, expect } from '@playwright/test';

const hudlUrl = 'https://www.hudl.com/embed/video/3/20145851/6ad4044a1c035448d31fa50d';
const frameSelector = '[data-hudl-player]';

test('dedicated Highlights page embeds official Hudl without autoplay and keeps true 16:9 geometry', async ({ page }) => {
  await page.route('https://www.hudl.com/**', route => route.fulfill({
    status: 200, contentType: 'text/html',
    body: '<!doctype html><html><body style="margin:0;background:#111"><div style="width:100%;height:100%;background:#111"></div></body></html>',
  }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/highlights/');
  const frame = page.locator(frameSelector);
  await expect(frame).toHaveAttribute('src', hudlUrl);
  await expect(frame).toHaveAttribute('title', 'Zephyr Kreye — Official Hudl Highlights');
  await expect(frame).toHaveAttribute('loading', 'lazy');
  await expect(frame).toHaveAttribute('allowfullscreen', '');
  await expect(frame).toHaveAttribute('allow', /picture-in-picture/);
  await expect(frame).not.toHaveAttribute('allow', /autoplay/);
  await expect(page.locator('main')).toBeVisible();

  for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.evaluate(async () => {
      const iframe = document.querySelector<HTMLIFrameElement>('[data-hudl-player]')!;
      const visibleHeaderBottom = () => {
        const header = document.querySelector<HTMLElement>('.site-header');
        if (!header) return 0;
        const rect = header.getBoundingClientRect(), style = getComputedStyle(header);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.bottom > 0 && rect.top < innerHeight ? rect.bottom : 0;
      };
      const before = iframe.getBoundingClientRect();
      const targetTop = visibleHeaderBottom() + 8;
      if (before.top < targetTop || before.bottom > innerHeight) scrollBy({ top: before.top - targetTop, behavior: 'instant' });
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const box = iframe.getBoundingClientRect();
      const insetX = Math.min(4, box.width * .01), insetY = Math.min(4, box.height * .01);
      const points = [[box.left+insetX,box.top+insetY],[box.right-insetX,box.top+insetY],[box.left+insetX,box.bottom-insetY],[box.right-insetX,box.bottom-insetY]];
      return {
        withinViewport: box.top >= Math.max(7, visibleHeaderBottom()) && box.bottom <= innerHeight + 1,
        ratioCorrect: Math.abs(box.width / box.height - 16 / 9) < .02,
        noOverflow: document.documentElement.scrollWidth <= innerWidth,
        corners: points.map(([x,y]) => document.elementFromPoint(x,y) === iframe),
      };
    })).toEqual({ withinViewport: true, ratioCorrect: true, noOverflow: true, corners: [true,true,true,true] });
  }
});

test('static Highlights iframe survives viewport changes without reloading', async ({ page }) => {
  const token = `hudl-fixture-${crypto.randomUUID()}`;
  let hudlNavigations = 0;
  page.on('framenavigated', frame => { if (frame.url().startsWith('https://www.hudl.com/')) hudlNavigations++; });
  await page.route('https://www.hudl.com/**', route => route.fulfill({
    status: 200, contentType: 'text/html', body: `<!doctype html><html><body data-fixture-token="${token}">Fixture</body></html>`,
  }));
  await page.goto('/highlights/');
  const frame = page.locator(frameSelector);
  const fixtureBody = page.frameLocator(frameSelector).locator('body');
  await frame.scrollIntoViewIfNeeded();
  await expect(fixtureBody).toHaveAttribute('data-fixture-token', token);
  await expect.poll(() => hudlNavigations).toBe(1);
  for (const viewport of [{width:1280,height:800},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]) {
    await page.setViewportSize(viewport);
    await expect(fixtureBody).toHaveAttribute('data-fixture-token', token);
    await expect(frame).toHaveCount(1);
    expect(hudlNavigations).toBe(1);
  }
});

test('Highlights is active on direct load and reachable from desktop and mobile navigation', async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#film-room').scrollIntoViewIfNeeded();
    const nav = page.locator('#site-nav');
    if (width < 900) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(nav.locator('a')).toHaveCount(6);
    await nav.getByRole('link', { name: /HIGHLIGHTS/ }).click();
    await expect(page).toHaveURL(/\/highlights\/$/);
    await expect(page.locator('#route-nav [aria-current="page"]')).toHaveAttribute('href', '/highlights/');
  }
});
