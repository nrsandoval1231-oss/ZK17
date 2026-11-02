'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MediaAsset, PreviewPhoto, PublicProfile, ScenePhoto } from '@/content/site';
import styles from './arrival.module.css';

type Props = {
  profile: PublicProfile;
  photo?: PreviewPhoto | ScenePhoto;
  film: MediaAsset | null;
  onWatch: (opener: HTMLButtonElement) => void;
};

function ResponsivePhoto({ photo }: { photo: PreviewPhoto | ScenePhoto }) {
  const base = photo.kind === 'preview' ? photo.src.replace(/-706\.webp$/, '') : null;
  const srcSet = (format: string) => [360, 540, 706].map(width => `${base}-${width}.${format} ${width}w`).join(', ');
  const focal = photo.kind === 'preview' ? photo.focal : photo.focalPoint;
  return <figure className={styles.photo}>
    <picture>
      {base && <>
        <source type="image/avif" srcSet={srcSet('avif')} sizes="(max-width: 700px) 92vw, 60vw" />
        <source type="image/webp" srcSet={srcSet('webp')} sizes="(max-width: 700px) 92vw, 60vw" />
      </>}
      <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} priority unoptimized style={{ objectPosition: focal }} />
    </picture>
    {photo.kind === 'preview' && <figcaption><i />{photo.label}</figcaption>}
  </figure>;
}

export default function ArrivalExperience({ profile, photo, film, onWatch }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const overlay = useRef<SVGSVGElement>(null);
  const filmCopy = useRef<HTMLDivElement>(null);
  const name = profile.name.trim().split(/\s+/);
  const given = name.slice(0, -1).join(' ');
  const family = name.at(-1) ?? '';

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const scope = gsap.context(() => {
      mm.add({ reduce: '(prefers-reduced-motion: reduce)', desktop: '(min-width: 900px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
        const isReduce = context.conditions?.reduce;
        const isDesktop = context.conditions?.desktop;
        if (!isReduce) {
          gsap.fromTo(`.${styles.photo}`, { xPercent: -8, scale: 1.04 }, { xPercent: 0, scale: 1, duration: 1.55, ease: 'power3.out' });
          gsap.fromTo(`.${styles.title}`, { yPercent: 22, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05, delay: .22, ease: 'power3.out' });
          gsap.fromTo(`.${styles.meta}, .${styles.corner}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6, delay: .65, stagger: .1 });
          gsap.fromTo(`.${styles.lightSweep}`, { xPercent: -140 }, { xPercent: 140, duration: 1.7, ease: 'power2.out' });
          gsap.to(`.${styles.heroMain}`, { yPercent: -8, scale: .97, ease: 'none', scrollTrigger: { trigger: `.${styles.hero}`, start: 'top top', end: 'bottom top', scrub: .6 } });
        }
        if (!overlay.current || !filmCopy.current) return;
        if (isReduce) {
          gsap.set(overlay.current, { autoAlpha: 0 });
          gsap.set(filmCopy.current, { autoAlpha: 1, y: 0 });
          return;
        }
        const transition = gsap.timeline({
          scrollTrigger: {
            id: 'arrival-cinema',
            trigger: `.${styles.cinema}`, start: isDesktop ? 'top top' : 'top 85%', end: isDesktop ? '+=100%' : 'top 10%',
            scrub: .7, pin: Boolean(isDesktop), invalidateOnRefresh: true,
          },
        });
        transition.fromTo(overlay.current, { scale: 1, autoAlpha: 1 }, { scale: 5, autoAlpha: 1, ease: 'none', duration: .82 }, 0)
          .to(overlay.current, { autoAlpha: 0, ease: 'none', duration: .18 }, .82)
          .fromTo(filmCopy.current, { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', duration: .48 }, .5);
      });
    }, element);
    return () => { scope.revert(); mm.revert(); };
  }, []);

  useEffect(() => {
    const media = video.current;
    const stage = root.current?.querySelector(`.${styles.cinema}`);
    if (!media || !stage || !film?.src) return;
    const source = film.src;
    let near = false;
    let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setPlayback = () => {
      const shouldPlay = near && !reduced && document.visibilityState === 'visible';
      if (shouldPlay) {
        if (media.getAttribute('src') !== source) { media.src = source; media.load(); }
        if (media.paused) void media.play().catch(() => {});
      } else if (!media.paused || media.hasAttribute('src')) {
        media.pause(); media.removeAttribute('src'); media.load();
      }
    };
    const observer = new IntersectionObserver(entries => {
      near = entries.some(entry => entry.isIntersecting);
      setPlayback();
    }, { rootMargin: '0px', threshold: 0.05 });
    const visibility = () => setPlayback();
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChange = (event: MediaQueryListEvent) => { reduced = event.matches; setPlayback(); };
    observer.observe(stage);
    document.addEventListener('visibilitychange', visibility);
    motionQuery.addEventListener('change', motionChange);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); motionQuery.removeEventListener('change', motionChange); media.pause(); media.removeAttribute('src'); media.load(); };
  }, [film?.src]);

  return <>
    <div ref={root} className={styles.arrival}>
    <section id="arrival" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.lightSweep} aria-hidden="true" />
      <div className={styles.heroHead}><span className={styles.corner}>ZEPHYR KREYE <i /> OFFICIAL ATHLETE WEBSITE</span><span className={styles.number}>17</span></div>
      <div className={styles.heroMain}>
        {photo ? <ResponsivePhoto photo={photo} /> : <div className={styles.photoFallback} role="img" aria-label="Athlete photo pending">17</div>}
        <div className={styles.nameBlock}>
          <h1 id="hero-title" className={styles.title}><span>{given.toUpperCase()}</span><span>{family.toUpperCase()}</span></h1>
          <div className={styles.meta}><p>{profile.position.toUpperCase()}<b> / </b>{profile.school.toUpperCase()}<br />{profile.location.toUpperCase()}<b> · </b>ZK{profile.number}</p><div className={styles.actions}><button type="button" onClick={event => onWatch(event.currentTarget)}>WATCH THE FILM <span aria-hidden="true">↗</span></button><a href="#film-room">SCROLL TO BEGIN <span aria-hidden="true">↓</span></a></div></div>
        </div>
      </div>
      <div className={styles.heroFoot}><span>ANNA, TEXAS</span><span>ATHLETE / {profile.position.toUpperCase()}</span></div>
    </section>
    <section className={styles.cinema} id="film-room" aria-labelledby="film-title">
      <div className={styles.cinemaVideo}>
        {(film?.poster ?? photo?.src) && <Image className={styles.poster} src={(film?.poster ?? photo?.src)!} alt="" fill unoptimized sizes="100vw" />}
        {film?.src ? <video ref={video} className={styles.video} muted loop playsInline preload="none" poster={film.poster ?? photo?.src} aria-label="Muted cinematic football footage featuring Zephyr Kreye" /> : <div className={styles.videoFallback} aria-hidden="true">ZK17</div>}
      </div>
      <svg ref={overlay} className={styles.mask} aria-hidden="true"><defs><mask id="arrival-number-cutout"><rect width="100%" height="100%" fill="white"/><text className={styles.maskNumber} x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="black">17</text></mask></defs><rect width="100%" height="100%" fill="#090b0b" mask="url(#arrival-number-cutout)"/></svg>
      <span className={styles.portalLabel}>ZK17 <i /> THE GAME MOVES FAST</span>
        <div ref={filmCopy} className={styles.filmCopy}><p>FILM ROOM / ZEPHYR KREYE</p><h2 id="film-title">EVERY<br />SECOND<br /><em>COUNTS.</em></h2><button type="button" onClick={event => onWatch(event.currentTarget)}>WATCH WITH SOUND <span aria-hidden="true">↗</span></button></div>
        <span className={styles.filmIndex}>FILM ROOM <i /> ZEPHYR KREYE / 17</span>
    </section></div>
  </>;
}
