const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');
const baseURL = process.env.QA_URL || 'http://127.0.0.1:3100';
const output = path.resolve('.impeccable/review');
(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser = await chromium.launch();
  const evidence={baseURL,startedUtc:new Date().toISOString(),viewports:[],limitations:['Chromium viewport testing; physical devices and other engines not tested.','No approved athlete video supplied.']};
  for(const [name,width,height] of [['desktop',1280,720],['mobile',390,844],['android',412,915]]){
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto(baseURL,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:path.join(output,`${name}.png`)});
    const sceneIDs=await page.locator('main .scene').evaluateAll(items=>items.map(el=>el.id));
    for(const id of sceneIDs){
      await page.locator(`#${id}`).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
      await page.locator(`#${id} img`).evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
      await page.screenshot({path:path.join(output,`${name}-${id}.png`)});
    }
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(output,`${name}-full.png`),fullPage:true});
    const measurements=await page.evaluate(()=>({
      viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth,
      images:[...document.images].map(img=>({src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0,width:img.naturalWidth})),
      resources:performance.getEntriesByType('resource').map(r=>({name:r.name,transferSize:r.transferSize,duration:r.duration})),
      navigation:performance.getEntriesByType('navigation').map(r=>({domContentLoaded:r.domContentLoadedEventEnd,load:r.loadEventEnd,transferSize:r.transferSize})),
      paint:performance.getEntriesByType('paint').map(r=>({name:r.name,time:r.startTime})),
      scrollTriggers:document.querySelectorAll('.pin-spacer').length
    }));
    evidence.viewports.push({name,width,height,reducedMotion:true,status:response.status(),errors,sceneIDs,...measurements});
    await context.close();
  }
  const noJS=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false,reducedMotion:'reduce'});
  const page=await noJS.newPage();
  await page.goto(baseURL,{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(output,'mobile-no-js.png')});
  evidence.noJS={heading:await page.locator('h1').innerText(),scenes:await page.locator('main .scene').count()};
  await noJS.close();
  await browser.close();
  evidence.finishedUtc=new Date().toISOString();
  await fs.writeFile('.agent/BROWSER_CAPTURE.json',JSON.stringify(evidence,null,2));
  console.log(JSON.stringify({output,viewports:evidence.viewports.map(v=>({name:v.name,status:v.status,overflow:v.content-v.viewport,errors:v.errors,images:v.images.map(i=>i.loaded)})),noJS:evidence.noJS},null,2));
})().catch(err=>{console.error(err);process.exitCode=1;});
