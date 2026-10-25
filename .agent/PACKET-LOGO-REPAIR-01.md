# ZK-06-R1 — footer flow repair
Base 79a896027d7729618e9d681e444845ed34e5c823. Focused repair, Luna only. Owner canonical logo intent unchanged. Sol independent review FIX: square closing logo changed footer flow; .closing-future absolute bottom position now collides with copyright/mobile and desktop rule.

Allowed: app/globals.css and .agent/LOGO_REPAIR_COMPLETION.json only. Excluded all assets/content/components/deployment/other files. You are not alone; preserve other edits. Move .closing-future to normal footer flow after closing-bottom (already after it in DOM), position static, transform none, centered modest margin; let closing height grow. Ensure desktop and mobile separation, no clipping/overlap. No other polish.

Run focused lint/diffcheck. Parent rebuild/screenshots/gates and Sol rescore exact candidate. Retry budget one scoped materially distinct repair; no push/deploy/certification. Record start/finish and evidence. Do not reuse old green tests as current proof.
