'use client';

import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useArrivalHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const container = element.parentElement!;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const layer = (name: string) => element.querySelector<HTMLElement>(`[data-arrival-layer="${name}"]`);
      const lights = layer('lights')!;
      const smokeBack = layer('smoke-back')!;
      const smokeFront = layer('smoke-front')!;
      const silhouette = layer('silhouette');
      const athlete = layer('athlete');
      const running = layer('running');
      const rear = layer('rear');
      const white = layer('white');
      const photos = [silhouette, athlete, running, rear, white].filter(Boolean);
      const copy = element.querySelector('[data-arrival-statement]');
      const details = element.querySelectorAll('[data-arrival-detail]');
      gsap.set([lights, smokeBack, smokeFront, ...photos], { opacity: 0 });
      gsap.set([copy, ...details], { autoAlpha: 0 });
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'arrival-hero', trigger: element,
        start: () => `top ${parseFloat(getComputedStyle(container).paddingTop) || 0}px`,
        end: () => `+=${(element.offsetHeight + (parseFloat(getComputedStyle(container).paddingTop) || 0)) * 15}`, scrub: .35, pin: true, invalidateOnRefresh: true,
      } });
      // Durations express relative scroll distance, not autoplay time.
      timeline.to({}, { duration: 2 })
        .to(lights, { opacity: .8, duration: 1.5 }, 2)
        .fromTo(lights.children, { opacity: .08 }, { opacity: 1, stagger: .25, duration: .7 }, 2)
        .to(smokeBack, { opacity: .9, xPercent: 4, duration: 2 }, 4)
        .to(smokeFront, { opacity: .8, xPercent: -4, duration: 2 }, 4)
        .to({}, { duration: 10 }, 6);
      if (silhouette) timeline.to(silhouette, { opacity: .85, scale: 1.03, duration: 1.4 }, 6);
      if (athlete) timeline.to(athlete, { opacity: .95, scale: 1.05, duration: 2 }, 8);
      if (silhouette) timeline.to(silhouette, { opacity: 0, duration: 1 }, 8.5);
      if (athlete && running) timeline.to(athlete, { opacity: 0, duration: .6 }, 10.5).to(running, { opacity: 1, scale: 1.04, duration: .7 }, 10.5);
      if (running && rear) timeline.to(running, { opacity: 0, duration: .6 }, 11.8).to(rear, { opacity: 1, scale: 1.04, duration: .7 }, 11.8);
      if (rear && white) timeline.to(rear, { opacity: 0, duration: .6 }, 13).to(white, { opacity: 1, scale: 1.04, duration: .7 }, 13);
      if (white) timeline.to(white, { opacity: 0, duration: .7 }, 14);
      if (athlete) timeline.to(athlete, { opacity: .7, scale: .98, duration: 1.3 }, 14);
      timeline.to([copy, ...details], { autoAlpha: 1, duration: .8 }, 14.2)
        .to(smokeFront, { opacity: .3, xPercent: 5, duration: 1.5 }, 14);
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('orientationchange', refresh);
      return () => { window.removeEventListener('orientationchange', refresh); timeline.kill(); };
    });
    return () => mm.revert();
  }, [root]);
}
