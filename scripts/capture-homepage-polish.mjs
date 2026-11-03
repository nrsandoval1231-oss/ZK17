import { chromium, webkit } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const safari=process.argv.includes('--webkit');
const output=`artifacts/homepage-polish/${safari ? 'webkit' : 'after'}`;
await mkdir(output,{recursive:true});
const browser=safari ? await webkit.launch() : await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? '/usr/bin/chromium'});
const results=[];
try {
 for(const width of (safari ? [390] : [375,390,430,768,853,1024,1440])) {
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce',isMobile:width<600,hasTouch:width<600});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:3100');
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('[aria-roledescription="carousel"]')?.scrollLeft > 100);
  for(const id of ['on-field','off-field','follow-the-journey','next-chapter']) {
   const section=page.locator(`#${id}`);
   await section.scrollIntoViewIfNeeded();
   await section.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
   await section.screenshot({path:`${output}/${width}-${id}.jpg`,type:'jpeg',quality:78,style:'.site-header,.skip-link { visibility: hidden !important; }'});
  }
  // Stitch the actual chapter captures: oversized element screenshots can lose
  // offscreen native scroll compositing and show a stale carousel position.
  const files=['on-field','off-field','follow-the-journey','next-chapter'].map(id=>`${output}/${width}-${id}.jpg`);
  const metadata=await Promise.all(files.map(file=>sharp(file).metadata()));
  let top=0;
  const composite=files.map((input,index)=>{const item={input,top,left:0};top+=metadata[index].height;return item;});
  await sharp({create:{width,height:top,channels:3,background:'#09090b'}}).composite(composite).jpeg({quality:78}).toFile(`${output}/${width}-comparison.jpg`);
  results.push({width,height:900,reducedMotion:true,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),sections:await page.locator('main section').evaluateAll(items=>items.map(item=>item.id))});
  await context.close();
 }
 await writeFile(`artifacts/homepage-polish/${safari ? 'webkit' : 'responsive'}.json`,JSON.stringify(results,null,2)+'\n');
} finally {await browser.close();}
