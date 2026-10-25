import Image from 'next/image';
import { brand } from '@/content/brand';

export default function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <Image
      className={`brand-logo ${className}`.trim()}
      src={brand.monogram.src}
      alt={brand.monogram.alt}
      width={brand.monogram.width}
      height={brand.monogram.height}
      sizes="(max-width: 560px) 40px, 48px"
      priority
    />
  );
}
