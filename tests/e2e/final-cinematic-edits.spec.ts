import { expect, test } from '@playwright/test';

const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 844, height: 390 },
];

test('final cinematic layers preserve the cold logo, crisp color action, and approved timing', async ({ browser }) => {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto('/');

    const hero = page.locator('#arrival');
    await expect(hero).toHaveAttribute('data-arrival-motion', 'ready');
    const duration = await hero.evaluate(el => parseFloat(el.parentElement!.style.paddingBottom));
    expect(duration / viewport.height).toBeCloseTo(viewport.width >= 900 ? 2.4 : 1.6, 1);

    const layer = (name: string) => hero.locator(`[data-arrival-layer="${name}"]`);
    const opacity = (name: string) => layer(name).evaluate(el => Number(getComputedStyle(el).opacity));
    await expect(layer('monogram')).toHaveCount(0);
    expect(await opacity('cold-logo')).toBeCloseTo(.9, 1);
    expect(await opacity('color-action')).toBe(0);
    expect(await opacity('color-action-glow')).toBe(0);

    await page.evaluate(() => scrollTo({ top: innerHeight * (innerWidth >= 900 ? 2.4 : 1.6) * .96, behavior: 'instant' }));
    await expect.poll(() => opacity('color-action')).toBeGreaterThan(.8);
    await expect.poll(() => opacity('color-action-glow')).toBeGreaterThan(.5);
    await expect.poll(() => opacity('running')).toBeGreaterThan(.65);
    await expect(layer('color-action').locator('img')).toHaveCSS('filter', 'none');
    const foregroundFilters = await layer('color-action').evaluate(el => {
      const filters: string[] = [];
      for (let node: Element | null = el; node && node !== document.querySelector('#arrival'); node = node.parentElement) {
        filters.push(getComputedStyle(node).filter);
      }
      return filters;
    });
    expect(foregroundFilters.every(filter => !filter.includes('blur('))).toBe(true);
    await context.close();
  }
});

test('reduced motion presents the completed static color action and transparent FilmRoom logo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#film-room');

  const hero = page.locator('#arrival');
  await expect(hero.locator('[data-arrival-layer="monogram"]')).toHaveCount(0);
  await expect(hero.locator('[data-arrival-layer="color-action"]')).toHaveCSS('opacity', '0.72');

  const logoImage = page.locator('#film-room img');
  const logo = logoImage.locator('..');
  await expect(logoImage).toHaveAttribute('src', '/brand/zk17-monogram-512-v2.png');
  await expect(logoImage).toHaveCSS('filter', 'none');
  await expect(logo).toHaveCSS('background-image', 'none');
  await expect(logo).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
