import { expect, test } from '@playwright/test';

for (const viewport of [{width:1440,height:900},{width:390,height:844},{width:768,height:1024}]) {
 test(`collage accumulates permanently with compact travel at ${viewport.width}px`, async ({browser}) => {
  test.setTimeout(60_000);
  const context=await browser.newContext({viewport,isMobile:viewport.width<900,hasTouch:viewport.width<900,reducedMotion:'no-preference'});
  const page=await context.newPage();await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  const hero=page.locator('#arrival');
  await expect(hero).toHaveAttribute('data-arrival-motion','ready');
  const distance=await hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom));
  expect(distance/viewport.height).toBeCloseTo(viewport.width>=900?2.4:1.6,1);
  const opacity=(name:string)=>hero.locator(`[data-arrival-layer="${name}"]`).evaluate(el=>Number(getComputedStyle(el).opacity));
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-header nav a').first()).toBeHidden();
  for(const name of ['lights','stadium','closeup','rear','white','running','athlete','stadium-color']) expect(await opacity(name)).toBe(0);
  expect(await opacity('cold-logo')).toBeCloseTo(.9,1);
  expect(await opacity('smoke-back')).toBeCloseTo(.25,1);
  const revealed:string[]=[];
  for(const [fraction,name] of [[.59,'athlete'],[.67,'closeup'],[.74,'rear'],[.80,'white'],[.86,'running']] as const){
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
 await expect.poll(()=>hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom))).toBeGreaterThan(0);
 await page.evaluate(()=>scrollTo({top:innerHeight*1.6*.5,behavior:'instant'}));await page.waitForTimeout(400);
 await expect.poll(()=>page.evaluate(()=>scrollY/(innerHeight*1.6))).toBeCloseTo(.5,1);
 await page.setViewportSize({width:844,height:390});
 await expect.poll(()=>hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom))).toBeCloseTo(624,0);
 await expect.poll(()=>page.evaluate(()=>scrollY/(innerHeight*1.6))).toBeCloseTo(.5,1);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#arrival').locator('..')).not.toHaveClass('pin-spacer');
 await expect(hero.locator('#hero-title')).toBeVisible();await expect(page.locator('.site-header')).toBeVisible();
});

test('mobile toolbar height changes do not shift the pinned scene or its scrub progress', async ({ browser }) => {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
 const page=await context.newPage();await page.goto('/');
 const hero=page.locator('#arrival');await expect(hero).toHaveAttribute('data-arrival-motion','ready');
 await expect.poll(()=>hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom))).toBeGreaterThan(0);
 await page.evaluate(()=>document.fonts.ready);
 const settle=async()=>page.evaluate(async()=>{
  const athlete=document.querySelector<HTMLElement>('#arrival [data-arrival-layer="athlete"]')!;
  let previous=Number(getComputedStyle(athlete).opacity),stable=0;
  for(let frame=0;frame<180&&stable<5;frame++){
   await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
   const current=Number(getComputedStyle(athlete).opacity);
   stable=Math.abs(current-previous)<.0001?stable+1:0;previous=current;
  }
  return previous;
 });
 await page.evaluate(()=>scrollTo({top:600,behavior:'instant'}));
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(600);
 await settle();
 const readState=()=>hero.evaluate(el=>({distance:parseFloat(el.parentElement!.style.paddingBottom),height:el.clientHeight,top:el.getBoundingClientRect().top,scrollY:window.scrollY,athlete:Number(getComputedStyle(el.querySelector('[data-arrival-layer="athlete"]')!).opacity)}));
 const before=await readState();
 const samples:Awaited<ReturnType<typeof readState>>[]=[];
 for(const height of[664,754,724,844]){
  await page.setViewportSize({width:390,height});
  await settle();
  samples.push(await readState());
 }
 const states=JSON.stringify({before,samples});
 expect(samples.every(sample=>Math.abs(sample.distance-before.distance)<1),states).toBe(true);
 expect(samples.every(sample=>sample.height===before.height),states).toBe(true);
 expect(samples.every(sample=>Math.abs(sample.top-before.top)<1),states).toBe(true);
 expect(samples.every(sample=>Math.abs(sample.scrollY-before.scrollY)<1),states).toBe(true);
 expect(samples.every(sample=>Math.abs(sample.athlete-before.athlete)<.02),JSON.stringify({before,samples})).toBe(true);
 await context.close();
});

test('ready mobile intro has its scroll spacer before the first swipe', async ({ browser }) => {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
 const page=await context.newPage();await page.goto('/');
 const hero=page.locator('#arrival');await expect(hero).toHaveAttribute('data-arrival-motion','ready');
 const travel=await hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom));
 expect(travel).toBeGreaterThan(0);
 await page.evaluate(()=>scrollTo({top:600,behavior:'instant'}));
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(600);
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));});
 expect(await hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom))).toBeCloseTo(travel,0);
 expect(await page.evaluate(()=>scrollY)).toBe(600);
 await context.close();
});
