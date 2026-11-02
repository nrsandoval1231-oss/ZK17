'use client';

import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';
import type { PreviewPhoto, PublicProfile, ScenePhoto } from '@/content/site';
import { useArrivalHeroMotion } from './use-arrival-hero-motion';
import styles from './arrival-hero.module.css';

type Photo = PreviewPhoto | ScenePhoto;
type Props = { profile: PublicProfile; photo?: Photo; photos?: Photo[]; onWatch: (button: HTMLButtonElement) => void };

function PhotoLayer({ photo, layer, className, decorative = true }: { photo?: Photo; layer: string; className: string; decorative?: boolean }) {
  if (!photo) return null;
  const directors = photo.kind === 'preview' && photo.id.startsWith('directors-');
  const focal = photo.kind === 'preview' ? photo.focal : photo.focalPoint;
  return <div className={`${styles.photo} ${className}`} data-arrival-layer={layer} aria-hidden={decorative || undefined} style={{ '--photo-url': `url("${photo.src}")` } as CSSProperties}>
    <div className={styles.photoFrame}><picture>{directors && <source srcSet={`${photo.src.replace('-960.webp', '-480.webp')} 480w, ${photo.src} 960w`} sizes="(max-width: 700px) 100vw, 60vw" />}
      <Image src={photo.src} alt={decorative ? '' : photo.alt} width={photo.width} height={photo.height} loading="lazy" unoptimized style={{ objectPosition: focal }} />
    </picture></div>
  </div>;
}

export default function ArrivalHero({ profile, photo, photos = [], onWatch }: Props) {
  const root = useRef<HTMLElement>(null);
  useArrivalHeroMotion(root);
  const find = (id: string) => photos.find(item => item.id === id);
  const athlete = find('directors-standing') ?? photo ?? find('arrival');
  const rear = find('directors-rear');
  const white = find('directors-white');
  const running = find('directors-action');
  return <section ref={root} id="arrival" data-arrival-hero className={styles.hero} aria-labelledby="arrival-heading">
    <h1 id="arrival-heading" className="sr-only">MAKE THEM REMEMBER.</h1>
    <div className={styles.lights} data-arrival-layer="lights" aria-hidden="true">
      <div className={styles.beam} /><div className={styles.beam} /><div className={styles.beam} /><div className={styles.beam} />
    </div>
    <div className={styles.smokeBack} data-arrival-layer="smoke-back" aria-hidden="true" />
    <PhotoLayer photo={athlete} layer="silhouette" className={styles.silhouette} />
    <PhotoLayer photo={athlete} layer="athlete" className={styles.athlete} decorative={false} />
    <PhotoLayer photo={running} layer="running" className={styles.montage} />
    <PhotoLayer photo={rear} layer="rear" className={styles.montage} />
    <PhotoLayer photo={white} layer="white" className={styles.montage} />
    <div className={styles.smokeFront} data-arrival-layer="smoke-front" aria-hidden="true" />
    <div className={styles.grain} aria-hidden="true" />
    <div className={styles.copy} data-arrival-statement>
      <p data-arrival-detail className={styles.identity}>{profile.name.toUpperCase()} / QB {profile.number}</p>
      <h1 id="hero-title" aria-hidden="true"><span>MAKE THEM</span>{' '}<span>REMEMBER.</span></h1>
      <p data-arrival-detail className={styles.school}>ANNA COYOTES / {profile.position.toUpperCase()}</p>
      <button data-arrival-detail className={styles.watch} type="button" onClick={event => onWatch(event.currentTarget)}>WATCH THE FILM <span aria-hidden="true">↗</span></button>
    </div>
    <p data-arrival-detail className={styles.footer}>PREPARATION | DISCIPLINE | RESULTS</p>
    <a data-arrival-detail className={styles.scroll} href="#film-room">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
  </section>;
}
