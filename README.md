# ZK17 — official site

A static, eight-scene editorial site for Zephyr Kreye. It uses only owner-supplied profile facts and clearly labeled CSS/SVG placeholder artwork while approved original media is unavailable. No statistics, milestones, offers, social links, partnership details, or personal preferences are prefilled.

## Requirements

Node.js 20.9 or newer and npm.

## Local development

```sh
npm install
npm run dev
```

## Checks and export

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run e2e
```

`npm run build` creates the static site in `out/`. The browser suite uses Playwright and requires its Chromium browser (`npx playwright install chromium`). Tailwind CSS 4 is available alongside the authored styles. Hosting headers in `public/_headers` are Cloudflare Pages-compatible and mark the preview noindex. Keep preview indexing disabled. A canonical domain, sitemap, robots allow rule, and final public release require owner approval and the approved public URL. The generated Person JSON-LD and Open Graph art use supplied identity only and do not depict the athlete.

## Content and evidence

Edit `content/site.ts`. Keep content records typed. An item is publicly eligible only when verified, published, and accompanied by a source and source date. Media additionally requires approved rights and an actual local source. Highlights also require a published media asset. Stats require a positive season and game count. Social destinations must use HTTPS. Empty collections are deliberate until evidence is approved. The commitment model is fixed to `UNCOMMITTED`; do not add private commitment information to public source.

Preview crops are isolated in the `previewPhotos` content model and enabled by `PREVIEW_MEDIA_MODE` (enabled by default for the review build). They are explicitly labeled `PREVIEW CROP · ORIGINAL PENDING` and never pass the rights-approved public media gate. A public build must set `PREVIEW_MEDIA_MODE=false`; the prebuild release check blocks `PUBLIC_RELEASE=true` while preview media is enabled.

Use `node scripts/optimize-media.mjs <approved-original-path> <lowercase-slug>` for a local raster photo. It writes AVIF and WebP responsive variants, respects EXIF orientation, preserves aspect ratio, never upscales, and strips source metadata. Rebuild the graphic-only social preview with `node scripts/generate-og.mjs`. Place authorized original assets under `public/media/` and reference the local path. Do not use screenshots, external athlete photography, or generated people. For approved film, add a verified video record with `kind: 'video'`, a local MP4 `src`, approved rights, source metadata, and optional local poster path. The Film Room modal will use the native player and provides keyboard Escape dismissal. Set explicit width/height and useful alt text when adding photos.

Fonts are self-hosted via `@fontsource` (Barlow Condensed and DM Sans); their packages carry OFL licensing.

## Preview

The app intentionally ships `noindex` metadata and `public/robots.txt` disallowing crawl. Do not remove either until an owner-approved production release configures its canonical host, sitemap, and corresponding allow rule. No deployment is performed by this project build.
