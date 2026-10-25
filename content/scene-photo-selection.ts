import type { PhotoScene, PreviewPhoto, ScenePhoto } from './site';

export function resolveScenePhoto(scene: PhotoScene, approved: ScenePhoto[], previews: PreviewPhoto[], previewEnabled: boolean): ScenePhoto | PreviewPhoto | undefined {
  const approvedPhoto = approved.find((photo) => photo.scene === scene);
  if (approvedPhoto) return approvedPhoto;
  if (!previewEnabled) return undefined;
  const previewId = scene === 'off-field' || scene === 'closing' ? 'portrait' : scene;
  return previews.find((photo) => photo.id === previewId);
}
