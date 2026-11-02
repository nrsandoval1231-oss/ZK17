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
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 650px) and (hover: hover) and (pointer: fine)', () => {
      const layer = (name: string) => element.querySelector(`[data-arrival-layer="${name}"]`);
      const rear = layer('rear');
      const mark = layer('mark');
      const portraits = ['athlete', 'portrait-left', 'portrait-right', 'action'].map(layer).filter(Boolean);
      const lines = element.querySelectorAll('#hero-title span');
      const details = element.querySelectorAll('[data-arrival-detail]');
      // Initialize all children together; staggered tweens alone leave later lines visible.
      gsap.set(portraits, { opacity: 0, yPercent: 3 });
      gsap.set(lines, { opacity: 0, yPercent: 10 });
      gsap.set(details, { opacity: 0 });
      gsap.set(mark, { opacity: rear ? 0 : .15, scale: 1.08 });
      if (rear) gsap.set(rear, { opacity: .65, xPercent: -8 });
      const timeline = gsap.timeline({ scrollTrigger: {
        id: 'arrival-hero', trigger: element, start: 'top top', end: '+=185%',
        scrub: .6, pin: true, invalidateOnRefresh: true,
      } });
      if (rear) timeline.to(rear, { opacity: .75, xPercent: 0, duration: 1 }, 0);
      timeline.to(mark, { opacity: .9, scale: 1, duration: 1 }, .5)
        .to(portraits, { opacity: 1, yPercent: 0, stagger: .12, duration: 1 }, 1)
        .to(details, { opacity: 1, duration: .5 }, 1.5)
        .to(lines, { opacity: 1, yPercent: 0, stagger: .3, duration: .7 }, 1.6)
        .to(element.querySelectorAll('[data-arrival-layer]'), { scale: .98, duration: .8 }, 2.7);
      return () => timeline.kill();
    });
    return () => mm.revert();
  }, [root]);
}
