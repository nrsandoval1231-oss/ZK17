# ZK17 brand asset provenance

The owner supplied and approved the sword-and-ZK monogram as the canonical ZK17 logo on 2026-10-25. The exact supplied JPEG is retained at `brand/zk17-monogram-master.jpg` (1254 × 1254 px). Its SHA256 is `6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736`.

The transparent derivatives preserve the full square composition and negative spaces. `scripts/generate-brand.mjs` verifies the master hash and embeds the exact JPEG as a luminance mask in `brand/zk17-monogram-transparent.svg`; its monotone component transfer removes black background noise while retaining the original geometry. The SVG is self-contained, and `sharp` rasterizes it into the downloadable 1254 × 1254 PNG, 32, 64, 180 and 512 px variants, `public/favicon.png` and a self-contained `public/favicon.svg`, and `public/apple-touch-icon.png`. Existing variant paths are regenerated with true alpha; active 512px use is cache-busted at `public/brand/zk17-monogram-512-v2.png`. The JPEG remains immutable and is the only geometry source. `scripts/generate-og.mjs` verifies the same master and composites the transparent mark at 540 × 540 px into the opaque 1200 × 630 px social image while retaining the athlete name, #17, class year, and campaign line.

Run `node scripts/generate-brand.mjs` and `node scripts/generate-og.mjs` from the repository root to reproduce the assets. Presentation metadata lives in `content/brand.ts`; `components/brand-logo.tsx` renders the supplied monogram with its accessible text and explicit square dimensions.


## Usage rule
Use the supplied monogram as the only ZK17 logo. Do not pair it with a duplicate ZK17 wordmark. The athlete's name and jersey-number storytelling remain editorial content.
