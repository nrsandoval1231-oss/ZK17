import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const master = await readFile('brand/zk17-monogram-master.jpg');
const digest = createHash('sha256').update(master).digest('hex');
if (digest !== '6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736') throw new Error(`Canonical logo hash mismatch: ${digest}`);
const text = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#09090d"/><text x="84" y="270" fill="#f5f3f8" font-family="sans-serif" font-weight="700" font-size="92" letter-spacing="-3">ZEPHYR</text><text x="84" y="374" fill="#f5f3f8" font-family="sans-serif" font-weight="700" font-size="92" letter-spacing="-3">KREYE</text><text x="90" y="432" fill="#ac7cff" font-family="sans-serif" font-weight="700" font-size="24" letter-spacing="2">#17 · CLASS OF 2027</text><text x="90" y="504" fill="#a5a2ae" font-family="sans-serif" font-size="13" letter-spacing="1.2">BUILT FOR THE MOMENT. READY FOR WHAT’S NEXT.</text></svg>`;
const monogram = await sharp('public/brand/zk17-monogram-512-v2.png').resize(540, 540, { fit: 'contain' }).png().toBuffer();
await sharp(Buffer.from(text)).composite([{ input: monogram, left: 610, top: 45 }]).flatten({ background: '#09090d' }).png().toFile('public/og-zk17.png');
