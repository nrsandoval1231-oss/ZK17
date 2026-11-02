import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { auditPreviewDistribution } from '../scripts/audit-export.mjs';
import { arrivalCampaignPhotos } from '../content/arrival-campaign';

test('every distributed campaign photo is included in the preview-only release boundary', async () => {
  const manifest = JSON.parse(await readFile('docs/PREVIEW_MEDIA_MANIFEST.json', 'utf8'));
  const guarded = new Set<string>(manifest.filter((row: {usage:string}) => row.usage === 'preview-only').flatMap((row: {outputs:string[]}) => row.outputs));
  for (const directory of ['arrival-campaign', 'arrival-directors-cut']) {
    const files = await readdir(`public/media/${directory}`);
    assert.ok(files.length >= 8);
    for (const file of files) assert.ok(guarded.has(`/media/${directory}/${file}`), `Unprotected review photograph: ${directory}/${file}`);
  }
  for (const photo of arrivalCampaignPhotos) assert.ok(guarded.has(photo.src));
  await assert.rejects(auditPreviewDistribution({ previewOutputs: [...guarded], publicRelease:true }), /preview-only media file/);
});
