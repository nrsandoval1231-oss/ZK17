import { chromium, webkit } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const rows=[];
for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch();
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:844},javaScriptEnabled:false});
  const page=await context.newPage();await page.goto('http://127.0.0.1:3100/#film-room');
  rows.push({engine:name,width,noJavaScript:true,hero:await page.locator('#hero-title').isVisible(),film:await page.locator('#film-title').isVisible(),sound:await page.getByRole('button',{name:'WATCH WITH SOUND'}).isVisible(),videoSrc:await page.locator('#film-room video').getAttribute('src'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});await page.waitForTimeout(1000);
 const initial=await page.locator('#film-room video').getAttribute('src');
 await page.goto('http://127.0.0.1:3100/#film-room');await page.waitForTimeout(1800);
 const playing=await page.locator('#film-room video').evaluate(v=>({time:v.currentTime,paused:v.paused}));
 await page.goto('http://127.0.0.1:3100/#off-field');await page.waitForTimeout(1200);
 rows.push({engine:name,initialVideoSrc:initial,playing,offscreen:await page.locator('#film-room video').evaluate(v=>({src:v.getAttribute('src'),paused:v.paused}))});
 await context.close();await browser.close();
}
await writeFile('.agent/evidence/arrival/critic-fallback.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows,null,2));
