# Release and review builds
The current build remains a non-indexed review preview and uses only owner-authorized preview crops. All final original-file/rights gates remain open.

Preview environment:
SITE_URL=https://review.zk17-review.pages.dev
PUBLIC_RELEASE=false
PREVIEW_MEDIA_MODE=true
COMMITMENT_REVEAL_MODE=disabled

PUBLIC_RELEASE=true triggers both preflight and exported-file checks. Setting PREVIEW_MEDIA_MODE=false is insufficient while any manifest-listed preview derivative remains in public/ or out/. Replace/remove those files explicitly before final release. The checker does not delete source media automatically.

Approved originals: add source-backed rights-approved MediaAsset entries with dimensions/alt/focalPoint and ScenePhotoAssignment entries for arrival/on-field/off-field/closing; approved slots outrank preview fallback. Preserve original aspect and optimize with scripts/optimize-media.mjs.

Commitment: content/commitment-announcement.json is null. Never stage an unannounced school or payload there, in environment variables, or source. Only after announcement is already public and owner approved, add a verified/published/approved source/date record and set COMMITMENT_REVEAL_MODE=enabled. Invalid enable fails the build; default client model contains no announcement payload.

Public launch also requires approved domain, contacts/socials/media and owner authorization; indexing is intentionally blocked in current robots/meta/headers and must be deliberately reviewed for launch.
