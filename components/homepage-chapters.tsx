import Link from 'next/link';
import BrandLogo from './brand-logo';
import OffFieldArcade from './offfield-arcade';
import JourneyCarousel from './journey-carousel';
import EditorialPhoto, { type EditorialPhotoSource } from './editorial-photo';
import { homepageStatistics, homepageStatsSeason } from '@/content/homepage-stats';
import type { OffFieldFeature, PublicProfile, SocialLink, StatLine } from '@/content/site';
import type { PublicNilContact } from '@/content/contact';
import styles from './homepage-chapters.module.css';

type Props = { profile: PublicProfile; fieldPhoto?: EditorialPhotoSource; personalPhoto?: EditorialPhotoSource; closingPhoto?: EditorialPhotoSource; gallery: EditorialPhotoSource[]; stats: StatLine[]; features: OffFieldFeature[]; socials: SocialLink[]; nilContact: PublicNilContact | null };
export default function HomepageChapters({profile,fieldPhoto,personalPhoto,closingPhoto,gallery,stats,features,socials,nilContact}: Props) {
 const metrics=homepageStatistics(stats);
 return <div className={styles.chapters}>
  <section id="on-field" className={styles.field} aria-labelledby="field-title">
   <div className={styles.fieldHero}>
    {fieldPhoto && <EditorialPhoto photo={fieldPhoto} className={`${styles.fieldPhoto} field-photo`} sizes="(max-width: 600px) 100vw, 58vw"/>}
    <div className={styles.fieldCopy}><p className={styles.index}>03 <span>/</span> {profile.name.toUpperCase()} <span>/</span> QB <span>/</span> #{profile.number}</p><i className={styles.rule}/><h2 id="field-title">ON THE<br/><em>FIELD</em></h2><p className={styles.tagline}>THE COMPETITOR.</p></div>
   </div>
   <div className={styles.stats} aria-label={`${homepageStatsSeason} season statistics`}>
    {metrics.map(metric=><div className={styles.stat} key={metric.label}><strong aria-label={metric.value===null?'Unavailable':undefined}>{metric.value===null?'—':metric.value.toLocaleString('en-US')+(metric.label==='COMP %'?'%':'')}</strong><span>{metric.label}</span><i/><small>{metric.value===null?'NOT YET VERIFIED':metric.note}</small></div>)}
   </div>
   <p className={styles.statsScope}>{homepageStatsSeason} SEASON <span>·</span> {metrics.every(metric=>metric.value===null)?'VERIFIED SEASON RECORD PENDING':'PASSING + RUSHING TOTALS · SOURCE-DEFINED QB RATING'}</p>
  </section>
  <section id="off-field" className={styles.beyond} aria-labelledby="off-title">
   {personalPhoto && <EditorialPhoto photo={personalPhoto} className={styles.personalPhoto} sizes="(max-width: 600px) 100vw, 50vw"/>}
   <div className={styles.beyondCopy}><p className={styles.index}>04 <i/></p><h2 id="off-title">BEYOND <em>17</em></h2><p className={styles.subtitle}>Beyond the lights. Beyond the game. Beyond 17.</p><p className={styles.introduction}>A look at Zephyr’s world beyond football — the games, movies, and stories he comes back to.</p><OffFieldArcade features={features} athleteName={profile.name} compact/></div>
  </section>
  <JourneyCarousel photos={gallery} socials={socials}/>
  <section id="next-chapter" className={styles.next} aria-labelledby="next-title">
   {closingPhoto && <EditorialPhoto photo={closingPhoto} className={styles.rearPhoto} sizes="(max-width: 600px) 100vw, 65vw"/>}
   <div className={styles.nextCopy}><p className={styles.index}>06 <i/></p><h2 id="next-title">NEXT<br/>CHAPTER.</h2><p className={styles.tagline}>THE STORY IS STILL<br/>BEING WRITTEN.</p></div><BrandLogo className={styles.nextLogo}/>
  </section>
  <footer id="closing" className={styles.footer}>
   <div className={styles.footerTop}>
    <Link href="/" aria-label="ZK17 home"><BrandLogo className={styles.footerLogo}/></Link>
    <p className={styles.footerStatement}>THE STORY IS STILL BEING WRITTEN.<br/>{profile.name.toUpperCase()} · QB1<br/>BIGGER STAGE. SAME MINDSET.</p>
    <a className={styles.footerBackTop} href="#arrival">BACK TO TOP</a>
   </div>
   <div className={styles.footerIdentity}>
    <BrandLogo className={styles.footerMonogram}/>
    {personalPhoto && <EditorialPhoto photo={personalPhoto} className={styles.footerPortrait} sizes="(max-width: 600px) 86vw, 40vw"/>}
   </div>
   <div className={styles.footerBottom}>
    <span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span>
    <nav className={styles.footerLinks} aria-label="Contact and recruiting"><Link href="/nil-recruiting/">NIL / RECRUITING</Link><Link href="/recruiting/">RECRUITING SNAPSHOT</Link>{nilContact && <a href={nilContact.href}>CONTACT</a>}</nav>
   </div>
  </footer>
 </div>;
}
