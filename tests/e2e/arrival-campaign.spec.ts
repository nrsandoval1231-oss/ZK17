import { test, expect } from '@playwright/test';

test('skip intro reveals navigation and focuses the film section',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 await expect(page.locator('#arrival')).toHaveAttribute('data-arrival-motion','ready');
 await page.getByRole('link',{name:'Skip intro'}).click();
 await expect(page.locator('.site-header')).toBeVisible();await expect(page.locator('#film-room')).toBeFocused();
 await expect.poll(()=>page.locator('#film-room').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(5);
});

test('seven primary links navigate to separate pages and identify the active route',async({page})=>{
 for(const [path,title] of [['/film/','EVERY'],['/beyond-17/','BEYOND'],['/nil-recruiting/','THE NEXT']] as const){
  await page.goto(path);await expect(page.locator('.site-header')).toBeVisible();
  const nav=page.locator('.site-header nav');if(page.viewportSize()!.width<900)await page.getByRole('button',{name:'Menu',exact:true}).click();
  await expect(nav.locator('a')).toHaveCount(7);await expect(nav.locator('[aria-current="page"]')).toHaveAttribute('href',path);
  await expect(page.getByRole('heading',{level:1})).toContainText(title);
 }
});

test('mobile route menu traps focus and restores scroll after Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/about/');
 const menu=page.getByRole('button',{name:'Menu',exact:true});await menu.click();
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
