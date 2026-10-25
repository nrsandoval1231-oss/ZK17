# Content owner handoff
Update typed content in content/site.ts. Public eligibility is an affirmative gate, never inferred from array presence.

| Domain | Needed before publication |
| --- | --- |
| Athlete profile | Owner-confirmed public identity only |
| Photo | Original export, descriptive alt, intrinsic dimensions, focal point, source, use-rights approval |
| Highlight | Approved source and rights, title, season, optional verified opponent/game/date, captions/transcript |
| Statistics | Season, game count, source, date, verification and publish approval |
| Milestone/offer | Confirmed event/date, reliable source, explicit publish flag |
| Games/movies/TV shows | Owner supplied the current top three in each category; further changes need owner approval |
| Social | Each owner-approved HTTPS profile URL; no profile is inferred or linked when the list is empty |
| NIL/business contact | Owner-approved parent/representative email or HTTPS contact URL, with source, date, verification, and publication approval |
| Partnership | Verified and approved public association |
| Commitment | Disabled until announcement is public and owner authorizes; never place unannounced payload in repo/public client bundle |

An absence is an empty state, not permission to invent. Remove temporary preview crops before final release and replace with authentic originals. No analytics is enabled.

The NIL contact record lives in content/contact.ts and defaults to null. Keep it null until an owner-approved public destination is ready to commit; never put private or pending contact details in repository files. Only publicNilContact() output reaches the client. The gate rejects unverified, unpublished, unapproved, malformed, non-HTTPS, or control-character destinations. Approved email links use a prefilled NIL inquiry subject.
