import { test, expect } from '@playwright/test';

test('scroll to explore completes the intro, reveals navigation and focuses the film section',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 const hero=page.locator('#arrival');
 const explore=hero.locator('a[href="#film-room"]');
 await expect(hero).toHaveAttribute('data-arrival-motion','ready');
 await expect(explore).toBeHidden();
 await expect(page.locator('.site-header')).toBeHidden();
 await expect(page.getByText('Skip intro',{exact:true})).toHaveCount(0);
 const distance=await hero.evaluate(el=>parseFloat(el.parentElement!.style.paddingBottom));
 expect(distance).toBeGreaterThan(0);
 // The remaining section link enters with the statement at .86–.94.
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*.96);
 await expect(explore).toHaveAccessibleName('SCROLL TO EXPLORE');
 await expect(explore).toBeVisible();
 await expect(explore).toHaveCSS('opacity','1');
 await expect(page.locator('.site-header')).toBeHidden();
 await expect(page.locator('html')).toHaveAttribute('data-intro-complete','false');
 await explore.click();
 await expect(page.locator('.site-header')).toBeVisible();await expect(page.locator('#film-room')).toBeFocused();
 await expect.poll(()=>page.locator('#film-room').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(5);
 await expect(page.locator('html')).toHaveAttribute('data-intro-complete','true');
 await expect(page.locator('.site-header').getByRole('button',{name:'WATCH FILM',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'WATCH THE FILM',exact:true})).toHaveCount(0);
});

test('six primary links navigate to separate pages and identify the active route',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [path,title] of [['/','MAKE THEM'],['/film/','EVERY'],['/highlights/','HIGHLIGHTS'],['/playoffs/','ROAD TO STATE'],['/about/','ZEPHYR'],['/nil-recruiting/','THE NEXT']] as const){
  await page.goto(path);await expect(page.locator('.site-header')).toBeVisible();
  const nav=page.locator('.site-header nav');if(page.viewportSize()!.width<900)await page.getByRole('button',{name:'MENU',exact:true}).click();
  await expect(nav.locator('a')).toHaveCount(6);await expect(nav.locator('[aria-current="page"]')).toHaveAttribute('href',path);
  await expect(nav.locator('[aria-current="page"]')).toBeVisible();
  if(page.viewportSize()!.width<900){
   await page.keyboard.press('Escape');
   await expect(page.getByRole('button',{name:'MENU',exact:true})).toBeFocused();
  }
  await expect(page.getByRole('heading',{level:1})).toContainText(title);
 }
});

test('mobile route menu traps focus and restores scroll after Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/about/');
 const menu=page.getByRole('button',{name:'MENU',exact:true});await menu.click();
 await expect(page.locator('#route-nav .nav-close')).toBeFocused();
 await page.keyboard.press('Shift+Tab');await expect(page.locator('#route-nav a').last()).toBeFocused();
 await page.keyboard.press('Escape');await expect(menu).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');
});

test('static responsive frames preserve all five authentic photo layers',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:844});await page.goto('/');
  for(const name of ['closeup','rear','white','running','athlete']){
   const photo=page.locator(`[data-arrival-layer="${name}"]`);await expect(photo).toBeVisible();
   const box=(await photo.boundingBox())!;expect(box.width).toBeGreaterThan(50);expect(box.height).toBeGreaterThan(50);
  }
  await expect(page.locator('#hero-title')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test('homepage keeps the approved field photo and no Hudl player',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('#on-field .field-photo')).toBeVisible();
 await expect(page.locator('iframe[src*="hudl.com"]')).toHaveCount(0);
 await expect(page.locator('.site-header').getByRole('button',{name:'WATCH FILM',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'WATCH THE FILM',exact:true})).toHaveCount(0);
});
