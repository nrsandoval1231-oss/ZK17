import { media, previewPhotos, publicScenePhotos, scenePhotoAssignments } from './site';
import { resolveScenePhoto } from './scene-photo-selection';
export function athletePhotos() {
 const approved = publicScenePhotos(scenePhotoAssignments, media);
 const preview = process.env.PREVIEW_MEDIA_MODE !== 'false';
 return {
  field: resolveScenePhoto('on-field', approved, previewPhotos, preview),
  portrait: resolveScenePhoto('off-field', approved, previewPhotos, preview),
 };
}
