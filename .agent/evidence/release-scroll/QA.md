# Owner-authorized release scroll QA

Owner explicitly authorized desktop/mobile GSAP check, then merge and production deploy. Reviewed product78ba2726ecd2714884ce661b6d82f2966c2ce529; DEV immutablea720a051/source78ba272 verified through authenticated deployment listing. No source changes for this release check.

Fresh scrolling suite60/60pass includes forward/reverse, photo accumulation, unchanged2.4/1.6viewport travel, pin/header release, fast navigation, resizing/rotation, reduced-motion activation/cleanup and directFilmanchor. SeparateAstra independently reran8/8iPhoneWebKit cases and found no release-blocking product defect. Prior complete suite213pass7conditional skips is supporting historical evidence; latest removal focused36pass and current60pass are distinct.

Live desktopChromium/mobileChromium/iPhone-sizedWebKit forward/reverse200rAF samples each passed pin/header/reversecoldlogo/nooverflow/noerrors. Frame timings are headless Windows browser-emulation evidence, not physical-device or60fps certification. Initial WebKit p9547ms/6frames>50ms; isolatedWebKit p9552ms/14frames>50ms. Same-engine back-to-back comparison: existingproductionp9551ms/13frames>50ms, candidateimmutablep9545ms/2frames>50ms (200frames each). This sample shows no regression versus baseline; it is not a sustained deviceperformance benchmark.

Before merge: exactPRhead/base checked. Production target existingCloudflarePages zk17-review/main, prior5bfba97/deployment5093e24c. Merge and production deployment are now owner-authorized; earlier preview-only handoff restrictions are superseded for this release. Verify resulting mergeSHA deployment identity and actual production UI/assets/Hudl/scroll after deployment; no credential/configuration changes needed.
