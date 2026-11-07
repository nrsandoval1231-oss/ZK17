import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('five chapters preserve opening, sourced season statistics and dedicated destinations',async({page})=>{
 await page.goto('/');
 await expect(page.locator('#on-field')).toBeAttached();
 expect(await page.locator('main section').evaluateAll(items=>items.map(item=>item.id))).toEqual(['arrival','film-room','on-field','off-field','follow-the-journey']);
 await expect(page.locator('footer#closing')).toBeAttached();
 await expect(page.getByText(/preview crop/i)).toHaveCount(0);
 await expect(page.locator('#journey,[data-field-pin-spacer],.journey-stage,.verified-milestones')).toHaveCount(0);
 await expect(page.locator('a[href="#journey"]')).toHaveCount(0);
 await expect(page.locator('#on-field video,#on-field iframe,#on-field button')).toHaveCount(0);
 const strip=page.locator('[aria-label="2026 season statistics"]');
 await expect(strip.locator('strong')).toHaveCount(4);
 await expect(strip).toContainText('TOTAL YARDS');
 await expect(strip).toContainText('TOTAL TD');
 await expect(strip).toContainText('QB RATING');
 await expect(strip).toContainText('COMP %');
 await expect(strip.locator('strong')).toHaveText(['2,001','28','106.4','64.8%']);
 await expect(page.getByRole('navigation',{name:'Verified social profiles'}).getByRole('link')).toHaveText(['X (opens in a new tab)','Instagram (opens in a new tab)','TikTok (opens in a new tab)']);
 for(const route of ['/about/','/film/','/highlights/','/playoffs/','/nil-recruiting/','/recruiting/']){
  const response=await page.goto(route);
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
 }
});

test('PLAYER17 keeps all approved interests, Escape and return focus',async({page})=>{
 await page.goto('/#off-field');
 for(const [category,pick] of [['Games','Madden'],['Movies','A Bronx Tale'],['TV Shows','The Sopranos'],['Anime','Berserk']]){
  const button=page.getByRole('button',{name:category,exact:true});
  await button.click();
  await expect(page.locator('#player17-picks')).toContainText(pick);
  await expect(page.getByRole('button',{name:'BACK TO MENU'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(page.locator('#player17-picks')).toBeHidden();
 }
});

test('photo journal supports keyboard, pagination and normal vertical scrolling',async({page,browserName,isMobile})=>{
 await page.goto('/#follow-the-journey');
 const rail=page.getByRole('region',{name:'Zephyr’s photo journal'});
 await expect.poll(()=>rail.evaluate(element=>element.scrollLeft)).toBeGreaterThan(100);
 await rail.focus();
 await page.keyboard.press('End');
 await expect(page.getByRole('button',{name:'Show photograph 5'})).toHaveAttribute('aria-current','true');
 await page.keyboard.press('Home');
 await expect(page.getByRole('button',{name:'Show photograph 1'})).toHaveAttribute('aria-current','true');
 await page.getByRole('button',{name:'Show photograph 3'}).click();
 await expect(page.getByRole('button',{name:'Show photograph 3'})).toHaveAttribute('aria-current','true');
 const before=await page.evaluate(()=>scrollY);
 await rail.hover();
 if(browserName==='webkit' && isMobile) await page.keyboard.press('PageDown');
 else await page.mouse.wheel(0,350);
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+100);
});

test('responsive chapters keep images loaded, no page overflow and accessible controls',async({page})=>{
 test.slow(); // Six viewport changes, 24 image-decode checks and an axe audit.
 await page.emulateMedia({reducedMotion:'reduce'});
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 for(const width of [375,390,430,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const id of ['on-field','off-field','follow-the-journey','closing']){
   await page.locator(`#${id}`).scrollIntoViewIfNeeded();
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.locator(`#${id} img`).evaluateAll(images=>Promise.all(images.map(image=>(image as HTMLImageElement).decode())));
  }
 }
 expect(errors).toEqual([]);
 const result=await new AxeBuilder({page}).include('#on-field').include('#off-field').include('#follow-the-journey').include('#closing').analyze();
 expect(result.violations).toEqual([]);
});

test('native touch swipe moves the journal while a vertical gesture scrolls the document',async({page,context,browserName,isMobile})=>{
 test.skip(browserName!=='chromium'||!isMobile,'CDP gesture coverage uses the mobile Chromium project.');
 await page.goto('/#follow-the-journey');
 const rail=page.getByRole('region',{name:'Zephyr’s photo journal'});
 await rail.scrollIntoViewIfNeeded();
 const box=await rail.boundingBox();
 expect(box).not.toBeNull();
 const cdp=await context.newCDPSession(page);
 const swipe=async(x:number,y:number,dx:number,dy:number)=>{
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 };
 const before=await rail.evaluate(element=>element.scrollLeft);
 await swipe(box!.x+box!.width*.8,box!.y+box!.height/2,-box!.width*.5,0);
 await expect.poll(()=>rail.evaluate(element=>element.scrollLeft)).toBeGreaterThan(before+50);
 const vertical=await page.evaluate(()=>scrollY);
 const nextBox=await rail.boundingBox();
 await swipe(nextBox!.x+nextBox!.width/2,nextBox!.y+nextBox!.height*.8,0,-220);
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(vertical+50);
 await cdp.detach();
});

test('footer Back to Top returns to the start of the cinematic Arrival pin',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 await expect(page.locator('#arrival')).toHaveAttribute('data-arrival-motion','ready');
 const back=page.getByRole('link',{name:'BACK TO TOP',exact:true});
 await back.scrollIntoViewIfNeeded();
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(1000);
 await back.click();
 await expect(page).toHaveURL(/#arrival$/);
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);
});
