import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('playoffs navigation, complete bracket and region/round filters work',async({page})=>{
 await page.goto('/');
 if(page.viewportSize()!.width<900)await page.getByRole('button',{name:'Menu'}).click();
 await page.locator('#site-nav').getByRole('link',{name:'Playoffs',exact:true}).click();
 await expect(page).toHaveURL(/\/playoffs\/$/);
 await expect(page.getByRole('heading',{level:1})).toContainText('ROAD TO STATE.');
 await expect(page.getByRole('link',{name:'Playoffs',exact:true})).toHaveAttribute('aria-current','page');
 await page.getByRole('button',{name:'All regions',exact:true}).click();
 await expect(page.locator('[data-game-card]')).toHaveCount(63);
 await page.getByRole('button',{name:'Region III',exact:true}).click();
 await expect(page.locator('[data-game-card]')).toHaveCount(15);
 await page.getByRole('combobox',{name:'Bracket round'}).selectOption('1');
 await expect(page.locator('[data-game-card]')).toHaveCount(4);
 await page.getByRole('button',{name:'List view',exact:true}).click();
 await expect(page.locator('[data-game-card]')).toHaveCount(4);
 await expect(page.getByText('MATCHUP PENDING OFFICIAL CONFIRMATION').first()).toBeVisible();
});

test('game center supports direct links, Escape, focus and back navigation',async({page})=>{
 await page.goto('/playoffs/#game=r1-bi-1');
 const dialog=page.getByRole('dialog',{name:'Game center'});
 await expect(dialog).toBeVisible();await expect(dialog).toContainText('Bi-District');
 await expect(dialog).toContainText('Official matchup pending');
 await page.getByRole('button',{name:'Close game center'}).click();
 await expect(dialog).toHaveCount(0);
 const card=page.locator('[data-game-card]').first();await card.click();
 await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(card).toBeFocused();
 await card.click();await page.goBack();await expect(dialog).toHaveCount(0);
});

test('mobile bracket scrolls internally without page overflow and respects reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/playoffs/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const rail=page.getByRole('region',{name:'Interactive tournament bracket'});
 await rail.scrollIntoViewIfNeeded();
 expect(await rail.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
 await rail.focus();await page.keyboard.press('ArrowRight');
 await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.pin-spacer')).toHaveCount(0);
 await expect(page.locator('h1')).toHaveCSS('opacity','1');
});

test('playoffs has no runtime errors or accessibility violations',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/playoffs/');
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 expect(errors).toEqual([]);
 await page.locator('[data-game-card]').first().click();
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});

test('late fonts keep the mobile hero layout stable',async({page})=>{
 await page.setViewportSize({width:412,height:823});
 await page.addInitScript(()=>{
  const state=window as Window & {__playoffCLS?:number};state.__playoffCLS=0;
  new PerformanceObserver(list=>{for(const entry of list.getEntries()){
   const shift=entry as PerformanceEntry & {hadRecentInput:boolean;value:number};
   if(!shift.hadRecentInput)state.__playoffCLS!+=shift.value;
  }}).observe({type:'layout-shift',buffered:true});
 });
 await page.route('**/*.woff2',async route=>{await new Promise(resolve=>setTimeout(resolve,700));await route.continue();});
 await page.goto('/playoffs/');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 expect(await page.evaluate(()=>(window as Window & {__playoffCLS?:number}).__playoffCLS)).toBeLessThanOrEqual(.1);
});

test('hero downloads exactly one browser-supported responsive image source',async({page})=>{
 const images:string[]=[];page.on('request',request=>{if(/\/media\/on-field-.*\.(avif|webp)$/.test(request.url()))images.push(request.url());});
 await page.goto('/playoffs/');await page.evaluate(()=>document.fonts.ready);
 expect(images).toHaveLength(1);
 expect(images[0]).toMatch(/\.(avif|webp)$/);
});

test('uses the exact owner coyote logo without inventing Anna bracket placement',async({page})=>{
 await page.goto('/playoffs/');
 const logos=page.getByRole('img',{name:'Anna Coyotes logo',exact:true});
 await expect(logos).toHaveCount(3);
 for(const logo of await logos.all()){
  await expect(logo).toHaveAttribute('src','/brand/anna/coyotes-transparent.png');
  await expect(logo).toHaveAttribute('width','256');await expect(logo).toHaveAttribute('height','276');
  await expect(logo).toHaveCSS('object-fit','contain');await expect(logo).toHaveCSS('filter','none');
 }
 await expect(page.getByText('ORIGINAL LOGO PENDING',{exact:true})).toHaveCount(0);
 await expect(page.locator('[data-game-card][data-anna]')).toHaveCount(0);
});
