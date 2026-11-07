const videos = new Set([
  '/media/zephyr-cinematic.mp4',
  '/media/zephyr-monochrome-full.mp4',
]);

export default {
  async fetch(request, env) {
    const { hostname, pathname } = new URL(request.url);
    const range = /^bytes=(\d*)-(\d*)$/i.exec(request.headers.get('Range') ?? '');
    if (!hostname.endsWith('.zk17-review.pages.dev') || request.method !== 'GET' ||
        !videos.has(pathname) || !range || (!range[1] && !range[2])) {
      return env.ASSETS.fetch(request);
    }

    const headers = new Headers(request.headers);
    headers.delete('Range');
    headers.delete('If-Range');
    const asset = await env.ASSETS.fetch(new Request(request, { headers }));
    if (asset.status !== 200) return asset;

    const validator = request.headers.get('If-Range');
    if (validator && validator !== asset.headers.get('ETag') &&
        validator !== asset.headers.get('Last-Modified')) return asset;

    const bytes = await asset.arrayBuffer();
    const size = bytes.byteLength;
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    const responseHeaders = new Headers(asset.headers);
    responseHeaders.delete('Content-Encoding');
    responseHeaders.set('Accept-Ranges', 'bytes');

    if (start > end || start >= size) {
      responseHeaders.set('Content-Range', 'bytes */' + size);
      responseHeaders.set('Content-Length', '0');
      return new Response(null, { status: 416, headers: responseHeaders });
    }

    responseHeaders.set('Content-Range', 'bytes ' + start + '-' + end + '/' + size);
    responseHeaders.set('Content-Length', String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), { status: 206, headers: responseHeaders });
  },
};
