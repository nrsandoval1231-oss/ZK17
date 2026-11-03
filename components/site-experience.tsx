'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NextChapter from '@/components/next-chapter';
import VerifiedStatRows from '@/components/verified-stat-rows';
import BrandLogo from '@/components/brand-logo';
import ArrivalExperience from '@/components/arrival-experience';
import TwoWorlds from '@/components/two-worlds';
import OffFieldArcade from '@/components/offfield-arcade';
import ConnectSection from '@/components/connect-section';
import type { PublicNilContact } from '@/content/contact';
import { resolveScenePhoto } from '@/content/scene-photo-selection';
import { useStoryMotion } from '@/components/use-story-motion';
import type { Highlight, StatLine, Milestone, MediaAsset, OffFieldFeature, SocialLink, PreviewPhoto, ScenePhoto, PhotoScene, PublicProfile, CommitmentReveal } from '@/content/site';


const scenes = [['/', 'HOME'], ['/film/', 'FILM'], ['/playoffs/', 'PLAYOFFS'], ['/about/', 'ABOUT'], ['/nil-recruiting/', 'NIL / RECRUITING']] as const;
function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none"><path d={diagonal ? 'M5 15 15 5M6 5h9v9' : 'M3 10h13m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1.4" /></svg>; }
function Placeholder({ label, variant = 'field', className = '' }: { label: string; variant?: 'field' | 'portrait' | 'film' | 'abstract'; className?: string }) { return <div className={`media-placeholder media-${variant} ${className}`} role="img" aria-label={`Designed media placeholder. ${label}. No athlete photo supplied.`}><span className="placeholder-mark" aria-hidden="true">17</span><span className="placeholder-caption"><i />{label}</span></div>; }
function ResponsivePhoto({ item, className = '', priority = false }: { item: PreviewPhoto | ScenePhoto; className?: string; priority?: boolean }) {
 const base=item.kind === 'preview' ? item.src.replace(/-706\.webp$/, '') : null;
 const variants=(format: string)=>[360,540,706].map((width)=>`${base}-${width}.${format} ${width}w`).join(', ');
 const focal=item.kind === 'preview' ? item.focal : item.focalPoint;
 return <figure className={`responsive-photo ${className} ${item.kind === 'approved' ? 'approved-photo' : 'preview-photo'}`}><picture>{base&&<><source type="image/avif" srcSet={variants('avif')} sizes="(max-width: 560px) 92vw, (max-width: 900px) 75vw, 52vw"/><source type="image/webp" srcSet={variants('webp')} sizes="(max-width: 560px) 92vw, (max-width: 900px) 75vw, 52vw"/></>}<Image src={item.src} alt={item.alt} width={item.width} height={item.height} priority={priority} unoptimized style={{objectPosition:focal}}/></picture></figure>;
}
function VideoDialog({ source, poster, onClose }: { source: string | null; poster?: string; onClose: () => void }) {
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => { const el = dialog.current; if (!el) return; el.showModal(); const priorOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { if (el.open) el.close(); document.body.style.overflow = priorOverflow; }; }, [onClose]);
 return <dialog ref={dialog} className="film-dialog" aria-label="Film room" onCancel={event => { event.preventDefault(); onClose(); }}><button className="dialog-close" onClick={onClose} aria-label="Close film room">Close <span>×</span></button>{source ? <video controls playsInline preload="none" poster={poster}><source src={source} type="video/mp4" />Your browser does not support video playback.</video> : <div className="film-unavailable"><span className="section-rule" /><p className="eyebrow">FILM ROOM</p><h2>Film arrives<br />when it’s ready.</h2><p>No approved film is available yet.</p><button className="text-action" onClick={onClose}>Return to the story <Arrow /></button></div>}</dialog>;
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
    <button className="nav-close" onClick={close}>Close <span>×</span></button>
    {scenes.map(([id, name], index) => <a key={id} href={id} aria-label={name} aria-current={id === '/' ? 'page' : undefined} onClick={close}><span>0{index + 1}</span>{name}</a>)}
   </nav>
   <button ref={trigger} aria-expanded={open} aria-controls="site-nav" className={"menu-toggle "+(open?"is-open":"")} onClick={() => setOpen(!open)}><span>{open ? "Close" : "Menu"}</span><svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M2 6h16" /><path d="M2 14h16" /></svg></button>
  </header>
  {open && <button className="nav-backdrop" aria-label="Close navigation menu" onClick={close} />}
 </>;
}
export default function SiteExperience({ profileData, film, highlights, stats, milestones, features, commitmentReveal, assets, socials, nilContact, previewPhotos, scenePhotos, campaignPhotos = [], previewMediaMode }: { profileData: PublicProfile; film: MediaAsset | null; highlights: Highlight[]; assets: MediaAsset[]; socials: SocialLink[]; nilContact: PublicNilContact | null; previewPhotos: PreviewPhoto[]; campaignPhotos?: PreviewPhoto[]; scenePhotos: ScenePhoto[]; previewMediaMode: boolean; stats: StatLine[]; milestones: Milestone[]; features: OffFieldFeature[]; commitmentReveal: CommitmentReveal }) {
 const root = useRef<HTMLElement>(null); const [filmOpen, setFilmOpen] = useState(false); const [selectedFilm, setSelectedFilm] = useState<MediaAsset | null>(null); const [season, setSeason] = useState<number | 'all'>('all'); const [filmSeason, setFilmSeason] = useState<number | 'all'>('all');
 const filmOpener = useRef<HTMLElement | null>(null);
 const approvedFilm = film;
 const photoFor = (scene: PhotoScene): ScenePhoto | PreviewPhoto | undefined => resolveScenePhoto(scene, scenePhotos, previewPhotos, previewMediaMode);
 const arrivalPhoto = photoFor('arrival'); const offFieldPhoto = photoFor('off-field'); const closingPhoto = photoFor('closing');
 const availableStats = stats.filter((item) => season === 'all' || item.season === season);
 const availableHighlights = highlights.filter((item) => filmSeason === 'all' || item.season === filmSeason);
 const gallerySeasons = [...new Set(highlights.map((item) => item.season))].sort((a,b)=>b-a);
 const openFilm = (asset: MediaAsset | null = approvedFilm, opener?: HTMLElement) => {
  const active = document.activeElement;
  filmOpener.current = opener ?? (active instanceof HTMLElement && active !== document.body ? active : null);
  history.pushState(null, '', '#film=' + encodeURIComponent(asset?.id ?? 'pending'));
  setSelectedFilm(asset); setFilmOpen(true);
 };
 const availableMilestones = milestones;
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
  <ArrivalExperience profile={profileData} photo={arrivalPhoto} photos={previewMediaMode ? [...campaignPhotos, ...scenePhotos, ...previewPhotos] : scenePhotos} film={approvedFilm} onWatch={(opener) => openFilm(approvedFilm, opener)} />
  <div data-field-pin-spacer><section className="scene on-field" id="on-field" aria-labelledby="field-title"><span id="field-story" className="field-story-anchor" aria-hidden="true"/><div className="field-lockup"><p className="eyebrow"><i /> ON THE FIELD</p><h2 id="field-title">ON THE FIELD</h2><div className="field-base"><span>{profileData.position.toUpperCase()} <b>{profileData.number}</b></span><p>{profileData.school}.<br />Class of {profileData.classYear}.</p></div></div><div className="field-film-panel"><iframe src="https://www.hudl.com/embed/video/3/20145851/6ad4044a1c035448d31fa50d" title="Zephyr Kreye — Official Hudl Highlights" loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div><span className="scene-edge">ON FIELD <i /> 01 / 08</span></section></div>
  <section className="scene journey" id="journey" aria-labelledby="journey-title"><div className="journey-head" data-reveal><p className="eyebrow">A STORY STILL IN MOTION</p><h2 id="journey-title">THE <em>JOURNEY.</em></h2><p className="journey-intro">A {profileData.position.toLowerCase()} at {profileData.school} in {profileData.location}. Class of {profileData.classYear}.</p></div><div className="journey-stage"><div className="journey-track" aria-hidden="true" /><span className="journey-marker" aria-hidden="true"><i /></span><span className="journey-origin">CLASS OF {profileData.classYear}</span><div className="journey-empty"><h3>{profileData.school.split(' ')[0].toUpperCase()}<br /><em>{profileData.school.split(' ').slice(1).join(' ').toUpperCase()}.</em></h3><p>{profileData.position} · {profileData.location}</p></div><div className="journey-end">IN PROGRESS <span>—</span> {profileData.classYear}</div></div><div className="verified-milestones">{availableMilestones.map((item) => <article key={item.id}><time>{item.date}</time><h3>{item.title}</h3>{item.detail && <p>{item.detail}</p>}</article>)}</div><span className="scene-edge">THE JOURNEY <i /> 04 / 08</span></section>
  <section className="scene off-field" id="off-field" aria-labelledby="off-title"><div className="offfield-head" data-reveal><h2 id="off-title" className="sr-only">Off field</h2><a className="offfield-inquiry" href="#nil-inquiries">NIL &amp; BUSINESS INQUIRIES <Arrow diagonal /></a></div><TwoWorlds onFieldPhoto={arrivalPhoto} offFieldPhoto={offFieldPhoto} jerseyNumber={profileData.number}/><OffFieldArcade features={features} athleteName={profileData.name}/><span className="scene-edge dark-edge">OFF FIELD <i /> 03 / 08</span></section>
  <section className="media-gallery" id="media" aria-labelledby="media-title"><div className="feature-list"><h2 id="media-title">THE STORY, IN FRAMES.</h2>{gallerySeasons.length>0&&<label className="gallery-season">SEASON<select aria-label="Filter the media gallery by season" value={filmSeason} onChange={(event)=>setFilmSeason(event.target.value==='all'?'all':Number(event.target.value))}><option value="all">ALL</option>{gallerySeasons.map((year)=><option key={year} value={year}>{year}</option>)}</select></label>}<div className="approved-gallery">{previewPhotos.map((photo)=><ResponsivePhoto key={photo.id} item={photo}/>)}{availableHighlights.map((item)=>{const asset=assets.find((candidate)=>candidate.id===item.assetId);if(!asset||asset.id===approvedFilm?.id)return null;return <figure key={item.id}>{asset.kind==='photo'?<Image src={asset.src??''} alt={asset.alt} width={asset.width??1200} height={asset.height??800} unoptimized/>:<button className="gallery-film" onClick={(event)=>openFilm(asset,event.currentTarget)} aria-label={`Play ${item.title}`}><Placeholder variant="film" label={item.title}/><Arrow/></button>}<figcaption>{item.title} · {item.season}</figcaption></figure>})}</div>{availableHighlights.every((item)=>!assets.some((asset)=>asset.id===item.assetId&&asset.id!==approvedFilm?.id))&&<p className="gallery-empty">ZEPHYR KREYE / ANNA COYOTES</p>}</div></section>
  {stats.length > 0 && <section className="scene numbers" id="numbers" aria-labelledby="numbers-title"><div className="numbers-head" data-reveal><p className="eyebrow">PROOF IN THE DETAILS</p><h2 id="numbers-title">NUMBERS<br /><em>THAT MEAN IT.</em></h2><p>Season numbers appear when the full picture is verified.</p></div><div className="numbers-content"><div className="numbers-toolbar"><span>SEASON VIEW</span><label className="select-wrap"><span className="sr-only">Filter statistics by season</span><select value={season} onChange={(event) => setSeason(event.target.value === 'all' ? 'all' : Number(event.target.value))}><option value="all">ALL SEASONS</option>{[...new Set([...stats.map((item) => item.season), ...highlights.map((item) => item.season)])].sort((a,b) => b-a).map((year) => <option value={year} key={year}>{year}</option>)}</select></label></div>{availableStats.length ? <VerifiedStatRows stats={availableStats}/> : <div className="numbers-empty"><span className="empty-dash">—</span><p>NO VERIFIED SEASON DATA YET</p><span>Numbers belong to the full story.<br />This page will grow when the record is ready.</span></div>}</div><span className="scene-edge">NUMBERS <i /> 05 / 08</span></section>}
  <NextChapter reveal={commitmentReveal} classYear={profileData.classYear}/>
  <footer className="scene closing" id="closing"><div className="closing-top"><a className="brand" href="#arrival" aria-label="ZK17 home"><BrandLogo className="footer-logo"/></a><p>THE STORY IS STILL BEING WRITTEN.<br />ZEPHYR KREYE · QB1<br />BIGGER STAGE. SAME MINDSET.</p><a className="back-top" href="#arrival">BACK TO TOP <Arrow diagonal /></a></div><div className="closing-identity">{closingPhoto&&<ResponsivePhoto item={closingPhoto} className="closing-photo"/>}<div className="closing-wordmark" aria-label="ZK17"><BrandLogo className="closing-logo"/></div></div><div className="closing-bottom"><p>© {new Date().getFullYear()} {profileData.name.toUpperCase()}</p><span>{profileData.location.toUpperCase()} <i /> CLASS OF ’{String(profileData.classYear).slice(-2)}</span></div><ConnectSection socials={socials} nilContact={nilContact}/><div className="closing-future"><a href="/nil-recruiting/">RECRUITING SNAPSHOT <Arrow diagonal /></a><span>MORE OF THE STORY</span><span>THE STORY IS STILL BEING WRITTEN. ZEPHYR KREYE · QB1 <i /></span></div></footer>
  </div>
  {filmOpen && <VideoDialog source={selectedFilm?.src ?? null} poster={selectedFilm?.poster} onClose={closeFilm} />}
 </main>;
}

