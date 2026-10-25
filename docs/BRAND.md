# ZK17 brand asset provenance

The owner supplied and approved the sword-and-ZK monogram as the canonical ZK17 logo on 2026-10-25. The exact supplied JPEG is retained at `brand/zk17-monogram-master.jpg` (1254 × 1254 px). Its SHA256 is `6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736`.

The generated logo images preserve the full square composition and black background. `scripts/generate-brand.mjs` verifies the master hash before producing square PNG derivatives at 32, 64, 180 and 512 px, plus `public/favicon.png` and a self-contained `public/favicon.svg` from the 64 px derivative, and `public/apple-touch-icon.png` at 180 px. It does not redraw, recolor, or crop the source mark. `scripts/generate-og.mjs` verifies the same master and places a 540 × 540 px square derivative in the 1200 × 630 px social image while retaining the athlete name, #17, class year, and campaign line.

Run `node scripts/generate-brand.mjs` and `node scripts/generate-og.mjs` from the repository root to reproduce the assets. Presentation metadata lives in `content/brand.ts`; `components/brand-logo.tsx` renders the supplied monogram with its accessible text and explicit square dimensions.
