import Image from 'next/image';
import type { PreviewPhoto, ScenePhoto } from '@/content/site';

type WorldPhoto = PreviewPhoto | ScenePhoto | undefined;

function WorldCard({
  side,
  photo,
  jerseyNumber,
}: {
  side: 'on' | 'off';
  photo: WorldPhoto;
  jerseyNumber: string;
}) {
  const isOn = side === 'on';
  const titleId = isOn ? 'world-on-title' : 'world-off-title';
  const focal = photo?.kind === 'preview' ? photo.focal : photo?.focalPoint ?? '50% 50%';
  const base = photo?.kind === 'preview' ? photo.src.replace(/-706\.webp$/, '') : null;
  const variants = (format: string) => [360, 540, 706].map((width) => `${base}-${width}.${format} ${width}w`).join(', ');

  return (
    <article className={`world-card world-card-${side}`} aria-labelledby={titleId}>
      <div className="world-card-copy">
        <h3 id={titleId}>{isOn ? <>ON<br />FIELD<span>.</span></> : <>OFF<br />FIELD<span>.</span></>}</h3>
      </div>
      {photo ? (
        <figure className="world-photo">
          {base ? <picture><source type="image/avif" srcSet={variants('avif')} sizes="(max-width: 560px) 46vw, (max-width: 900px) 42vw, 38vw" /><source type="image/webp" srcSet={variants('webp')} sizes="(max-width: 560px) 46vw, (max-width: 900px) 42vw, 38vw" /><Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized style={{ objectPosition: focal }} /></picture> : <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized style={{ objectPosition: focal }} />}
          <figcaption>{photo.kind === 'preview' ? photo.label : 'ORIGINAL PHOTO'}</figcaption>
        </figure>
      ) : (
        <div className="world-photo world-photo-pending" role="img" aria-label={`${isOn ? 'Game-day' : 'Sideline'} original photo pending`}>
          <span>{isOn ? 'GAME-DAY ORIGINAL PENDING' : 'SIDELINE ORIGINAL PENDING'}</span>
        </div>
      )}
      <div className="world-caption">
        <p>{isOn ? `Helmet on · Game day · No. ${jerseyNumber}` : 'Helmet off · Sideline portrait.'}</p>
        <a href={isOn ? '#on-field' : '#offfield-personal'}>{isOn ? 'SEE HIM ON FIELD' : 'EXPLORE PERSONAL'}</a>
      </div>
    </article>
  );
}

export default function TwoWorlds({ onFieldPhoto, offFieldPhoto, jerseyNumber }: { onFieldPhoto?: WorldPhoto; offFieldPhoto?: WorldPhoto; jerseyNumber: string }) {
  return (
    <div className="two-worlds" aria-label="On-field and sideline portraits">
      <WorldCard side="on" photo={onFieldPhoto} jerseyNumber={jerseyNumber} />
      <WorldCard side="off" photo={offFieldPhoto} jerseyNumber={jerseyNumber} />
    </div>
  );
}
