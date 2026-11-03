'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { MediaAsset, PreviewPhoto, PublicProfile, ScenePhoto } from '@/content/site';
import { brand } from '@/content/brand';
import ArrivalHero from './arrival-hero';
import styles from './arrival.module.css';

type Props = { profile: PublicProfile; photo?: PreviewPhoto | ScenePhoto; photos?: Array<PreviewPhoto | ScenePhoto>; film: MediaAsset | null };
export default function ArrivalExperience({ profile, photo, photos, film }: Props) {
 const video = useRef<HTMLVideoElement>(null);
 useEffect(() => {
  const media = video.current;
  if (!media || !film?.src) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let near = false;
  const playback = () => {
   if (near && !motion.matches && document.visibilityState === 'visible') void media.play().catch(() => {});
   else media.pause();
  };
  const observer = new IntersectionObserver(entries => { near = entries.some(item => item.isIntersecting); playback(); }, { threshold: .1 });
  observer.observe(media);
  motion.addEventListener('change', playback); document.addEventListener('visibilitychange', playback);
  return () => { observer.disconnect(); motion.removeEventListener('change', playback); document.removeEventListener('visibilitychange', playback); media.pause(); };
 }, [film?.src]);
 return <div className={styles.arrival}>
  <ArrivalHero profile={profile} photo={photo} photos={photos} />
  <section className={styles.cinema} id="film-room" aria-labelledby="film-title">
   <div className={styles.cinemaVideo}>{film?.src && <video ref={video} className={styles.video} src={film.src} controls muted loop playsInline preload="none" poster="/media/zephyr-cinematic-poster.webp" aria-label="Cinematic football footage featuring Zephyr Kreye" />}</div>
   <div className={styles.blackLogo}><Image src={brand.monogram.src} alt={brand.monogram.alt} width={100} height={100} unoptimized /></div>
   <div className={styles.filmCopy}><p>ZEPHYR KREYE / 17</p><h2 id="film-title">EVERY<br />SECOND<br />COUNTS.</h2></div>
  </section>
 </div>;
}
