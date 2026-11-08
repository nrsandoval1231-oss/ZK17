# Hero montage expansion

## Goal
Use the nine owner-supplied football photos as a semi-transparent, grayscale collage around the existing bold center portrait in Arrival. Owner authorization to publish these photos and edits is recorded with source/output hashes; release/media approval checks remain mandatory.

## Scope
- Copy the nine named Instagram JPGs from the owner media folder into `public/media/arrival-montage/` without modifying their pixels.
- Add preview-only photo metadata, hero layers, responsive placements, and reveal timing.
- Add all nine files to the media approval ledger and release preflight so a public build verifies each owner approval and exact output hash.
- Build with `PUBLIC_RELEASE=true` and `PREVIEW_MEDIA_MODE=false`; after PR review/merge, upload only `out/` to the verified production branch `main` of `zk17-review`.

## Guardrails
- The central `directors-standing` portrait remains full opacity and in front of the new layers.
- New montage photos are decorative and semi-transparent. Do not change page copy or other chapters.
- Record the existing owner grant precisely; do not waive hash checks. Merge only the new reviewed PR and deploy only the verified `main` production branch.

## Acceptance
- All nine user-provided source files are represented in the montage and media manifest with source/output hashes and owner approvals.
- `PUBLIC_RELEASE=true PREVIEW_MEDIA_MODE=false npm run build` passes the production preflight and export audit. Independent Astra review accepted the release candidate with no P1/P2 findings.
- Deployed desktop and narrow/mobile views show the collage while the central portrait stays prominent; no broken images or horizontal overflow.
- Record the merged commit, actual production deployment and live verification.

## Current evidence
- `PREVIEW_MEDIA_MODE=true PUBLIC_RELEASE=false npm run build`: passed.
- `git diff --check` and preview-manifest JSON parse: passed.
- `PUBLIC_RELEASE=true node scripts/audit-export.mjs`: correctly blocked 18 missing/unapproved preview copies (nine assets in `public/` and `out/`).
- Cloudflare project `zk17-review` production branch verified as `main`; uploaded only `out/` to preview branch `dev` at `https://fcc73554.zk17-review.pages.dev`.
- Desktop rendering shows the central portrait bold over the faded grayscale collage. At 390px, all nine new layers loaded at opacity 0.29; center portrait opacity 1 / z-index 8; no horizontal overflow.
- Astra independently accepted the unstaged candidate with no P1/P2 findings; reviewer confirmed hashes, opacity/stacking, reduced-motion hierarchy, responsive readability, and release audit rejection. Physical-iPhone performance remains unverified.
- The Cloudflare Pages production branch is `main`; its production build now runs the release build and prepares the video-range worker. Owner-approved media hashes are recorded in `content/media-approvals.json` and remain subject to the release audit.
- Next: create a fresh PR because PR #14 is already merged; merge only after required checks pass; verify the automatic `main` production deployment, hero on desktop/mobile, and HTTP 206 ranges for both videos.
