const {chromium,webkit}=require('playwright');
(async()=>{
 for(const [name,engine,viewport] of [['desktop',chromium,{width:1440,height:900}],['iphone',webkit,{width:390,height:844}]]){
  const browser=await engine.launch();
  const page=await browser.newPage({viewport,isMobile:name==='iphone',hasTouch:name==='iphone',reducedMotion:'no-preference'});
  await page.goto('http://127.0.0.1:3100/film/');
  if(name==='iphone')await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.locator('#route-nav a[href="/"]').click();
  await page.locator('#arrival[data-arrival-motion="ready"]').waitFor();
  await page.screenshot({path:`.agent/evidence/cinematic-v2/screenshots/${name}-client-home-opening.png`});
  console.log(name,await page.locator('html').getAttribute('data-arrival-boot'),await page.locator('.site-header').evaluate(el=>getComputedStyle(el).visibility));
  await browser.close();
 }
})();
