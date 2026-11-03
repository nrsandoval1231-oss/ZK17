'use client';
import { useRef, useState } from 'react';
import AthletePhoto from './athlete-photo';
import type { LifePhoto } from '@/content/life';
import styles from './worlds.module.css';
export default function LifeGallery({ photos }: { photos: LifePhoto[] }) {
 const rail = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(0);
 const move = (index: number) => {
  const element = rail.current;
  const target = element?.children[index] as HTMLElement | undefined;
  if (!element || !target) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollTo({ left: target.offsetLeft - element.offsetLeft - (element.clientWidth - target.clientWidth) / 2, behavior: reduced ? 'instant' : 'smooth' });
 };
 return <section className={styles.lifeGallery} aria-labelledby="life-gallery-title"><header className={styles.sectionHeading}><div><p className={styles.kicker}>THE IN-BETWEEN MOMENTS</p><h2 id="life-gallery-title">LIFE OUTSIDE<br /><span>THE LINES.</span></h2></div><p>The people. The places.<br />The moments that stay.</p></header>
 {photos.length > 0 ? <><div ref={rail} className={`${styles.photoRail} ${photos.length === 1 ? styles.singlePhoto : ''}`} tabIndex={photos.length > 1 ? 0 : undefined} role="region" aria-roledescription="carousel" aria-label="Life outside the lines photographs" onScroll={() => { const element = rail.current; if (!element) return; const center = element.scrollLeft + element.clientWidth / 2; let closest = 0, distance = Infinity; Array.from(element.children).forEach((child, index) => { const item = child as HTMLElement; const diff = Math.abs(item.offsetLeft - element.offsetLeft + item.clientWidth / 2 - center); if (diff < distance) { distance = diff; closest = index; } }); setActive(closest); }} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(Math.max(0, Math.min(photos.length - 1, active + (event.key === 'ArrowLeft' ? -1 : 1)))); } }}>
 {photos.map((item, index) => <figure key={item.id} className={`${styles.lifeFrame} ${index === active ? styles.activeFrame : ''}`} aria-label={`${index + 1} of ${photos.length}`}><AthletePhoto photo={item.photo} sizes="(max-width: 700px) 78vw, 46vw" /><figcaption><span>0{index + 1}</span>{item.caption}</figcaption></figure>)}</div>
 {photos.length > 1 && <div className={styles.galleryControls}><button onClick={() => move(active - 1)} disabled={active === 0} aria-label="Previous photograph">Previous</button><p aria-live="polite">{active + 1} / {photos.length}</p><button onClick={() => move(active + 1)} disabled={active === photos.length - 1} aria-label="Next photograph">Next</button></div>}</> : null}
 <p className={styles.galleryPending}>More of life outside football is on the way.<br />Family, friends, and adventure photographs are awaiting Zephyr’s selection.</p>
 </section>;
}
