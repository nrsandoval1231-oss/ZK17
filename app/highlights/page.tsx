import type { Metadata } from 'next';
import RouteHeader from '@/components/route-header';
import styles from './highlights.module.css';

export const metadata: Metadata = {
  title: 'Highlights | Zephyr Kreye — ZK17',
  alternates: { canonical: '/highlights/' },
};

export default function HighlightsPage() {
  return <><RouteHeader /><main id="main" className={styles.page}>
    <p className={styles.eyebrow}>ZEPHYR KREYE / QUARTERBACK / 17</p>
    <h1>HIGHLIGHTS</h1>
    <div className={styles.player}>
      <iframe data-hudl-player src="https://www.hudl.com/embed/video/3/20145851/6ad4044a1c035448d31fa50d" title="Zephyr Kreye — Official Hudl Highlights" loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    </div>
  </main></>;
}
