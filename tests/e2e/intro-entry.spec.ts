import {test,expect,type Page} from '@playwright/test';

async function assertAnimatedOpening(page:Page){
 const hero=page.locator('#arrival');
 await expect(hero).toHaveAttribute('data-arrival-motion','ready');
 await expect(page.locator('html')).toHaveAttribute('data-arrival-boot','ready');
 await expect(page.locator('.site-header')).toBeHidden();
 await expect(page.locator('.site-header nav a').first()).toBeHidden();
 await expect(hero.locator('[data-arrival-layer="athlete"]')).toHaveCSS('opacity','0');
 const distance=await hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom));
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*.70);
 await expect.poll(()=>hero.locator('[data-arrival-layer="closeup"]').evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.65);
 await expect(page.locator('.site-header nav a').first()).toBeHidden();
 await page.getByRole('link',{name:'Skip intro'}).click();
 await expect(page.locator('.site-header')).toBeVisible();
 await expect(page.locator('#film-room')).toBeFocused();
}
for(const origin of ['/film/','/about/'])test(`client navigation ${origin} to Home owns intro header state`,async({page})=>{
 test.setTimeout(60_000);await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(origin);
 if(page.viewportSize()!.width<900)await page.getByRole('button',{name:'Menu',exact:true}).click();
 await page.locator('#route-nav a[href="/"]').click();await expect(page).toHaveURL(/\/$/);
 await assertAnimatedOpening(page);
});

test('reduced motion to normal starts a hidden-header intro on each activation',async({page})=>{
 test.setTimeout(60_000);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('.site-header')).toBeVisible();
 await page.emulateMedia({reducedMotion:'no-preference'});await assertAnimatedOpening(page);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.site-header')).toBeVisible();
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.emulateMedia({reducedMotion:'no-preference'});await assertAnimatedOpening(page);
});


test('direct Film anchor keeps completed intro navigation and controls visible after refresh',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/#film-room');
 await expect(page.locator('#film-room video')).toHaveJSProperty('controls',true);
 await expect(page.locator('#film-room video')).toHaveCSS('object-fit','contain');
 await expect(page.locator('.site-header')).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('data-intro-complete','true');
 await page.evaluate(()=>dispatchEvent(new Event('resize')));
 await expect.poll(()=>page.locator('#film-room').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(5);
 await expect(page.locator('.site-header')).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('data-intro-complete','true');
});
