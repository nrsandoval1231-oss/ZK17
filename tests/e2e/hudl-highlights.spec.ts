import { test, expect } from '@playwright/test';

const hudlUrl = 'https://www.hudl.com/embed/video/3/20145851/6ad4044a1c035448d31fa50d';

test('Hudl highlights embed stays responsive, unobstructed, and separate from navigation', async ({ page }) => {
  // Layout coverage uses a deterministic iframe document. This does not test Hudl playback.
  await page.route('https://www.hudl.com/**', route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><html><body style="margin:0;background:#111"><div style="width:100%;height:100%;background:#111"></div></body></html>',
  }));
  await page.goto('/');

  const frame = page.locator('#on-field iframe');
  await expect(frame).toHaveAttribute('src', hudlUrl);
  await expect(frame).toHaveAttribute('title', 'Zephyr Kreye — Official Hudl Highlights');
  await expect(frame).toHaveAttribute('loading', 'lazy');
  await expect(frame).toHaveAttribute('allowfullscreen', '');
  await expect(frame).toHaveAttribute('allow', /picture-in-picture/);
  await expect(frame).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  await expect(frame).not.toHaveAttribute('allow', /autoplay/);
  await expect(page.locator('.site-header').getByRole('button', { name: 'WATCH FILM', exact: true })).toHaveCount(0);

  for (const [label, href] of [['HOME', '/'], ['FILM', '/film/'], ['PLAYOFFS', '/playoffs/'], ['ABOUT', '/about/'], ['NIL / RECRUITING', '/nil-recruiting/']] as const) {
    await expect(page.locator(`#site-nav a[href="${href}"]`)).toHaveCount(1);
    await expect(page.locator(`#site-nav a[href="${href}"]`)).toContainText(label);
  }

  const checkRatio = async () => {
    await expect.poll(async () => {
      const box = await frame.boundingBox();
      return box ? Math.abs(box.width / box.height - 16 / 9) : Infinity;
    }).toBeLessThan(0.02);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  };
  const checkUnobstructed = async () => {
    await frame.scrollIntoViewIfNeeded();
    // Rotation and pin refresh can restore scroll after the viewport changes.
    // Correct placement against the currently visible header, then sample all
    // geometry and hit targets together so no coordinates survive another frame.
    await expect.poll(() => page.evaluate(async () => {
      const iframe = document.querySelector<HTMLIFrameElement>('#on-field iframe')!;
      const visibleHeaderBottom = () => {
        const header = document.querySelector<HTMLElement>('.site-header');
        if (!header) return 0;
        const rect = header.getBoundingClientRect();
        const style = getComputedStyle(header);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.bottom > 0 && rect.top < innerHeight ? rect.bottom : 0;
      };
      const before = iframe.getBoundingClientRect();
      const targetTop = visibleHeaderBottom() + 8;
      if (before.top < targetTop || before.bottom > innerHeight) {
        window.scrollBy({ top: before.top - targetTop, behavior: 'instant' });
      }
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const box = iframe.getBoundingClientRect();
      const insetX = Math.min(4, box.width * 0.01);
      const insetY = Math.min(4, box.height * 0.01);
      const points = [
        [box.left + insetX, box.top + insetY],
        [box.left + box.width / 2, box.top + box.height / 2],
        [box.right - insetX, box.top + insetY],
        [box.left + insetX, box.bottom - insetY],
        [box.right - insetX, box.bottom - insetY],
      ];
      return {
        withinViewport: box.top >= Math.max(7, visibleHeaderBottom()) && box.bottom <= innerHeight + 1,
        ratioCorrect: Math.abs(box.width / box.height - 16 / 9) < 0.02,
        noOverflow: document.documentElement.scrollWidth <= innerWidth,
        hitTargets: points.map(([x, y]) => {
          const hit = document.elementFromPoint(x, y);
          return hit === iframe ? 'iframe' : hit?.outerHTML.slice(0, 120) ?? 'outside viewport';
        }),
      };
    })).toEqual({ withinViewport: true, ratioCorrect: true, noOverflow: true, hitTargets: Array(5).fill('iframe') });
  };
  await page.locator('#on-field').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await checkRatio();
  await checkUnobstructed();
  await page.setViewportSize({ width: 390, height: 844 });
  await checkRatio();
  await checkUnobstructed();
  await page.setViewportSize({ width: 844, height: 390 });
  await checkRatio();
  await checkUnobstructed();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await checkRatio();
  await checkUnobstructed();

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await checkUnobstructed();
});

test('field asset refreshes and responsive motion preserve the mounted Hudl document', async ({ page }) => {
  const token = `hudl-fixture-${crypto.randomUUID()}`;
  const pageErrors: string[] = [];
  let hudlNavigations = 0;
  let fixtureRequests = 0;
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('framenavigated', frame => {
    if (frame.url().startsWith('https://www.hudl.com/')) hudlNavigations++;
  });
  // Fixture token proves the iframe document survives parent refreshes; it is not playback evidence.
  await page.route('https://www.hudl.com/**', route => {
    fixtureRequests++;
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html><html><body data-fixture-token="${token}-${fixtureRequests}">Fixture document</body></html>`,
    });
  });
  await page.goto('/');
  const frame = page.locator('#on-field iframe');
  const fixtureBody = page.frameLocator('#on-field iframe').locator('body');
  await frame.scrollIntoViewIfNeeded();
  await expect(fixtureBody).toHaveAttribute('data-fixture-token', `${token}-1`);
  await expect.poll(() => hudlNavigations).toBe(1);

  for (const viewport of [{ width: 1280, height: 800 }, { width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await expect(fixtureBody).toHaveAttribute('data-fixture-token', `${token}-1`);
    await expect(frame).toHaveCount(1);
    expect(hudlNavigations).toBe(1);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('img').first().dispatchEvent('load');
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(fixtureBody).toHaveAttribute('data-fixture-token', `${token}-1`);
  await expect(frame).toHaveCount(1);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect(hudlNavigations).toBe(1);
  expect(pageErrors).toEqual([]);
});
