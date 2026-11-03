import type { Metadata } from 'next';
import RouteHeader from '@/components/route-header';
import AthletePhoto from '@/components/athlete-photo';
import WorldFooter from '@/components/world-footer';
import Interests from '@/components/interests';
import LifeGallery from '@/components/life-gallery';
import { athletePhotos } from '@/content/athlete-photos';
import { lifePhotos } from '@/content/life';
import styles from '@/components/worlds.module.css';
export const metadata: Metadata = { title: 'Beyond 17 | Zephyr Kreye — ZK17', description: 'The people, passions, and experiences that shape Zephyr off the field.', alternates: { canonical: '/beyond-17/' } };
export default function Beyond17Page() {
 const { portrait } = athletePhotos();
 const photos = lifePhotos.filter(item => item.approved && item.source && Number.isFinite(Date.parse(item.verifiedAt)));
 // Temporary review portrait is honestly captioned; never presented as a family/lifestyle moment.
 const gallery = photos.length ? photos : portrait ? [{ id: 'sideline-preview', photo: portrait, caption: 'A moment on the sideline.', source: 'Existing owner-supplied sideline photograph', verifiedAt: '2026-10-25', approved: false }] : [];
 return <><RouteHeader /><main id="main" className={styles.beyondPage}>
 <section className={styles.beyondHero} aria-labelledby="beyond-title"><div className={styles.beyondCopy}><p className={styles.kicker}>02 / THE PERSON</p><h1 id="beyond-title">BEYOND<br />17<span>.</span></h1><p className={styles.beyondSubtitle}>LIFE OUTSIDE THE LINES.</p><p className={styles.beyondIntro}>The people, passions, and experiences that shape Zephyr off the field.</p><span className={styles.beyondSignature}>Same Zephyr. A different side.</span></div><div className={styles.beyondPortrait}>{portrait && <AthletePhoto photo={portrait} priority sizes="(max-width: 700px) 100vw, 55vw" />}<p>ZEPHYR KREYE / ON THE SIDELINE</p></div><span className={styles.heroSideNote}>MORE THAN A NUMBER.</span></section>
 <Interests /><LifeGallery photos={gallery} /><WorldFooter next="field" />
 </main></>;
}
