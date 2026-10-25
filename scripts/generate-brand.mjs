import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const master = 'brand/zk17-monogram-master.jpg';
const expectedSha256 = '6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736';
const bytes = await readFile(master);
const actualSha256 = createHash('sha256').update(bytes).digest('hex');
if (actualSha256 !== expectedSha256) throw new Error(`Canonical logo hash mismatch: ${actualSha256}`);

const input = sharp(bytes, { failOn: 'error' });
const metadata = await input.metadata();
if (metadata.width !== metadata.height) throw new Error('Canonical logo master must remain square.');

for (const size of [32, 64, 180, 512]) {
  await sharp(bytes).resize(size, size, { fit: 'contain', background: '#000000' }).png().toFile(`public/brand/zk17-monogram-${size}.png`);
}
const favicon = await sharp(bytes).resize(64, 64, { fit: 'contain', background: '#000000' }).png().toBuffer();
await writeFile('public/favicon.png', favicon);
await writeFile('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image href="data:image/png;base64,${favicon.toString('base64')}" width="64" height="64"/></svg>\n`);
await sharp(bytes).resize(180, 180, { fit: 'contain', background: '#000000' }).png().toFile('public/apple-touch-icon.png');
console.log(`Generated square logo derivatives from ${master} (${actualSha256}); sizes: 32, 64, 180, 512px.`);
