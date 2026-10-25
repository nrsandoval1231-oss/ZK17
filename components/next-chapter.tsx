import type { CommitmentReveal } from '@/content/site';

export default function NextChapter({ reveal, classYear }: { reveal: CommitmentReveal; classYear: number }) {
  const enabled = reveal.mode === 'enabled';
  return <section className="scene next-chapter" id="next-chapter" aria-labelledby="next-title"><div className="next-graphic" aria-hidden="true"><span className="next-orbit orbit-a"/><span className="next-orbit orbit-b"/><span className="next-plus">+</span></div><div className="next-copy" data-reveal><p className="eyebrow"><i /> {enabled ? 'A NEW CHAPTER' : 'STILL WRITING'}</p>{enabled ? <h2 className="announcement-copy" id="next-title">{reveal.displayCopy}</h2> : <h2 id="next-title">THE STORY<br />IS STILL BEING<br /><em>WRITTEN.</em></h2>}{enabled ? <p className="next-status"><span className="status-dot" /> COMMITTED <i /> {reveal.school.toUpperCase()}</p> : <p className="next-status"><span className="status-dot" /> UNCOMMITTED <i /> CLASS OF {classYear}</p>}</div><span className="scene-edge">NEXT CHAPTER <i /> 06 / 08</span></section>;
}
