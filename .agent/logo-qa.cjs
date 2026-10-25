const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const origin = process.env.QA_URL || 'http://127.0.0.1:3100';
const evidenceDir = process.env.QA_EVIDENCE_DIR || '.agent/evidence/logo-01';
(async () => {
  const output = path.resolve(process.env.QA_OUTPUT_DIR || '.impeccable/review/logo');
  await fs.mkdir(output, { recursive: true });
  await fs.mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch();
  const proof = { origin, startedUtc: new Date().toISOString(), viewports: [] };
  try {
    for (const [name, width, height] of [['desktop',1280,720],['mobile',390,844],['android',412,915]]) {
      const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce' });
      const errors=[];
      page.on('pageerror', e=>errors.push(e.message));
      const response = await page.goto(origin, { waitUntil:'networkidle' });
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({ path:path.join(output,`${name}.png`) });
      await page.locator('.panel-archive').screenshot({ path:path.join(output,`${name}-archive.png`) });
      await page.locator('#closing').scrollIntoViewIfNeeded();
      await page.locator('#closing img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
      await page.screenshot({ path:path.join(output,`${name}-closing.png`) });
      await page.locator('#closing').screenshot({ path:path.join(output,`${name}-closing-full.png`) });
      const state=await page.evaluate(()=>({
        width:document.documentElement.clientWidth, contentWidth:document.documentElement.scrollWidth,
        logos:[...document.querySelectorAll('img.brand-logo')].map(img=>({src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,alt:img.alt})),
        icons:[...document.querySelectorAll('link[rel*=icon]')].map(el=>({rel:el.rel,href:el.getAttribute('href')})),
        og:document.querySelector('meta[property="og:image"]')?.content,
        legacyWordmarks:document.querySelectorAll('.brand-name,.hero-index').length,
        brandLinkText:[...document.querySelectorAll('a.brand')].map(el=>el.textContent.trim()),
        closingBottom:document.querySelector('.closing-bottom')?.getBoundingClientRect().toJSON(),
        closingFuture:document.querySelector('.closing-future')?.getBoundingClientRect().toJSON()
      }));
      assert.equal(response.status(),200);assert.deepEqual(errors,[]);assert.equal(state.width,state.contentWidth);
      assert.ok(state.logos.length>=3,'header, closing header and main closing logos');
      for(const logo of state.logos){assert.ok(logo.loaded);assert.equal(logo.naturalWidth,logo.naturalHeight);assert.ok(Math.abs(logo.width-logo.height)<1);}
      assert.ok(state.closingFuture.top>=state.closingBottom.bottom+4,'closing caption must be separated from copyright/rule');
      if(process.env.CANONICAL_ONLY==='true'){assert.equal(state.legacyWordmarks,0);assert.ok(state.brandLinkText.every(text=>text===''));}
      proof.viewports.push({name,status:response.status(),errors,...state});
      await page.close();
    }
  } finally { await browser.close(); }
  proof.finishedUtc=new Date().toISOString();
  await fs.writeFile(path.join(evidenceDir,'browser.json'),JSON.stringify(proof,null,2)+'\n');
  console.log(JSON.stringify(proof,null,2));
})().catch(err=>{console.error(err);process.exitCode=1;});
