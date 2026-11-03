import {chromium,webkit} from '@playwright/test';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const dir='.agent/evidence/opening-refinement/screenshots'; await mkdir(dir,{recursive:true});
const results=[];
for(const [name,engine,viewport,mobile] of [['desktop',chromium,{width:1440,height:900},false],['iphone-webkit',webkit,{width:390,height:844},true],['landscape-webkit',webkit,{width:844,height:390},true]]){
 const browser=await engine.launch();const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,reducedMotion:'no-preference'}); const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:3100'); await page.locator('#arrival').waitFor({state:'visible'});await page.waitForFunction(()=>document.querySelector('#arrival')?.getAttribute('data-arrival-motion')==='ready');await page.evaluate(()=>document.fonts.ready);
 const distance=await page.locator('#arrival').evaluate(el=>parseFloat(el.parentElement.style.paddingBottom));const tiles=[];
 for(const [beat,p] of [['cold-open',0],['ignition',.12],['stadium-mono',.27],['stadium-color',.38],['silhouette',.46],['hero',.59],['montage',.85],['statement',.98],['release',1.15]]){
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*p);await page.waitForTimeout(420);const file=`${dir}/${name}-${beat}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:83});tiles.push(await sharp(file).resize(360,225,{fit:'contain',background:'#141414'}).toBuffer());
 }
 await sharp({create:{width:1080,height:675,channels:3,background:'#141414'}}).composite(tiles.map((input,i)=>({input,left:(i%3)*360,top:Math.floor(i/3)*225}))).jpeg({quality:88}).toFile(`${dir}/${name}-overview.jpg`);
 results.push({name,viewport,distance,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)}); await browser.close();
}
await writeFile('.agent/evidence/opening-refinement/visual-checks.json',JSON.stringify(results,null,2));console.log(results);
