'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/brand-logo';
import ArrivalExperience from '@/components/arrival-experience';
import type { PublicNilContact } from '@/content/contact';
import { resolveScenePhoto } from '@/content/scene-photo-selection';
import { useStoryMotion } from '@/components/use-story-motion';
import type { StatLine, MediaAsset, OffFieldFeature, SocialLink, PreviewPhoto, ScenePhoto, PhotoScene, PublicProfile } from '@/content/site';


import HomepageChapters from './homepage-chapters';
import { navigationDestinations } from '@/content/navigation';
const scenes = navigationDestinations;
function VideoDialog({ source, poster, onClose }: { source: string | null; poster?: string; onClose: () => void }) {
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => { const el = dialog.current; if (!el) return; el.showModal(); const priorOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { if (el.open) el.close(); document.body.style.overflow = priorOverflow; }; }, [onClose]);
 return <dialog ref={dialog} className="film-dialog" aria-label="Film room" onCancel={event => { event.preventDefault(); onClose(); }}><button className="dialog-close" onClick={onClose} aria-label="Close film room">CLOSE</button>{source ? <video controls playsInline preload="none" poster={poster}><source src={source} type="video/mp4" />Your browser does not support video playback.</video> : <div className="film-unavailable"><span className="section-rule" /><p className="eyebrow">FILM ROOM</p><h2>Film arrives<br />when it’s ready.</h2><p>No approved film is available yet.</p><button className="text-action" onClick={onClose}>Return to the story</button></div>}</dialog>;
}
export function Header() {
 const [open, setOpen] = useState(false);
 const nav=useRef<HTMLElement>(null); const trigger=useRef<HTMLButtonElement>(null); const restoreTriggerFocus=()=>{let attempts=0;const restore=()=>{const button=trigger.current;if(!button)return;if(getComputedStyle(button).visibility==='visible'&&button.getClientRects().length>0)button.focus();else if(window.innerWidth<900&&attempts++<10)requestAnimationFrame(restore);};requestAnimationFrame(restore);};
 useLayoutEffect(()=>{if(!open)return;const priorOverflow=document.body.style.overflow;const content=document.querySelector<HTMLElement>('.site-content');const priorInert=content?.inert??false;document.body.style.overflow='hidden';if(content)content.inert=true;let focusFrame=0;const focusWhenVisible=()=>{const closeButton=nav.current?.querySelector<HTMLButtonElement>('.nav-close');if(closeButton&&getComputedStyle(closeButton).visibility==='visible'&&closeButton.getClientRects().length>0)closeButton.focus();else focusFrame=requestAnimationFrame(focusWhenVisible);};focusFrame=requestAnimationFrame(focusWhenVisible);const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);restoreTriggerFocus();return;}if(event.key==='Tab'&&nav.current){const items=[...nav.current.querySelectorAll<HTMLElement>('a,button:not([disabled])')];if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}}};document.addEventListener('keydown',onKey);return()=>{cancelAnimationFrame(focusFrame);document.removeEventListener('keydown',onKey);document.body.style.overflow=priorOverflow;if(content)content.inert=priorInert;};},[open]);
   const close = () => {setOpen(false);restoreTriggerFocus();};
 useLayoutEffect(() => {
  const desktop = window.matchMedia('(min-width: 900px)');
  const releaseMenu = () => {
   if (!desktop.matches || !open) return;
   setOpen(false);
   // Finish CSS breakpoint changes and the shared pin refresh before focusing.
   requestAnimationFrame(() => requestAnimationFrame(() => {
    if (desktop.matches) nav.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
   }));
  };
  releaseMenu();
  desktop.addEventListener('change', releaseMenu);
  return () => desktop.removeEventListener('change', releaseMenu);
 }, [open]);
 return <>
  <header className="site-header">
   <Link className="brand" href="/" aria-label="Zephyr Kreye — ZK17 home" onClick={()=>setOpen(false)}>
    <BrandLogo className="header-logo"/>
    <span className="header-wordmark" aria-hidden="true">ZEPHYR KREYE</span>
   </Link>
   <nav ref={nav} id="site-nav" className={"site-nav "+(open?"nav-open":"")} aria-label="Main navigation">
    <button className="nav-close" onClick={close}>CLOSE</button>
    {scenes.map(([id, name], index) => <a key={id} href={id} aria-label={name} aria-current={id === '/' ? 'page' : undefined} onClick={close}><span>0{index + 1}</span>{name}</a>)}
   </nav>
   <button ref={trigger} aria-expanded={open} aria-controls="site-nav" className={"menu-toggle "+(open?"is-open":"")} onClick={() => setOpen(!open)}><span>{open ? "CLOSE" : "MENU"}</span></button>
  </header>
  {open && <button className="nav-backdrop" aria-label="Close navigation menu" onClick={close} />}
 </>;
}
const ownerFieldPhoto: PreviewPhoto = {
 kind: 'preview', id: 'owner-field-2026-10-16', src: '/media/on-field-owner-2026-10-16.jpg',
 width: 1611, height: 2297, alt: 'Zephyr Kreye, wearing number 17, prepares to throw a football.',
 focal: '50% 28%', label: 'OWNER-SUPPLIED PHOTO',
};

export default function SiteExperience({ profileData, film, stats, features, assets, socials, nilContact, previewPhotos, scenePhotos, campaignPhotos = [], previewMediaMode }: { profileData: PublicProfile; film: MediaAsset | null; assets: MediaAsset[]; socials: SocialLink[]; nilContact: PublicNilContact | null; previewPhotos: PreviewPhoto[]; campaignPhotos?: PreviewPhoto[]; scenePhotos: ScenePhoto[]; previewMediaMode: boolean; stats: StatLine[]; features: OffFieldFeature[]; }) {
 const root = useRef<HTMLElement>(null); const [filmOpen, setFilmOpen] = useState(false); const [selectedFilm, setSelectedFilm] = useState<MediaAsset | null>(null);
 const filmOpener = useRef<HTMLElement | null>(null);
 const approvedFilm = film;
 const photoFor = (scene: PhotoScene): ScenePhoto | PreviewPhoto | undefined => resolveScenePhoto(scene, scenePhotos, previewPhotos, previewMediaMode);
 const arrivalPhoto = photoFor('arrival'); const fieldPhoto = photoFor('on-field'); const offFieldPhoto = photoFor('off-field');
 useStoryMotion(root);
 useEffect(() => {
  const sync = () => {
   if (!location.hash.startsWith('#film=')) { setFilmOpen(false); return; }
   filmOpener.current = null;
   let id: string;
   try { id = decodeURIComponent(location.hash.slice(6)); } catch { id = ''; }
   setSelectedFilm(assets.find(asset => asset.kind === 'video' && asset.id === id) ?? null);
   setFilmOpen(true);
  };
  sync(); window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
  return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
 }, [assets]);
 const closeFilm = useCallback(() => {
  setFilmOpen(false);
  history.replaceState(null, '', '#film-room');
  requestAnimationFrame(() => (filmOpener.current ?? root.current?.querySelector<HTMLElement>('.arrival-watch, #film-room button'))?.focus({ preventScroll: true }));
 }, []);
 return <main ref={root} id="main" data-home-experience data-preview-media={previewMediaMode ? 'enabled' : 'disabled'}>
  <Header />
  <div className="site-content">
  <ArrivalExperience profile={profileData} photo={arrivalPhoto} photos={previewMediaMode ? [...campaignPhotos, ...scenePhotos, ...previewPhotos] : scenePhotos} film={approvedFilm} />
  <HomepageChapters profile={profileData} fieldPhoto={previewMediaMode ? ownerFieldPhoto : fieldPhoto?.kind === 'approved' ? fieldPhoto : arrivalPhoto ?? fieldPhoto} personalPhoto={offFieldPhoto} gallery={[...scenePhotos, ...(previewMediaMode ? previewPhotos : [])].filter((photo,index,items)=>items.findIndex(other=>other.src===photo.src)===index).slice(0,6)} stats={stats} features={features} socials={socials} nilContact={nilContact}/>

  </div>
  {filmOpen && <VideoDialog source={selectedFilm?.src ?? null} poster={selectedFilm?.poster} onClose={closeFilm} />}
 </main>;
}

