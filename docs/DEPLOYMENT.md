# Deployment runbook
Target: owner GitHub nrsandoval1231-oss/ZK17 (empty verified 2026-10-25); Cloudflare Pages separate review project `zk17-review` with production branch `owner-approved-release`, deploy branch `review` only.
Static export: npm ci; npm run typecheck; npm run lint; npm test; npm run build. Upload only out/ . Never upload repository root, docs, .agent, originals, source credentials or unverified data.
Preview: `npx wrangler pages deploy out --project-name zk17-review --branch review --commit-hash <reviewedSHA>` . Record actual result URL and deployment ID, then test in browser. No final public domain binding or production deployment.
Cloudflare direct upload documentation: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
Static Next.js export documentation: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
Review preview is URL-accessible and noindex, not authenticated. Only approved preview assets and public owner-supplied identity facts may enter it.
Final release: resolve docs/MEDIA_INVENTORY.md and .agent/FINISH_CONTRACT.md, owner review, set approved SITE_URL and explicit index/release flags as implemented, validate rebuilt candidate, publish only with owner authorization.
