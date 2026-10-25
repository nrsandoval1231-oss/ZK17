import type { Metadata } from 'next';
import './globals.css';
import '@fontsource/barlow-condensed/latin-400.css';
import '@fontsource/barlow-condensed/latin-500.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import { profile } from '@/content/site';
const configuredSiteUrl = process.env.SITE_URL;
const publicSiteUrl = (() => { try { const url = new URL(configuredSiteUrl ?? ''); return url.protocol === 'https:' && url.hostname.includes('.') && !/(example|localhost|127\.0\.0\.1)/i.test(url.hostname) ? url.origin : undefined; } catch { return undefined; } })();
export const metadata: Metadata = {
 metadataBase: publicSiteUrl ? new URL(publicSiteUrl) : undefined,
 alternates: publicSiteUrl ? { canonical: publicSiteUrl } : undefined,
 title: 'Zephyr Kreye — ZK17', description: 'Quarterback. Anna High School, Texas. Class of 2027.',
 robots: { index: false, follow: false },
 openGraph: { title: 'ZK17 — Zephyr Kreye', description: 'Built for the moment. Ready for what’s next.', ...(publicSiteUrl ? { images: ['/og-zk17.png'] } : {}), type: 'website' },
 icons: { icon: [{ url: '/favicon.png?v=2', type: 'image/png', sizes: '64x64' }], apple: '/apple-touch-icon.png?v=2' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 const jsonLd = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, memberOf: { '@type': 'SportsTeam', name: profile.school }, jobTitle: profile.position, description: `Class of ${profile.classYear} ${profile.position} at ${profile.school}, ${profile.location}.` };
 return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />{children}</body></html>;
}
