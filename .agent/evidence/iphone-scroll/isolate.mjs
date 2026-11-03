import {webkit} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await webkit.launch(); const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await page.goto('https://zephyrkreye.com/');await page.waitForSelector('[data-arrival-motion=ready]');await page.waitForTimeout(1500);
const results=[];
for(const mode of ['original','no-blend','original-again']){
if(mode==='no-blend')await page.addStyleTag({content:'[data-arrival-layer]{mix-blend-mode:normal!important;filter:none!important}[data-arrival-layer="smoke-back"],[data-arrival-layer="smoke-front"]{animation:none!important}'});
if(mode==='original-again')await page.evaluate(()=>document.querySelectorAll('style').forEach(s=>{if(s.textContent.includes('mix-blend-mode:normal!important'))s.remove()}));
results.push({mode,...await page.evaluate(async()=>{const frames=[];let last=performance.now();for(let i=0;i<180;i++){scrollTo(0,900+150*Math.sin(i/25));await new Promise(requestAnimationFrame);const now=performance.now();frames.push(now-last);last=now;}frames.sort((a,b)=>a-b);return{p95:frames[Math.floor(frames.length*.95)],over50:frames.filter(x=>x>50).length}})});
}await browser.close();await writeFile('.agent/evidence/iphone-scroll/effect-isolation.json',JSON.stringify(results,null,2));console.log(results);
