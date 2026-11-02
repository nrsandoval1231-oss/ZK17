import { createServer } from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve('out');
// Optional CDN-like transfer compression for local performance checks. Default behavior is unchanged.
const compress = process.argv.includes('--compress');
const portFlag = process.argv.indexOf('--port');
const port = Number(process.env.PORT ?? (portFlag >= 0 ? process.argv[portFlag + 1] : 3100));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.avif': 'image/avif', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const candidate = resolve(root, `.${pathname}`);
    if (candidate !== root && !candidate.startsWith(root + sep)) throw new Error('Invalid path');
    let file = candidate;
    if ((await stat(file).catch(() => null))?.isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    const contentType = types[extname(file)] ?? 'application/octet-stream';
    // Browsers (especially Safari) seek MP4 through byte-range requests.
    // Match static-host behavior so local regression checks exercise real playback.
    if (request.headers.range && contentType === 'video/mp4') {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      let start = match?.[1] ? Number(match[1]) : 0;
      let end = match?.[2] ? Number(match[2]) : body.length - 1;
      if (match && !match[1] && match[2]) { start = Math.max(0, body.length - Number(match[2])); end = body.length - 1; }
      if (!match || start > end || start >= body.length) {
        response.writeHead(416, { 'Content-Range': `bytes */${body.length}` }); response.end(); return;
      }
      end = Math.min(end, body.length - 1);
      response.writeHead(206, { 'Content-Type': contentType, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 });
      response.end(body.subarray(start, end + 1)); return;
    }
    const canCompress = compress && body.length > 1024 && /^(text\/|application\/json|image\/svg)/.test(contentType);
    const gzipPreference = String(request.headers['accept-encoding'] ?? '').split(',').find(value => value.trim().split(';')[0] === 'gzip');
    const useGzip = canCompress && gzipPreference && !/;\s*q=0(?:\.0+)?\s*(?:;|$)/.test(gzipPreference);
    response.writeHead(200, { 'Content-Type': contentType, 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes', ...(canCompress ? { Vary: 'Accept-Encoding' } : {}), ...(useGzip ? { 'Content-Encoding': 'gzip' } : {}) });
    response.end(useGzip ? gzipSync(body) : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', function () { console.log(`Static export at http://127.0.0.1:${this.address().port}`); });
