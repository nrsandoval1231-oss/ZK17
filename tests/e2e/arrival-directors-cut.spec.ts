import { expect, test } from '@playwright/test';

for (const viewport of [{width:1440,height:900},{width:390,height:844},{width:768,height:1024}]) {
 test(`collage accumulates permanently with compact travel at ${viewport.width}px`, async ({browser}) => {
  const context=await browser.newContext({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900,reducedMotion:'no-preference'});
  const page=await context.newPage();await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  const hero=page.locator('#arrival');
  await expect(hero).toHaveAttribute('data-arrival-motion','ready');
  const distance=await hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom));
  expect(distance/viewport.height).toBeCloseTo(viewport.width>=900?2.4:1.6,1);
  const opacity=(name:string)=>hero.locator(`[data-arrival-layer="${name}"]`).evaluate(el=>Number(getComputedStyle(el).opacity));
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-header nav a').first()).toBeHidden();
  for(const name of ['lights','stadium','closeup','rear','white','running','athlete','monogram']) expect(await opacity(name)).toBe(0);
  const revealed:string[]=[];
  for(const [fraction,name] of [[.33,'closeup'],[.44,'rear'],[.55,'white'],[.66,'running'],[.78,'athlete']] as const){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*fraction);
   revealed.push(name);
   for(const present of revealed) await expect.poll(()=>opacity(present),{timeout:10000}).toBeGreaterThan(.65);
   await expect(page.locator('.site-header')).toBeHidden();
  }
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*.95);
  await expect.poll(()=>hero.locator('[data-arrival-statement]').evaluate(el=>Number(getComputedStyle(el).opacity)),{timeout:10000}).toBeGreaterThan(.98);
  await expect.poll(()=>opacity('stadium')).toBeGreaterThan(.15);
  for(const name of revealed) expect(await opacity(name)).toBeGreaterThan(.65);
  await page.evaluate(y=>scrollTo({top:y+2,behavior:'instant'}),distance);
  await expect(page.locator('.site-header')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await context.close();
 });
}

test('rotation preserves normalized intro progress and reduced motion releases the pin',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:844});await page.goto('/');
 const hero=page.locator('#arrival');await expect(hero).toHaveAttribute('data-arrival-motion','ready');
 await page.evaluate(()=>scrollTo({top:innerHeight*1.6*.5,behavior:'instant'}));await page.waitForTimeout(400);
 await page.setViewportSize({width:844,height:390});
 await expect.poll(()=>hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom))).toBeCloseTo(624,0);
 await expect.poll(()=>page.evaluate(()=>scrollY/(innerHeight*1.6))).toBeCloseTo(.5,1);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#arrival').locator('..')).not.toHaveClass('pin-spacer');
 await expect(hero.locator('#hero-title')).toBeVisible();await expect(page.locator('.site-header')).toBeVisible();
});
