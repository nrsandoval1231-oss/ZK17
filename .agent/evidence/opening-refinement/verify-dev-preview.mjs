import {chromium,webkit} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const url='https://cinematic-opening-dev.zk17-review.pages.dev';const results=[];
for(const [name,engine,viewport] of [['desktop',chromium,{width:1440,height:900}],['iphone-webkit',webkit,{width:390,height:844}]]){
 const browser=await engine.launch();const page=await browser.newPage({viewport,isMobile:name!=='desktop',hasTouch:name!=='desktop',reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(url);await page.waitForFunction(()=>document.querySelector('#arrival')?.getAttribute('data-arrival-motion')==='ready');
 const initial=await page.locator('[data-arrival-layer="cold-logo"]').evaluate(el=>Number(getComputedStyle(el).opacity));
 const distance=await page.locator('#arrival').evaluate(el=>parseFloat(el.parentElement.style.paddingBottom));
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*.38);await page.waitForTimeout(450);
 await page.screenshot({path:`.agent/evidence/opening-refinement/dev-preview-${name}.jpg`,type:'jpeg',quality:85});
 const stadium=await page.locator('[data-arrival-layer="stadium"]').evaluate(el=>Number(getComputedStyle(el).opacity));
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance+5);await page.waitForTimeout(450);const header=await page.locator('.site-header').isVisible();
 results.push({name,status:response.status(),noindex:response.headers()['x-robots-tag'],initial,stadium,header,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await browser.close();
}
const path='media/anna-stadium-color-768.webp';const remote=Buffer.from(await (await fetch(`${url}/${path}`)).arrayBuffer());const hash=b=>createHash('sha256').update(b).digest('hex');
const production=await fetch('https://zephyrkreye.com');const html=await production.text();
const receipt={url,immutable:'https://ed5d0a54.zk17-review.pages.dev',source:'e2820d3f8705a17d715d549f8f79c26042efbd42',results,stadiumHashMatches:hash(remote)===hash(readFileSync(`out/${path}`)),production:{status:production.status,hasNewStadium:html.includes('anna-stadium')},verifiedAt:new Date().toISOString()};await writeFile('.agent/evidence/opening-refinement/dev-preview-receipt.json',JSON.stringify(receipt,null,2));console.log(receipt);
if(results.some(r=>r.status!==200||r.initial<.8||r.stadium<.7||!r.header||r.errors.length||r.overflow)||!receipt.stadiumHashMatches||receipt.production.hasNewStadium)process.exitCode=1;

