import { test, expect } from '@playwright/test';

test('film resolves to an uncropped native player in the second story scene', async ({ page }) => {
  await page.goto('/#film-room');
  await page.evaluate(() => document.fonts.ready);
  const video = page.locator('#film-room video');
  await expect(video).toHaveCSS('object-fit', 'contain');
  await expect(video).toHaveJSProperty('controls', true);
  await expect(page.locator('#film-room [data-zk-aperture]')).toHaveAttribute('href', '/brand/zk17-monogram-512-v2.png');
  await expect(page.locator('#film-room svg text')).toHaveCount(0);
  await expect.poll(() => video.evaluate(el => getComputedStyle(el).transform)).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  const box = await video.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThan(0);
  expect(box!.x + box!.width).toBeLessThan(viewport.width);
  expect(box!.y).toBeGreaterThanOrEqual(Math.max(0, (await page.locator('.site-header').boundingBox())!.y + (await page.locator('.site-header').boundingBox())!.height) - 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  expect(await page.locator('.site-content section').evaluateAll(sections => sections.slice(0, 2).map(section => section.id))).toEqual(['arrival', 'film-room']);
});

test('Playoffs desktop places official Anna mark left of copy', async ({ page }) => {
  test.skip(page.viewportSize()!.width <= 700);
  await page.goto('/playoffs/');
  const logo = page.locator('[data-playoff-hero] img[alt="Anna Coyotes logo"]');
  const heading = page.locator('#playoffs-title');
  await expect(logo).toBeVisible();
  const mark = await logo.boundingBox();
  const title = await heading.boundingBox();
  expect(mark!.x + mark!.width).toBeLessThan(title!.x);
});

for (const height of [180, 240, 360]) {
  test(`short ${height}px viewport retains a finite, usable player`, async ({ page }) => {
    await page.setViewportSize({ width: 1024, height });
    await page.goto('/#film-room', { waitUntil: 'load' });
    const video = page.locator('#film-room video');
    await expect(video).toHaveJSProperty('controls', true);
    await expect.poll(() => video.evaluate(el => {
      const box = el.getBoundingClientRect();
      return box.width >= 120 && box.height > 0 && box.height <= innerHeight &&
        box.x >= 0 && box.right <= innerWidth && box.y >= Math.max(0, document.querySelector('.site-header')!.getBoundingClientRect().bottom) - 1 && box.bottom <= innerHeight + 1 &&
        !/NaN|Infinity/.test(getComputedStyle(el).transform);
    })).toBe(true);
    await video.focus();
    await expect(video).toHaveJSProperty('controls', true);
    await expect(video).toHaveJSProperty('tabIndex', 0);
    // Browser native-focus scrolling can arrive after the focus event.
    await page.waitForTimeout(200);
    await expect(video).toBeFocused();
    await expect(video).toHaveJSProperty('controls', true);
    await expect(video).toHaveJSProperty('tabIndex', 0);
  });
}

test('cinema reverses its reveal and recomputes framing after a height and width resize', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const stage = page.locator('#film-room');
  const video = stage.locator('video');
  const mask = stage.locator('svg').first();
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (!reduced) await expect(video).toHaveJSProperty('tabIndex', -1);
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const seek = async (complete: boolean) => {
    await stage.evaluate((el, complete) => {
      const top = (el.closest('.pin-spacer') ?? el).getBoundingClientRect().top + scrollY;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const offset = reduced ? 1 : innerWidth >= 900 ? (complete ? innerHeight * 1.85 + 1 : -1) : (complete ? 1 : -innerHeight * .85 - 1);
      scrollTo({ top: top + offset, behavior: 'instant' });
    }, complete);
  };
  const framed = async () => {
    await expect(video).toHaveJSProperty('controls', true);
    await expect(video).toHaveJSProperty('tabIndex', 0);
    await expect.poll(() => video.evaluate(el => {
      const r = el.getBoundingClientRect();
      return r.width > 120 && Math.abs(r.width / r.height - .8) < .01 &&
        Math.abs(r.x + r.width / 2 - innerWidth / 2) < 1 &&
        r.y >= Math.max(0, document.querySelector('.site-header')!.getBoundingClientRect().bottom) - 1 && r.bottom <= innerHeight + 1 &&
        /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/.test(getComputedStyle(el).transform);
    })).toBe(true);
    await expect(mask).toHaveCSS('opacity', '0');
    const player = await video.boundingBox();
    const button = await stage.getByRole('button', { name: /WATCH WITH SOUND/ }).boundingBox();
    expect(player!.x + player!.width <= button!.x || button!.x + button!.width <= player!.x ||
      player!.y + player!.height <= button!.y || button!.y + button!.height <= player!.y).toBe(true);
  };
  const reversed = async () => {
    await seek(false);
    await expect(video).toHaveJSProperty('controls', false);
    await expect(video).toHaveJSProperty('tabIndex', -1);
    await expect(mask).toHaveCSS('opacity', '1');
    await expect.poll(() => mask.evaluate(el => getComputedStyle(el).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)');
    await expect.poll(() => video.evaluate(el => {
      const r = el.getBoundingClientRect();
      const stage = el.closest('section')!.getBoundingClientRect();
      return r.left <= stage.left + 1 && r.right >= stage.right - 1 &&
        r.top <= stage.top + 1 && r.bottom >= stage.bottom - 1;
    })).toBe(true);
  };
  await seek(true);
  await framed();
  const source = await video.getAttribute('src');
  const before = await video.boundingBox();
  if (!reduced) { await reversed(); await seek(true); await framed(); }
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width - 10, height: viewport.height - 140 });
  // Allow the browser's resize event and ScrollTrigger's debounced refresh to run.
  await page.waitForTimeout(350);
  await seek(true);
  await framed();
  const after = await video.boundingBox();
  expect(Math.abs(after!.width - before!.width)).toBeGreaterThan(1);
  expect(await video.getAttribute('src')).toBe(source);
  if (!reduced) await reversed();
  await seek(true);
  await framed();
});

test('a direct film anchor stays framed through resize and yields to manual scrolling', async ({ page, hasTouch }) => {
  await page.goto('/#film-room');
  const video = page.locator('#film-room video');
  await expect(video).toHaveJSProperty('controls', true);
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 600 });
  await expect.poll(() => video.evaluate(el => {
    const r = el.getBoundingClientRect();
    const header = document.querySelector('.site-header')!.getBoundingClientRect();
    return (el as HTMLVideoElement).controls && r.y >= Math.max(0, header.bottom) - 1 && r.bottom <= innerHeight + 1;
  })).toBe(true);
  const anchored = await page.evaluate(() => scrollY);
  if (hasTouch) {
    // Playwright mobile WebKit exposes taps, but does not support mouse wheels.
    await page.touchscreen.tap(5, 300);
    await page.evaluate(() => scrollBy({ top: -300, behavior: 'instant' }));
  } else await page.mouse.wheel(0, -300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(anchored - 100);
  const manual = await page.evaluate(() => scrollY);
  await page.evaluate(() => dispatchEvent(new Event('resize')));
  await page.waitForTimeout(500);
  expect(Math.abs(await page.evaluate(() => scrollY) - manual)).toBeLessThan(10);
});


test('direct film landing lets keyboard focus leave the native player and scroll to its destination', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 180 });
  await page.goto('/#film-room');
  const video = page.locator('#film-room video');
  await expect(video).toHaveJSProperty('controls', true);
  await video.focus();
  await page.waitForTimeout(200);
  const anchored = await page.evaluate(() => scrollY);
  // Native control tab stops vary by browser; follow real Tab navigation until
  // it reaches the next story link rather than prescribing their count.
  for (let index = 0; index < 20; index++) {
    await page.keyboard.press('Tab');
    if (await video.evaluate(el => document.activeElement === el)) {
      await expect(video).toHaveJSProperty('controls', true);
      await expect(video).toHaveJSProperty('tabIndex', 0);
    }
    if (await page.evaluate(() => document.activeElement?.matches('a[href="#nil-inquiries"]'))) break;
  }
  const target = page.getByRole('link', { name: /NIL.*BUSINESS INQUIRIES/i }).first();
  await expect(target).toBeFocused();
  await expect.poll(() => target.evaluate(el => { const box = el.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; })).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(anchored + 100);
  const keyboardScroll = await page.evaluate(() => scrollY);
  await page.evaluate(() => dispatchEvent(new Event('resize')));
  await page.waitForTimeout(500);
  expect(Math.abs(await page.evaluate(() => scrollY) - keyboardScroll)).toBeLessThan(10);
});


test('ready native keyboard controls survive seek keys and yield to manual scrolling', async ({ page, hasTouch }) => {
 await page.setViewportSize({width:1024,height:360});
 await page.goto('/#film-room');
 const video=page.locator('#film-room video');
 await expect(video).toHaveAttribute('tabindex','0');
 await expect.poll(()=>video.evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 await video.focus();
 await expect(video).toBeFocused();
 for(const key of ['ArrowRight','Space','ArrowUp']) {
  await page.keyboard.press(key);
  await expect(video).toBeFocused();
  await expect(video).toHaveJSProperty('controls',true);
  await expect(video).toHaveJSProperty('tabIndex',0);
  await expect.poll(()=>video.evaluate(el=>{const box=el.getBoundingClientRect(),header=document.querySelector('.site-header')!.getBoundingClientRect();return box.top>=Math.max(0,header.bottom)-1&&box.bottom<=innerHeight+1;})).toBe(true);
 }
 const anchored=await page.evaluate(()=>scrollY);
 await page.getByRole('link',{name:'Skip to content'}).evaluate((el: HTMLElement)=>el.focus({preventScroll:true}));
 await page.waitForTimeout(150);
 expect(await page.evaluate(()=>scrollY)).toBe(anchored);
 // A ready player reached without a pending hash alignment can hold again.
 await video.evaluate((el: HTMLVideoElement)=>el.focus({preventScroll:true}));
 await page.keyboard.press('ArrowRight');
 if(hasTouch) {
  await page.touchscreen.tap(5,100);
  await page.evaluate(()=>scrollBy({top:-180,behavior:'instant'}));
 } else {
  await page.mouse.move(5,100);
  await page.mouse.wheel(0,-180);
 }
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(anchored-100);
 const reduced=await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 await expect(video).toHaveJSProperty('controls',reduced);
 await expect(video).toHaveJSProperty('tabIndex',reduced?0:-1);
});
