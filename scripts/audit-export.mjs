import { access, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

export async function auditPreviewDistribution({
  previewOutputs,
  previewApprovals = [],
  previewSourceHashes = new Map(),
  publicDirectory = resolve('public'),
  exportDirectory = resolve('out'),
  publicRelease = process.env.PUBLIC_RELEASE === 'true',
}) {
  if (!publicRelease) return { blocked: false, previewFiles: [] };
  const roots = [publicDirectory, exportDirectory];
  const previewFiles = [];
  for (const output of previewOutputs) {
    if (typeof output !== 'string' || !output.startsWith('/media/')) throw new Error(`Invalid preview media manifest path: ${output}`);
    const safeName = output.slice(1);
    for (const root of roots) {
      const base = resolve(root);
      const candidate = resolve(base, safeName);
      const relativePath = relative(base, candidate);
      if (relativePath === '..' || relativePath.startsWith(`..${sep}`)) throw new Error(`Preview media path escapes its distribution directory: ${output}`);
      if (!(await exists(candidate))) {
        previewFiles.push(`${root === publicDirectory ? 'public' : 'out'}/${safeName} (missing)`);
      } else {
        const bytes = await readFile(candidate);
        const outputHash = createHash('sha256').update(bytes).digest('hex');
        const sourceHash = previewSourceHashes.get(output);
        const approved = previewApprovals.some((record) => record.status === 'approved' && record.approvedBy === 'owner' &&
          record.sourceSha256 === sourceHash && record.outputPaths?.includes(output) && record.outputSha256?.[output] === outputHash);
        if (!approved) previewFiles.push(`${root === publicDirectory ? 'public' : 'out'}/${safeName}`);
      }
    }
  }
  if (previewFiles.length) throw new Error(`Public release blocked: ${previewFiles.length} required preview derivative(s) are missing, unapproved, or changed in the public/export distribution.`);
  return { blocked: false, previewFiles: [] };
}

const scriptPath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === scriptPath) {
  void (async () => {
    const manifestPath = resolve(dirname(scriptPath), '../docs/PREVIEW_MEDIA_MANIFEST.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const outputs = [...new Set(manifest.filter((item) => item.usage === 'preview-only').flatMap((item) => item.outputs))];
    const approvals = JSON.parse(await readFile(resolve(dirname(scriptPath), '../content/media-approvals.json'), 'utf8'));
    const sourceHashes = new Map();
    for (const item of manifest.filter((entry) => entry.usage === 'preview-only')) for (const output of item.outputs ?? []) sourceHashes.set(output, item.sourceSha256);
    for (const path of ['/media/on-field-owner-2026-10-16.jpg', '/media/beyond-17-owner.webp']) {
      const bytes = await readFile(resolve(dirname(scriptPath), `../public${path}`)).catch(() => null);
      if (bytes) sourceHashes.set(path, createHash('sha256').update(bytes).digest('hex'));
    }
    outputs.push('/media/on-field-owner-2026-10-16.jpg', '/media/beyond-17-owner.webp');
    try {
      const result = await auditPreviewDistribution({ previewOutputs: outputs, previewApprovals: approvals.records, previewSourceHashes: sourceHashes });
      console.log(result.blocked ? 'Preview media export blocked.' : process.env.PUBLIC_RELEASE === 'true' ? 'Release export media audit passed.' : 'Preview export media audit skipped for non-release build.');
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  })();
}
