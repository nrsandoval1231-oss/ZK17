import Image from 'next/image';
import type { PreviewPhoto, ScenePhoto } from '@/content/site';
export type OwnerPhoto = { kind: 'owner'; id: string; src: string; width: number; height: number; alt: string; focalPoint: string; variants: { width: number; webp: string; avif: string }[]; source: string; sourceDate: string; sha256: string };
export type AthletePhotoData = PreviewPhoto | ScenePhoto | OwnerPhoto;
export default function AthletePhoto({ photo, className, sizes = '100vw', priority = false }: { photo: AthletePhotoData; className?: string; sizes?: string; priority?: boolean }) {
 const base = photo.kind === 'preview' ? photo.src.replace(/-706\.webp$/, '') : null;
 const variants = (format: string) => [360, 540, 706].map(w => `${base}-${w}.${format} ${w}w`).join(', ');
 const ownerVariants = photo.kind === 'owner' ? photo.variants : [];
 const sourceSet = (format: 'webp' | 'avif') => ownerVariants.map(variant => `${variant[format]} ${variant.width}w`).join(', ');
 return <picture className={className} data-photo-kind={photo.kind}>
  {base && <><source type="image/avif" srcSet={variants('avif')} sizes={sizes} /><source type="image/webp" srcSet={variants('webp')} sizes={sizes} /></>}
  {ownerVariants.length > 0 && <><source type="image/avif" srcSet={sourceSet('avif')} sizes={sizes} /><source type="image/webp" srcSet={sourceSet('webp')} sizes={sizes} /></>}
  <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized priority={priority} style={{ objectPosition: photo.kind === 'preview' ? photo.focal : photo.focalPoint }} />
 </picture>;
}
