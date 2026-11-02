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
    // The arrival component owns its own entrance and portal motion.
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out', duration: .65 } });
    entrance.from('.header-logo', { y: -8, opacity: .9 }, 0);

    // A single bounded timeline owns every field layer; no competing scrub triggers.
    const field = select('#on-field')[0];
    const story = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
     trigger: field, start: desktop ? 'top top' : 'top 82%',
     end: desktop ? '+=65%' : 'top 22%', pin: desktop ? field : false,
     scrub: desktop ? .45 : true, anticipatePin: desktop ? 1 : 0, invalidateOnRefresh: true,
    } });
    story.fromTo('.field-photo img', { scale: 1.025 }, { scale: desktop ? 1.14 : 1.06, duration: 1 }, 0)
     .fromTo('.field-mark', { xPercent: 10, yPercent: 3 }, { xPercent: -9, yPercent: -4, duration: 1 }, 0)
     .fromTo('.field-lockup h2', { yPercent: 12, opacity: .9 }, { yPercent: 0, opacity: 1, duration: .48 }, .05)
     .fromTo('.field-base, .field-caption', { y: 12, opacity: .9 }, { y: 0, opacity: 1, duration: .35 }, .5);

    gsap.utils.toArray<HTMLElement>('[data-reveal]', element).forEach(el => {
     // Never hide content on a direct anchor landing or on a fast scroll.
     gsap.from(el, { y: desktop ? 24 : 12, opacity: .9, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } });
    });
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
  const decodeHash = (value: string) => { try { return decodeURIComponent(value); } catch { return value; } };
  let pendingAnchor = location.hash.startsWith('#film=') ? null : decodeHash(location.hash.slice(1)) || null;
  let anchorFrame = 0;
  let nativeKeyboardFrame = false;
  const nativeVideo = element.querySelector<HTMLVideoElement>('#film-room video');
  const reconcileAnchor = () => {
   if (disposed) return;
   if (nativeKeyboardFrame) {
    const cinema = ScrollTrigger.getById('arrival-cinema');
    const stage = document.getElementById('film-room');
    const top = cinema?.end ?? (stage ? stage.getBoundingClientRect().top + window.scrollY : null);
    if (top !== null) window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
    return;
   }
   const id = pendingAnchor;
   if (disposed || !id || location.hash !== `#${id}`) return;
   const target = document.getElementById(id);
   if (!target) return;
   const cinema = id === 'film-room' ? ScrollTrigger.getById('arrival-cinema') : undefined;
   const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
   // The full-height film stage must align with the viewport even without a pin.
   const top = id === 'film-room'
    ? cinema?.end ?? target.getBoundingClientRect().top + window.scrollY
    : target.getBoundingClientRect().top + window.scrollY - scrollPadding;
   window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
  };
  // Late images and pin refreshes can move an anchor after its first landing.
  // Keep reconciling until the visitor chooses a new scroll position.
  const releaseAnchor = () => { pendingAnchor = null; nativeKeyboardFrame = false; nativeVideo?.removeAttribute('data-native-keyboard-active'); cancelAnimationFrame(anchorFrame); };
  let tabIntent = false;
  let tabIntentFrame = 0;
  let focusVersion = 0;
  const clearFocusIntent = () => { tabIntent = false; focusVersion++; cancelAnimationFrame(tabIntentFrame); };
  const onScrollKey = (event: KeyboardEvent) => {
   clearFocusIntent();
   if (event.key === 'Tab') {
    tabIntent = true;
    // Native Tab focus follows keydown; unrelated later focus cannot reuse it.
    tabIntentFrame = requestAnimationFrame(clearFocusIntent);
   }
   const nativeControlKey = ['Tab', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key);
   const inNativePlayer = document.activeElement === nativeVideo || (nativeKeyboardFrame && document.activeElement === document.body);
   if (nativeControlKey && inNativePlayer && (nativeKeyboardFrame || (nativeVideo?.controls && nativeVideo.tabIndex === 0))) {
    nativeKeyboardFrame = true;
    // Film Room owns controls. This token protects an already-ready player's
    // focused shadow controls until alignment settles, never its opening.
    nativeVideo?.setAttribute('data-native-keyboard-active', 'true');
    queueAnchor();
   } else if (['Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) releaseAnchor();
  };
  const queueAnchor = () => {
   if ((!pendingAnchor && !nativeKeyboardFrame) || disposed) return;
   cancelAnimationFrame(anchorFrame);
   anchorFrame = requestAnimationFrame(() => { reconcileAnchor(); anchorFrame = 0; });
  };
  const onAnchorClick = (event: MouseEvent) => {
   const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
   if (!link || !element.contains(link)) return;
   const id = link.hash.slice(1);
   if (!id || id.startsWith('film=')) return;
   releaseAnchor();
   pendingAnchor = decodeHash(id);
   refresh();
  };
  const onHashChange = () => {
   releaseAnchor();
   const id = location.hash.slice(1);
   pendingAnchor = id && !id.startsWith('film=') ? decodeHash(id) : null;
   if (pendingAnchor) refresh();
  };
  const refresh = () => {
   cancelAnimationFrame(frame);
   frame = requestAnimationFrame(() => {
    if (disposed) return;
    // Pin measurement briefly moves DOM nodes; retain keyboard focus in the arcade.
    const focused = document.activeElement;
    ScrollTrigger.refresh();
    if (focused instanceof HTMLElement && focused !== document.body && focused.isConnected && document.activeElement !== focused) focused.focus({ preventScroll: true });
    queueAnchor();
   });
  };
  element.addEventListener('click', onAnchorClick, true);
  window.addEventListener('hashchange', onHashChange);
  ScrollTrigger.addEventListener('refresh', queueAnchor);
  window.addEventListener('resize', refresh);
  // Native video focus may scroll a few pixels after the focus event. Keep an
  // active direct landing aligned until wheel/touch/key input releases it.
  const keepNativeFocusFramed = () => {
   if (nativeKeyboardFrame || (pendingAnchor === 'film-room' && document.activeElement === nativeVideo)) queueAnchor();
  };
  window.addEventListener('scroll', keepNativeFocusFramed, { passive: true });
  const releaseOnExternalFocus = (event: FocusEvent) => {
   const target = event.target;
   const fromTab = tabIntent;
   tabIntent = false;
   cancelAnimationFrame(tabIntentFrame);
   if (!fromTab || !(target instanceof HTMLElement) || target.matches('#film-room video')) return;
   const version = focusVersion;
   if (pendingAnchor === 'film-room') releaseAnchor();
   // Native smooth focus scrolling can be measured before a pin refresh.
   // Reconcile the actual focused control after that layout has settled.
   requestAnimationFrame(() => {
    if (disposed || version !== focusVersion || document.activeElement !== target || !target.getClientRects().length) return;
    const box = target.getBoundingClientRect();
    if (box.top < 0 || box.bottom > innerHeight) target.scrollIntoView({ block: 'center', behavior: 'instant' });
   });
  };
  const releaseNativeOnExternalFocus = (event: FocusEvent) => {
   const target = event.target;
   // BODY may be a transient native-shadow focus state. A real external
   // target, including header/skip controls outside this story, ends the hold.
   if (nativeKeyboardFrame && target instanceof HTMLElement && target !== document.body && target !== nativeVideo) releaseAnchor();
  };
  document.addEventListener('focusin', releaseNativeOnExternalFocus);
  element.addEventListener('focusin', releaseOnExternalFocus);
  window.addEventListener('wheel', releaseAnchor, { passive: true });
  const onPointer = () => { clearFocusIntent(); releaseAnchor(); };
  window.addEventListener('touchstart', onPointer, { passive: true });
  window.addEventListener('pointerdown', onPointer, { passive: true });
  window.addEventListener('keydown', onScrollKey);
  if (pendingAnchor) refresh();
  void document.fonts.ready.then(refresh);
  element.addEventListener('load', refresh, true);
  const observer = new ResizeObserver(refresh);
  element.querySelectorAll('#film-room, .approved-gallery, .numbers-content, .verified-milestones').forEach(el => observer.observe(el));
  return () => { disposed = true; releaseAnchor(); clearFocusIntent(); cancelAnimationFrame(frame); cancelAnimationFrame(anchorFrame); observer.disconnect(); element.removeEventListener('click', onAnchorClick, true); element.removeEventListener('load', refresh, true); window.removeEventListener('hashchange', onHashChange); ScrollTrigger.removeEventListener('refresh', queueAnchor); window.removeEventListener('resize', refresh); window.removeEventListener('scroll', keepNativeFocusFramed); element.removeEventListener('focusin', releaseOnExternalFocus); document.removeEventListener('focusin', releaseNativeOnExternalFocus); window.removeEventListener('wheel', releaseAnchor); window.removeEventListener('touchstart', onPointer); window.removeEventListener('pointerdown', onPointer); window.removeEventListener('keydown', onScrollKey); mm.revert(); context.revert(); };
 }, [root]);
}
