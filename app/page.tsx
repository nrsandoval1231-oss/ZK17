import { profile, previewPhotos, publicHighlights, publicMedia, publicMilestones, publicScenePhotos, publicStats, publicCommitmentReveal, commitmentAnnouncement, scenePhotoAssignments, media, highlights, milestones, stats, offFieldFeatures, publicSocials, socials } from '@/content/site';
import SiteExperience from '@/components/site-experience';
const previewMediaMode = process.env.PREVIEW_MEDIA_MODE !== 'false';
export default function Home() {
 const publishedMedia = publicMedia(media);
 return <SiteExperience profileData={profile} film={publishedMedia.find((asset) => asset.kind === 'video') ?? null} assets={publishedMedia} scenePhotos={publicScenePhotos(scenePhotoAssignments, media)} previewPhotos={previewMediaMode ? previewPhotos : []} previewMediaMode={previewMediaMode} highlights={publicHighlights(highlights, media)} stats={publicStats(stats)} milestones={publicMilestones(milestones)} features={offFieldFeatures} commitmentReveal={publicCommitmentReveal(process.env.COMMITMENT_REVEAL_MODE, commitmentAnnouncement)} socials={publicSocials(socials)} />;
}
