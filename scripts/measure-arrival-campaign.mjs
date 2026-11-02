import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const results=[];const browser=await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {});
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const context=await browser.newContext({viewport,deviceScaleFactor:1});const page=await context.newPage();
 await page.addInitScript(()=>{
  window.arrivalMetrics={lcp:0,cls:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.arrivalMetrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.arrivalMetrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
 });
 const started=Date.now();await page.goto('http://127.0.0.1:3100/',{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2200);
 const metrics=await page.evaluate(()=>({metrics:window.arrivalMetrics,nav:performance.getEntriesByType('navigation').map(e=>({domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd})),images:performance.getEntriesByType('resource').filter(e=>/\.(avif|webp|png|jpg|svg)(?:$|\?)/.test(e.name)).map(e=>({url:new URL(e.name).pathname,bytes:e.encodedBodySize,transfer:e.transferSize})),overflow:document.documentElement.scrollWidth>innerWidth}));
 results.push({viewport,elapsedMs:Date.now()-started,...metrics});await context.close();
}
await browser.close();await writeFile(process.argv[2] ?? 'artifacts/arrival-campaign/performance.json',JSON.stringify({conditions:'Managed headless Chromium, local static HTTP, cold isolated browser contexts, deviceScaleFactor1, no network/CPU throttling. LCP/CLS observed for2200ms after fonts. Lab measurements only; desktop starts in the intentional rear-silhouette state before interaction, not the completed sequence.',results},null,2));
