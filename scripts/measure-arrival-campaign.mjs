import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { createCLSAccumulator, writeJSONAtomic } from './lib/arrival-evidence.mjs';

export async function measureArrival({ baseURL = process.env.ARRIVAL_METRICS_URL ?? process.env.ARRIVAL_CAPTURE_URL ?? 'http://127.0.0.1:3100', output = 'artifacts/arrival-directors-cut/performance.json', observationMs = 2200 } = {}) {
 const results = [];
 const browser = await chromium.launch();
 try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
   const context = await browser.newContext({viewport,deviceScaleFactor:1,isMobile:viewport.width<700,hasTouch:viewport.width<700});
   try {
    const page = await context.newPage();
    await page.addInitScript({content:`const createCLSAccumulator=${createCLSAccumulator.toString()};
     const accumulator=createCLSAccumulator();
     window.arrivalMetrics={lcp:0,cls:0,lcpElement:null};
     const acceptLCP=entries=>{for(const e of entries){window.arrivalMetrics.lcp=e.startTime;window.arrivalMetrics.lcpElement=e.element?.tagName??null;}};
     const acceptCLS=entries=>{for(const e of entries)window.arrivalMetrics.cls=accumulator.observe(e);};
     const lcp=new PerformanceObserver(list=>acceptLCP(list.getEntries()));lcp.observe({type:'largest-contentful-paint',buffered:true});
     const cls=new PerformanceObserver(list=>acceptCLS(list.getEntries()));cls.observe({type:'layout-shift',buffered:true});
     window.flushArrivalMetrics=()=>{acceptLCP(lcp.takeRecords());acceptCLS(cls.takeRecords());};`});
    const started = Date.now();
    const response = await page.goto(baseURL, {waitUntil:'load'});
    if (!response || response.status()<200 || response.status()>=300) throw new Error(`Metrics rejected HTTP ${response?.status() ?? 'no response'} at ${baseURL}`);
    if (await page.locator('#arrival[data-arrival-hero]').count() !== 1 || await page.locator('#arrival #hero-title').count() !== 1) throw new Error(`Metrics rejected missing campaign hero at ${baseURL}`);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(observationMs);
    const metrics = await page.evaluate(()=>{
     window.flushArrivalMetrics();
     const hero=document.querySelector('#arrival'), spacer=hero.parentElement;
     const distance=spacer.classList.contains('pin-spacer')?parseFloat(spacer.style.paddingBottom)||0:0;
     const start=(spacer.classList.contains('pin-spacer')?spacer:hero).getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.querySelector('.site-header')??hero).height)||0);
     return {metrics:window.arrivalMetrics,nav:performance.getEntriesByType('navigation').map(e=>({domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd})),images:performance.getEntriesByType('resource').filter(e=>/\.(avif|webp|png|jpg|svg)(?:$|\?)/.test(e.name)).map(e=>({url:new URL(e.name).pathname,bytes:e.encodedBodySize,transfer:e.transferSize})),overflow:document.documentElement.scrollWidth>innerWidth,story:{scrollY,distance,normalizedProgress:distance?Math.max(0,Math.min(1,(scrollY-start)/distance)):null,lightsOpacity:hero.querySelector('[data-arrival-layer="lights"]')?Number(getComputedStyle(hero.querySelector('[data-arrival-layer="lights"]')).opacity):null}};
    });
    results.push({viewport,status:response.status(),elapsedMs:Date.now()-started,...metrics});
   } finally { await context.close(); }
  }
 } finally { await browser.close(); }
 const evidence={url:baseURL,conditions:`Managed headless Chromium; cold isolated contexts; DPR1; no CPU/network throttling; observation ${observationMs}ms after fonts, no scrolling. CLS is largest session window (<1s gap, <5s duration), excluding recent input. The intentional dark opening does not define a completed-story LCP: candidates may include header/logo, the initial SSR static fallback, or other visible content. This is not sequence-completion or hero-photo LCP, field/device/thermal performance, or a physical Safari toolbar test. Story progress and light opacity identify the sampled frame.`,results};
 await writeJSONAtomic(output,evidence);
 return evidence;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
 measureArrival({output:process.argv[2] ?? 'artifacts/arrival-directors-cut/performance.json'}).catch(error => { console.error(error); process.exitCode = 1; });
}
