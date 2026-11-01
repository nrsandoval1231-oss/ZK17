'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** One motion owner per story. All geometry and inline styles revert together. */
export function useStoryMotion(root: RefObject<HTMLElement | null>) {
 useEffect(() => {
  const element = root.current;
  if (!element) return;
  const mm = gsap.matchMedia();
  const context = gsap.context(() => {
   mm.add({ desktop: '(min-width: 900px) and (min-height: 650px)', motion: '(prefers-reduced-motion: no-preference)' }, (media) => {
    if (!media.conditions?.motion) return;
    const desktop = media.conditions.desktop;
    const select = gsap.utils.selector(element);
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out', duration: .65 } });
    // Opacity stays readable: the hero never waits behind a loader or a fade from zero.
    entrance.from('.header-logo', { y: -8, opacity: .9 }, 0)
     .from('.hero-title > span', { yPercent: 16, opacity: .9, stagger: .08 }, .06)
     .from('.hero-photo img', { scale: 1.045, duration: .85 }, .12)
     .from('.hero-foot, .hero-coord', { y: 10, opacity: .9 }, .22)
     .from('.scroll-cue', { y: -6, opacity: .9 }, .32);

    const hero = gsap.timeline({ scrollTrigger: { trigger: '#arrival', start: 'top top', end: 'bottom top', scrub: true }, defaults: { ease: 'none' } });
    hero.to('.hero-photo', { yPercent: desktop ? 22 : 8 }, 0)
     .to('.hero-title', { xPercent: desktop ? -3 : -1, yPercent: -5 }, 0)
     .to('.hero-mark', { yPercent: -16, xPercent: 4 }, 0);

    // A single bounded timeline owns every field layer; no competing scrub triggers.
    const field = select('#on-field')[0];
    const story = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
     trigger: field, start: desktop ? 'top top' : 'top 82%',
     end: desktop ? '+=65%' : 'top 22%', pin: desktop ? field : false,
     scrub: desktop ? .45 : true, anticipatePin: desktop ? 1 : 0, invalidateOnRefresh: true,
    } });
    story.fromTo('.field-photo img', { scale: 1.025 }, { scale: desktop ? 1.14 : 1.06, duration: 1 }, 0)
     .fromTo('.field-mark', { xPercent: 10, yPercent: 3 }, { xPercent: -9, yPercent: -4, duration: 1 }, 0)
     .fromTo('.field-title-line', { yPercent: 30, opacity: .9 }, { yPercent: 0, opacity: 1, stagger: .12, duration: .48 }, .05)
     .fromTo('.field-base, .field-caption', { y: 12, opacity: .9 }, { y: 0, opacity: 1, duration: .35 }, .5);

    gsap.utils.toArray<HTMLElement>('[data-reveal]', element).forEach(el => {
     // Never hide content on a direct anchor landing or on a fast scroll.
     gsap.from(el, { y: desktop ? 24 : 12, opacity: .9, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
    });
    gsap.from('.film-title-line', { yPercent: 24, opacity: .9, stagger: .1, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.film-copy', start: 'top 88%', once: true } });
    gsap.from('.film-frame', { scale: .96, y: desktop ? 36 : 14, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: '.film-frame', start: 'top 92%', once: true } });
    gsap.from('.film-copy .section-note, .film-copy .text-action', { y: 10, opacity: .9, stagger: .12, duration: .55, scrollTrigger: { trigger: '.film-copy', start: 'top 75%', once: true } });
    gsap.utils.toArray<HTMLElement>('.approved-gallery > figure', element).forEach(el => {
     gsap.from(el, { y: 18, scale: .98, opacity: .9, duration: .65, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
    });

    // The light chapter drifts instead of locking: no motion on arcade controls.
    gsap.utils.toArray<HTMLElement>('.world-card', element).forEach((card, index) => {
     gsap.from(card.querySelector('h3'), { y: 18, opacity: .9, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } });
     gsap.fromTo(card.querySelector('.world-photo img'), { yPercent: index ? -3 : 3, scale: 1.07 }, { yPercent: index ? 3 : -3, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    const rail = select('#offfield-personal .offfield-rail')[0] as HTMLElement | undefined;
    const track = rail?.querySelector<HTMLElement>('.offfield-track');
    const travel = () => Math.max(0, (track?.scrollWidth ?? 0) - (rail?.clientWidth ?? 0));
    if (desktop && rail && track && travel() > 0) gsap.to(track, { x: () => -travel(), ease: 'none', scrollTrigger: { trigger: rail, pin: rail, start: 'top 90px', end: () => `+=${travel()}`, scrub: .45, invalidateOnRefresh: true } });

    gsap.from('.journey-track', { scaleX: 0, ease: 'none', scrollTrigger: { trigger: '.journey-stage', start: 'top 80%', end: 'bottom 65%', scrub: true } });
    gsap.utils.toArray<HTMLElement>('.verified-milestones article, .journey-end', element).forEach(el => gsap.from(el, { y: 12, opacity: .9, duration: .55, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    gsap.from('.next-graphic', { yPercent: 10, scale: .94, ease: 'none', scrollTrigger: { trigger: '#next-chapter', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.next-copy h2', { scale: .97, transformOrigin: 'left center', duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.next-copy', start: 'top 90%', once: true } });
    gsap.from('.closing-wordmark', { yPercent: 10, opacity: .9, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.closing-wordmark', start: 'top 95%', once: true } });
   });
  }, element);
  // Fonts, late local images and filtered data can change trigger geometry.
  let disposed = false;
  let frame = 0;
  const refresh = () => {
   cancelAnimationFrame(frame);
   frame = requestAnimationFrame(() => {
    if (disposed) return;
    // Pin measurement briefly moves DOM nodes; retain keyboard focus in the arcade.
    const focused = document.activeElement;
    ScrollTrigger.refresh();
    if (focused instanceof HTMLElement && focused !== document.body && focused.isConnected && document.activeElement !== focused) focused.focus({ preventScroll: true });
   });
  };
  void document.fonts.ready.then(refresh);
  element.addEventListener('load', refresh, true);
  const observer = new ResizeObserver(refresh);
  element.querySelectorAll('.approved-gallery, .numbers-content, .verified-milestones').forEach(el => observer.observe(el));
  return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); element.removeEventListener('load', refresh, true); mm.revert(); context.revert(); };
 }, [root]);
}
