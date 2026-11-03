import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Photo = { id: string; src: string; alt: string };
const photos = JSON.parse(readFileSync(resolve(process.cwd(), 'content/selected-photos.json'), 'utf8')) as Photo[];
const selected = (id: string) => {
 const photo = photos.find(item => item.id === id);
 if (!photo) throw new Error(`Missing selected photo ${id}`);
 return photo;
};

test('discovery uses the standing field photo and the On the Field hero uses a separate throwing photo', async ({ page }) => {
 await page.goto('/');
 const discoveryPhoto = selected('discovery-field');
 const heroPhoto = selected('field-hero');
 const fieldWorld = page.locator('#two-sides a[href="/on-the-field/"]');
 await expect(fieldWorld.locator('img')).toHaveAttribute('alt', discoveryPhoto.alt);
 const html = await page.locator('#two-sides').innerHTML();
 expect(html).toContain(discoveryPhoto.src.replace('.avif', ''));
 expect(discoveryPhoto.src).not.toBe(heroPhoto.src);
 const images = await page.locator('#two-sides img').evaluateAll(items => items.map(item => (item as HTMLImageElement).alt));
 expect(images).toContain(discoveryPhoto.alt);
 for (const image of await page.locator('#two-sides img').all()) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
 }
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await page.goto('/on-the-field/');
 const fieldHero = page.locator('.field-art img');
 await expect(fieldHero).toHaveAttribute('alt', heroPhoto.alt);
 await expect.poll(() => fieldHero.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Beyond 17 uses the personal hero and personal photo gallery, not a restaurant stock image', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/beyond-17/');
 const hero = selected(photos.some(photo => photo.id === 'personal-portrait') ? 'personal-portrait' : 'personal-birthday');
 const heroImage = page.locator('section[aria-labelledby="beyond-title"] img');
 await expect(heroImage).toHaveAttribute('alt', hero.alt);
 await expect.poll(() => heroImage.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
 const gallery = page.getByRole('region', { name: 'Life outside the lines photographs' });
 await expect(gallery).toBeVisible();
 const galleryMarkup = await gallery.innerHTML();
 const galleryIds = new Set(['personal-home', 'personal-sideline', 'personal-outing', 'personal-golf']);
 for (const photo of photos.filter(item => galleryIds.has(item.id))) {
  expect(galleryMarkup).toContain(photo.src.replace('.avif', ''));
 }
 expect(galleryMarkup).not.toMatch(/restaurant|dining|menu|food[-_ ]?photo/i);
 const galleryImages = gallery.locator('img');
 const total = await galleryImages.count();
 expect(total).toBeGreaterThanOrEqual(2);
 for (const image of await galleryImages.all()) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
 }
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 const next = page.getByRole('button', { name: 'Next photograph' });
 const previous = page.getByRole('button', { name: 'Previous photograph' });
 await gallery.evaluate(element => { element.scrollLeft = 0; });
 await expect(page.locator('[aria-live="polite"]')).toHaveText(`1 / ${total}`);
 await expect(previous).toBeDisabled();
 await next.click();
 await expect(page.locator('[aria-live="polite"]')).toHaveText(`2 / ${total}`);
 await gallery.focus();
 await page.keyboard.press('ArrowLeft');
 await expect(page.locator('[aria-live="polite"]')).toHaveText(`1 / ${total}`);
 await expect(previous).toBeDisabled();
});
