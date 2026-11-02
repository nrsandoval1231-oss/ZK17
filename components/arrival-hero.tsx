'use client';

import Image from 'next/image';
import { useRef } from 'react';
import type { PreviewPhoto, PublicProfile, ScenePhoto } from '@/content/site';
import { brand } from '@/content/brand';
import { useArrivalHeroMotion } from './use-arrival-hero-motion';
import styles from './arrival-hero.module.css';

type Photo = PreviewPhoto | ScenePhoto;
type Props = { profile: PublicProfile; photo?: Photo; photos?: Photo[]; onWatch: (button: HTMLButtonElement) => void };

function Layer({ photo, layer, className, decorative = true }: { photo?: Photo; layer: string; className: string; decorative?: boolean }) {
  if (!photo) return null;
  const base = photo.kind === 'preview' && /-706\.webp$/.test(photo.src) ? photo.src.replace(/-706\.webp$/, '') : null;
  const campaign = photo.kind === 'preview' && photo.id.startsWith('campaign-');
  const campaignBase = campaign ? photo.src.replace(/-640\.svg$/, '') : null;
  const focal = photo.kind === 'preview' ? photo.focal : photo.focalPoint;
  return <div className={`${styles.layer} ${className} ${layer === 'athlete' && photo.kind === 'preview' && photo.id === 'arrival' ? styles.arrivalCutout : ''}`} data-arrival-layer={layer} data-campaign-photo={campaign || undefined}>
    <picture>{campaignBase && <source srcSet={`${campaignBase}-320.svg 320w, ${campaignBase}-640.svg 640w`} sizes={layer === 'stadium' ? '100vw' : layer === 'athlete' ? '(max-width: 700px) 48vw, 25vw' : '(max-width: 700px) 25vw, 30vw'} />} {base && <source type="image/avif" srcSet={[360, 540, 706].map(width => `${base}-${width}.avif ${width}w`).join(', ')} sizes="(max-width: 700px) 80vw, 45vw" />}
      <Image src={photo.src} alt={decorative ? '' : photo.alt} width={photo.width} height={photo.height} loading={layer === 'athlete' ? 'eager' : 'lazy'} fetchPriority={layer === 'athlete' ? 'high' : 'auto'} unoptimized style={{ objectPosition: focal }} />
    </picture>
  </div>;
}

export default function ArrivalHero({ profile, photo, photos = [], onWatch }: Props) {
  const root = useRef<HTMLElement>(null);
  useArrivalHeroMotion(root);
  const find = (id: string) => photos.find(item => item.id === id);
  const athlete = find('campaign-front') ?? photo ?? find('arrival');
  return <section ref={root} id="arrival" data-arrival-hero className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.atmosphere} aria-hidden="true" />
    <Layer photo={find('campaign-stadium')} layer="stadium" className={styles.stadium} />
    <Layer photo={find('campaign-closeup') ?? athlete} layer="portrait-left" className={styles.left} />
    <Layer photo={find('campaign-rear') ?? find('throwing')} layer="rear" className={styles.rear} />
    <div className={styles.mark} data-arrival-layer="mark" aria-hidden="true" style={{ maskImage: `url(${brand.monogram.src})`, WebkitMaskImage: `url(${brand.monogram.src})` }} />
    <Layer photo={athlete} layer="athlete" className={styles.athlete} decorative={false} />
    <Layer photo={find('campaign-profile') ?? find('portrait')} layer="portrait-right" className={styles.right} />
    <Layer photo={find('running') ?? find('on-field')} layer="action" className={styles.action} />
    <div className={styles.copy} data-arrival-statement>
      <p data-arrival-detail className={styles.identity}>{profile.name.toUpperCase()} / QB {profile.number}</p>
      <h1 id="hero-title"><span>MAKE THEM</span>{" "}<span>REMEMBER.</span></h1>
      <p data-arrival-detail className={styles.school}>ANNA COYOTES / {profile.position.toUpperCase()}</p>
      <button data-arrival-detail className={styles.watch} type="button" onClick={event => onWatch(event.currentTarget)}>WATCH THE FILM <span aria-hidden="true">↗</span></button>
    </div>
    <p data-arrival-detail className={styles.footer}>PREPARATION | DISCIPLINE | RESULTS</p>
    <a data-arrival-detail className={styles.scroll} href="#film-room">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
    {athlete?.kind === 'preview' && <span data-arrival-detail className={styles.preview}>PREVIEW CROP · ORIGINAL PENDING</span>}
  </section>;
}
