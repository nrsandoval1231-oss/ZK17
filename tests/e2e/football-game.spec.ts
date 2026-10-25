import { test, expect } from '@playwright/test';
test('passing game starts, accepts a real throw, advances, pauses, restarts, and exits',async({page})=>{
 await page.goto('/#offfield-personal');await page.getByRole('button',{name:'PRESS START'}).click();
 const dialog=page.getByRole('dialog',{name:'POCKET PASS'});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'START DRIVE'}).click();
 const field=dialog.getByRole('application',{name:/Football field/});const bounds=await field.boundingBox();if(!bounds)throw new Error('Football field is not visible');await field.click({position:{x:bounds.width*.52,y:bounds.height*.32}});await dialog.getByRole('button',{name:'THROW'}).click();
 await expect(dialog.locator('[class*="hud"]')).toContainText('SNAP 1/12');await expect(dialog.getByText(/COMPLETE|INCOMPLETE|INTERCEPTED/)).toBeVisible();
 await dialog.getByRole('button',{name:'NEXT PLAY'}).click();await dialog.getByRole('button',{name:'PAUSE'}).click();await expect(dialog.getByText('PAUSED',{exact:true})).toBeVisible();await dialog.getByRole('button',{name:'RESUME'}).click();await dialog.getByRole('button',{name:'RESTART'}).click();await expect(dialog.getByRole('button',{name:'START DRIVE'})).toBeVisible();
 await dialog.getByRole('button',{name:'EXIT'}).click();await expect(dialog).toBeHidden();await expect(page.getByRole('button',{name:'PRESS START'})).toBeFocused();
});
test('phone game controls remain inside the viewport and title is renamed',async({page})=>{
 await page.setViewportSize({width:320,height:780});await page.goto('/#offfield-personal');await expect(page.locator('#offfield-personal').getByRole('heading',{name:'ZEPHYR KREYE',exact:true})).toBeVisible();await expect(page.getByText('PLAYER 17',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'PRESS START'}).click();const dialog=page.getByRole('dialog',{name:'POCKET PASS'});await dialog.getByRole('button',{name:'START DRIVE'}).click();const bounds=await dialog.evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth,height:el.scrollHeight,clientHeight:el.clientHeight}));expect(bounds.scroll).toBeLessThanOrEqual(bounds.client+1);expect(bounds.height).toBeLessThanOrEqual(bounds.clientHeight+1);
});
test('field keyboard controls, hidden pause, and scroll-lock cleanup work',async({page})=>{
 await page.goto('/#offfield-personal');await page.getByRole('button',{name:'PRESS START'}).click();const dialog=page.getByRole('dialog',{name:'POCKET PASS'});await dialog.getByRole('button',{name:'START DRIVE'}).click();
 const field=dialog.getByRole('application',{name:/Football field/});await field.focus();await page.keyboard.press('ArrowUp');await page.keyboard.press('Space');await expect(dialog.locator('[class*="hud"]')).toContainText('SNAP 1/12');await dialog.getByRole('button',{name:'NEXT PLAY'}).click();
 // Handler-level browser check: dispatch the visibility event and verify pause; this does not claim a real tab-switch test.
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});await expect(dialog.getByText('PAUSED',{exact:true})).toBeVisible();
 await dialog.getByRole('button',{name:'EXIT'}).click();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');await expect(page.getByRole('button',{name:'PRESS START'})).toBeFocused();
});
