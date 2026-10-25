import announcementData from './commitment-announcement.json';

export type Verification = { verified: boolean; published: boolean; source: string | null; sourceDate: string | null };
export type PublicProfile = { name: string; school: string; location: string; position: string; number: string; classYear: number; commitment: 'UNCOMMITTED' };
export type CommitmentAnnouncement = Verification & { rights: 'approved'; school: string; displayCopy: string };
export type CommitmentReveal = { mode: 'disabled' } | { mode: 'enabled'; school: string; displayCopy: string; sourceDate: string };
export type MediaAsset = Verification & { id: string; kind: 'photo' | 'video'; title: string; src: string | null; poster?: string; width?: number; height?: number; alt: string; focalPoint?: string; rights: 'pending' | 'approved' };
export type Highlight = Verification & { id: string; title: string; season: number; assetId: string; description?: string };
export type StatLine = Verification & { id: string; label: string; value: number; season: number; gameCount: number };
export type Milestone = Verification & { id: string; date: string; title: string; detail?: string };
export type Offer = Verification & { id: string; school: string; date: string };
export type SocialLink = Verification & { id: string; label: string; url: string };
export type Partnership = Verification & { id: string; name: string; url?: string };
export type OffFieldFeature = { label: 'Games' | 'Movies' | 'TV Shows'; verifiedDetails: string[] };
export const profile: PublicProfile = { name: 'Zephyr Kreye', school: 'Anna High School', location: 'Texas', position: 'Quarterback', number: '17', classYear: 2027, commitment: 'UNCOMMITTED' };
export const media: MediaAsset[] = [];
export const highlights: Highlight[] = [];
export const stats: StatLine[] = [];
export const milestones: Milestone[] = [{ id: 'anna-hs', date: 'CLASS OF 2027', title: 'Anna High School', verified: true, published: true, source: 'Owner-confirmed profile', sourceDate: '2026-10-25' }];
export const offers: Offer[] = [];
export const socials: SocialLink[] = [];
export const partnerships: Partnership[] = [];
// Owner-supplied top-three picks, in the supplied order.
export const offFieldFeatures: OffFieldFeature[] = [
 { label: 'Games', verifiedDetails: ['Madden', 'GTA 6', 'The Last of Us'] },
 { label: 'Movies', verifiedDetails: ['A Bronx Tale', 'Interstellar', 'Step Brothers'] },
 { label: 'TV Shows', verifiedDetails: ['Berserk', 'Attack on Titan', 'Demon Slayer'] },
];
export const commitmentAnnouncement = announcementData as CommitmentAnnouncement | null;
export function publicCommitmentReveal(mode: string | undefined, announcement: CommitmentAnnouncement | null): CommitmentReveal {
 if (mode !== 'enabled') return { mode: 'disabled' };
 if (!announcement || !eligible(announcement) || announcement.rights !== 'approved' || !announcement.school.trim() || !announcement.displayCopy.trim()) throw new Error('Commitment reveal requires a source-backed, published, owner-approved announcement record.');
 return { mode: 'enabled', school: announcement.school.trim(), displayCopy: announcement.displayCopy.trim(), sourceDate: announcement.sourceDate! };
}
function eligible(item: Verification): boolean { const timestamp = item.sourceDate ? Date.parse(item.sourceDate) : NaN; return item.verified && item.published && !!item.source?.trim() && Number.isFinite(timestamp); }
export function publicMedia(items: MediaAsset[]): MediaAsset[] { return items.filter((item) => eligible(item) && item.rights === 'approved' && !!item.src?.startsWith('/media/')); }
export function publicHighlights(items: Highlight[], assets: MediaAsset[], season?: number): Highlight[] {
 const validVideoAssets = new Set(publicMedia(assets).filter((asset) => asset.kind === 'video').map((asset) => asset.id));
 return items.filter((item) => eligible(item) && validVideoAssets.has(item.assetId) && Number.isInteger(item.season) && item.season > 0 && (season === undefined || item.season === season));
}
export function publicStats(items: StatLine[], season?: number): StatLine[] { return items.filter((item) => eligible(item) && Number.isFinite(item.value) && Number.isInteger(item.season) && item.season > 0 && Number.isInteger(item.gameCount) && item.gameCount > 0 && (season === undefined || item.season === season)); }
export function publicMilestones(items: Milestone[]): Milestone[] { return items.filter(eligible); }
export function publicOffers(items: Offer[]): Offer[] { return items.filter(eligible); }
export function publicSocials(items: SocialLink[]): SocialLink[] { return items.filter((item) => eligible(item) && /^https:\/\//i.test(item.url)); }
export function publicPartnerships(items: Partnership[]): Partnership[] { return items.filter(eligible); }
export type PhotoScene = 'arrival' | 'on-field' | 'off-field' | 'closing';
export type ScenePhotoAssignment = { scene: PhotoScene; assetId: string };
export type ScenePhoto = { kind: 'approved'; id: string; scene: PhotoScene; src: string; width: number; height: number; alt: string; focalPoint: string };
export type PreviewPhoto = { kind: 'preview'; id: string; src: string; width: number; height: number; alt: string; focal: string; label: 'PREVIEW CROP · ORIGINAL PENDING' };
export const scenePhotoAssignments: ScenePhotoAssignment[] = [];
export function publicScenePhotos(assignments: ScenePhotoAssignment[], assets: MediaAsset[]): ScenePhoto[] {
 const approvedPhotos = new Map(publicMedia(assets).filter((asset) => asset.kind === 'photo' && Number.isInteger(asset.width) && (asset.width ?? 0) > 0 && Number.isInteger(asset.height) && (asset.height ?? 0) > 0 && !!asset.alt.trim()).map((asset) => [asset.id, asset]));
 const occupied = new Set<PhotoScene>();
 return assignments.flatMap((assignment) => {
  const asset = approvedPhotos.get(assignment.assetId);
  if (!asset || occupied.has(assignment.scene)) return [];
  occupied.add(assignment.scene);
  return [{ kind: 'approved' as const, id: asset.id, scene: assignment.scene, src: asset.src!, width: asset.width!, height: asset.height!, alt: asset.alt, focalPoint: asset.focalPoint ?? '50% 50%' }];
 });
}
export const previewPhotos: PreviewPhoto[] = [
 { kind: 'preview', id: 'arrival', src: '/media/arrival-706.webp', width: 706, height: 690, alt: 'Zephyr Kreye wearing number 17 in a black uniform and helmet, photographed in black and white.', focal: '43% 32%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
 { kind: 'preview', id: 'on-field', src: '/media/on-field-706.webp', width: 706, height: 750, alt: 'Zephyr Kreye, number 17 in a black uniform, preparing to throw during a football game.', focal: '50% 53%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
 { kind: 'preview', id: 'portrait', src: '/media/portrait-706.webp', width: 706, height: 740, alt: 'Zephyr Kreye seated on the sideline in his number 17 black uniform.', focal: '51% 36%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
 { kind: 'preview', id: 'throwing', src: '/media/throwing-706.webp', width: 706, height: 730, alt: 'Zephyr Kreye viewed from behind, wearing a purple number 17 uniform and preparing to throw.', focal: '50% 40%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
 { kind: 'preview', id: 'running', src: '/media/running-706.webp', width: 706, height: 620, alt: 'Zephyr Kreye carrying the football in a purple uniform.', focal: '49% 62%', label: 'PREVIEW CROP · ORIGINAL PENDING' },
];
