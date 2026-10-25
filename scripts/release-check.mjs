import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const previewMediaMode = process.env.PREVIEW_MEDIA_MODE !== 'false';
const publicRelease = process.env.PUBLIC_RELEASE === 'true';
const commitmentMode = process.env.COMMITMENT_REVEAL_MODE ?? 'disabled';
if (publicRelease && previewMediaMode) {
  console.error('Public release blocked: set PREVIEW_MEDIA_MODE=false and replace preview-only assets with rights-approved media before release.');
  process.exit(1);
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
