import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Source photographs are cropped and encoded only; no subject reconstruction.
const source = process.argv[2];
const originalSource = process.argv[3];
if (!source || !originalSource) throw new Error('Pass the extracted black-and-white and original source directories');
const items = [
  { id: 'directors-action', file: 'source-11.jpg', original: true, crop: { left: 120, top: 450, width: 400, height: 450 }, alt: 'Zephyr Kreye carrying a football on the field.' },
  { id: 'directors-standing', file: 'zephyr_cinematic_bw_01.png', crop: { left: 0, top: 0, width: 601, height: 780 }, alt: 'Zephyr Kreye standing in his black number 17 uniform.' },
  { id: 'directors-rear', file: 'zephyr_cinematic_bw_03.png', crop: { left: 250, top: 200, width: 650, height: 1050 }, alt: 'Zephyr Kreye seen from behind in his number 17 uniform.' },
  { id: 'directors-white', file: 'zephyr_cinematic_bw_08.png', crop: { left: 115, top: 330, width: 470, height: 805 }, alt: 'Zephyr Kreye seen from behind in his white number 17 uniform.' },
];
await mkdir('public/media/arrival-directors-cut', { recursive: true });
const rows = [];
for (const item of items) {
  const input = await readFile(resolve(item.original ? originalSource : source, item.file));
  const outputs = [];
  for (const width of [480, 960]) {
    const path = `/media/arrival-directors-cut/${item.id}-${width}.webp`;
    await sharp(input).extract(item.crop).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${path}`);
    outputs.push(path);
  }
  rows.push({ id: item.id, sourceName: item.file, sourceSha256: createHash('sha256').update(input).digest('hex'), crop: item.crop, alt: item.alt, usage: 'preview-only', rights: 'pending', encoding: 'WebP, crop and resize only', outputs, campaign: 'arrival-directors-cut' });
}
const manifestPath = 'docs/PREVIEW_MEDIA_MANIFEST.json';
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
await writeFile(manifestPath, JSON.stringify([...manifest.filter(row => row.campaign !== 'arrival-directors-cut'), ...rows], null, 2) + '\n');
console.log('Prepared preview-only director’s cut crops.');
