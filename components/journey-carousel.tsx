'use client';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { SocialLink } from '@/content/site';
import EditorialPhoto, { type EditorialPhotoSource } from './editorial-photo';
import styles from './homepage-chapters.module.css';

export default function JourneyCarousel({ photos, socials }: { photos: EditorialPhotoSource[]; socials: SocialLink[] }) {
 const rail = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(Math.min(2, Math.max(0, photos.length - 1)));
 const frame = useRef(0);
 const select = useCallback((index: number) => {
  const element = rail.current;
  const card = element?.children[index] as HTMLElement | undefined;
  if (!element || !card) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollTo({left:card.offsetLeft - (element.clientWidth-card.clientWidth)/2,behavior:reduced ? 'instant' : 'smooth'});
 }, []);
 useLayoutEffect(()=>{
  const element=rail.current;
  const index=Math.min(2, Math.max(0, photos.length-1));
  const card=element?.children[index] as HTMLElement | undefined;
  if(element && card) element.scrollLeft=card.offsetLeft-(element.clientWidth-card.clientWidth)/2;
  return ()=>cancelAnimationFrame(frame.current);
 },[photos.length]);
 const measure = () => {
  cancelAnimationFrame(frame.current);
  frame.current=requestAnimationFrame(()=>{
   const element=rail.current;
   if(!element)return;
   const center=element.getBoundingClientRect().left+element.clientWidth/2;
   let closest=0, distance=Infinity;
   Array.from(element.children).forEach((child,index)=>{const box=child.getBoundingClientRect();const next=Math.abs(box.left+box.width/2-center);if(next<distance){closest=index;distance=next;}});
   setActive(closest);
  });
 };
 return <section id="follow-the-journey" className={styles.social} aria-labelledby="social-title">
  <div className={styles.socialCopy}><p className={styles.index}>05 <i/></p><h2 id="social-title">FOLLOW<br/>THE <em>JOURNEY.</em></h2><p className={styles.tagline}>THE STORY CONTINUES.</p></div>
  <div className={styles.carousel}>
   {photos.length > 0 ? <><div ref={rail} className={styles.photoRail} role="region" aria-roledescription="carousel" aria-label="Zephyr’s photo journal" tabIndex={0} onScroll={measure} onKeyDown={event=>{
    const next=event.key==='ArrowRight'?Math.min(active+1,photos.length-1):event.key==='ArrowLeft'?Math.max(active-1,0):event.key==='Home'?0:event.key==='End'?photos.length-1:null;
    if(next!==null){event.preventDefault();select(next);}
   }}>
    {photos.map((photo,index)=><div className={styles.photoSlide} key={photo.id} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${photos.length}`} data-active={active===index} onClick={()=>select(index)}><EditorialPhoto photo={photo} sizes="(max-width: 600px) 66vw, (max-width: 900px) 42vw, 24vw"/></div>)}
   </div><div className={styles.pagination} role="group" aria-label="Choose a photograph">{photos.map((photo,index)=><button key={photo.id} type="button" aria-label={`Show photograph ${index+1}`} aria-current={active===index?'true':undefined} onClick={()=>select(index)}><span/></button>)}</div><p className="sr-only" aria-live="polite">Photograph {active+1} of {photos.length}</p></> : <p className={styles.photoPending}>The next frame is still to come.</p>}
   {socials.length > 0 && <nav className={styles.socialLinks} aria-label="Verified social profiles">{socials.map(link=><a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span></a>)}</nav>}
  </div>
 </section>;
}
