import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('snapshot is reachable from recruiting navigation and shares the current route', async ({page, context}, testInfo) => {
 if (testInfo.project.use.browserName === 'webkit') test.skip();
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/nil-recruiting/');
 await page.getByRole('link',{name:'VIEW RECRUITING SNAPSHOT'}).click();
 await expect(page).toHaveURL(/\/recruiting\/?$/);
 await waitForHydration(page, '.snapshot-share button');
 await expect(page.getByRole('heading',{level:1})).toContainText('Zephyr Kreye');
 await page.getByRole('button',{name:'Copy snapshot link'}).click();
 await expect(page.getByRole('status')).toContainText('Link copied');
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toMatch(/\/recruiting\/$/);
 await expect(page.getByRole('link',{name:'Recruiting contact'})).toHaveAttribute('href','/nil-recruiting/');
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.goBack();
 await expect(page).toHaveURL(/\/nil-recruiting\/$/);
 await expect(page.locator('.site-header').getByRole('link',{name:/Zephyr Kreye.*home/i})).toBeVisible();
});

test('pending film deep link remains closable while approved film uses native controls',async({page})=>{
 await page.goto('/#film=pending');
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog')).toContainText('No approved film is available yet.');
 await page.getByRole('button',{name:'Close film room'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page).toHaveURL(/#film-room$/);
 await page.goto('/#film-room');
 await expect(page.locator('.site-header')).toBeVisible();
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'WATCH THE FILM',exact:true})).toHaveCount(0);
 await page.goto('/#film=zephyr-cinematic');
 const dialog=page.getByRole('dialog',{name:'Film room'});
 await expect(dialog.locator('video')).toHaveAttribute('controls','');
 await expect(dialog.locator('video source')).toHaveAttribute('src','/media/zephyr-monochrome-full.mp4');
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
});

test('scrolling releases the field pin and responsive motion leaves a readable document',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('#on-field').scrollIntoViewIfNeeded();
 await page.evaluate(()=>window.scrollBy({top:innerHeight*2,behavior:'instant'}));
 await expect.poll(()=>page.locator('#on-field').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThan(100);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await expect(page.locator('#field-title')).toHaveCSS('opacity','1');
});

test('snapshot offers a selectable address when clipboard access is unavailable', async ({page}) => {
 await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {value:{writeText:async()=>{throw new Error('denied');}}}));
 await page.goto('/recruiting/');
 await waitForHydration(page, '.snapshot-share button');
 await page.getByRole('button',{name:'Copy snapshot link'}).click();
 await expect(page.getByRole('status')).toContainText('Copy the snapshot address below.');
 const address = page.getByRole('textbox',{name:'Snapshot address'});
 await expect(address).toHaveValue(/\/recruiting\/$/);
 await address.focus();
 expect(await address.evaluate((el:HTMLInputElement)=>el.selectionEnd! - el.selectionStart!)).toBeGreaterThan(10);
});

async function waitForHydration(page: import('@playwright/test').Page, selector: string) {
 await page.waitForFunction((target) => {
  const element = document.querySelector(target);
  return !!element && Object.keys(element).some(key => key.startsWith('__reactProps$'));
 }, selector);
}
