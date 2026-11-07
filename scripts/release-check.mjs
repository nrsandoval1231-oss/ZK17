import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const previewMediaMode = process.env.PREVIEW_MEDIA_MODE !== 'false';
const publicRelease = process.env.PUBLIC_RELEASE === 'true';
const commitmentMode = process.env.COMMITMENT_REVEAL_MODE ?? 'disabled';
if (publicRelease) {
  const approvals = JSON.parse(await readFile(resolve('content/media-approvals.json'), 'utf8'));
  const manifests = [
    JSON.parse(await readFile(resolve('docs/PREVIEW_MEDIA_MANIFEST.json'), 'utf8')),
    JSON.parse(await readFile(resolve('docs/ARRIVAL_CAMPAIGN_MEDIA_MANIFEST.json'), 'utf8')),
  ];
  const used = new Set([
    ...['arrival', 'on-field', 'portrait', 'throwing', 'running'].map((slug) => `/media/${slug}-706.webp`),
    ...['stadium', 'front', 'rear', 'back', 'profile', 'closeup'].map((id) => `/media/arrival-campaign/${id}-640.svg`),
    ...['action', 'standing', 'rear', 'white'].map((id) => `/media/arrival-directors-cut/directors-${id}-960.webp`),
    '/media/zephyr-color-action.webp',
    '/media/on-field-owner-2026-10-16.jpg',
    '/media/beyond-17-owner.webp',
  ]);
  const sources = new Map();
  for (const entry of manifests.flat()) {
    for (const output of entry.outputs ?? []) sources.set(output, entry.sourceSha256);
  }
  for (const path of ['/media/on-field-owner-2026-10-16.jpg', '/media/beyond-17-owner.webp']) {
    const bytes = await readFile(resolve('public', `.${path}`)).catch(() => null);
    if (bytes) sources.set(path, createHash('sha256').update(bytes).digest('hex'));
  }
  const missing = [];
  for (const path of used) {
    const sourceHash = sources.get(path);
    const output = await readFile(resolve('public', `.${path}`)).catch(() => null);
    const outputHash = output && createHash('sha256').update(output).digest('hex');
    const approved = approvals.records?.some((record) =>
      record.status === 'approved' && record.approvedBy === 'owner' && record.approvedOn &&
      Array.isArray(record.outputPaths) && record.outputPaths.includes(path) &&
      record.sourceSha256 === sourceHash && record.outputSha256?.[path] === outputHash &&
      /^[a-f0-9]{64}$/.test(sourceHash ?? '') && /^[a-f0-9]{64}$/.test(outputHash ?? '')
    );
    if (!sourceHash || !output || !approved) missing.push(path);
  }
  if (missing.length) {
    console.error(`Public release blocked: owner approval is missing or does not match source hashes for: ${missing.join(', ')}`);
    process.exit(1);
  }
}
if (!['disabled', 'enabled'].includes(commitmentMode)) {
  console.error('Commitment reveal blocked: COMMITMENT_REVEAL_MODE must be disabled or enabled.');
  process.exit(1);
}
if (commitmentMode === 'enabled') {
  const announcement = JSON.parse(await readFile(resolve('content/commitment-announcement.json'), 'utf8'));
  const valid = announcement && announcement.verified === true && announcement.published === true && announcement.rights === 'approved' && typeof announcement.source === 'string' && announcement.source.trim() && typeof announcement.sourceDate === 'string' && Number.isFinite(Date.parse(announcement.sourceDate)) && typeof announcement.school === 'string' && announcement.school.trim() && typeof announcement.displayCopy === 'string' && announcement.displayCopy.trim();
  if (!valid) {
    console.error('Commitment reveal blocked: an enabled announcement requires an approved, published, source-backed record.');
    process.exit(1);
  }
}
console.log(publicRelease ? 'Release media preflight passed; exported files are still checked after build.' : `Preview media mode ${previewMediaMode ? 'enabled' : 'disabled'}.`);
