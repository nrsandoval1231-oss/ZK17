'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { OffFieldFeature } from '@/content/site';
import styles from './offfield-arcade.module.css';
import FootballGame from './football-game';

const categories = ['Gaming', 'Movies', 'Music'] as const;
type Category = (typeof categories)[number];

export default function OffFieldArcade({ features, athleteName }: { features: OffFieldFeature[]; athleteName: string }) {
  const [selected, setSelected] = useState<Category>('Gaming');
  const [started, setStarted] = useState(false);
  const startRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const previousStarted = useRef(false);
  const featureMap = new Map(features.map((feature) => [feature.label, feature.verifiedDetails]));
  const details = featureMap.get(selected) ?? [];

  useLayoutEffect(() => {
    if (started === previousStarted.current) return;
    previousStarted.current = started;
    (started ? backRef.current : startRef.current)?.focus({ preventScroll: true });
  }, [started]);

  const start = () => selected === 'Gaming' ? setGameOpen(true) : setStarted(true);
  const back = () => setStarted(false);
  const [gameOpen, setGameOpen] = useState(false);
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && started) {
      event.preventDefault();
      back();
    } else if (!started && event.target instanceof HTMLInputElement && event.target.type === 'radio' && event.key === 'Enter') {
      event.preventDefault();
      start();
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
                  <fieldset className={styles.choices} aria-label="Choose a world">
                    {categories.map((category) => (
                      <label className={styles.choice} key={category} data-selected={selected === category}>
                        <input type="radio" name="offfield-world" value={category} checked={selected === category} onChange={() => setSelected(category)} />
                        <span className={styles.pointer} aria-hidden="true"><svg viewBox="0 0 12 14"><path d="M1 1v12l10-6z" /></svg></span>
                        <span>{category}</span>
                      </label>
                    ))}
                  </fieldset>
                  <p className={styles.teaser}>A passing challenge is ready. Movies and music are coming soon.</p>
                  <button ref={startRef} className={styles.start} type="button" onClick={start}>PRESS START</button>
                </>
              ) : (
                <div className={styles.detail} aria-live="polite" aria-atomic="true">
                  {selected === 'Gaming' ? <p>Lead moving receivers and drive the ball downfield in a twelve-snap passing challenge. Arcade scores are simulated.</p> : details.length ? <ul>{details.map((detail) => <li key={detail}>{detail}</li>)}</ul> : <p>{selected} details are coming soon.</p>}
                  <button ref={backRef} type="button" className={styles.back} onClick={back}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="M16 10H4m0 0 5-5m-5 5 5 5" /></svg> BACK TO MENU</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {gameOpen && <FootballGame onExit={() => { setGameOpen(false); requestAnimationFrame(() => startRef.current?.focus()); }} />}
          </div>
        </div>
      </div>
      <p className={styles.outro}>FOOTBALL. THEN EVERYTHING ELSE.</p>
    </section>
  );
}
