import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = 'artifacts/cinema-framing';
await mkdir(output, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {});
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
 const headerBottom=await page.locator('.site-header').evaluate(el=>Math.max(0,el.getBoundingClientRect().bottom));
 assert(last.y>=headerBottom-1);
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
 // Resize both dimensions, then verify the recomputed frame and reverse crop.
 const seek=async complete=>page.locator('#film-room').evaluate((el,complete)=>{
  const top=(el.closest('.pin-spacer')??el).getBoundingClientRect().top+scrollY;
  const offset=innerWidth>=900?(complete?innerHeight*1.85:0):(complete?0:-innerHeight*.85);
  scrollTo({top:top+offset,behavior:'instant'});
 },complete);
 const state=async()=>page.locator('#film-room video').evaluate(el=>{
  const r=el.getBoundingClientRect();const stage=el.closest('section').getBoundingClientRect();
  const mask=el.closest('section').querySelector('svg');
  return {x:r.x,y:r.y,width:r.width,height:r.height,stageWidth:stage.width,stageHeight:stage.height,
   controls:el.controls,tabIndex:el.tabIndex,transform:getComputedStyle(el).transform,
   headerBottom:Math.max(0,document.querySelector('.site-header').getBoundingClientRect().bottom),
   stageX:stage.x,stageY:stage.y,maskOpacity:getComputedStyle(mask).opacity,maskTransform:getComputedStyle(mask).transform,
   src:el.currentSrc,time:el.currentTime};
 });
 const resizedViewport={width:width-10,height:height-140};
 await page.setViewportSize(resizedViewport);await page.waitForTimeout(900);
 await seek(true);await page.waitForTimeout(1100);
 const resized=await state();
 assert(resized.width>120&&resized.height>0&&Math.abs(resized.width/resized.height-.8)<.01);
 assert(resized.x>0&&resized.x+resized.width<resizedViewport.width+1&&resized.y>=-1&&resized.y+resized.height<=resizedViewport.height+1);
 assert(Math.abs(resized.x+resized.width/2-resizedViewport.width/2)<1);
 assert(Math.abs(resized.width-last.width)>1);assert.equal(resized.controls,true);assert.equal(resized.tabIndex,0);
 assert(resized.y>=resized.headerBottom-1);
 assert.equal(resized.transform,'matrix(1, 0, 0, 1, 0, 0)');assert.equal(resized.maskOpacity,'0');
 assert.equal(resized.src,last.src);assert(resized.time>=last.time);
 await page.screenshot({path:`${output}/${width}-resized-final.png`});
 await seek(false);await page.waitForTimeout(1100);
 const reversed=await state();
 assert.equal(reversed.controls,false);assert.equal(reversed.tabIndex,-1);assert.equal(reversed.maskOpacity,'1');
 assert.equal(reversed.maskTransform,'matrix(1, 0, 0, 1, 0, 0)');
 assert(reversed.x<=reversed.stageX+1&&reversed.x+reversed.width>=reversed.stageX+reversed.stageWidth-1);
 assert(reversed.y<=reversed.stageY+1&&reversed.y+reversed.height>=reversed.stageY+reversed.stageHeight-1);
 assert.equal(reversed.src,last.src);assert(reversed.time>=resized.time);
 await page.screenshot({path:`${output}/${width}-resized-reverse.png`});
 await page.setViewportSize({width,height});await page.waitForTimeout(900);
 await seek(true);await page.waitForTimeout(1100);
 const restored=await state();
 assert(Math.abs(restored.width-last.width)<1);assert.equal(restored.controls,true);
 assert.equal(restored.transform,'matrix(1, 0, 0, 1, 0, 0)');
 await page.locator('#film-room video').evaluate(el=>el.pause());
 await page.locator('#film-room video').hover();
 await page.waitForTimeout(500);
 await page.screenshot({path:`${output}/${width}-final-controls.png`});
 await page.goto('http://127.0.0.1:3100/playoffs/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const logo=await page.getByRole('img',{name:'Anna Coyotes logo',exact:true}).first().boundingBox();
 const title=await page.locator('#playoffs-title').boundingBox();
 if(width>700)assert(logo.x+logo.width<title.x);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 assert(!overflow);assert.equal(errors.length,0);
 await page.screenshot({path:`${output}/${width}-playoffs.png`});
 results.push({width,height,beats,headerBottom,released,resizedViewport,resized,reversed,restored,logo,title,overflow,errors});await page.close();
}
const shortViewports=[];
for(const height of [180,240,360]){
 const page=await browser.newPage({viewport:{width:1024,height}});
 await page.goto('http://127.0.0.1:3100/#film-room',{waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1500);
 const state=await page.locator('#film-room video').evaluate(el=>{
  const r=el.getBoundingClientRect();const header=document.querySelector('.site-header').getBoundingClientRect();
  return {width:r.width,height:r.height,x:r.x,y:r.y,bottom:r.bottom,headerBottom:header.bottom,
   controls:el.controls,transform:getComputedStyle(el).transform};
 });
 assert(state.width>=120&&state.height>0&&state.y>=Math.max(0,state.headerBottom)-1&&state.bottom<=height+1);
 assert.equal(state.controls,true);assert.equal(state.transform,'matrix(1, 0, 0, 1, 0, 0)');
 await page.locator('#film-room video').evaluate(el=>el.pause());await page.locator('#film-room video').hover();
 await page.waitForTimeout(500);
 await page.screenshot({path:`${output}/1024x${height}-final-controls.png`});
 shortViewports.push({viewport:{width:1024,height},...state});await page.close();
}
await writeFile(`${output}/short-viewports.json`,JSON.stringify(shortViewports,null,2));
await browser.close();
await writeFile(`${output}/validation.json`,JSON.stringify(results,null,2));
console.log('Validated scroll, zoom-out, release, reverse, resize and Playoffs at all four widths, plus 180/240/360px short viewports.');
