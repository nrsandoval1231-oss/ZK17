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
    try { mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (document.documentElement.dataset.arrivalBoot === 'fallback') return;
      // The head bootstrap only runs on a document load. Own state on every
      // Home mount and motion activation, including client route transitions.
      document.documentElement.dataset.arrivalBoot = 'pending';
      document.documentElement.dataset.introComplete = 'false';
      const layer = (name: string) => element.querySelector<HTMLElement>(`[data-arrival-layer="${name}"]`);
      const lights = layer('lights')!;
      const smokeBack = layer('smoke-back')!;
      const smokeFront = layer('smoke-front')!;
      const photoNames = ['closeup', 'rear', 'white', 'running', 'athlete'];
      const photos = photoNames.map(name => layer(name)).filter((item): item is HTMLElement => Boolean(item));
      const stadium = layer('stadium');
      const monogram = layer('monogram');
      const grain = layer('grain');
      const copy = element.querySelector('[data-arrival-statement]');
      const details = element.querySelectorAll('[data-arrival-detail]');
      gsap.set([lights, smokeBack, smokeFront, stadium, monogram, grain, ...photos].filter(Boolean), { opacity: 0 });
      gsap.set([copy, ...details], { autoAlpha: 0 });
      const complete = (value: boolean) => {
        document.documentElement.dataset.introComplete = String(value);
      };
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'arrival-hero', trigger: element, start: 'top top',
        end: () => `+=${window.innerHeight * (window.innerWidth >= 900 ? 2.4 : 1.6)}`,
        scrub: .18, pin: true, invalidateOnRefresh: true,
        onUpdate: self => complete(self.progress >= 1),
        onRefresh: self => complete(self.progress >= 1),
        onLeave: () => complete(true), onEnterBack: () => complete(false),
      } });
      timeline.to(lights, { opacity: .65, duration: .1 }, .025)
        .to(grain, { opacity: .008, duration: .1 }, .06)
        .to(stadium, { opacity: .2, duration: .13 }, .06)
        .to(smokeBack, { opacity: .35, xPercent: 3, duration: .8 }, .08)
        .to(smokeFront, { opacity: .2, xPercent: -3, duration: .8 }, .08)
        .to(monogram, { opacity: .29, duration: .16 }, .18);
      photoNames.forEach((name, index) => {
        const photo = layer(name);
        if (photo) timeline.fromTo(photo, { opacity: 0, y: 10 }, { opacity: name === 'athlete' ? 1 : .72, y: 0, duration: .14 }, .16 + index * .11);
      });
      timeline.to([copy, ...details], { autoAlpha: 1, duration: .1 }, .79)
        .to({}, { duration: .11 }, .89);
      const skip = element.querySelector<HTMLAnchorElement>('a[href="#film-room"]');
      const skipIntro = (event: Event) => {
        event.preventDefault();
        const target = document.getElementById('film-room');
        const trigger = timeline.scrollTrigger;
        complete(true);
        if (trigger && target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
        requestAnimationFrame(() => { target?.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true }); });
      };
      skip?.addEventListener('click', skipIntro);
      // Capture progress before a rotation lets competing pin refreshes temporarily
      // reset scroll. Only restore when the visitor was inside this story.
      let stableWidth = window.innerWidth;
      let lastProgress = 0;
      let pendingProgress: number | null = null;
      let rotationTimer: ReturnType<typeof setTimeout> | undefined;
      const rememberProgress = () => {
        const trigger = timeline.scrollTrigger;
        if (!trigger || pendingProgress !== null || window.innerWidth !== stableWidth) return;
        lastProgress = gsap.utils.clamp(0, 1, (window.scrollY - trigger.start) / (trigger.end - trigger.start));
      };
      const cancelRotation = () => { pendingProgress = null; clearTimeout(rotationTimer); stableWidth = window.innerWidth; lastProgress = 0; };
      const queueRotation = () => {
        if (pendingProgress === null && lastProgress > .001 && lastProgress < .999 && (!location.hash || location.hash === '#arrival')) pendingProgress = lastProgress;
        if (pendingProgress === null) return;
        clearTimeout(rotationTimer);
        rotationTimer = setTimeout(() => {
          const progress = pendingProgress;
          pendingProgress = null;
          stableWidth = window.innerWidth;
          if (progress === null) return;
          lastProgress = progress;
          ScrollTrigger.refresh();
          const trigger = timeline.scrollTrigger;
          if (trigger) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
        }, 180);
      };
      const onResize = () => {
        if (window.innerWidth === stableWidth) return;
        queueRotation();
        if (pendingProgress === null) stableWidth = window.innerWidth;
      };
      window.addEventListener('scroll', rememberProgress, { passive: true });
      window.addEventListener('orientationchange', queueRotation, true);
      window.addEventListener('resize', onResize, true);
      window.addEventListener('wheel', cancelRotation, { passive: true });
      window.addEventListener('touchstart', cancelRotation, { passive: true });
      window.addEventListener('pointerdown', cancelRotation, { passive: true });
      window.addEventListener('keydown', cancelRotation);
      window.addEventListener('hashchange', cancelRotation);
      complete((timeline.scrollTrigger?.progress ?? 0) >= 1);
      document.documentElement.dataset.arrivalBoot = 'ready';
      element.setAttribute('data-arrival-motion', 'ready');
      window.dispatchEvent(new Event('arrival:motion-ready'));
      return () => {
        skip?.removeEventListener('click', skipIntro);
        delete document.documentElement.dataset.introComplete;
        delete document.documentElement.dataset.arrivalBoot;
        element.setAttribute('data-arrival-motion', 'static');
        cancelRotation();
        window.removeEventListener('scroll', rememberProgress);
        window.removeEventListener('orientationchange', queueRotation, true);
        window.removeEventListener('resize', onResize, true);
        window.removeEventListener('wheel', cancelRotation);
        window.removeEventListener('touchstart', cancelRotation);
        window.removeEventListener('pointerdown', cancelRotation);
        window.removeEventListener('keydown', cancelRotation);
        window.removeEventListener('hashchange', cancelRotation);
        timeline.kill();
      };
    }); } catch {
      mm.revert();
      element.setAttribute('data-arrival-motion', 'fallback');
      document.documentElement.dataset.arrivalBoot = 'fallback';
      window.dispatchEvent(new Event('arrival:motion-failed'));
    }
    return () => {
      mm.revert();
      delete document.documentElement.dataset.arrivalBoot;
      delete document.documentElement.dataset.introComplete;
    };
  }, [root]);
}
