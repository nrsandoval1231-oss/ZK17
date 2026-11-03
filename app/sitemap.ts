import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

function publicSiteUrl(): string | null {
  try {
    const url = new URL(process.env.SITE_URL ?? 'https://zephyrkreye.com');
    if (url.protocol !== 'https:' || !url.hostname.includes('.') || /(example|localhost|127\.0\.0\.1)/i.test(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  return base ? [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/on-the-field/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/beyond-17/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/film/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/highlights/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/nil-recruiting/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/recruiting/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/playoffs/`, changeFrequency: 'weekly', priority: 0.8 },
  ] : [];
}
