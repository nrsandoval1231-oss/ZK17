'use client';

import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useArrivalHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px) and (min-height: 650px)' }, context => {
      if (!context.conditions?.motion) return;
      const desktop = Boolean(context.conditions.desktop);
      const layer = (name: string) => element.querySelector(`[data-arrival-layer="${name}"]`);
      const lines = element.querySelectorAll('#hero-title span');
      const timeline = gsap.timeline({ scrollTrigger: {
        id: 'arrival-hero', trigger: element, start: 'top top', end: desktop ? '+=185%' : 'bottom top',
        scrub: .6, pin: desktop, invalidateOnRefresh: true,
      } });
      const rear = layer('rear');
      if (rear) timeline.fromTo(rear, { opacity: .15, xPercent: -8 }, { opacity: .7, xPercent: 0, duration: 1 }, 0);
      timeline.fromTo(layer('mark'), { opacity: .2, scale: 1.08 }, { opacity: .8, scale: 1, duration: 1 }, .5)
        .fromTo([layer('athlete'), layer('portrait-left'), layer('portrait-right'), layer('action')].filter(Boolean), { opacity: .35, yPercent: 3 }, { opacity: 1, yPercent: 0, stagger: .12, duration: 1 }, 1)
        .fromTo(lines, { opacity: .55, yPercent: 10 }, { opacity: 1, yPercent: 0, stagger: .3, duration: .7 }, 1.6)
        .to(element.querySelectorAll('[data-arrival-layer]'), { scale: .98, duration: .8 }, 2.7);
      return () => timeline.kill();
    });
    return () => mm.revert();
  }, [root]);
}
