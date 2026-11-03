import Link from 'next/link';
import AthletePhoto, { type AthletePhotoData } from './athlete-photo';
import styles from './worlds.module.css';
export default function TwoWorlds({ onFieldPhoto, offFieldPhoto }: { onFieldPhoto?: AthletePhotoData; offFieldPhoto?: AthletePhotoData; jerseyNumber?: string }) {
 return <section id="two-sides" className={styles.discovery} aria-label="Two sides. One Zephyr.">
  <header className={styles.discoveryHeading}><p className={styles.kicker}>THE ATHLETE. THE PERSON.</p><h2>TWO SIDES.<br /><span>ONE ZEPHYR.</span></h2><p>Same drive.<br />Different worlds.</p></header>
  <div className={styles.split}>
   <Link prefetch={false} className={`${styles.world} ${styles.fieldWorld}`} href="/on-the-field/">
    {onFieldPhoto && <AthletePhoto photo={onFieldPhoto} className={styles.worldImage} sizes="(max-width: 700px) 100vw, 55vw" />}
    <span className={styles.worldNumber} aria-hidden="true">01 / 17</span><div className={styles.worldCopy}><p>THE QUARTERBACK</p><h3>ON THE<br />{' '}FIELD<span>.</span></h3></div>
   </Link>
   <Link prefetch={false} className={`${styles.world} ${styles.personalWorld}`} href="/beyond-17/">
    {offFieldPhoto && <AthletePhoto photo={offFieldPhoto} className={styles.worldImage} sizes="(max-width: 700px) 100vw, 55vw" />}
    <span className={styles.worldNumber} aria-hidden="true">02 / 17</span><div className={styles.worldCopy}><p>LIFE OUTSIDE THE LINES</p><h3>BEYOND<br />{' '}17<span>.</span></h3></div>
   </Link>
   <span className={styles.divider} aria-hidden="true" />
  </div>
 </section>;
}
