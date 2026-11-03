import Image from 'next/image';
import type { PreviewPhoto, ScenePhoto } from '@/content/site';
export type EditorialPhotoSource = PreviewPhoto | ScenePhoto;
export default function EditorialPhoto({ photo, className = '', sizes = '50vw' }: { photo: EditorialPhotoSource; className?: string; sizes?: string }) {
 const base = photo.kind === 'preview' && /-706\.webp$/.test(photo.src) ? photo.src.replace(/-706\.webp$/, '') : null;
 const focal = photo.kind === 'preview' ? photo.focal : photo.focalPoint;
 return <figure className={className}>
  <picture>{base && <><source type="image/avif" srcSet={[360,540,706].map(w=>`${base}-${w}.avif ${w}w`).join(', ')} sizes={sizes}/><source type="image/webp" srcSet={[360,540,706].map(w=>`${base}-${w}.webp ${w}w`).join(', ')} sizes={sizes}/></>}
   <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" unoptimized style={{objectPosition:focal}}/>
  </picture>
  {photo.kind === 'preview' && photo.label !== 'OWNER-SUPPLIED PHOTO' && <figcaption>PREVIEW CROP · ORIGINAL PENDING</figcaption>}
 </figure>;
}
