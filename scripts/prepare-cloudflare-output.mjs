import { copyFile, writeFile } from 'node:fs/promises';

const videos = [
  '/media/zephyr-cinematic.mp4',
  '/media/zephyr-monochrome-full.mp4',
];

await copyFile('scripts/dev-preview-video-worker.mjs', 'out/_worker.js');
await writeFile('out/_routes.json', `${JSON.stringify({ version: 1, include: videos, exclude: [] })}\n`);
console.log('Prepared Cloudflare Pages MP4 range worker and route manifest.');
