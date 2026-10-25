'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { OffFieldFeature } from '@/content/site';
import styles from './offfield-arcade.module.css';

const categories = ['Games', 'Movies', 'TV Shows'] as const;
type Category = (typeof categories)[number];

export default function OffFieldArcade({ features, athleteName }: { features: OffFieldFeature[]; athleteName: string }) {
  const [selected, setSelected] = useState<Category>('Games');
  const [started, setStarted] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const choiceRefs = useRef<Partial<Record<Category, HTMLButtonElement | null>>>({});
  const returnTarget = useRef<Category | 'start'>('start');
  const previousStarted = useRef(false);
  const featureMap = new Map(features.map((feature) => [feature.label, feature.verifiedDetails]));
  const details = (featureMap.get(selected) ?? []).slice(0, 3);

  useLayoutEffect(() => {
    if (started === previousStarted.current) return;
    previousStarted.current = started;
    const target = started ? backRef.current : returnTarget.current === 'start' ? startRef.current : choiceRefs.current[returnTarget.current];
    target?.focus({ preventScroll: true });
  }, [started]);

  const openCategory = (category: Category, target: Category | 'start') => {
    returnTarget.current = target;
    setSelected(category);
    setStarted(true);
  };
  const back = () => setStarted(false);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && started) {
      event.preventDefault();
      back();
    }
  };

  return (
    <section className={styles.arcade} id="offfield-personal" aria-labelledby="arcade-heading" onKeyDown={handleKeyDown}>
      <noscript><style>{`@media (min-width: 900px) {
        #offfield-personal { max-width: 1100px; }
        #offfield-personal .offfield-rail { width: 100%; height: auto; margin: 0; overflow: visible; }
        #offfield-personal .offfield-track { display: block; width: 100%; min-width: 0; height: auto; padding: 0; }
        #offfield-personal .offfield-track > div { display: block; width: 100%; max-width: none; height: auto; }
        #offfield-personal .offfield-track > div:first-child { margin-bottom: 26px; }
        #offfield-personal .screen { min-height: 600px; }
      }`}</style></noscript>
      <div className={`${styles.rail} offfield-rail`}>
        <div className={`${styles.track} offfield-track`}>
          <div className={styles.introPanel}>
            <div className={styles.intro}>
              <p className={styles.kicker}>03 / OFF FIELD</p>
              <h2 id="arcade-heading">A DIFFERENT<br /><em>kind of game.</em></h2>
              <span className={styles.rule} aria-hidden="true" />
            </div>
          </div>
          <div className={styles.cabinetPanel}>
      <div className={styles.cabinet}>
        <div className={styles.bezel}>
          <div className={styles.screen}>
            <div className={styles.stadium} aria-hidden="true">
              <picture>
              <source type="image/avif" srcSet="/media/arcade/player17-stadium-768.avif 768w, /media/arcade/player17-stadium-1280.avif 1280w, /media/arcade/player17-stadium-1536.avif 1536w" sizes="(max-width: 600px) 92vw, (max-width: 1150px) 88vw, 1000px" />
              <img src="/media/arcade/player17-stadium-1536.webp" srcSet="/media/arcade/player17-stadium-768.webp 768w, /media/arcade/player17-stadium-1280.webp 1280w, /media/arcade/player17-stadium-1536.webp 1536w" sizes="(max-width: 600px) 92vw, (max-width: 1150px) 88vw, 1000px" width="1536" height="1024" loading="lazy" alt="" />
              </picture>
            </div>
            <div className={styles.content}>
              <h3 className={styles.pixelTitle}>{athleteName.toUpperCase()}</h3>
              <p className={styles.screenLabel}>{started ? selected.toUpperCase() : 'SELECT A WORLD'}</p>

              {!started ? (
                <>
                  <div className={styles.choices} role="group" aria-label="Choose a category">
                    {categories.map((category) => (
                      <button type="button" ref={(node) => { choiceRefs.current[category] = node; }} className={styles.choice} key={category} data-selected={selected === category} onClick={() => openCategory(category, category)}>
                        <span className={styles.pointer} aria-hidden="true"><svg viewBox="0 0 12 14"><path d="M1 1v12l10-6z" /></svg></span>
                        <span>{category}</span>
                      </button>
                    ))}
                  </div>
                  <p className={styles.teaser}>His picks. Top three.</p>
                  <button ref={startRef} className={styles.start} type="button" onClick={() => openCategory(selected, 'start')}>PRESS START</button>
                </>
              ) : (
                <div className={styles.detail} aria-live="polite" aria-atomic="true">
                  {details.length ? <><p className={styles.picksLabel}>HIS TOP THREE</p><ol className={styles.picks} aria-label={`Zephyr’s top three ${selected.toLowerCase()}`} role="list">{details.map((detail, index) => <li key={detail}><span className={styles.rank} aria-hidden="true">0{index + 1}</span><span className={styles.pickTitle}>{detail}</span></li>)}</ol></> : <p>{selected} details are coming soon.</p>}
                  <button ref={backRef} type="button" className={styles.back} onClick={back}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="M16 10H4m0 0 5-5m-5 5 5 5" /></svg> BACK TO MENU</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>
      <p className={styles.outro}>FOOTBALL. THEN EVERYTHING ELSE.</p>
    </section>
  );
}
