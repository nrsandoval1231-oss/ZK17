const { chromium, webkit, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const origin = process.env.QA_URL || 'http://127.0.0.1:3100';
const evidence = '.agent/evidence/arcade-build';
const capture = '.impeccable/review/arcade-build';
(async()=>{
 await fs.mkdir(capture,{recursive:true});
 const result={origin,startedUtc:new Date().toISOString(),checks:[]};
 for(const [engine, config] of [[chromium,{name:'chromium',sizes:[[320,780],[390,844],[412,915],[768,1024],[1280,900]]}],[webkit,{name:'webkit',sizes:[[390,844]]}]]){
  const browser=await engine.launch();
  try{for(const [width,height] of config.sizes){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(origin+'/#offfield-personal',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const root=page.locator('#offfield-personal');await root.scrollIntoViewIfNeeded();
   await expect(root.locator('picture img')).toHaveJSProperty('complete',true);await expect(root.locator('picture img')).toHaveJSProperty('naturalWidth',await root.locator('picture img').evaluate(el=>el.naturalWidth));
   const geometry=await root.evaluate(el=>({root:el.getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,image:[...el.querySelectorAll('img')].map(i=>({complete:i.complete,width:i.naturalWidth,src:i.currentSrc})),labels:[...el.querySelectorAll('label')].map(x=>x.getBoundingClientRect().toJSON()),buttons:[...el.querySelectorAll('button')].map(x=>x.getBoundingClientRect().toJSON())}));
   assert.equal(response.status(),200);assert.equal(geometry.overflow,0);assert.ok(geometry.image.every(i=>i.complete&&i.width>0));assert.ok(geometry.labels.every(l=>l.height>=44));assert.ok(geometry.buttons.every(b=>b.height>=44&&b.width>=44));
   await root.screenshot({path:path.join(capture,config.name+'-'+width+'-menu.png')});
   for(const category of ['Gaming','Movies','Music']){
    const radio=root.getByRole('radio',{name:category,exact:true});await radio.locator('..').click();await expect(radio).toBeChecked();await root.getByRole('button',{name:'PRESS START',exact:true}).click();
    await expect(root.getByText(category+' details are coming soon.',{exact:true})).toBeVisible();
    await expect(root.getByRole('button',{name:'BACK TO MENU',exact:true})).toBeFocused();
    if(category==='Music'&&width===390)await root.screenshot({path:path.join(capture,config.name+'-'+width+'-music.png')});
    await root.getByRole('button',{name:'BACK TO MENU',exact:true}).click();await expect(root.getByRole('button',{name:'PRESS START',exact:true})).toBeFocused();
   }
   assert.deepEqual(errors,[]);result.checks.push({engine:config.name,width,height,geometry,interactions:'all3worlds/start/back/focus PASS',errors});await page.close();
  }}finally{await browser.close();}
 }
 result.finishedUtc=new Date().toISOString();await fs.writeFile(path.join(evidence,'browser.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({origin,checks:result.checks.length},null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
