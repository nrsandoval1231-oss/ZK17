import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const specArg = process.argv[2];
if (!specArg) {
  console.error('Usage: node scripts/prepare-selected-photos.mjs <local-photo-spec.json>');
  process.exit(2);
}

const specs = JSON.parse(await readFile(resolve(specArg), 'utf8'));
if (!Array.isArray(specs) || specs.length === 0) throw new Error('Photo spec must be a non-empty JSON array.');
const ids = new Set();
const outputDir = resolve('public/media/selected');
await mkdir(outputDir, { recursive: true });

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const photos = [];
const provenance = [];
const manifest = JSON.parse(await readFile(resolve('docs/PREVIEW_MEDIA_MANIFEST.json'), 'utf8'));
const existingIds = new Set(specs.map((spec) => spec.id));
for (let i = manifest.length - 1; i >= 0; i -= 1) {
  if (existingIds.has(manifest[i].id)) manifest.splice(i, 1);
}

for (const spec of specs) {
  if (!/^[a-z0-9][a-z0-9-]{0,60}$/.test(spec.id) || ids.has(spec.id)) throw new Error(`Invalid or duplicate photo id: ${spec.id}`);
  ids.add(spec.id);
  if (!spec.path || !spec.alt || !spec.focalPoint || !spec.source) throw new Error(`Missing required fields for ${spec.id}`);
  const input = resolve(spec.path);
  const original = await readFile(input);
  const sourceHash = sha256(original);
  const sourceImage = sharp(original, { failOn: 'error' }).rotate();
  const sourceInfo = await sourceImage.metadata();
  if (!sourceInfo.width || !sourceInfo.height || !['jpeg', 'png', 'webp', 'avif', 'tiff'].includes(sourceInfo.format ?? '')) {
    throw new Error(`Unsupported photo format/dimensions for ${spec.id}`);
  }

  const sourceWidth = sourceInfo.orientation && sourceInfo.orientation >= 5 && sourceInfo.orientation <= 8
    ? sourceInfo.height : sourceInfo.width;
  const sourceHeight = sourceInfo.orientation && sourceInfo.orientation >= 5 && sourceInfo.orientation <= 8
    ? sourceInfo.width : sourceInfo.height;
  if (spec.crop) {
    const { left, top, width, height } = spec.crop;
    if (![left, top, width, height].every(Number.isInteger) || left < 0 || top < 0 || width < 1 || height < 1 || left + width > sourceWidth || top + height > sourceHeight) {
      throw new Error(`Invalid crop bounds for ${spec.id}`);
    }
  }
  const availableWidth = spec.crop?.width ?? sourceWidth;
  const widths = [360, 706, 1280].filter((width) => width <= availableWidth);
  if (spec.crop && availableWidth <= 1280 && !widths.includes(availableWidth)) widths.push(availableWidth);
  if (widths.length === 0) widths.push(availableWidth);
  widths.sort((a, b) => a - b);

  for (const filename of await readdir(outputDir)) {
    if (filename.startsWith(`${spec.id}-`) && /\.(?:webp|avif)$/.test(filename)) await unlink(resolve(outputDir, filename));
  }

  const variants = [];
  const outputs = [];
  for (const width of widths) {
    const webp = `/media/selected/${spec.id}-${width}.webp`;
    const avif = `/media/selected/${spec.id}-${width}.avif`;
    const pipeline = () => {
      let image = sharp(original, { failOn: 'error' }).rotate();
      if (spec.crop) image = image.extract(spec.crop);
      return image.resize({ width, withoutEnlargement: true });
    };
    await pipeline().webp({ quality: 82, effort: 5 }).toFile(resolve(`public${webp}`));
    await pipeline().avif({ quality: 72, effort: 5 }).toFile(resolve(`public${avif}`));
    const webpBytes = await readFile(resolve(`public${webp}`));
    const avifBytes = await readFile(resolve(`public${avif}`));
    const actual = await sharp(webpBytes).metadata();
    variants.push({ width: actual.width, webp, avif });
    outputs.push({ path: webp, sha256: sha256(webpBytes) }, { path: avif, sha256: sha256(avifBytes) });
  }
  const chosen = variants.at(-1);
  const chosenMetadata = await sharp(resolve(`public${chosen.webp}`)).metadata();
  photos.push({
    id: spec.id,
    src: chosen.avif,
    width: chosen.width,
    height: chosenMetadata.height,
    alt: spec.alt,
    focalPoint: spec.focalPoint,
    variants,
    ...(spec.crop ? { crop: spec.crop } : {}),
    source: `${basename(input)} (${spec.source})`,
    sourceDate: '2026-11-03',
    sha256: sourceHash,
  });
  provenance.push({
    id: spec.id,
    sourceName: basename(input),
    source: spec.source,
    sourceSha256: sourceHash,
    sourceDimensions: { width: sourceWidth, height: sourceHeight },
    ...(spec.crop ? { crop: spec.crop } : {}),
    outputDimensions: { width: chosen.width, height: chosenMetadata.height },
    usage: 'preview-only',
    rights: 'Owner supplied for PR review; final-release rights gate retained',
    outputs,
  });
  manifest.push({
    id: spec.id,
    sourceName: basename(input),
    sourceSha256: sourceHash,
    alt: spec.alt,
    focal: spec.focalPoint,
    ...(spec.crop ? { crop: spec.crop } : {}),
    usage: 'preview-only',
    rights: 'Owner supplied for PR review; final-release rights gate retained',
    outputs: outputs.map(({ path }) => path),
  });
}

await writeFile(resolve('content/selected-photos.json'), `${JSON.stringify(photos, null, 2)}\n`);
await writeFile(resolve('docs/SELECTED_PHOTOS.json'), `${JSON.stringify(provenance, null, 2)}\n`);
await writeFile(resolve('docs/PREVIEW_MEDIA_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Prepared ${photos.length} selected photos and ${photos.reduce((n, p) => n + p.variants.length * 2, 0)} responsive derivatives.`);
