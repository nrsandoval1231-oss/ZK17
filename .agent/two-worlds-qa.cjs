const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const origin=process.env.QA_URL||'http://127.0.0.1:3100';
const output=path.resolve('.impeccable/review/two-worlds');
(async()=>{
 await fs.mkdir(output,{recursive:true});await fs.mkdir('.agent/evidence/two-worlds',{recursive:true});
 const browser=await chromium.launch();const proof={origin,startedUtc:new Date().toISOString(),viewports:[]};
 try{
  for(const[name,width,height]of[['desktop',1440,1000],['mobile',390,844],['android',412,915]]){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(origin,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.locator('#off-field').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.locator('.two-worlds img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   await page.screenshot({path:path.join(output,name+'-worlds.png')});
   await page.locator('.two-worlds').screenshot({path:path.join(output,name+'-worlds-full.png')});
   const worlds=await page.locator('.two-worlds').evaluate(el=>({bounds:el.getBoundingClientRect().toJSON(),text:el.textContent,images:[...el.querySelectorAll('img')].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,alt:i.alt,bounds:i.getBoundingClientRect().toJSON()})),links:[...el.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),text:a.textContent}))}));
   assert.equal(worlds.images.length,2);assert.ok(worlds.images.every(i=>i.loaded));
   await page.locator('.two-worlds a[href="#offfield-personal"]').click();assert.equal(new URL(page.url()).hash,'#offfield-personal');
   await page.locator('.two-worlds a[href="#on-field"]').click();assert.equal(new URL(page.url()).hash,'#on-field');
   const nilLink=page.locator('a[href="#nil-inquiries"]').first();assert.ok(await nilLink.count());await nilLink.click();
   assert.equal(new URL(page.url()).hash,'#nil-inquiries');await page.screenshot({path:path.join(output,name+'-connect.png')});
   await page.locator('#nil-inquiries').screenshot({path:path.join(output,name+'-connect-full.png')});
   const state=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,contentWidth:document.documentElement.scrollWidth,scenes:document.querySelectorAll('main .scene').length,legacyWordmarks:document.querySelectorAll('.brand-name,.hero-index').length,nil:document.querySelector('#nil-inquiries')?.textContent,links:[...document.querySelectorAll('#nil-inquiries a')].map(a=>({href:a.getAttribute('href'),text:a.textContent,target:a.target,rel:a.rel})),closingLogo:document.querySelector('.closing-identity .closing-logo').getBoundingClientRect().toJSON(),closingPhoto:document.querySelector('.closing-identity .closing-photo').getBoundingClientRect().toJSON()}));
   assert.equal(response.status(),200);assert.deepEqual(errors,[]);assert.equal(state.contentWidth,state.viewport);assert.equal(state.scenes,8);assert.equal(state.legacyWordmarks,0);
   const overlapX=Math.min(state.closingLogo.right,state.closingPhoto.right)-Math.max(state.closingLogo.left,state.closingPhoto.left);
   const overlapY=Math.min(state.closingLogo.bottom,state.closingPhoto.bottom)-Math.max(state.closingLogo.top,state.closingPhoto.top);
   assert.ok(overlapX<=0||overlapY<=0,'closing photo and canonical logo must not overlap');
   proof.viewports.push({name,status:response.status(),errors,worlds,...state});await page.close();
  }
  const motion=await browser.newPage({viewport:{width:1440,height:1000}});
  await motion.goto(origin,{waitUntil:'networkidle'});
  proof.desktopMotion=await motion.evaluate(()=>({railTravel:document.querySelector('.offfield-track').scrollWidth-document.querySelector('.offfield-rail').clientWidth,pinSpacers:document.querySelectorAll('.pin-spacer').length}));
  assert.ok(proof.desktopMotion.railTravel>0,'horizontal story travel must stay positive');
  assert.ok(proof.desktopMotion.pinSpacers>=2,'desktop story pins should initialize');
  await motion.emulateMedia({reducedMotion:'reduce'});
  await expect(motion.locator('.pin-spacer')).toHaveCount(0);
  proof.desktopMotion.reducedMotionPinSpacers=0;
  await motion.close();
 }finally{await browser.close();}
 proof.finishedUtc=new Date().toISOString();await fs.writeFile('.agent/evidence/two-worlds/browser.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
