const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const origin=process.env.QA_URL||'http://127.0.0.1:3100';
(async()=>{
 const output=path.resolve('.impeccable/review/menu-button');await fs.mkdir(output,{recursive:true});
 const browser=await chromium.launch();const result={origin,startedUtc:new Date().toISOString(),viewports:[]};
 try{
  for(const width of[320,390,412,768,899]){
   const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(origin,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const button=page.getByRole('button',{name:'Menu',exact:true});
   const state=await button.evaluate(el=>({button:el.getBoundingClientRect().toJSON(),label:el.querySelector('span').getBoundingClientRect().toJSON(),icon:el.querySelector('svg').getBoundingClientRect().toJSON(),expanded:el.getAttribute('aria-expanded')}));
   assert.ok(state.button.width>=44&&state.button.height>=44);assert.ok(state.icon.left>=state.label.right+6,'menu icon must sit beside label');
   assert.equal(state.expanded,'false');assert.equal(response.status(),200);
   await page.locator('.site-header').screenshot({path:path.join(output,width+'-header.png')});
   if(width===390)await page.screenshot({path:path.join(output,'mobile-closed.png')});
   await button.click();await expect(page.locator('#site-nav .nav-close')).toBeFocused();await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','true');
   if(width===390)await page.screenshot({path:path.join(output,'mobile-open.png')});
   await page.keyboard.press('Escape');await expect(button).toBeFocused();await expect(button).toHaveAttribute('aria-expanded','false');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert.equal(overflow,0);assert.deepEqual(errors,[]);
   result.viewports.push({width,status:response.status(),...state,overflow,errors,openCloseAndFocus:'PASS'});await page.close();
  }
  const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});await page.goto(origin,{waitUntil:'networkidle'});await expect(page.locator('.menu-toggle')).toBeHidden();assert.equal(await page.locator('#site-nav a').count(),6);result.desktop={width:1280,menuHidden:true,inlineLinks:6};await page.close();
 }finally{await browser.close();}
 result.finishedUtc=new Date().toISOString();await fs.writeFile('.agent/evidence/menu-button/browser.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
