import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = 'artifacts/cinema-framing';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium' });
const results = [];
for (const [width, height] of [[1440,900],[1920,1080],[768,1024],[390,844]]) {
 const page = await browser.newPage({ viewport: { width, height } });
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3100/', { waitUntil: 'networkidle' });
 await page.evaluate(()=>document.fonts.ready);
 const stage=await page.locator('#film-room').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.clientHeight}));
 const start=width>=900?stage.top:stage.top-height*.85;
 const end=width>=900?start+height*1.85:stage.top;
 const beats=[];
 for(const progress of [0,.3,.54,.7,.9,1]){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+(end-start)*progress);
  await page.waitForTimeout(1100);
  const state=await page.locator('#film-room video').evaluate(el=>{
   const r=el.getBoundingClientRect();const s=getComputedStyle(el);
   return {x:r.x,y:r.y,width:r.width,height:r.height,transform:s.transform,fit:s.objectFit,controls:el.controls,time:el.currentTime,native:[el.videoWidth,el.videoHeight],src:el.currentSrc};
  });
  beats.push({progress,...state});
  await page.screenshot({path:`${output}/${width}-beat-${progress}.png`});
 }
 const last=beats.at(-1);
 assert.equal(last.fit,'contain');assert.equal(last.controls,true);
 assert(last.x>0&&last.x+last.width<width+1&&last.y>=0&&last.y+last.height<=height);
 assert.equal(last.transform,'matrix(1, 0, 0, 1, 0, 0)');
 const scale=b=>Number(b.transform.match(/matrix\(([^,]+)/)?.[1]||1);
 assert(scale(beats[3])>scale(beats[4]));
 // One pixel beyond release changes only normal document position.
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),end+1);
 await page.waitForTimeout(900);
 const released=await page.locator('#film-room video').boundingBox();
 assert(Math.abs(released.width-last.width)<1&&Math.abs(released.y-(last.y-1))<2);
 // Resize at completion and reverse to the opening: no stale scale or controls.
 await page.setViewportSize({width:width-10,height});await page.waitForTimeout(900);
 await page.setViewportSize({width,height});await page.waitForTimeout(900);
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start);
 await page.waitForTimeout(1100);
 assert.equal(await page.locator('#film-room video').evaluate(el=>el.controls),false);
 await page.goto('http://127.0.0.1:3100/playoffs/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const logo=await page.getByRole('img',{name:'Anna Coyotes logo',exact:true}).first().boundingBox();
 const title=await page.locator('#playoffs-title').boundingBox();
 if(width>700)assert(logo.x+logo.width<title.x);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 assert(!overflow);assert.equal(errors.length,0);
 await page.screenshot({path:`${output}/${width}-playoffs.png`});
 results.push({width,height,beats,released,logo,title,overflow,errors});await page.close();
}
await browser.close();
await writeFile(`${output}/validation.json`,JSON.stringify(results,null,2));
console.log('Validated scroll, zoom-out, release, reverse, resize and Playoffs at all four widths.');
