'use client';
import {useEffect,type RefObject} from 'react';
import {loadPlayoffMotion} from '@/lib/playoffs/motion';
export function usePlayoffMotion(root:RefObject<HTMLElement|null>){
 useEffect(()=>{
  let disposed=false;let cleanup=()=>{};
  const frame=requestAnimationFrame(()=>{void loadPlayoffMotion().then(({gsap,ScrollTrigger})=>{
   if(disposed)return;
   const mm=gsap.matchMedia();
   const context=gsap.context(()=>{
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
     gsap.from('[data-playoff-title]',{y:24,duration:.8,stagger:.09,ease:'power3.out'});
     // Keep the LCP photograph at its server-rendered geometry; type and 17 carry the entrance.
     gsap.to('[data-playoff-depth]',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'[data-playoff-hero]',start:'top top',end:'bottom top',scrub:true}});
     gsap.utils.toArray<HTMLElement>('[data-playoff-reveal]',root.current).forEach(el=>gsap.from(el,{y:16,duration:.65,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}}));
    });
   },root);
   void document.fonts.ready.then(()=>{if(!disposed)ScrollTrigger.refresh();});
   cleanup=()=>{mm.revert();context.revert();};
  }).catch(()=>{/* Optional motion never hides or blocks the static story. */});});
  return()=>{disposed=true;cancelAnimationFrame(frame);cleanup();};
 },[root]);
}
