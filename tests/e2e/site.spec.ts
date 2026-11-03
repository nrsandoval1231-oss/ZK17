import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('dedicated routes load directly without runtime errors or public implementation labels',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const path of ['/','/film/','/highlights/','/about/','/nil-recruiting/','/recruiting/','/playoffs/']){
  const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page.locator('main')).toBeVisible();
  expect(await page.locator('body').innerText()).not.toMatch(/PREVIEW CROP|Original files pending|WATCH WITH SOUND|PHOTO NEEDED|original\s+(?:photo\s+)?pending/i);
 }
 expect(errors).toEqual([]);
});

test('reduced motion remains static and new routes pass accessibility checks',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const path of ['/','/film/','/highlights/','/about/','/nil-recruiting/']){
  await page.goto(path);await expect(page.locator('.pin-spacer')).toHaveCount(0);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 }
});

test('navigation supports browser back and forward',async({page})=>{
 await page.goto('/about/');if(page.viewportSize()!.width<900)await page.getByRole('button',{name:'MENU',exact:true}).click();
 await page.locator('.site-header nav').getByRole('link',{name:/FILM/,exact:false}).click();await expect(page).toHaveURL(/\/film\/$/);
 await page.goBack();await expect(page).toHaveURL(/\/about\/$/);await page.goForward();await expect(page).toHaveURL(/\/film\/$/);
});

test('NIL separates owner-approved inquiry intents and links to the public contact page',async({page})=>{
 await page.goto('/nil-recruiting/');await expect(page.getByRole('heading',{name:'NIL PARTNERSHIPS'})).toBeVisible();await expect(page.getByRole('heading',{name:'RECRUITING',exact:true})).toBeVisible();
 await expect(page.locator('form,input[type="email"]')).toHaveCount(0);
 await expect(page.getByRole('link',{name:'PARTNERSHIP INQUIRY'})).toHaveAttribute('href','mailto:info@teamsportsagency.com?subject=NIL%20inquiry%20for%20Zephyr%20Kreye');
 await expect(page.getByRole('link',{name:/RECRUITING INQUIRY/})).toHaveAttribute('href','mailto:info@teamsportsagency.com?subject=Recruiting%20inquiry%20for%20Zephyr%20Kreye');
 await expect(page.getByRole('link',{name:/CONTACT PAGE/})).toHaveAttribute('href','https://www.teamsportsagency.com/contact-us');
 await expect(page.getByRole('link',{name:'VIEW RECRUITING SNAPSHOT'})).toHaveAttribute('href','/recruiting/');
});
