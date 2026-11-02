import { chromium, webkit } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const results=[];
const output='.agent/evidence/arrival';
for(const [engineName,engine] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch();
 for(const [mode,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:mode==='mobile',hasTouch:mode==='mobile'});
  const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('.mp4'))requests.push(r.url())});
  const settle=async()=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1300)};
  const geometry=async id=>page.locator('#'+id).evaluate(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,scroll:scrollY,height:innerHeight}));
  await page.goto('http://127.0.0.1:3100/',{waitUntil:'networkidle'});await settle();
  const initialRequests=requests.length;
  await page.screenshot({path:`${output}/critic-${engineName}-${mode}-hero.png`});
  const anchors=[];
  for(const id of ['film-room','journey','off-field']){
   await page.goto('http://127.0.0.1:3100/#'+id,{waitUntil:'networkidle'});await settle();
   anchors.push({id,...await geometry(id),filmCopyVisible:await page.locator('#film-title').isVisible()});
   await writeFile(`${output}/critic-${engineName}-${mode}-anchors.json`,JSON.stringify(anchors,null,2));
  }
  await page.goto('http://127.0.0.1:3100/#film-room',{waitUntil:'networkidle'});await settle();
  const video=page.locator('#film-room video');
  const playback1=await video.evaluate(v=>({time:v.currentTime,paused:v.paused,ready:v.readyState,muted:v.muted,src:v.currentSrc}));
  await page.waitForTimeout(1200);const playback2=await video.evaluate(v=>({time:v.currentTime,paused:v.paused,ready:v.readyState,muted:v.muted,src:v.currentSrc}));
  await page.screenshot({path:`${output}/critic-${engineName}-${mode}-film.png`});
  const opener=page.getByRole('button',{name:'WATCH WITH SOUND'});
  const soundBounds=await opener.boundingBox();await opener.click();
  const dialog=page.getByRole('dialog');const native=await dialog.locator('video').evaluate(v=>({controls:v.controls,muted:v.muted,autoplay:v.autoplay,src:v.querySelector('source')?.src}));
  await page.keyboard.press('Escape');await page.waitForTimeout(200);
  const focusReturned=await opener.evaluate(e=>document.activeElement===e);
  if(mode==='mobile')await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.locator('#site-nav').getByRole('link',{name:'Off Field',exact:true}).click();await settle();
  const inPageAnchor=await geometry('off-field');
  await page.goto('http://127.0.0.1:3100/#film-room',{waitUntil:'networkidle'});await settle();
  const pinBefore=await page.locator('.pin-spacer').count();
  await page.emulateMedia({reducedMotion:'reduce'});await settle();
  const reduced={pins:await page.locator('.pin-spacer').count(),src:await video.getAttribute('src'),copy:await page.locator('#film-title').isVisible()};
  await page.emulateMedia({reducedMotion:'no-preference'});await settle();
  const motionRestored={pins:await page.locator('.pin-spacer').count(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
  const widths=[];
  for(const w of [320,768,1024]){await page.setViewportSize({width:w,height:600});await settle();widths.push({width:w,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),pins:await page.locator('.pin-spacer').count()});}
  results.push({engine:engineName,mode,initialRequests,anchors,playback1,playback2,soundBounds,native,focusReturned,inPageAnchor,pinBefore,reduced,motionRestored,widths,errors});
  await writeFile(`${output}/critic-runtime.json`,JSON.stringify({timestamp:new Date().toISOString(),results},null,2));
  console.log(`${engineName} ${mode} complete`);
  await context.close();
 }
 await browser.close();
}
await writeFile(`${output}/critic-runtime.json`,JSON.stringify({timestamp:new Date().toISOString(),results},null,2));
console.log(JSON.stringify(results,null,2));
