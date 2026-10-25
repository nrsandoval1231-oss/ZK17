import { access, readFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

export async function auditPreviewDistribution({
  previewOutputs,
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
      if (await exists(candidate)) previewFiles.push(`${root === publicDirectory ? 'public' : 'out'}/${safeName}`);
    }
  }
  if (previewFiles.length) throw new Error(`Public release blocked: ${previewFiles.length} preview-only media file(s) remain in the public/export distribution. Replace or remove each preview derivative and update its manifest before release.`);
  return { blocked: false, previewFiles: [] };
}

const scriptPath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === scriptPath) {
  void (async () => {
    const manifestPath = resolve(dirname(scriptPath), '../docs/PREVIEW_MEDIA_MANIFEST.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const outputs = [...new Set(manifest.filter((item) => item.usage === 'preview-only').flatMap((item) => item.outputs))];
    try {
      const result = await auditPreviewDistribution({ previewOutputs: outputs });
      console.log(result.blocked ? 'Preview media export blocked.' : process.env.PUBLIC_RELEASE === 'true' ? 'Release export media audit passed.' : 'Preview export media audit skipped for non-release build.');
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  })();
}
