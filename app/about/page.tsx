import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import RouteHeader from '@/components/route-header';
import { profile, previewPhotos } from '@/content/site';
export const metadata: Metadata = { title: 'About | Zephyr Kreye — ZK17', alternates: { canonical: '/about/' } };
export default function AboutPage() {
 return <><RouteHeader /><main id="main" className="route-page"><p className="eyebrow">ANNA COYOTES / CLASS OF {profile.classYear}</p><h1>ZEPHYR<br />KREYE.</h1><p>{profile.name} is a {profile.position.toLowerCase()} at {profile.school} in {profile.location}. Wearing number {profile.number}, his story continues with the Anna Coyotes.</p><div className="route-gallery">{previewPhotos.slice(0,3).map(photo => <Image key={photo.id} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized />)}</div><Link prefetch={false} className="text-action" href="/film/">SEE THE FILM ↗</Link></main></>;
}
