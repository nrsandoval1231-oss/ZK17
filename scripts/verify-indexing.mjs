import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = 'https://zephyrkreye.com';
for (const route of ['', 'recruiting/', 'playoffs/']) {
  const html = await readFile(`out/${route}index.html`, 'utf8');
  const robots = [...html.matchAll(/<meta\b[^>]*name="(?:robots|googlebot)"[^>]*>/gi)].map(match => match[0]);
  assert.ok(robots.some(tag => /content="index, follow"/.test(tag)), `${route || '/'} must permit indexing`);
  assert.ok(robots.every(tag => !/noindex|nofollow|none/i.test(tag)), `${route || '/'} must not block indexing`);
  assert.ok(html.includes(`<link rel="canonical" href="${base}/${route}"`), `${route || '/'} needs its own production canonical`);
}
const headers = await readFile('out/_headers', 'utf8');
const rules = headers.trim().split(/\n\s*\n/).map(block => block.split(/\r?\n/).filter(line => !line.startsWith('#')));
assert.ok(!rules.find(lines => lines[0] === '/*')?.some(line => /X-Robots-Tag/i.test(line)), 'Production must not inherit a blocking header');
for (const pattern of ['https://:project.pages.dev/*', 'https://:version.:project.pages.dev/*']) {
  assert.ok(rules.some(lines => lines[0] === pattern && lines.some(line => /X-Robots-Tag: noindex, nofollow/.test(line))), `${pattern} must stay excluded`);
}
const robotsTxt = await readFile('out/robots.txt', 'utf8');
assert.match(robotsTxt, /User-agent: \*\s+Allow: \//);
assert.ok(!/Disallow:\s*\//i.test(robotsTxt));
assert.ok(robotsTxt.includes(`Sitemap: ${base}/sitemap.xml`));
const sitemap = await readFile('out/sitemap.xml', 'utf8');
for (const route of ['', 'recruiting/', 'playoffs/']) assert.ok(sitemap.includes(`<loc>${base}/${route}</loc>`));
console.log('Indexing export verified: 3 page metadata/canonicals, production and preview header boundaries, robots.txt, sitemap.');

