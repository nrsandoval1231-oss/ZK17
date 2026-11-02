import { chromium, webkit, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, rename, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { captureSelection, writeJSONAtomic } from './lib/arrival-evidence.mjs';

export const captureCases = [
 {name:'desktop',viewport:{width:1440,height:900}},
 {name:'laptop',viewport:{width:1536,height:1024}},
 {name:'tablet',viewport:{width:768,height:1024},touch:true},
 {name:'mobile',viewport:{width:390,height:844},touch:true},
 {name:'android',viewport:{width:412,height:915},touch:true},
 {name:'small',viewport:{width:320,height:568},touch:true},
 {name:'landscape',viewport:{width:844,height:390},touch:true},
 {name:'iphone-webkit',viewport:{width:390,height:844},touch:true,webkit:true},
 {name:'desktop-no-js',viewport:{width:1440,height:900},javaScriptEnabled:false},
 {name:'mobile-no-js',viewport:{width:390,height:844},touch:true,javaScriptEnabled:false},
 {name:'desktop-reduced',viewport:{width:1440,height:900},reducedMotion:'reduce'},
 {name:'mobile-reduced',viewport:{width:390,height:844},touch:true,reducedMotion:'reduce'},
];
const layers=['lights','smoke-back','smoke-front','silhouette','athlete','running','rear','white'];
// Timeline lasts 16 relative units. Samples sit inside each development/hold,
// including all three individual montage photographs rather than one collage.
export const beatSamples = [
 ['darkness-midpoint',1/16,'darkness'],['darkness-hold',1.8/16,'darkness'],
 ['lights-midpoint',3/16,'lights'],['lights-hold',3.85/16,'lights'],
 ['smoke-midpoint',5/16,'smoke'],['smoke-hold',5.85/16,'smoke'],
 ['silhouette-midpoint',6.8/16,'silhouette'],['silhouette-hold',7.8/16,'silhouette'],
 ['hero-midpoint',9/16,'athlete'],['hero-hold',10.3/16,'athlete'],
 ['montage-action-midpoint',11.3/16,'running'],['montage-action-hold',11.7/16,'running'],
 ['montage-rear-midpoint',12.55/16,'rear'],['montage-rear-hold',12.9/16,'rear'],
 ['montage-white-midpoint',13.75/16,'white'],['montage-white-hold',13.95/16,'white'],
 ['statement-midpoint',15.1/16,'statement'],['statement-hold',15.8/16,'statement'],
];

async function geometry(page, id='arrival') {
 return page.locator(`#${id}`).evaluate((el,id)=>{
  const pinned=el.parentElement?.classList.contains('pin-spacer');
  const stage=pinned?el.parentElement:el;
  const top=stage.getBoundingClientRect().top+scrollY;
  const padding=pinned?parseFloat(stage.style.paddingBottom)||0:0;
  const container=pinned?stage.parentElement:el.parentElement;
  const offset=id==='arrival'?(parseFloat(getComputedStyle(container).paddingTop)||0):0;
  return {start:top-offset,distance:padding,heroHeight:el.getBoundingClientRect().height,scrollY,progress:padding?Math.max(0,Math.min(1,(scrollY-top+offset)/padding)):null};
 },id);
}
async function state(page) {
 return page.locator('#arrival').evaluate(el=>{
  const read=node=>{if(!node)return null;const box=node.getBoundingClientRect(),style=getComputedStyle(node);return {x:box.x,y:box.y,width:box.width,height:box.height,opacity:Number(style.opacity),visibility:style.visibility,transform:style.transform};};
  const layers=Object.fromEntries([...el.querySelectorAll('[data-arrival-layer]')].map(node=>[node.dataset.arrivalLayer,read(node)]));
  return {layers,hero:read(el),statement:read(el.querySelector('[data-arrival-statement]')),details:[...el.querySelectorAll('[data-arrival-detail]')].map(read),title:[...el.querySelectorAll('#hero-title span')].map(read),watch:read(el.querySelector('button')),images:[...el.querySelectorAll('img')].map(node=>({src:node.currentSrc,loaded:node.complete&&node.naturalWidth>0})),overflow:document.documentElement.scrollWidth>innerWidth,scrollY};
 });
}
function dark(snapshot) {
 return layers.every(name=>snapshot.layers[name]?.opacity<.01)&&snapshot.statement.opacity<.01&&snapshot.details.every(node=>node.opacity<.01);
}
function beatReady(snapshot,beat) {
 if(beat==='darkness')return dark(snapshot);
 if(beat==='statement')return snapshot.statement.opacity>.99&&snapshot.details.every(node=>node.opacity>.99);
 const ready=beat==='lights'?snapshot.layers.lights.opacity>.45:beat==='smoke'?snapshot.layers['smoke-back'].opacity>.4&&snapshot.layers['smoke-front'].opacity>.35:snapshot.layers[beat]?.opacity>(['running','rear','white'].includes(beat)?.95:.4);
 if(['running','rear','white'].includes(beat))return ready&&['athlete','running','rear','white'].filter(name=>name!==beat).every(name=>snapshot.layers[name].opacity<.1);
 return ready;
}
async function seek(page,fraction,beat) {
 const g=await geometry(page);
 assert(g.distance>0,'Expected a scroll-driven hero pin');
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.start+g.distance*fraction);
 await expect.poll(async()=>Math.abs((await geometry(page)).progress-fraction),{timeout:15000}).toBeLessThan(.004);
 // Observe settled DOM styles; production does not expose fixtureScrollTrigger.
 await expect.poll(async()=>beatReady(await state(page),beat),{timeout:15000}).toBe(true);
 return {...await state(page),geometry:await geometry(page)};
}
function visibleBox(box,viewport,top=0) {
 assert(box&&box.width>0&&box.height>0,'Expected nonempty visible bounds');
 assert(box.x>=-1&&box.x+box.width<=viewport.width+1,'Horizontal bounds exceed viewport');
 assert(box.y>=top-1&&box.y+box.height<=viewport.height+1,'Vertical bounds exceed viewport');
}
async function noOverflow(page) {assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
async function resizeStory(page,viewport,retainBeat=true) {
 const before=await geometry(page);
 await page.setViewportSize(viewport);
 const header=await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().height);
 await expect.poll(async()=>{
  const g=await geometry(page);
  return Math.abs(g.distance-(g.heroHeight+header)*15);
 },{timeout:10000}).toBeLessThan(2);
 if(retainBeat)await expect.poll(async()=>Math.abs((await geometry(page)).progress-before.progress),{timeout:10000}).toBeLessThan(.035);
 await page.waitForTimeout(400); // beyond the hero's queued orientation restore
 const after=await geometry(page);
 if(retainBeat)assert(Math.abs(after.progress-before.progress)<.035,'Resize changed the retained beat');
 assert(after.progress>=0&&after.progress<=1,'Resize left the story outside its measured scroll range');
 await noOverflow(page);
 return {before,after,viewport,retainedBeatRequired:retainBeat,method:'Playwright setViewportSize; emulation, not a physical iOS toolbar interaction'};
}
async function filmAndPlayoffs(page,viewport,shot) {
 // Scroll from the completed hero into the existing film scene, then to its
 // own pin end. Do not force GSAP state or replace this with a direct hash.
 const g=await geometry(page,'film-room');
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.max(0,g.start-viewport.height*.45));
 await shot('film-handoff');
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),g.start+g.distance);
 const video=page.locator('#film-room video');
 await expect(video).toHaveJSProperty('controls',true,{timeout:15000});
 await expect.poll(()=>video.evaluate(el=>getComputedStyle(el).transform),{timeout:15000}).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
 const film=await video.boundingBox();
 const headerBottom=await page.locator('.site-header').evaluate(el=>Math.max(0,el.getBoundingClientRect().bottom));
 visibleBox(film,viewport,headerBottom);
 await video.evaluate(el=>el.pause());
 await shot('film-final');
 await video.focus();
 await page.keyboard.press('Tab');
 await expect.poll(()=>page.evaluate(()=>{const box=document.activeElement.getBoundingClientRect();return box.top>=0&&box.bottom<=innerHeight;})).toBe(true);
 const focused=await page.evaluate(()=>{const el=document.activeElement,box=el.getBoundingClientRect();return {tag:el.tagName,top:box.top,bottom:box.bottom,visible:box.top>=0&&box.bottom<=innerHeight};});
 assert(focused.visible,'Native-player Tab destination must stay visible');
 await expect(video).toHaveJSProperty('controls',true);
 await page.goto(new URL('/playoffs/',page.url()).href,{waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);
 const logo=await page.getByRole('img',{name:'Anna Coyotes logo',exact:true}).first().boundingBox();
 const heading=await page.locator('#playoffs-title').boundingBox();
 assert(logo&&heading);
 if(viewport.width>700)assert(logo.x+logo.width<heading.x);else assert(logo.y+logo.height<heading.y);
 await noOverflow(page);
 await shot('playoffs');
 return {film,focused,logo,heading};
}

export async function captureArrival({selected=process.env.ARRIVAL_CAPTURE_CASE,root=process.env.ARRIVAL_CAPTURE_OUTPUT??'artifacts/arrival-directors-cut',baseURL=process.env.ARRIVAL_CAPTURE_URL??'http://127.0.0.1:3100'}={}) {
 // Validate before launching a browser or touching either artifact tree.
 const selection=captureSelection(captureCases.map(item=>item.name),selected,root);
 const staging=`${root}/.runs/${Date.now()}-${process.pid}`;
 await mkdir(staging,{recursive:true});
 const results=[];
 for(const scenario of captureCases.filter(item=>selection.names.includes(item.name))) {
  const {name,viewport,touch=false,javaScriptEnabled=true,reducedMotion='no-preference'}=scenario;
  const engine=scenario.webkit?webkit:chromium;
  const browser=await engine.launch();
  const videoEnabled=['desktop','mobile','iphone-webkit'].includes(name)&&javaScriptEnabled;
  const context=await browser.newContext({viewport,isMobile:touch,hasTouch:touch,javaScriptEnabled,reducedMotion,deviceScaleFactor:1,...videoEnabled?{recordVideo:{dir:`${staging}/videos`,size:viewport}}:{}});
  try {
   const page=await context.newPage();
   const recording=page.video();
   const errors=[],failed=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.status()>=400)failed.push({url:response.url(),status:response.status()});});
   const shot=label=>page.screenshot({path:`${staging}/${name}-${label}.png`});
   const response=await page.goto(new URL('/',baseURL).href,{waitUntil:'load'});
   assert(response?.ok(),`Capture rejected HTTP ${response?.status()}`);
   await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('#arrival[data-arrival-hero]')).toHaveCount(1);
   const motion=javaScriptEnabled&&reducedMotion!=='reduce';
   if(motion){
    await expect.poll(()=>geometry(page).then(g=>g.distance),{timeout:10000}).toBeGreaterThan(viewport.height*14);
    await expect.poll(async()=>dark(await state(page)),{timeout:15000}).toBe(true);
   }
   const initial=await state(page);
   await shot('initial');
   const entry={name,viewport,touch,javaScriptEnabled,reducedMotion,engine:scenario.webkit?'managed WebKit':'managed Chromium',interaction:motion?'Programmatic window.scrollTo in '+(touch?'touch-enabled':'desktop')+' browser context. No physical swipe injected.':'Static document',initial,checks:{httpResponses:'monitored across every visited page',runtimeErrors:'pageerror monitored across every visited page',overflow:true},samples:[]};
   if(motion) {
    await expect.poll(()=>geometry(page).then(g=>g.distance),{timeout:10000}).toBeGreaterThan(viewport.height*14);
    assert(dark(initial),'Opening must hide lights, both smoke planes, every photo and statement');
    let previousY=await page.evaluate(()=>scrollY);
    for(const [label,fraction,beat] of beatSamples) {
     const snapshot=await seek(page,fraction,beat);
     assert(snapshot.scrollY>previousY,'Each beat must advance actual scroll offset');
     previousY=snapshot.scrollY;
     await noOverflow(page);
     await shot(label);
     entry.samples.push({label,fraction,beat,snapshot});
    }
    const final=await state(page);
    for(const title of final.title)visibleBox(title,viewport);
    visibleBox(final.watch,viewport);
    assert(final.images.every(image=>image.loaded),'All story photos must load');
    await shot('final');
    entry.final=final;
    entry.reverse=await seek(page,0,'darkness');
    assert(dark(entry.reverse),'Reverse must clear lights, both smoke planes, all photos, statement and details');
    await shot('reverse');
    await seek(page,.48,'silhouette');
    entry.orientation=await resizeStory(page,{width:viewport.height,height:viewport.width});
    await expect.poll(async()=>beatReady(await state(page),'silhouette'),{timeout:15000}).toBe(true);
    await shot('orientation');
    await resizeStory(page,viewport);
    // Height-only resize approximates changing visible browser chrome. Record
    // actual geometry; this is not evidence of physical Safari toolbar behavior.
    entry.toolbarEmulation=await resizeStory(page,{width:viewport.width,height:viewport.height-80},false);
    await shot('toolbar-emulation');
    await resizeStory(page,viewport,false);
    await seek(page,.9875,'statement');
    const axe=await new AxeBuilder({page}).analyze();
    assert.equal(axe.violations.length,0,JSON.stringify(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
    entry.checks.axe={performed:true,violations:0,page:'home final hold'};
    entry.filmAndPlayoffs=await filmAndPlayoffs(page,viewport,shot);
    entry.checks.nativeFilmAndPlayoffs=true;
   } else {
    assert.equal((await geometry(page)).distance,0);
    assert(initial.statement.opacity===1);
    for(const title of initial.title)visibleBox(title,viewport);
    visibleBox(initial.watch,viewport);
    await noOverflow(page);
    await shot('final');
    if(javaScriptEnabled) {
     const axe=await new AxeBuilder({page}).analyze();
     assert.equal(axe.violations.length,0,JSON.stringify(axe.violations.map(v=>v.id)));
     entry.checks.axe={performed:true,violations:0,page:'home static frame'};
    } else entry.checks.axe={performed:false,reason:'JavaScript disabled; axe requires script execution'};
    entry.checks.nativeFilmAndPlayoffs=false;
   }
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   entry.errors=errors;entry.failedResponses=failed;
   await context.close();
   if(recording)entry.video=`videos/${(await recording.path()).split('/').at(-1)}`;
   results.push(entry);
   console.log(`Validated ${name}: ${entry.samples.length} beat samples; axe ${entry.checks.axe.performed?'executed':'not applicable (no JS)'}`);
  }finally{await context.close();await browser.close();}
 }
 const evidence={complete:selection.canonical,expectedCases:selection.names,url:baseURL,conditions:'Managed headless browsers; touch-enabled emulation where stated. Scroll offsets are set programmatically, never forced timeline progress. Videos show automated seeks/holds in desktop/mobile/WebKit browsers, not authored playback timing or physical-device recordings. Height-only viewport resize approximates browser chrome and does not verify physical Safari dynamic toolbar behavior. Per-case checks report exact coverage.',results};
 await writeJSONAtomic(`${staging}/validation.json`,evidence);
 // Publish directory only after the entire selected run succeeds. Filtered runs
 // have a separate directory for JSON, images and video; canonical stays intact.
 await mkdir(selection.output.split('/').slice(0,-1).join('/'),{recursive:true});
 const backup=`${selection.output}.previous-${process.pid}`;
 let previous=false;
 try {await rename(selection.output,backup);previous=true;}catch(error){if(error.code!=='ENOENT')throw error;}
 try {await rename(staging,selection.output);}catch(error){if(previous)await rename(backup,selection.output);throw error;}
 if(previous)await rm(backup,{recursive:true,force:true});
 console.log(`Published ${results.length} ${selection.canonical?'complete':'filtered'} scenarios to ${selection.output}/validation.json`);
 return evidence;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)captureArrival().catch(error=>{console.error(error);process.exitCode=1;});
