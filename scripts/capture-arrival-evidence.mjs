import { chromium, webkit } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.EVIDENCE_URL ?? 'http://127.0.0.1:3100/';
const output = process.argv[2] ?? 'artifacts/arrival';
await mkdir(output, { recursive: true });
const results = [];

for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch(engineName === 'chromium' && process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {});
  for (const [device, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    const videoRequests = [];
    page.on('pageerror', error => errors.push({ kind: 'pageerror', message: error.message }));
    page.on('console', message => { if (message.type() === 'error') errors.push({ kind: 'console', message: message.text() }); });
    page.on('request', request => { if (/\.mp4(?:$|\?)/i.test(request.url())) videoRequests.push(request.url()); });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    if (device === 'desktop') await page.locator('.pin-spacer #film-room').waitFor();
    await page.screenshot({ path: `${output}/${engineName}-${device}-hero.png`, fullPage: false });
    const videoRequestsBeforeApproach = videoRequests.length;
    const film = page.locator('#film-room');
    const section = await film.evaluate(element => ({ top: element.getBoundingClientRect().top + window.scrollY, height: element.getBoundingClientRect().height }));
    const viewportHeight = page.viewportSize().height;
    const settle = async () => {
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.waitForTimeout(500);
    };
    const midpoint = device === 'desktop' ? section.top + section.height * 0.48 : section.top - viewportHeight * 0.45;
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), midpoint);
    await settle();
    await page.screenshot({ path: `${output}/${engineName}-${device}-cinema-midpoint.png`, fullPage: false });
    // Desktop ScrollTrigger pins the viewport for one viewport of progress; mobile follows its natural section flow.
    const filmPosition = device === 'desktop' ? section.top + viewportHeight * 0.99 : section.top - 76;
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), filmPosition);
    await settle();
    await page.screenshot({ path: `${output}/${engineName}-${device}-cinema-end.png`, fullPage: false });
    await page.waitForFunction(() => [...document.querySelectorAll('video')].some(video => video.currentTime > 0), undefined, { timeout: 5000 }).catch(() => {});
    const axe = await new AxeBuilder({ page }).analyze();
    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      cinemaPin: Boolean(document.querySelector('.pin-spacer #film-room')),
      video: [...document.querySelectorAll('video')].map(video => ({ src: video.currentSrc || video.getAttribute('src'), preload: video.preload, muted: video.muted, controls: video.controls, currentTime: video.currentTime, playbackAdvanced: video.currentTime > 0 })),
    }));
    results.push({ engine: engineName, device, screenshots: ['hero', 'cinema-midpoint', 'cinema-end'], errors, axeViolations: axe.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, count: nodes.length })), horizontalOverflow: layout.document > layout.viewport, layout, videoRequestsBeforeApproach, videoRequests });
    await context.close();
  }
  await browser.close();
}
await writeFile(`${output}/arrival-audit.json`, JSON.stringify({ baseURL, results }, null, 2));
console.log(`Arrival evidence written to ${output}`);
