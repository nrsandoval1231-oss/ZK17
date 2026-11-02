import {test,expect} from '@playwright/test';
test('no JavaScript keeps the complete collage and full Film route available',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('/');
 await expect(page.locator('#hero-title')).toBeVisible();await expect(page.locator('[data-arrival-layer="athlete"]')).toHaveCSS('opacity','1');
 await page.goto('/film/');await expect(page.locator('video')).toHaveAttribute('controls','');await expect(page.locator('.site-header')).toBeVisible();await context.close();
});
