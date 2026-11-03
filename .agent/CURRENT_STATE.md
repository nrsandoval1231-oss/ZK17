# ZK17 owner-authorized production release

Owner requested final GSAP desktop/mobile QA then merge/deploy. Product78ba2726 reviewed; no source edits. Current scrollsuite60pass, separateAstra8WebKitpass, liveforward/reverse/pin/header/rotation/reducedmotion checks pass. Sample WebKitcomparison didnotregress versuscurrentproduction (p9545mscandidate vs51msbaseline); no physicaliPhone/60fpsclaim. ExactDEV a720a051/source78ba272. Evidence .agent/evidence/release-scroll/QA.md and review.md.

Next: exacthead/base gate, squashmergePR11 with release message, existingCloudflareproduction(main) deployment; verify exactmergeSHA/productiondomainbehavior+assetparity and realHudlplayback. Mainbefore release5bfba97/production5093e24c. Current authorization expressly includes production; oldpreview-only limitations no longer apply to this release. Keepcredentials/settings/unrelatedlocalpreviewlogs intact.
