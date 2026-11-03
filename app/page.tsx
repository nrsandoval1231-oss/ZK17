import { profile, previewPhotos, publicMedia, publicScenePhotos, publicStats, scenePhotoAssignments, media, stats, offFieldFeatures, publicSocials, socials } from '@/content/site';
import { arrivalCampaignPhotos } from '@/content/arrival-campaign';
import SiteExperience from '@/components/site-experience';
import { nilContactRecord, publicNilContact } from '@/content/contact';
const previewMediaMode = process.env.PREVIEW_MEDIA_MODE !== 'false';
export default function Home() {
 const publishedMedia = publicMedia(media);
 return <SiteExperience profileData={profile} film={publishedMedia.find((asset) => asset.kind === 'video') ?? null} assets={publishedMedia} scenePhotos={publicScenePhotos(scenePhotoAssignments, media)} previewPhotos={previewMediaMode ? previewPhotos : []} campaignPhotos={previewMediaMode ? arrivalCampaignPhotos : []} previewMediaMode={previewMediaMode} stats={publicStats(stats)} features={offFieldFeatures} socials={publicSocials(socials)} nilContact={publicNilContact(nilContactRecord)} />;
}
