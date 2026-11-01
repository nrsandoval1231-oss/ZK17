import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const stage = process.argv[2] ?? 'after';
if (!['before', 'after'].includes(stage)) throw new Error('Use before or after');
const directory = `artifacts/scroll-polish/${stage}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'] });
for (const [name, width, height] of [['desktop',1440,900], ['mobile',390,844]]) {
 const context = await browser.newContext({ viewport: { width, height }, recordVideo: { dir: directory, size: { width:720, height:450 } } });
 const page = await context.newPage();
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
 await page.goto(process.env.EVIDENCE_URL ?? 'http://127.0.0.1:3100/');
 await page.evaluate(() => document.fonts.ready);
 await page.waitForTimeout(1200);
 await page.screenshot({path:`${directory}/${name}-hero.png`});
 for (const id of ['on-field','film-room','off-field','journey','numbers','next-chapter']) {
  await page.locator('#'+id).scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  await page.screenshot({path:`${directory}/${name}-${id}.png`});
 }
 await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
 await page.waitForTimeout(400);
 // Record native wheel scrolling, including the full pin and its release.
 const total = await page.evaluate(() => document.documentElement.scrollHeight);
 for (let y = 0; y < total; y += 300) { await page.mouse.wheel(0,300); await page.waitForTimeout(100); }
 await page.goto(new URL('/recruiting/', process.env.EVIDENCE_URL ?? 'http://127.0.0.1:3100/').href);
 await page.screenshot({path:`${directory}/${name}-recruiting.png`,fullPage:true});
 await writeFile(`${directory}/${name}-errors.json`,JSON.stringify(errors,null,2));
 const video = page.video();
 await context.close();
 await video.saveAs(`${directory}/${name}-scroll.webm`);
 await video.delete();
}
await browser.close();
