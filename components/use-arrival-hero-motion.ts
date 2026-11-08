'use client';

import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useArrivalHeroMotion(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const fitSceneHeight = () => {
      if (window.innerWidth < 900) {
        // ScrollTrigger pins with inline dimensions; measure svh on a separate
        // element so a rotation can recalculate the scene while it is pinned.
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;height:100svh;width:0';
        document.body.append(probe);
        const height = probe.getBoundingClientRect().height;
        probe.remove();
        if (height > 0) element.style.setProperty('--arrival-scene-height', `${height}px`);
      } else {
        element.style.removeProperty('--arrival-scene-height');
      }
    };
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    try { mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (document.documentElement.dataset.arrivalBoot === 'fallback') return;
      // Keep the initial mobile 100svh scene fixed while Safari's URL bars move.
      fitSceneHeight();
      // The head bootstrap only runs on a document load. Own state on every
      // Home mount and motion activation, including client route transitions.
      document.documentElement.dataset.arrivalBoot = 'pending';
      document.documentElement.dataset.introComplete = 'false';
      const layer = (name: string) => element.querySelector<HTMLElement>(`[data-arrival-layer="${name}"]`);
      const lights = layer('lights')!;
      const beams = lights.querySelectorAll<HTMLElement>('[data-arrival-beam]');
      const smokeBack = layer('smoke-back')!;
      const smokeFront = layer('smoke-front')!;
      const photoNames = ['athlete', 'closeup', 'rear', 'white', 'running', 'color-action-glow', 'color-action', ...Array.from({ length: 9 }, (_, index) => `montage-${String(index + 1).padStart(2, '0')}`)];
      const photos = photoNames.map(name => layer(name)).filter((item): item is HTMLElement => Boolean(item));
      const extraMontage = photoNames.filter(name => name.startsWith('montage-')).map(layer).filter((item): item is HTMLElement => Boolean(item));
      const coldLogo = layer('cold-logo');
      const stadium = layer('stadium');
      const stadiumColor = layer('stadium-color');
      const grain = layer('grain');
      const copy = element.querySelector('[data-arrival-statement]');
      const details = element.querySelectorAll('[data-arrival-detail]');
      gsap.set([coldLogo, lights, smokeBack, smokeFront, stadium, stadiumColor, grain, ...photos].filter(Boolean), { opacity: 0 });
      gsap.set(photos, { y: 0, scale: 1.02 });
      gsap.set(beams, { opacity: 0 });
      gsap.set(smokeBack, { opacity: .25 });
      gsap.set(smokeFront, { opacity: .12 });
      gsap.set(coldLogo, { opacity: .9 });
      gsap.set([copy, ...details], { autoAlpha: 0 });
      const complete = (value: boolean) => {
        document.documentElement.dataset.introComplete = String(value);
      };
      const setActive = (value: boolean) => {
        if (value && !document.hidden) element.setAttribute('data-arrival-active', 'true');
        else element.removeAttribute('data-arrival-active');
      };
      const syncActive = () => {
        const trigger = ScrollTrigger.getById('arrival-hero');
        if (!trigger) return setActive(false);
        setActive(trigger.isActive || (window.scrollY <= trigger.start && window.scrollY < trigger.end));
      };
      const timeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'arrival-hero', trigger: element, start: 'top top',
        // Match the scene's CSS 100svh box. iOS browser-toolbar changes alter
        // innerHeight without changing this scene, which otherwise shifts the
        // scrub progress underneath a stationary finger.
        end: () => `+=${element.clientHeight * (window.innerWidth >= 900 ? 2.4 : 1.6)}`,
        scrub: .18, pin: true, invalidateOnRefresh: true,
        onUpdate: self => { complete(self.progress >= 1); syncActive(); },
        onRefresh: self => { complete(self.progress >= 1); syncActive(); },
        onToggle: () => syncActive(),
        onLeave: () => complete(true), onEnterBack: () => complete(false),
      } });
      timeline.to(coldLogo, { opacity: 0, duration: .10 }, .04)
        .to(beams, { opacity: .65, stagger: .035, duration: .12 }, .06)
        .to(lights, { opacity: .65, duration: .12 }, .06)
        .to(grain, { opacity: .008, duration: .1 }, .06)
        .to(smokeBack, { opacity: .25, duration: .12 }, 0)
        .to(smokeFront, { opacity: .12, duration: .12 }, 0)
        .to(stadium, { opacity: .8, scale: 1.035, duration: .12 }, .15)
        .to(stadium, { opacity: .8, duration: .13 }, .27)
        .to(stadium, { opacity: .22, scale: 1.035, duration: .15 }, .40)
        .to(stadiumColor, { opacity: .25, duration: .09 }, .27)
        ;
      // Keep smoke drift in its CSS-owned animation so GSAP never competes for
      // its transform.
      const reveal = (name: string, at: number, duration: number, opacity: number, scale: number) => {
        const photo = layer(name);
        if (!photo) return;
        timeline.to(photo, { opacity, scale, duration }, at);
      };
      reveal('athlete', .40, .09, .4, 1.01);
      reveal('athlete', .49, .09, 1, 1);
      reveal('closeup', .57, .09, .38, 1);
      reveal('rear', .64, .09, .36, 1);
      reveal('white', .70, .09, .36, 1);
      timeline.to(extraMontage, { opacity: .29, scale: 1, duration: .05, stagger: .01 }, .70);
      reveal('running', .76, .09, .4, 1);
      reveal('color-action-glow', .82, .07, .55, 1.04);
      reveal('color-action', .82, .07, .9, 1);
      timeline.to([copy, ...details], { autoAlpha: 1, duration: .08 }, .86)
        .to({}, { duration: .06 }, .94);
      // Timeline creation queues ScrollTrigger's first refresh for a later
      // frame. Finish the pin spacer synchronously before reporting ready so
      // an immediate first swipe cannot race a zero-distance spacer.
      timeline.scrollTrigger?.refresh();
      // Capture progress before a rotation lets competing pin refreshes temporarily
      // reset scroll. Only restore when the visitor was inside this story.
      let stableWidth = window.innerWidth;
      let lastProgress = 0;
      let pendingProgress: number | null = null;
      let rotationTimer: ReturnType<typeof setTimeout> | undefined;
      // Every image is absolutely positioned inside the fixed-size scene, so
      // image decode cannot change pin geometry. Avoid refreshing the trigger
      // and restoring scroll for each lazy image while a visitor is swiping.
      const rememberProgress = () => {
        const trigger = timeline.scrollTrigger;
        if (!trigger || pendingProgress !== null || window.innerWidth !== stableWidth) return;
        lastProgress = gsap.utils.clamp(0, 1, (window.scrollY - trigger.start) / (trigger.end - trigger.start));
      };
      const cancelRotation = () => {
        pendingProgress = null;
        clearTimeout(rotationTimer);
        if (window.innerWidth !== stableWidth) {
          stableWidth = window.innerWidth;
          fitSceneHeight();
          ScrollTrigger.refresh();
        }
        lastProgress = 0;
      };
      const queueRotation = () => {
        // Some mobile browsers emit orientationchange during toolbar/viewport
        // transitions too. Only a real width change should refit the scene.
        if (window.innerWidth === stableWidth) return;
        if (pendingProgress === null && (!location.hash || location.hash === '#arrival')) {
          const trigger = timeline.scrollTrigger;
          const span = trigger ? trigger.end - trigger.start : 0;
          const currentProgress = trigger && span > 0 && window.scrollY >= trigger.start - 2 && window.scrollY <= trigger.end + 2
            ? gsap.utils.clamp(0, 1, (window.scrollY - trigger.start) / span)
            : lastProgress;
          if (currentProgress > .001 && currentProgress < .999) pendingProgress = currentProgress;
        }
        if (pendingProgress === null) return;
        clearTimeout(rotationTimer);
        rotationTimer = setTimeout(() => {
          const progress = pendingProgress;
          pendingProgress = null;
          stableWidth = window.innerWidth;
          fitSceneHeight();
          ScrollTrigger.refresh();
          if (progress === null) return;
          lastProgress = progress;
          const trigger = timeline.scrollTrigger;
          if (trigger) window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
        }, 180);
      };
      const onResize = () => {
        if (window.innerWidth === stableWidth) return;
        queueRotation();
        if (pendingProgress === null) {
          stableWidth = window.innerWidth;
          fitSceneHeight();
        }
      };
      window.addEventListener('scroll', rememberProgress, { passive: true });
      window.addEventListener('orientationchange', queueRotation, true);
      window.addEventListener('resize', onResize, true);
      window.addEventListener('wheel', cancelRotation, { passive: true });
      window.addEventListener('touchstart', cancelRotation, { passive: true });
      window.addEventListener('pointerdown', cancelRotation, { passive: true });
      window.addEventListener('keydown', cancelRotation);
      window.addEventListener('hashchange', cancelRotation);
      document.addEventListener('visibilitychange', syncActive);
      syncActive();
      complete((timeline.scrollTrigger?.progress ?? 0) >= 1);
      document.documentElement.dataset.arrivalBoot = 'ready';
      element.setAttribute('data-arrival-motion', 'ready');
      window.dispatchEvent(new Event('arrival:motion-ready'));
      return () => {
        delete document.documentElement.dataset.introComplete;
        delete document.documentElement.dataset.arrivalBoot;
        element.setAttribute('data-arrival-motion', 'static');
        cancelRotation();
        element.style.removeProperty('--arrival-scene-height');
        setActive(false);
        window.removeEventListener('scroll', rememberProgress);
        window.removeEventListener('orientationchange', queueRotation, true);
        window.removeEventListener('resize', onResize, true);
        window.removeEventListener('wheel', cancelRotation);
        window.removeEventListener('touchstart', cancelRotation);
        window.removeEventListener('pointerdown', cancelRotation);
        window.removeEventListener('keydown', cancelRotation);
        window.removeEventListener('hashchange', cancelRotation);
        document.removeEventListener('visibilitychange', syncActive);
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
