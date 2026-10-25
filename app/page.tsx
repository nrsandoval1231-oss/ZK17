import { previewPhotos, publicHighlights, publicMedia, publicMilestones, publicStats, media, highlights, milestones, stats, offFieldFeatures, commitmentReveal, publicSocials, socials } from '@/content/site';
import SiteExperience from '@/components/site-experience';
const previewMediaMode = process.env.PREVIEW_MEDIA_MODE !== 'false';
export default function Home() {
 const publishedMedia = publicMedia(media);
 return <SiteExperience film={publishedMedia.find((asset) => asset.kind === 'video') ?? null} assets={publishedMedia} previewPhotos={previewMediaMode ? previewPhotos : []} previewMediaMode={previewMediaMode} highlights={publicHighlights(highlights, media)} stats={publicStats(stats)} milestones={publicMilestones(milestones)} features={offFieldFeatures} commitmentReveal={commitmentReveal} socials={publicSocials(socials)} />;
}
