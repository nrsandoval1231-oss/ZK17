import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

function publicSiteUrl(): string | null {
  try {
    const url = new URL(process.env.SITE_URL ?? '');
    if (url.protocol !== 'https:' || !url.hostname.includes('.') || /(example|localhost|127\.0\.0\.1)/i.test(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicSiteUrl();
  return base ? [{ url: base, changeFrequency: 'monthly', priority: 1 }] : [];
}
