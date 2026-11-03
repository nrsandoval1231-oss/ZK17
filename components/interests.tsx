'use client';
import { useRef, useState } from 'react';
import { interests } from '@/content/life';
import styles from './worlds.module.css';
export default function Interests() {
 const [selected, setSelected] = useState(0);
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 const current = interests[selected];
 const select = (index: number) => { setSelected(index); tabs.current[index]?.focus({ preventScroll: true }); };
 return <section className={styles.interests} aria-labelledby="interests-title"><div className={styles.sectionHeading}><div><p className={styles.kicker}>A LITTLE MORE ZEPHYR</p><h2 id="interests-title">OFF THE CLOCK.<br /><span>IN HIS WORLD.</span></h2></div><p>Find a different side.</p></div>
  <div className={styles.interestLayout}><div className={styles.tabs} role="tablist" aria-label="Zephyr’s interests" aria-orientation="vertical">{interests.map((interest, index) => <button key={interest.name} ref={el => { tabs.current[index] = el; }} role="tab" id={`interest-${index}`} aria-selected={selected === index} aria-controls={selected === index ? `interest-panel-${index}` : undefined} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => { const count = interests.length; if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); select(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + count) % count); } }}><span aria-hidden="true">0{index + 1}</span>{interest.name}<span className={styles.tabMark} aria-hidden="true">{selected === index ? '−' : '+'}</span></button>)}</div>
  <div key={selected} id={`interest-panel-${selected}`} className={styles.interestPanel} role="tabpanel" aria-labelledby={`interest-${selected}`} tabIndex={0}><p className={styles.kicker}>{current.picks.length ? 'HIS PICKS / TOP THREE' : 'MORE TO COME'}</p><h3>{current.name}<span>.</span></h3>{current.picks.length ? <><ol>{current.picks.map((pick, index) => <li key={pick}><span>0{index + 1}</span>{pick}</li>)}</ol><p className={styles.panelSource}>{current.source}</p></> : <p className={styles.pending}>Awaiting Zephyr’s answers.<br />This part of his story is still to come.</p>}<span className={styles.panelNumber} aria-hidden="true">17</span></div></div>
 </section>;
}
