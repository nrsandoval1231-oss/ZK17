import { offFieldFeatures } from './site';
import type { AthletePhotoData } from '@/components/athlete-photo';
export const interests = [
 ...offFieldFeatures.map(feature => ({ name: feature.label as string, picks: feature.verifiedDetails, source: 'Owner-supplied picks' })),
 ...['Music', 'Favorites', 'Adventure', 'Family & Friends'].map(name => ({ name, picks: [] as string[], source: null })),
];
export type LifePhoto = { id: string; photo: AthletePhotoData; caption: string; source: string; verifiedAt: string; approved: boolean };
/** Add authentic, owner-approved lifestyle exports here. No substitutes for family moments. */
export const lifePhotos: LifePhoto[] = [];
