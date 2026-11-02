import RouteHeader from '@/components/route-header';
import StoryArrow from '@/components/story-arrow';
import Link from 'next/link';
import type { Metadata } from 'next';
import BrandLogo from '@/components/brand-logo';
import SnapshotShare from '@/components/snapshot-share';
import { profile, publicHighlights, publicMedia, publicStats, highlights, media, stats } from '@/content/site';

export const metadata: Metadata = {
 title: 'Recruiting Snapshot | Zephyr Kreye',
 description: 'Verified athlete profile and recruiting resources for Zephyr Kreye, quarterback at Anna High School.',
 robots: { index: true, follow: true },
 alternates: { canonical: '/recruiting/' },
};

export default function RecruitingPage() {
 const clips = publicHighlights(highlights, media);
 const approved = publicMedia(media);
 const numbers = publicStats(stats);
 const availableClips = clips.flatMap(clip => {
  const asset = approved.find(item => item.id === clip.assetId && item.kind === 'video');
  return asset?.src ? [{ ...clip, src: asset.src, poster: asset.poster }] : [];
 });
 return <><RouteHeader /><main className="recruiting-page" id="main">
  <nav className="snapshot-nav" aria-label="Recruiting page"><Link prefetch={false} href="/" aria-label="ZK17 home"><BrandLogo className="header-logo" /></Link><Link prefetch={false} href="/">← BACK TO THE STORY</Link></nav>
  <header className="snapshot-hero">
   <p className="eyebrow">THE RECRUITING SNAPSHOT <i /> VERIFIED INFORMATION</p>
   <h1>{profile.name.split(' ').slice(0, -1).join(' ')} <br /><em>{profile.name.split(' ').at(-1)}.</em></h1>
   <p className="snapshot-identity">{profile.position.toUpperCase()} <b>—</b> #{profile.number}<br />{profile.school.toUpperCase()} · CLASS OF {profile.classYear}</p>
   <div className="snapshot-actions"><SnapshotShare /><Link prefetch={false} className="text-action" href="/nil-recruiting/">Recruiting contact <StoryArrow /></Link></div>
  </header>
  <section className="snapshot-facts" aria-label="Athlete facts"><dl>{([['POSITION',profile.position],['NUMBER','#'+profile.number],['CLASS',String(profile.classYear)],['SCHOOL',profile.school],['LOCATION',profile.location],['STATUS',profile.commitment]] as const).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
  <section className="snapshot-section" aria-labelledby="film-heading"><div><p className="eyebrow">01 / IN MOTION</p><h2 id="film-heading">THE <em>FILM.</em></h2></div><div>
   {availableClips.length ? <ul className="snapshot-clips">{availableClips.map(clip=><li key={clip.id}><h3>{clip.title} / {clip.season}</h3><video controls playsInline preload="none" poster={clip.poster}><source src={clip.src} type="video/mp4"/>Video unavailable in this browser.</video><Link prefetch={false} className="text-action" href={`/#film=${encodeURIComponent(clip.assetId)}`}>Open this clip in Film Room <StoryArrow /></Link></li>)}</ul> : <div className="snapshot-empty"><span aria-hidden="true">—</span><p>FILM</p><p>Explore the complete film on the Film page.</p></div>}
   <Link prefetch={false} className="text-action" href="/film/">EXPLORE THE FILM ROOM <StoryArrow /></Link>
  </div></section>
  {numbers.length > 0 && <section className="snapshot-section" aria-labelledby="numbers-heading"><div><p className="eyebrow">02 / PROOF IN THE DETAILS</p><h2 id="numbers-heading">THE <em>NUMBERS.</em></h2></div><div>
   {numbers.length ? <div className="stats-list">{numbers.map(stat=><article className="stat-row" key={stat.id}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.season} · {stat.gameCount} GAMES</small></article>)}</div> : <div className="snapshot-empty"><span aria-hidden="true">—</span><p>VERIFIED SEASON DATA PENDING</p><p>The record will appear when the full picture is verified.</p></div>}
   <Link prefetch={false} className="text-action" href="/#numbers">VIEW THE FULL STORY <StoryArrow /></Link>
  </div></section>}
  <footer className="snapshot-footer"><p>OFFICIAL ATHLETE PROFILE · VERIFIED INFORMATION ONLY</p><Link prefetch={false} className="text-action" href="/#closing">RETURN TO ZK17 <StoryArrow /></Link></footer>
 </main></>;
}
