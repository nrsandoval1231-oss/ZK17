import Image from 'next/image';
import type { PreviewPhoto, ScenePhoto } from '@/content/site';
export type AthletePhotoData = PreviewPhoto | ScenePhoto;
export default function AthletePhoto({ photo, className, sizes = '100vw', priority = false }: { photo: AthletePhotoData; className?: string; sizes?: string; priority?: boolean }) {
 const base = photo.kind === 'preview' ? photo.src.replace(/-706\.webp$/, '') : null;
 const variants = (format: string) => [360, 540, 706].map(w => `${base}-${w}.${format} ${w}w`).join(', ');
 return <picture className={className}>{base && <><source type="image/avif" srcSet={variants('avif')} sizes={sizes} /><source type="image/webp" srcSet={variants('webp')} sizes={sizes} /></>}<Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized priority={priority} style={{ objectPosition: photo.kind === 'preview' ? photo.focal : photo.focalPoint }} /></picture>;
}
