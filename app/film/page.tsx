import type { Metadata } from 'next';
import RouteHeader from '@/components/route-header';
import { media, publicMedia } from '@/content/site';
export const metadata: Metadata = { title: 'Film | Zephyr Kreye — ZK17', alternates: { canonical: '/film/' } };
export default function FilmPage() {
 const film = publicMedia(media).find(item => item.kind === 'video');
 return <><RouteHeader /><main id="main" className="route-page"><p className="eyebrow">ZEPHYR KREYE / QUARTERBACK / 17</p><h1>EVERY<br />SECOND COUNTS.</h1>{film?.src && <video className="route-film" controls playsInline preload="metadata" poster="/media/zephyr-cinematic-poster.webp" aria-label="Zephyr Kreye complete cinematic film"><source src={film.src} type="video/mp4" />Your browser does not support video. <a href={film.src}>Download the complete film</a>.</video>}<p>Zephyr Kreye. Anna Coyotes. The complete film.</p></main></>;
}
