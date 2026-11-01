import Link from 'next/link';
import type { Metadata } from 'next';
import { profile, publicHighlights, publicMedia, publicStats, highlights, media, stats } from '@/content/site';

export const metadata: Metadata = {
 title: 'Recruiting Snapshot | Zephyr Kreye',
 description: 'Verified athlete profile and recruiting resources for Zephyr Kreye, quarterback at Anna High School.',
 robots: { index: false, follow: false },
};

export default function RecruitingPage() {
 const clips = publicHighlights(highlights, media);
 const approved = publicMedia(media);
 const numbers = publicStats(stats);
 const availableClips = clips.flatMap((clip) => {
  const asset = approved.find((item) => item.id === clip.assetId && item.kind === 'video');
  return asset?.src ? [{ ...clip, src: asset.src }] : [];
 });
 return <main style={{minHeight:'100vh',background:'#09090D',color:'#F5F3F8',fontFamily:'var(--font-dm-sans),Arial,sans-serif',padding:'clamp(24px,5vw,80px)'}}>
  <nav aria-label="Recruiting page"><Link href="/" style={{color:'#AC7CFF',textDecoration:'none',letterSpacing:2,fontWeight:700}}>← ZK17 / HOME</Link></nav>
  <header style={{maxWidth:1100,margin:'clamp(65px,10vw,140px) auto 70px'}}>
   <p style={{color:'#AC7CFF',letterSpacing:4,fontSize:12,fontWeight:700}}>THE RECRUITING SNAPSHOT / VERIFIED INFORMATION</p>
   <h1 style={{fontSize:'clamp(64px,12vw,170px)',lineHeight:.85,letterSpacing:'-.06em',margin:'24px 0',textTransform:'uppercase',fontFamily:'var(--font-barlow-condensed),Impact,sans-serif'}}>{profile.name}</h1>
   <p style={{fontSize:'clamp(16px,2.2vw,26px)',color:'#A5A2AE'}}>{profile.position.toUpperCase()} / #{profile.number} / {profile.school.toUpperCase()} / CLASS OF {profile.classYear}</p>
  </header>
  <section aria-label="Athlete facts" style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:1}}>
   {([['POSITION',profile.position],['NUMBER','#'+profile.number],['CLASS',String(profile.classYear)],['SCHOOL',profile.school]] as const).map(([label,value])=><div key={label} style={{background:'#15141B',padding:'28px 20px'}}><p style={{fontSize:11,letterSpacing:2,color:'#AC7CFF'}}>{label}</p><strong style={{fontSize:'clamp(20px,3vw,36px)',textTransform:'uppercase'}}>{value}</strong></div>)}
  </section>
  <section style={{maxWidth:1100,margin:'90px auto'}} aria-labelledby="film-heading">
   <h2 id="film-heading" style={{fontSize:'clamp(40px,6vw,80px)',letterSpacing:'-.04em'}}>THE FILM.</h2>
   {availableClips.length ? <ul style={{listStyle:'none',padding:0,display:'grid',gap:20}}>{availableClips.map((clip)=><li key={clip.id}><h3>{clip.title} / {clip.season}</h3><video controls preload="none" style={{width:'100%',maxWidth:850}}><source src={clip.src} type="video/mp4"/>Video unavailable in this browser.</video></li>)}</ul> : <p style={{color:'#A5A2AE'}}>Approved game film will appear here when available. No footage is being represented as verified yet.</p>}
   <Link href="/#film-room" style={{color:'#AC7CFF',display:'inline-block',marginTop:24}}>EXPLORE THE FILM ROOM →</Link>
  </section>
  <section style={{maxWidth:1100,margin:'90px auto'}} aria-labelledby="numbers-heading">
   <h2 id="numbers-heading" style={{fontSize:'clamp(40px,6vw,80px)',letterSpacing:'-.04em'}}>THE NUMBERS.</h2>
   {numbers.length ? <ul>{numbers.map((stat)=><li key={stat.id}>{stat.label}: {stat.value} ({stat.season}, {stat.gameCount} games)</li>)}</ul> : <p style={{color:'#A5A2AE'}}>Verified season statistics are pending. Unconfirmed numbers are intentionally not published.</p>}
   <Link href="/#numbers" style={{color:'#AC7CFF',display:'inline-block',marginTop:24}}>VIEW THE FULL STORY →</Link>
  </section>
  <footer style={{maxWidth:1100,margin:'100px auto 0',borderTop:'1px solid #39343F',paddingTop:30,color:'#A5A2AE'}}>
   <p>Official athlete profile · Verified information only</p>
   <Link href="/#closing" style={{color:'#AC7CFF'}}>RETURN TO ZK17 →</Link>
  </footer>
 </main>;
}
