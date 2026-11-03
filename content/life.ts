import { offFieldFeatures } from './site';
import { selectedPersonalPhotos } from './athlete-photos';
import type { AthletePhotoData, OwnerPhoto } from '@/components/athlete-photo';

export const interests = [
 ...offFieldFeatures.map(feature => ({ name: feature.label as string, picks: feature.verifiedDetails, source: 'Owner-supplied picks' })),
 ...['Music', 'Favorites', 'Adventure', 'Family & Friends'].map(name => ({ name, picks: [] as string[], source: null })),
];

export type LifePhoto = { id: string; photo: AthletePhotoData; caption: string; source: string; verifiedAt: string; selected: boolean; approved: boolean };

/** Owner-selected personal library images; selection does not assert global rights approval. */
const captions: Record<string, string> = {
 'personal-home': 'A moment at home.',
 'personal-sideline': 'After the game.',
 'personal-outing': 'A day out.',
 'personal-golf': 'At the driving range.',
 'personal-birthday': 'Birthday memories.',
};

export const lifePhotos: LifePhoto[] = selectedPersonalPhotos().map((photo: OwnerPhoto) => ({
 id: photo.id,
 photo,
 caption: captions[photo.id] ?? 'A personal moment.',
 source: photo.source,
 verifiedAt: photo.sourceDate,
 selected: true,
 approved: false,
}));
