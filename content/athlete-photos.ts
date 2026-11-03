import selectedPhotos from './selected-photos.json';
import { media, previewPhotos, publicScenePhotos, scenePhotoAssignments } from './site';
import { resolveScenePhoto } from './scene-photo-selection';
import type { OwnerPhoto } from '@/components/athlete-photo';

const ownerPhotos: OwnerPhoto[] = (selectedPhotos as Omit<OwnerPhoto, 'kind'>[]).map((photo) => ({ ...photo, kind: 'owner' }));
const reviewMediaEnabled = () => process.env.PREVIEW_MEDIA_MODE !== 'false';

function ownerPhoto(id: string): OwnerPhoto | undefined {
  return reviewMediaEnabled() ? ownerPhotos.find((photo) => photo.id === id) : undefined;
}

export function athletePhotos() {
 const approved = publicScenePhotos(scenePhotoAssignments, media);
 const preview = process.env.PREVIEW_MEDIA_MODE !== 'false';
 const fieldFallback = resolveScenePhoto('on-field', approved, previewPhotos, preview);
 const portraitFallback = resolveScenePhoto('off-field', approved, previewPhotos, preview);
 const fieldHero = ownerPhoto('field-hero');
 const discoveryField = ownerPhoto('discovery-field');
 const portrait = ownerPhoto('personal-portrait') ?? ownerPhoto('personal-birthday') ?? portraitFallback;
 const discoveryPortrait = ownerPhoto('personal-portrait') ?? portraitFallback;
 return {
  field: fieldHero ?? fieldFallback,
  portrait,
  discoveryField: discoveryField ?? fieldFallback,
  discoveryPortrait,
 };
}

export function selectedPersonalPhotos(): OwnerPhoto[] {
  if (!reviewMediaEnabled()) return [];
  const personalIds = ['personal-home', 'personal-sideline', 'personal-outing', 'personal-golf', 'personal-birthday'];
  return personalIds.flatMap((id) => {
    const photo = ownerPhotos.find((item) => item.id === id);
    return photo ? [photo] : [];
  });
}
