import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { auditPreviewDistribution } from '../scripts/audit-export.mjs';

describe('release export media boundary', () => {
  it('blocks preview files in public sources and in exported output even when preview mode is disabled', async () => {
    const root = await mkdtemp(join(tmpdir(), 'zk17-release-audit-'));
    const publicDirectory = join(root, 'public');
    const exportDirectory = join(root, 'out');
    const previewPath = 'media/arrival-706.webp';
    const output = '/media/arrival-706.webp';
    try {
      await mkdir(join(publicDirectory, 'media'), { recursive: true });
      await mkdir(join(exportDirectory, 'media'), { recursive: true });
      await writeFile(join(publicDirectory, previewPath), 'preview');
      await assert.rejects(auditPreviewDistribution({ previewOutputs: [output], publicDirectory, exportDirectory, publicRelease: true }), /preview-only media file/);
      await rm(join(publicDirectory, previewPath));
      await writeFile(join(exportDirectory, previewPath), 'preview');
      await assert.rejects(auditPreviewDistribution({ previewOutputs: [output], publicDirectory, exportDirectory, publicRelease: true }), /preview-only media file/);
      await rm(join(exportDirectory, previewPath));
      await assert.doesNotReject(auditPreviewDistribution({ previewOutputs: [output], publicDirectory, exportDirectory, publicRelease: true }));
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
  it('fails prebuild when commitment reveal is enabled without a published approved announcement', () => {
    const result = spawnSync(process.execPath, ['scripts/release-check.mjs'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: { ...process.env, PUBLIC_RELEASE: 'false', PREVIEW_MEDIA_MODE: 'false', COMMITMENT_REVEAL_MODE: 'enabled' },
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Commitment reveal blocked/);
  });
});
