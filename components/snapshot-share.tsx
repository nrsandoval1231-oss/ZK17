'use client';
import { useState } from 'react';

export default function SnapshotShare() {
 const [message, setMessage] = useState('');
 const [fallback, setFallback] = useState('');
 async function copy() {
  const url = new URL('/recruiting/', location.origin).href;
  try { await navigator.clipboard.writeText(url); setMessage('Link copied.'); setFallback(''); }
  catch { setFallback(url); setMessage('Copy the snapshot address below.'); }
 }
 return <div className="snapshot-share"><button className="text-action" onClick={copy}>COPY SNAPSHOT LINK</button><p role="status" aria-live="polite">{message}</p>{fallback && <label>Snapshot address<input readOnly value={fallback} onFocus={event => event.currentTarget.select()} /></label>}</div>;
}
