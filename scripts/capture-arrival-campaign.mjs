import { chromium, webkit, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

const output = 'artifacts/arrival-campaign';
const baseURL = process.env.ARRIVAL_CAPTURE_URL ?? 'http://127.0.0.1:3100';
await mkdir(output, {recursive:true});
const results=[];
const launchOptions = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {};

async function geometry(page) {
 return page.locator('#arrival').evaluate(el=>{
  const spacer=el.parentElement?.classList.contains('pin-spacer')?el.parentElement:null;
  const box=el.getBoundingClientRect();const header=document.querySelector('.site-header').getBoundingClientRect();
  return {top:(spacer??el).getBoundingClientRect().top+scrollY,headerHeight:header.height,headerBottom:Math.max(0,header.bottom),distance:spacer?parseFloat(getComputedStyle(spacer).paddingBottom)||0:0,box:box.toJSON()};
 });
}
async function state(page) {
 return page.locator('#arrival').evaluate(el=>{
  const read=node=>{if(!node)return null;const r=node.getBoundingClientRect();const s=getComputedStyle(node);return {...r.toJSON(),opacity:Number(s.opacity),transform:s.transform,visibility:s.visibility};};
  const image=el.querySelector('[data-arrival-layer="athlete"] img');
  let face=null,number=null;
  if(image){
   const r=image.getBoundingClientRect();const ratio=Number(image.getAttribute('width'))/Number(image.getAttribute('height'));
   const width=Math.min(r.width,r.height*ratio),height=width/ratio;const x=r.x+(r.width-width)/2,y=r.y+(r.height-height)/2;
   // Source01 regions in the SVG's330×945 viewport, measured from the supplied photo.
   const region=(rx,ry,rw,rh)=>({x:x+width*rx,y:y+height*ry,width:width*rw,height:height*rh});
   if(image.getAttribute('src')?.includes('front-')){face=region(.24,.01,.43,.17);number=region(.29,.27,.39,.14);}
  }
  return {hero:read(el),stadium:read(el.querySelector('[data-arrival-layer="stadium"]')),athlete:read(el.querySelector('[data-arrival-layer="athlete"]')),rear:read(el.querySelector('[data-arrival-layer="rear"]')),mark:read(el.querySelector('[data-arrival-layer="mark"]')),lines:[...el.querySelectorAll('#hero-title span')].map(read),footer:read(el.querySelector('[class*="footer"]')),watch:read(el.querySelector('button')),face,number,image:image?.currentSrc};
 });
}
function visibleBox(box,viewport,headerBottom=0) {
 assert(box&&Number.isFinite(box.width)&&box.width>0);
 assert(box.x>=-1&&box.x+box.width<=viewport.width+1);
 assert(box.y>=headerBottom-1&&box.y+box.height<=viewport.height+1);
}
async function complete(page) {
 const g=await geometry(page);
 if(g.distance)await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.top-g.headerHeight+g.distance);
 await page.waitForTimeout(1000);
 return state(page);
}

for(const [name,engine,viewport,touch] of [
 ['desktop',chromium,{width:1536,height:1024},false],
 ['laptop',chromium,{width:1440,height:900},false],
 ['tablet',chromium,{width:768,height:1024},true],
 ['mobile',chromium,{width:390,height:844},true],
 ['android',chromium,{width:412,height:915},true],
 ['small',chromium,{width:320,height:568},true],
 ['landscape',chromium,{width:844,height:390},true],
 ['iphone-webkit',webkit,{width:390,height:844},true],
 ]) {
 if(process.env.ARRIVAL_CAPTURE_CASE && process.env.ARRIVAL_CAPTURE_CASE!==name)continue;
 const browser=await engine.launch(engine===chromium?launchOptions:{});
 const context=await browser.newContext({viewport,isMobile:touch,hasTouch:touch,deviceScaleFactor:1});const page=await context.newPage();
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const failed=[];page.on('response',response=>{if(response.status()>=400)failed.push({url:response.url(),status:response.status()});});
 await page.goto(baseURL+'/',{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(400);
 const g=await geometry(page);const initial=await state(page);
 await page.screenshot({path:`${output}/${name}-initial.png`});
 if(g.distance){
  assert(initial.stadium.opacity<.01);assert(initial.rear.opacity>initial.athlete.opacity);assert(initial.lines.every(line=>line.opacity===0));
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.top-g.headerHeight+g.distance*.5);await page.waitForTimeout(900);
  await page.screenshot({path:`${output}/${name}-midpoint.png`});
 }
 const final=await complete(page);const finalGeometry=await geometry(page);
 assert(final.lines.every(line=>line.opacity>=.99));assert(final.athlete.opacity>=.99);assert(final.stadium.opacity>0&&final.stadium.opacity<=.2);
 for(const line of final.lines)visibleBox(line,viewport,finalGeometry.headerBottom);
 visibleBox(final.footer,viewport);visibleBox(final.watch,viewport);
 visibleBox(final.face,viewport,finalGeometry.headerBottom);visibleBox(final.number,viewport,finalGeometry.headerBottom);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.equal(await page.locator('#arrival video').count(),0);
 await page.screenshot({path:`${output}/${name}-final.png`});
 let release=null,resized=null,reverse=null;
 if(g.distance){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.top-g.headerHeight+g.distance+1);await page.waitForTimeout(750);
  release=await state(page);assert(Math.abs(release.hero.height-final.hero.height)<1);assert(Math.abs(release.hero.y-(final.hero.y-1))<2);
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.top-g.headerHeight);await page.waitForTimeout(900);
  reverse=await state(page);assert(reverse.stadium.opacity<.01);assert(reverse.athlete.opacity<.01);assert(reverse.lines.every(line=>line.opacity<.01));
  await page.screenshot({path:`${output}/${name}-reverse.png`});
  await page.setViewportSize({width:viewport.width-60,height:viewport.height-100});await page.waitForTimeout(500);resized=await complete(page);
  visibleBox(resized.face,page.viewportSize(),(await geometry(page)).headerBottom);visibleBox(resized.number,page.viewportSize(),(await geometry(page)).headerBottom);
  assert(resized.lines.every(line=>line.opacity>=.99));await page.screenshot({path:`${output}/${name}-resized.png`});
  await page.setViewportSize(viewport);await page.waitForTimeout(500);await complete(page);
 }
 const axe = await new AxeBuilder({page}).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
 await page.goto(baseURL+'/#film-room',{waitUntil:'load'});
 const video=page.locator('#film-room video');await expect(video).toHaveJSProperty('controls',true);
 await expect.poll(()=>video.evaluate(el=>getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 const film=await video.boundingBox();const headerBottom=await page.locator('.site-header').evaluate(el=>Math.max(0,el.getBoundingClientRect().bottom));
 visibleBox(film,viewport,headerBottom);
 await video.evaluate(el=>el.pause());await page.mouse.move(film.x+film.width/2,film.y+film.height-20);await page.waitForTimeout(400);
 await expect(video).toHaveJSProperty('controls',true);await page.screenshot({path:`${output}/${name}-film-final.png`});
 await page.goto(baseURL+'/playoffs/',{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(800);
 const logo=await page.getByRole('img',{name:'Anna Coyotes logo',exact:true}).first().boundingBox();const heading=await page.locator('#playoffs-title').boundingBox();
 if(viewport.width>700)assert(logo.x+logo.width<heading.x);else assert(logo.y+logo.height<heading.y);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:`${output}/${name}-playoffs.png`});
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 results.push({name,viewport,touch,pinned:!!g.distance,initial,final,release,resized,reverse,film,logo,heading,axeViolations:axe.violations.length,errors,failed});
 await context.close();await browser.close();
}
for(const [name,viewport,javaScriptEnabled,reducedMotion] of [
 ['desktop-no-js',{width:1536,height:1024},false,'no-preference'],
 ['mobile-no-js',{width:390,height:844},false,'no-preference'],
 ['desktop-reduced',{width:1536,height:1024},true,'reduce'],
 ['mobile-reduced',{width:390,height:844},true,'reduce'],
 ]){
 if(process.env.ARRIVAL_CAPTURE_CASE && process.env.ARRIVAL_CAPTURE_CASE!==name)continue;
 const browser=await chromium.launch(launchOptions);const context=await browser.newContext({viewport,javaScriptEnabled,reducedMotion});const page=await context.newPage();
 await page.goto(baseURL+'/#arrival',{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(350);
 const staticState=await state(page);assert(staticState.lines.every(line=>line.opacity===1));
 for(const line of staticState.lines)visibleBox(line,viewport);visibleBox(staticState.footer,viewport);visibleBox(staticState.watch,viewport);
 assert.equal(await page.locator('#arrival').evaluate(el=>el.parentElement?.classList.contains('pin-spacer')),false);
 await page.screenshot({path:`${output}/${name}-final.png`});results.push({name,viewport,javaScriptEnabled,reducedMotion,staticState});await context.close();await browser.close();
}
await writeFile(`${output}/validation.json`,JSON.stringify(results,null,2)+'\n');
console.log(`Validated ${results.length} hero scenarios, original film framing, Playoffs placement, keyboard-safe/reduced/no-JS fallbacks, source regions, resize/reverse/release, no overflow/runtime errors, and axe.`);
