import { mkdir, rename, writeFile, rm } from 'node:fs/promises';
import { dirname } from 'node:path';

// GoogleChrome/web-vitals src/lib/LayoutShiftManager.ts uses strict <1000/<5000.
// https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/LayoutShiftManager.ts
export function createCLSAccumulator() {
 let first = null, last = null, session = 0, largest = 0;
 return { observe(entry) {
  if (entry.hadRecentInput) return largest;
  if (first !== null && last !== null && entry.startTime - last < 1000 && entry.startTime - first < 5000) session += entry.value;
  else { first = entry.startTime; session = entry.value; }
  last = entry.startTime;
  largest = Math.max(largest, session);
  return largest;
 }, value() { return largest; } };
}

export function captureSelection(cases, selected, root = 'artifacts/arrival-directors-cut') {
 if (selected && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(selected) || !cases.includes(selected))) throw new Error(`Unknown capture case: ${selected}`);
 return { names: selected ? [selected] : cases, output: selected ? `${root}/filtered/${selected}` : `${root}/full`, canonical: !selected };
}

// Commit only after every case succeeded. Failure leaves prior evidence intact.
export async function writeJSONAtomic(path, value) {
 await mkdir(dirname(path), { recursive: true });
 const temporary = `${path}.${process.pid}.tmp`;
 try { await writeFile(temporary, JSON.stringify(value, null, 2) + '\n'); await rename(temporary, path); }
 finally { await rm(temporary, { force: true }); }
}
