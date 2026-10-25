import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const master = 'brand/zk17-monogram-master.jpg';
const expectedSha256 = '6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736';
const bytes = await readFile(master);
const actualSha256 = createHash('sha256').update(bytes).digest('hex');
if (actualSha256 !== expectedSha256) throw new Error(`Canonical logo hash mismatch: ${actualSha256}`);

const metadata = await sharp(bytes, { failOn: 'error' }).metadata();
if (metadata.width !== 1254 || metadata.height !== 1254) throw new Error('Canonical logo master must remain 1254px square.');

// Keep the exact source pixels as the mask. The monotone transfer removes the
// JPEG's black background while retaining the supplied mark and its gaps.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254" viewBox="0 0 1254 1254"><defs><filter id="noise" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0 0 1 1"/><feFuncG type="table" tableValues="0 0 1 1"/><feFuncB type="table" tableValues="0 0 1 1"/></feComponentTransfer></filter><mask id="mark" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254" style="mask-type:luminance"><image href="data:image/jpeg;base64,${bytes.toString('base64')}" width="1254" height="1254" filter="url(#noise)"/></mask></defs><rect width="1254" height="1254" fill="#fff" mask="url(#mark)"/></svg>\n`;
await mkdir('public/brand', { recursive: true });
await writeFile('brand/zk17-monogram-transparent.svg', svg);
const transparentSvg = Buffer.from(svg);
for (const size of [32, 64, 180, 512]) {
  await sharp(transparentSvg).resize(size, size).png().toFile(`public/brand/zk17-monogram-${size}.png`);
}
const active512 = await sharp(transparentSvg).resize(512, 512).png().toBuffer();
await writeFile('public/brand/zk17-monogram-512-v2.png', active512);
await sharp(transparentSvg).png().toFile('public/brand/zk17-monogram-1254.png');
await sharp(transparentSvg).png().toFile('public/brand/zk17-monogram-transparent.png');
const favicon = await sharp(transparentSvg).resize(64, 64).png().toBuffer();
await writeFile('public/favicon.png', favicon);
await writeFile('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image href="data:image/png;base64,${favicon.toString('base64')}" width="64" height="64"/></svg>\n`);
await sharp(transparentSvg).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log(`Generated transparent logo derivatives from ${master} (${actualSha256}); source SVG 1254px, PNG sizes: 32, 64, 180, 512px.`);
