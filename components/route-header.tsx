'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import BrandLogo from './brand-logo';
import { navigationDestinations } from '@/content/navigation';
export default function RouteHeader() {
 const pathname = usePathname();
 const [open, setOpen] = useState(false);
 const trigger = useRef<HTMLButtonElement>(null);
 const nav = useRef<HTMLElement>(null);
 useEffect(() => {
  if (!open) return;
  const previous = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const content = document.getElementById('main');
  const previousInert = content?.inert ?? false;
  if (content) content.inert = true;
  let focusFrame = 0;
  const focusClose = () => {
   const button = nav.current?.querySelector<HTMLButtonElement>('button');
   if (button && getComputedStyle(button).visibility === 'visible') button.focus();
   else focusFrame = requestAnimationFrame(focusClose);
  };
  focusFrame = requestAnimationFrame(focusClose);
  const close = () => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); };
  const keyboard = (event: KeyboardEvent) => {
   if(event.key === 'Escape') close();
   if(event.key !== 'Tab') return;
   const items = [...(nav.current?.querySelectorAll<HTMLElement>('button,a') ?? [])];
   if(event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
   else if(!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
  };
  const resize = () => { if(window.innerWidth >= 900) close(); };
  document.addEventListener('keydown', keyboard); window.addEventListener('resize', resize);
  return () => { cancelAnimationFrame(focusFrame); if (content) content.inert = previousInert; document.body.style.overflow = previous; document.removeEventListener('keydown', keyboard); window.removeEventListener('resize', resize); };
 }, [open]);
 return <header className="site-header"><Link prefetch={false} className="brand" href="/" aria-label="Zephyr Kreye — ZK17 home"><BrandLogo className="header-logo" /></Link><nav ref={nav} id="route-nav" className={'site-nav ' + (open ? 'nav-open' : '')} aria-label="Main navigation"><button className="nav-close" onClick={() => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }}>CLOSE</button>{navigationDestinations.map(([href, label], index) => <Link prefetch={false} key={href} href={href} aria-current={pathname.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'page' : undefined} onClick={() => setOpen(false)}><span>0{index + 1}</span>{label}</Link>)}</nav><button ref={trigger} className="menu-toggle" aria-expanded={open} aria-controls="route-nav" onClick={() => setOpen(!open)}>MENU</button></header>;
}
