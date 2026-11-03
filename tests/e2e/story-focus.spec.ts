import { test, expect } from '@playwright/test';
import { build } from 'esbuild';

async function openFocusFixture(page: import('@playwright/test').Page) {
 const bundle = await build({ stdin: { contents: `import React,{useRef} from 'react';import{createRoot}from'react-dom/client';import{useStoryMotion}from'./components/use-story-motion';function Fixture(){const root=useRef(null);useStoryMotion(root);return <main ref={root}><button id="before">Before</button><div style={{height:1200}}/><button id="target" style={{height:80,width:200}}>Partly visible control</button><div style={{height:1500}}/></main>}createRoot(document.getElementById('root')).render(<Fixture/>);`, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' } });
 await page.route('**/story-focus-fixture', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script>${bundle.outputFiles![0].text}</script>` }));
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/story-focus-fixture');
 await expect(page.locator('#target')).toBeAttached();
 await page.evaluate(() => { const target = document.querySelector('#target')!; scrollTo(0, target.getBoundingClientRect().top + scrollY - innerHeight + 20); });
}

test('pointer focus on a partly visible control does not recenter the story', async ({ page }) => {
 await openFocusFixture(page);
 // Safari buttons do not take native pointer focus. Make this fixture focus
 // on the real click so every engine exercises focusin after pointerdown.
 // preventScroll isolates any recentering performed by the story hook.
 await page.locator('#target').evaluate((el: HTMLElement) => {
  el.addEventListener('click', () => el.focus({ preventScroll: true }), { once: true });
 });
 const before = await page.evaluate(() => scrollY);
 await page.locator('#target').click({ position: { x: 20, y: 10 } });
 await expect(page.locator('#target')).toBeFocused();
 await page.waitForTimeout(150);
 expect(await page.evaluate(() => scrollY)).toBe(before);
});

test('programmatic preventScroll is preserved and Tab intent is consumed', async ({ page }) => {
 await openFocusFixture(page);
 // Establish and consume a real Tab intent first; it must not linger.
 await page.locator('#before').focus();
 await page.keyboard.press('Tab');
 await expect(page.locator('#target')).toBeFocused();
 await page.locator('#target').blur();
 await page.evaluate(() => { const target = document.querySelector('#target')!; scrollTo(0, target.getBoundingClientRect().top + scrollY - innerHeight + 20); });
 const before = await page.evaluate(() => scrollY);
 await page.locator('#target').evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
 await page.waitForTimeout(150);
 expect(await page.evaluate(() => scrollY)).toBe(before);
});

test('real Tab navigation keeps the focused story control fully visible', async ({ page }) => {
 await openFocusFixture(page);
 await page.locator('#before').evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
 await page.keyboard.press('Tab');
 await expect(page.locator('#target')).toBeFocused();
 await expect.poll(() => page.locator('#target').evaluate(el => { const box = el.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; })).toBe(true);
});

test('reduced film anchor observes layout that settles after the window resize frame', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 const bundle=await build({stdin:{contents:`import React,{useRef}from'react';import{createRoot}from'react-dom/client';import{useStoryMotion}from'./components/use-story-motion';function Fixture(){const root=useRef(null);useStoryMotion(root);return <main ref={root}><div id="before-film" style={{height:720}}/><section id="film-room" style={{height:720,position:'relative'}}><video controls style={{position:'absolute',top:96,height:200,width:160}}/></section><div style={{height:1200}}/></main>}createRoot(document.getElementById('root')).render(<Fixture/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
 await page.route('**/late-film-layout',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{scroll-behavior:auto}body{margin:0}</style><div id="root"></div><script>${bundle.outputFiles![0].text}</script>`}));
 await page.goto('/late-film-layout#film-room');
 const stage=page.locator('#film-room');
 await expect.poll(()=>stage.evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(0,0);
 await page.evaluate(()=>new Promise<void>(resolve=>{
  dispatchEvent(new Event('resize'));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   document.querySelector<HTMLElement>('#before-film')!.style.height='600px';
   document.querySelector<HTMLElement>('#film-room')!.style.height='600px';
   resolve();
  }));
 }));
 await expect(stage).toHaveCSS('height','600px');
 await expect.poll(()=>stage.evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(0,0);
 await expect.poll(()=>stage.locator('video').evaluate(el=>el.getBoundingClientRect().top)).toBeCloseTo(96,0);
});
