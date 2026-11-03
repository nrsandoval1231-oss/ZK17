import type { Metadata } from 'next';
import Link from 'next/link';
import RouteHeader from '@/components/route-header';
import { nilContactRecord, publicNilContact, inquiryPageRecord, recruitingInquiryHref } from '@/content/contact';
import { profile } from '@/content/site';
export const metadata: Metadata = { title: 'NIL / Recruiting | Zephyr Kreye — ZK17', alternates: { canonical: '/nil-recruiting/' } };
export default function NilRecruitingPage() {
 const contact = publicNilContact(nilContactRecord);
 const inquiryPage = publicNilContact(inquiryPageRecord);
 return <><RouteHeader /><main id="main" className="route-page"><p className="eyebrow">ZEPHYR KREYE / CLASS OF {profile.classYear}</p><h1>THE NEXT<br />CONVERSATION.</h1><p>{profile.position} · #{profile.number} · {profile.school} · {profile.location}</p><div className="inquiry-options"><article><h2>NIL PARTNERSHIPS</h2><p>Brand partnerships and business inquiries.</p>{contact ? <a className="text-action" href={contact.href}>PARTNERSHIP INQUIRY</a> : <p>A public partnership contact is not currently available.</p>}</article><article><h2>RECRUITING</h2><p>Explore Zephyr’s athlete profile and complete film.</p><Link prefetch={false} className="text-action" href="/recruiting/">VIEW RECRUITING SNAPSHOT</Link>{contact && <p><a className="text-action" href={recruitingInquiryHref(contact)}>RECRUITING INQUIRY</a></p>}{!contact && <p>A public recruiting contact is not currently available.</p>}</article></div>{inquiryPage && <p><a className="text-action" href={inquiryPage.href} target="_blank" rel="noopener noreferrer">CONTACT PAGE <span className="sr-only">(opens in a new tab)</span></a></p>}</main></>;
}
