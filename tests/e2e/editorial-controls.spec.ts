import { expect, test, type Locator } from '@playwright/test';

const arrowGlyphs = /[←→↑↓↖↗↘↙↔↕⟵⟶⇐⇒⇧⇩➜➝➞➔➤◀▶◁▷▸▹◂◃‹›❮❯]/;
const mediaControlName = /^(play|pause|volume|mute|unmute|fullscreen|full screen)\b/i;
const routes = ['/', '/film/', '/highlights/', '/about/', '/nil-recruiting/', '/recruiting/', '/playoffs/'];

async function expectTouchTarget(control: Locator, label: string) {
  const box = await control.boundingBox();
  expect(box?.width, `${label} should be at least 44 CSS pixels wide`).toBeGreaterThanOrEqual(44);
  expect(box?.height, `${label} should be at least 44 CSS pixels high`).toBeGreaterThanOrEqual(44);
}

test('site-owned controls contain no arrow text and no nonmedia SVG icons', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByText('Skip intro', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /WATCH FILM|WATCH THE FILM/i })).toHaveCount(0);

    const violations = await page.locator('main a, main button, main [role="button"], main [role="tab"], .site-header a, .site-header button')
      .evaluateAll((controls, config) => {
        const pattern = new RegExp(config.arrows as string);
        const mediaName = new RegExp(config.media as string);
        const isMediaContext = (element: HTMLElement) => element.tagName === 'BUTTON' && Boolean(element.closest('[data-media-control], [class*="media"], [class*="film"], [class*="player"]'));
        return controls.flatMap((control) => {
        const element = control as HTMLElement;
        const label = element.getAttribute('aria-label') ?? element.innerText ?? element.tagName;
        const isCanonicalLogo = element.tagName === 'A' && (/\bZK17 home\b|Zephyr Kreye/i.test(label) || element.classList.contains('brand'));
        const isFunctionalMedia = mediaName.test(label) && isMediaContext(element);
        const issues: string[] = [];
        let visibleText = element.innerText;
        if (isFunctionalMedia && /^play\b/i.test(label)) {
          for (const playGlyph of element.querySelectorAll('.play-glyph')) visibleText = visibleText.replace(playGlyph.textContent ?? '', '');
        }
        if (pattern.test(visibleText)) issues.push(`arrow text: ${label}`);
        if (!isFunctionalMedia && !isCanonicalLogo && element.querySelector('svg')) issues.push(`site-owned control SVG: ${label}`);
        for (const pseudo of ['::before', '::after']) {
          const content = getComputedStyle(element, pseudo).content;
          if (content && content !== 'none' && content !== 'normal') {
            const checkedContent = isFunctionalMedia && /^play\b/i.test(label) ? content.replace(/▶/g, '') : content;
            if (pattern.test(checkedContent)) issues.push(`generated ${pseudo} arrow: ${label}`);
          }
        }
        return issues;
      });
      }, { arrows: arrowGlyphs.source, media: mediaControlName.source });
    expect(violations, `${route} controls should use editorial text; only named controls inside media-specific elements and the canonical logo may contain SVG; native selects and Hudl iframe controls are outside this DOM scan`).toEqual([]);
  }
});

test('menu and section actions expose text labels and touch targets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about/');
  const menu = page.getByRole('button', { name: 'MENU', exact: true });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expectTouchTarget(menu, 'MENU');
  await menu.click();
  const close = page.getByRole('button', { name: 'CLOSE', exact: true });
  await expect(close).toBeFocused();
  await expectTouchTarget(close, 'CLOSE');
  await expect(page.locator('#route-nav a')).toHaveCount(7);
  await expect(page.locator('#route-nav [aria-current="page"]')).toHaveAttribute('href', '/about/');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();

  await page.goto('/');
  for (const name of ['EXPLORE PERSONAL', 'SEE HIM ON FIELD', 'BACK TO TOP']) {
    const action = page.getByRole('link', { name, exact: true });
    await expect(action, `${name} action should be present`).toHaveCount(1);
    await expectTouchTarget(action, name);
  }
  const recruiting = page.getByRole('link', { name: 'RECRUITING SNAPSHOT', exact: true });
  await expect(recruiting, 'recruiting snapshot action should be present').toHaveCount(1);
  await expectTouchTarget(recruiting, 'RECRUITING SNAPSHOT');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('editorial targets and active state remain legible in desktop, portrait, and landscape', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/playoffs/');
    const current = page.locator('.site-header nav [aria-current="page"]');
    if (viewport.width < 900) await page.getByRole('button', { name: 'MENU', exact: true }).click();
    await expect(current).toHaveAttribute('href', '/playoffs/');
    const navBox = await current.boundingBox();
    expect(navBox?.height).toBeGreaterThanOrEqual(44);
    expect(navBox?.width).toBeGreaterThanOrEqual(44);
    const hasNonColorUnderline = await current.evaluate((element) => {
      const style = getComputedStyle(element);
      const after = getComputedStyle(element, '::after');
      const before = getComputedStyle(element, '::before');
      const border = parseFloat(style.borderBottomWidth) > 0 && style.borderBottomStyle !== 'none';
      const text = style.textDecorationLine.includes('underline');
      const pseudo = [after, before].some((item) => item.content !== 'none' && item.content !== 'normal' && parseFloat(item.height) > 0 && item.transform !== 'matrix(0, 0, 0, 1, 0, 0)');
      return border || text || pseudo;
    });
    expect(hasNonColorUnderline, 'active navigation should include a visible underline marker').toBe(true);
    if (viewport.width < 900) {
      await page.keyboard.press('Escape');
      await expect(page.getByRole('button', { name: 'MENU', exact: true })).toBeFocused();
    }

    const region = page.getByRole('button', { name: 'Region III', exact: true });
    await expectTouchTarget(region, 'Region III');
    await region.click();
    await expect(region).toHaveAttribute('aria-pressed', 'true');
    const regionUnderline = await region.evaluate((element) => {
      const style = getComputedStyle(element);
      const after = getComputedStyle(element, '::after');
      const before = getComputedStyle(element, '::before');
      return (parseFloat(style.borderBottomWidth) > 0 && style.borderBottomStyle !== 'none') || style.textDecorationLine.includes('underline') || [after, before].some((item) => item.content !== 'none' && item.content !== 'normal' && parseFloat(item.height) > 0 && item.transform !== 'matrix(0, 0, 0, 1, 0, 0)');
    });
    expect(regionUnderline, 'selected playoff regions should use an underline state, not color alone').toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('playoff text controls, game center close, and arcade categories retain working interactions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/playoffs/');
  const rail = page.getByRole('region', { name: 'Interactive tournament bracket' });
  await rail.evaluate(element => { element.scrollLeft = 0; });
  const previous = page.getByRole('button', { name: /PREVIOUS/i });
  const next = page.getByRole('button', { name: /NEXT/i });
  await expectTouchTarget(previous, 'PREVIOUS');
  await expectTouchTarget(next, 'NEXT');
  await next.click();
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await previous.click();
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBe(0);

  const card = page.locator('[data-game-card]').first();
  await card.click();
  const dialog = page.getByRole('dialog', { name: 'Game center' });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'CLOSE', exact: true });
  await expectTouchTarget(close, 'Game Center CLOSE');
  await close.click();
  await expect(dialog).toHaveCount(0);

  await page.goto('/#offfield-personal');
  const arcade = page.locator('#offfield-personal');
  const categories = ['Games', 'Movies', 'TV Shows', 'Anime'];
  for (const category of categories) {
    const choice = arcade.getByRole('button', { name: category, exact: true });
    await expectTouchTarget(choice, `${category} category`);
    await choice.click();
    await expect(arcade.getByRole('listitem')).toHaveCount(3);
    const back = arcade.getByRole('button', { name: 'BACK TO MENU', exact: true });
    await expectTouchTarget(back, 'BACK');
    await back.click();
    await expect(choice).toBeFocused();
    await expect(choice).toHaveAttribute('data-selected', 'true');
    const selectedUnderline = await choice.evaluate((element) => {
      const text = element.querySelector('span') ?? element;
      const style = getComputedStyle(text);
      const after = getComputedStyle(text, '::after');
      return style.textDecorationLine.includes('underline') || (parseFloat(style.borderBottomWidth) > 0 && style.borderBottomStyle !== 'none') || (after.content !== 'none' && after.content !== 'normal' && parseFloat(after.height) > 0 && after.transform !== 'matrix(0, 0, 0, 1, 0, 0)');
    });
    expect(selectedUnderline, 'selected arcade category should use an underline, not color alone').toBe(true);
  }
  const start = arcade.getByRole('button', { name: 'PRESS START', exact: true });
  await expectTouchTarget(start, 'PRESS START');
});
