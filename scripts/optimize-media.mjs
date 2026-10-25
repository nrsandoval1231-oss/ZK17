import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';

const [, , inputArg, slug] = process.argv;
if (!inputArg || !slug || !/^[a-z0-9][a-z0-9-]{0,60}$/.test(slug)) {
  console.error('Usage: node scripts/optimize-media.mjs <approved-original-path> <lowercase-slug>');
  process.exit(2);
}
const input = resolve(inputArg);
const info = await sharp(input, { failOn: 'error' }).metadata();
if (!info.width || !info.height || !['jpeg', 'png', 'webp', 'avif', 'tiff'].includes(info.format ?? '')) throw new Error('Input must be a supported local raster photo.');
const directory = resolve('public/media');
await mkdir(directory, { recursive: true });
const max = Math.max(info.width, info.height);
for (const width of [640, 1280, 1920].filter((value) => value < max).concat(max)) {
  const pipe = sharp(input).rotate().resize({ width, height: undefined, fit: 'inside', withoutEnlargement: true });
  await pipe.clone().avif({ quality: 72, effort: 5 }).toFile(resolve(directory, `${slug}-${width}.avif`));
  await pipe.webp({ quality: 82, effort: 5 }).toFile(resolve(directory, `${slug}-${width}.webp`));
}
console.log(`Wrote responsive AVIF/WebP for ${basename(input, extname(input))}; source ${info.width}x${info.height}.`);
