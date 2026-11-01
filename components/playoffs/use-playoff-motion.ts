'use client';
import {useEffect,type RefObject} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function usePlayoffMotion(root:RefObject<HTMLElement|null>){
 useEffect(()=>{
  const mm=gsap.matchMedia();
  const context=gsap.context(()=>{
   mm.add('(prefers-reduced-motion: no-preference)',()=>{
    gsap.from('[data-playoff-title]',{y:24,duration:.8,stagger:.09,ease:'power3.out'});
    gsap.from('[data-playoff-photo] img',{scale:1.045,duration:1,ease:'power3.out'});
    gsap.to('[data-playoff-depth]',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'[data-playoff-hero]',start:'top top',end:'bottom top',scrub:true}});
    gsap.utils.toArray<HTMLElement>('[data-playoff-reveal]',root.current).forEach(el=>gsap.from(el,{y:16,duration:.65,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 95%',once:true}}));
   });
  },root);
  let disposed=false;void document.fonts.ready.then(()=>{if(!disposed)ScrollTrigger.refresh();});
  return()=>{disposed=true;mm.revert();context.revert();};
 },[root]);
}
