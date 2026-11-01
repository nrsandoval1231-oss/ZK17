import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const directory='artifacts/playoffs/after';
await mkdir(directory,{recursive:true});
const base=process.env.EVIDENCE_URL??'http://127.0.0.1:3100';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox']});
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},recordVideo:{dir:directory,size:{width:720,height:450}}});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 await page.goto(new URL('/playoffs/',base).href);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
 await page.screenshot({path:`${directory}/${name}-hero.png`});
 for(const id of ['anna-hq','anna-road','bracket']){
  await page.locator('#'+id).scrollIntoViewIfNeeded();await page.waitForTimeout(800);
  await page.screenshot({path:`${directory}/${name}-${id}.png`});
 }
 await page.getByRole('button',{name:'Scroll bracket right',exact:true}).click();await page.waitForTimeout(500);
 await page.screenshot({path:`${directory}/${name}-bracket-scroll.png`});
 await page.getByRole('button',{name:'Region IV',exact:true}).click();
 await page.getByRole('button',{name:'List view',exact:true}).click();
 await page.screenshot({path:`${directory}/${name}-list.png`});
 await page.locator('[data-game-card]').first().click();
 await page.screenshot({path:`${directory}/${name}-game-center.png`});
 await page.keyboard.press('Escape');
 await writeFile(`${directory}/${name}-errors.json`,JSON.stringify(errors,null,2));
 const video=page.video();await context.close();await video.saveAs(`${directory}/${name}-interaction.webm`);await video.delete();
}
await browser.close();
