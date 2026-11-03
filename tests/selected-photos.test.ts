import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import sharp from 'sharp';
import { athletePhotos } from '../content/athlete-photos';

type SelectedPhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  focalPoint: string;
  variants: { width: number; webp: string; avif: string }[];
  source: string;
  sourceDate: string;
  sha256: string;
};

const requiredIds = ['discovery-field', 'field-hero', 'personal-home', 'personal-sideline'];
const repoRoot = resolve(import.meta.dirname, '..');

async function manifest(): Promise<SelectedPhoto[]> {
  return JSON.parse(await readFile(resolve(repoRoot, 'content/selected-photos.json'), 'utf8')) as SelectedPhoto[];
}

function localAsset(path: string): string {
  assert.match(path, /^\/media\/selected\/[\w.-]+\.(?:avif|webp)$/);
  return resolve(repoRoot, 'public', path.slice(1));
}

describe('owner-selected photo assets', () => {
  it('keeps discovery, field hero, Beyond hero, and gallery on distinct owner selections', async () => {
    const photos = await manifest();
    const byId = new Map(photos.map(photo => [photo.id, photo]));
    for (const id of requiredIds) assert.ok(byId.has(id), `missing selected photo ${id}`);
    assert.ok(byId.has('personal-portrait') || byId.has('personal-birthday'), 'missing selected Beyond 17 hero original');
    assert.notEqual(byId.get('discovery-field')?.src, byId.get('field-hero')?.src);
    const personalPortrait = byId.get('personal-portrait') ?? byId.get('personal-birthday');
    assert.notEqual(personalPortrait?.src, byId.get('personal-home')?.src);
    assert.notEqual(personalPortrait?.src, byId.get('personal-sideline')?.src);
    assert.notEqual(byId.get('personal-home')?.src, byId.get('personal-sideline')?.src);
    for (const photo of photos) {
      assert.doesNotMatch(`${photo.id} ${photo.src} ${photo.alt} ${photo.source}`, /restaurant|dining|menu|food[-_ ]?photo/i);
      assert.match(photo.sha256, /^[a-f0-9]{64}$/i, `${photo.id} must retain original-source SHA-256`);
      assert.ok(Number.isFinite(Date.parse(photo.sourceDate)), `${photo.id} must have a source date`);
      assert.ok(photo.source.trim().length > 0, `${photo.id} must retain provenance`);
      assert.ok(photo.alt.trim().length > 0, `${photo.id} must have descriptive alt text`);
      assert.ok(/^\d{1,3}% \d{1,3}%$/.test(photo.focalPoint), `${photo.id} must define a focal point`);
      assert.ok(photo.variants.length > 0, `${photo.id} must have responsive derivatives`);
      const widths = photo.variants.map(variant => variant.width);
      assert.deepEqual(widths, [...widths].sort((a, b) => a - b), `${photo.id} variants should be ordered by width`);
      assert.ok(widths.every(width => width <= photo.width), `${photo.id} must not upscale its originals`);
      for (const variant of photo.variants) {
        for (const path of [variant.webp, variant.avif]) {
          const metadata = await sharp(localAsset(path)).metadata();
          assert.equal(metadata.width, variant.width, `${photo.id} derivative dimensions should match manifest`);
          assert.ok(metadata.height && metadata.height > 0, `${photo.id} derivative must be a valid image`);
          assert.ok(!metadata.exif && !metadata.iptc && !metadata.xmp, `${photo.id} derivative must not leak embedded metadata`);
        }
      }
    }
  });

  it('routes each UI role to its intended photo and hides review-only selections when preview mode is off', async () => {
    const byId = new Map((await manifest()).map(photo => [photo.id, photo]));
    const prior = process.env.PREVIEW_MEDIA_MODE;
    try {
      process.env.PREVIEW_MEDIA_MODE = 'true';
      const preview = athletePhotos();
      assert.equal(preview.field?.id, 'field-hero');
      assert.equal(preview.discoveryField?.id, 'discovery-field');
      assert.ok(['personal-portrait', 'personal-birthday'].includes(preview.portrait?.id ?? ''), 'Beyond hero must use its selected personal original');
      assert.equal(preview.discoveryPortrait?.id, 'personal-portrait');
      for (const id of ['field-hero', 'discovery-field', preview.portrait!.id, 'personal-portrait']) {
        const rolePhoto: { id: string; src: string } | undefined = [preview.field, preview.discoveryField, preview.portrait, preview.discoveryPortrait].find(photo => photo?.id === id);
        assert.ok(rolePhoto, `photo role ${id} must be available in preview mode`);
        assert.equal(rolePhoto.src, byId.get(id)?.src);
      }
      const publicPhotos = JSON.parse(execFileSync(process.execPath, [
        '--import', 'tsx', '--input-type=module', '-e',
        "const { athletePhotos } = await import('./content/athlete-photos.ts'); console.log(JSON.stringify(athletePhotos()));",
      ], { cwd: repoRoot, env: { ...process.env, PREVIEW_MEDIA_MODE: 'false' }, encoding: 'utf8' })) as Record<string, { id: string; src: string } | undefined>;
      for (const selected of Object.values(publicPhotos)) {
        if (selected?.src.startsWith('/media/selected/')) assert.fail(`review selection ${selected.id} leaked with PREVIEW_MEDIA_MODE=false`);
      }
    } finally {
      if (prior === undefined) delete process.env.PREVIEW_MEDIA_MODE;
      else process.env.PREVIEW_MEDIA_MODE = prior;
    }
  });

  it('matches original-source hashes and derivative hashes to the photo provenance ledger', async () => {
    const photos = await manifest();
    const ledger = JSON.parse(await readFile(resolve(repoRoot, 'docs/SELECTED_PHOTOS.json'), 'utf8')) as {
      id: string; sourceSha256: string; sourceName: string; outputs: { path: string; sha256: string }[];
    }[];
    const byId = new Map(ledger.map(item => [item.id, item]));
    for (const photo of photos) {
      const record = byId.get(photo.id);
      assert.ok(record, `${photo.id} must be documented in the provenance ledger`);
      assert.equal(photo.sha256, record.sourceSha256, `${photo.id} must fingerprint the original`);
      assert.ok(photo.source.includes(record.sourceName), `${photo.id} must name its original source`);
      for (const variant of photo.variants) for (const path of [variant.webp, variant.avif]) {
        const outputRecord: { path: string; sha256: string } | undefined = record.outputs.find(item => item.path === path);
        assert.ok(outputRecord, `${path} must be listed in the provenance ledger`);
        const actual = createHash('sha256').update(await readFile(localAsset(path))).digest('hex');
        assert.equal(actual, outputRecord.sha256, `${path} bytes should match their recorded hash`);
      }
    }
  });
});
