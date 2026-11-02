const {chromium,webkit}=require('playwright');
const {mkdirSync}=require('node:fs');
const path=require('node:path');
(async()=>{
 const directory=path.join(__dirname,'screenshots');mkdirSync(directory,{recursive:true});
 for(const [name,engine,viewport] of [['desktop',chromium,{width:1440,height:900}],['iphone',webkit,{width:390,height:844}],['ipad',webkit,{width:768,height:1024}]]){
  const browser=await engine.launch({headless:true});const page=await browser.newPage({viewport,reducedMotion:'no-preference',...(name==='desktop'?{}:{isMobile:true,hasTouch:true})});
  await page.goto('http://127.0.0.1:3100/');await page.locator('#arrival[data-arrival-motion="ready"]').waitFor();await page.evaluate(()=>document.fonts.ready);
  const distance=await page.locator('#arrival').evaluate(el=>parseFloat(el.parentElement.style.paddingBottom));
  for(const [state,fraction] of [['black-opening',0],['lights-on',.14],['mid-accumulation',.56],['final-composite',.95]]){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*fraction);await page.waitForTimeout(700);if(state==='final-composite')await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('[data-arrival-statement]')).opacity)>.98);await page.screenshot({path:path.join(directory,`${name}-${state}.png`)});
  }
  await page.getByRole('link',{name:'Skip intro'}).click();await page.waitForTimeout(600);await page.screenshot({path:path.join(directory,`${name}-act-ii.png`)});
  for(const [route,state] of [['film','film'],['playoffs','playoffs'],['nil-recruiting','nil-recruiting']]){
   await page.goto(`http://127.0.0.1:3100/${route}/`);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);await page.screenshot({path:path.join(directory,`${name}-${state}.png`)});
  }
  await browser.close();
 }
})();
