import { test, expect } from '@playwright/test';

test('slow enabled JavaScript paints darkness before hydration without spoiling the statement', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:1440,height:900});
 await page.route(/\.js(?:\?|$)/, async route => { await new Promise(resolve=>setTimeout(resolve,1800)); await route.continue(); });
 await page.goto('/',{waitUntil:'commit'});
 await page.waitForTimeout(1000);
 const hero=page.locator('#arrival');
 const opening=await hero.evaluate(el=>({statement:Number(getComputedStyle(el.querySelector('[data-arrival-statement]')!).opacity),layers:[...el.querySelectorAll('[data-arrival-layer]')].map(node=>Number(getComputedStyle(node).opacity)),pinned:el.parentElement?.classList.contains('pin-spacer')}));
 // A snapshot assertion must inspect the 1000ms paint, never retry into hydration.
 expect(opening.statement).toBe(0);
 expect(opening.layers.every(opacity=>opacity===0)).toBe(true);
 expect(opening.pinned).toBe(false);
 await expect(page.locator('.site-header')).toBeVisible();
 await expect(hero.getByRole('heading',{level:1})).toHaveText(/MAKE THEM REMEMBER/);
 await page.waitForLoadState('load');
 await expect.poll(()=>hero.evaluate(el=>el.parentElement?.classList.contains('pin-spacer'))).toBe(true);
 await expect(hero).toHaveAttribute('data-arrival-motion','ready');
});

test('failed JavaScript loading releases the finite opening guard into a readable fallback', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route(/\.js(?:\?|$)/, route=>route.abort());
 await page.goto('/');
 const hero=page.locator('#arrival');
 await expect(page.locator('html')).toHaveAttribute('data-arrival-boot','fallback',{timeout:8000});
 await expect(hero.locator('#hero-title')).toBeVisible();
 await expect(hero.locator('[data-arrival-layer="athlete"]')).toHaveCSS('opacity','0.8');
 await expect(hero.locator('a[href="#film-room"]')).toBeVisible();
 expect(await hero.evaluate(el=>el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
});

for(const mode of ['no-js','reduced'] as const)test(`${mode} keeps a complete readable composition without an opening guard`,async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
 const page=await context.newPage();
 await page.goto('/');
 await expect(page.locator('#hero-title')).toBeVisible();
 await expect(page.locator('[data-arrival-layer="athlete"]')).toHaveCSS('opacity','0.8');
 expect(await page.locator('#arrival').evaluate(el=>el.parentElement?.classList.contains('pin-spacer'))).toBe(false);
 await context.close();
});
