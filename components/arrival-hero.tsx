'use client';

import Image from 'next/image';
import { useRef, type CSSProperties } from 'react';
import type { PreviewPhoto, PublicProfile, ScenePhoto } from '@/content/site';
import { useArrivalHeroMotion } from './use-arrival-hero-motion';
import styles from './arrival-hero.module.css';
import { brand } from '@/content/brand';

type Photo = PreviewPhoto | ScenePhoto;
type Props = { profile: PublicProfile; photo?: Photo; photos?: Photo[]; onWatch: (button: HTMLButtonElement) => void };

function PhotoLayer({ photo, layer, className, decorative = true, eager = false }: { photo?: Photo; layer: string; className: string; decorative?: boolean; eager?: boolean }) {
  if (!photo) return null;
  const directors = photo.kind === 'preview' && photo.id.startsWith('directors-');
  const focal = photo.kind === 'preview' ? photo.focal : photo.focalPoint;
  return <div className={`${styles.photo} ${className}`} data-arrival-layer={layer} aria-hidden={decorative || undefined} style={{ '--photo-url': `url("${photo.src}")` } as CSSProperties}>
    <div className={styles.photoFrame}><picture>{directors && <source srcSet={`${photo.src.replace('-960.webp', '-480.webp')} 480w, ${photo.src} 960w`} sizes="(max-width: 700px) 100vw, 60vw" />}
      <Image src={photo.src} alt={decorative ? '' : photo.alt} width={photo.width} height={photo.height} loading={eager ? 'eager' : 'lazy'} priority={eager} unoptimized style={{ objectPosition: focal }} />
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
      <div className={styles.beam} data-arrival-beam /><div className={styles.beam} data-arrival-beam /><div className={styles.beam} data-arrival-beam /><div className={styles.beam} data-arrival-beam />
    </div>
    <div className={styles.smokeBack} data-arrival-layer="smoke-back" aria-hidden="true" />
    <div className={styles.stadium} data-arrival-layer="stadium" aria-hidden="true">
      <picture className={styles.stadiumMono}>
        <source media="(max-width: 899px)" srcSet="/media/anna-stadium-mono-768.webp" />
        <Image src="/media/anna-stadium-mono-1500.webp" alt="" fill loading="eager" fetchPriority="high" unoptimized sizes="100vw" />
      </picture>
      <picture className={styles.stadiumColor} data-arrival-layer="stadium-color">
        <source media="(max-width: 899px)" srcSet="/media/anna-stadium-color-768.webp" />
        <Image src="/media/anna-stadium-color-1500.webp" alt="" fill loading="eager" unoptimized sizes="100vw" />
      </picture>
    </div>
    <div className={styles.coldLogo} data-arrival-layer="cold-logo" aria-hidden="true"><Image src={brand.monogram.src} alt="" fill priority unoptimized sizes="75vw" /></div>
    <div className={styles.monogram} data-arrival-layer="monogram" aria-hidden="true"><Image src={brand.monogram.src} alt="" fill unoptimized sizes="85vw" /></div>
    <PhotoLayer photo={find('campaign-closeup') ?? photo} layer="closeup" className={styles.closeup} />
    <PhotoLayer photo={athlete} layer="athlete" className={styles.athlete} decorative={false} eager />
    <PhotoLayer photo={running} layer="running" className={styles.montage} />
    <PhotoLayer photo={rear} layer="rear" className={styles.montage} />
    <PhotoLayer photo={white} layer="white" className={styles.montage} />
    <div className={styles.smokeFront} data-arrival-layer="smoke-front" aria-hidden="true" />
    <div className={styles.grain} data-arrival-layer="grain" aria-hidden="true" />
    <div className={styles.copy} data-arrival-statement>
      <p data-arrival-detail className={styles.identity}>{profile.name.toUpperCase()} / QB {profile.number}</p>
      <h1 id="hero-title" aria-hidden="true"><span>MAKE THEM</span>{' '}<span>REMEMBER.</span></h1>
      <p data-arrival-detail className={styles.school}>ANNA COYOTES / {profile.position.toUpperCase()}</p>
      <button data-arrival-detail className={styles.watch} type="button" onClick={event => onWatch(event.currentTarget)}>WATCH THE FILM <span aria-hidden="true">↗</span></button>
    </div>
    <a className={styles.skip} href="#film-room">Skip intro ↓</a>
    <p data-arrival-detail className={styles.footer}>PREPARATION | DISCIPLINE | RESULTS</p>
    <a data-arrival-detail className={styles.scroll} href="#film-room">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
  </section>;
}
