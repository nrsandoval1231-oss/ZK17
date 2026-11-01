'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { StatLine } from '@/content/site';

gsap.registerPlugin(ScrollTrigger);
export default function VerifiedStatRows({ stats }: { stats: StatLine[] }) {
 const root = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
   const context = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.stat-row', root.current).forEach(el => gsap.from(el, {
     y: 12, duration: .55, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true },
    }));
   }, root);
   ScrollTrigger.refresh();
   return () => context.revert();
  });
  return () => mm.revert();
 }, [stats]);
 return <div ref={root} className="stats-list">{stats.map(item => <article className="stat-row" key={item.id}><span>{item.label}</span><strong>{item.value}</strong><small>{item.season} · {item.gameCount} GAMES</small></article>)}</div>;
}
