import type { Metadata } from 'next';
import RouteHeader from '@/components/route-header';
import AthletePhoto from '@/components/athlete-photo';
import WorldFooter from '@/components/world-footer';
import { athletePhotos } from '@/content/athlete-photos';
import { eligibleMetric, gameDate, performanceGames, performanceSource, seasonMetrics, verifiedGames } from '@/content/performance';
import styles from '@/components/worlds.module.css';
export const metadata: Metadata = { title: 'On the Field | Zephyr Kreye — ZK17', description: 'The quarterback. Zephyr Kreye’s source-backed 2026 season and signature performances.', alternates: { canonical: '/on-the-field/' } };
export default function OnTheFieldPage() {
 const { field } = athletePhotos();
 const games = verifiedGames(performanceGames);
 return <><RouteHeader /><main id="main" className={styles.fieldPage}>
  <section className={`scene on-field ${styles.fieldHero}`} id="on-field" aria-labelledby="field-title">
   <div className="field-art">{field && <AthletePhoto photo={field} className={styles.fieldPhoto} priority sizes="(max-width: 700px) 100vw, 65vw" />}<div className="field-lines" /><span className="field-mark" aria-hidden="true">17</span><div className="field-caption"><span>FIG. 01</span><span>FOOTBALL / ANNA COYOTES</span><span>TEXAS</span></div></div>
   <div className="field-lockup"><p className="eyebrow">01 / THE QUARTERBACK</p><h1 id="field-title">ON THE<br />FIELD<span>.</span></h1><div className="field-base"><span>QUARTERBACK <b>17</b></span><p>Anna High School.<br />Class of 2027.</p></div></div>
  </section>
  <section className={styles.season} aria-labelledby="season-title">
   <header className={styles.sectionHeading}><div><p className={styles.kicker}>THE RECORD / NINE GAMES</p><h2 id="season-title">2026<span>SEASON.</span></h2></div><p>Preparation meets<br />the moment.</p></header>
   <div className={styles.metricGrid}>{seasonMetrics.map(metric => <article key={metric.id} className={styles.metric} data-season-metric><p>{metric.label}</p><strong>{eligibleMetric(metric) ? metric.value!.toLocaleString('en-US') : '—'}<span>{metric.unit}</span></strong><a href={metric.sourceUrl}>MaxPreps · checked {metric.verifiedAt}</a></article>)}</div>
   <details className={styles.sourceNotes}><summary>ABOUT THE RECORD & SOURCES</summary><p>MaxPreps-reported 2026–27 varsity record, {performanceSource.games} games through Oct. 30. Coach-entered statistics updated Nov. 2; checked Nov. 3, 2026. These are in-season totals.</p><p>Dallas News reports different season figures. We display the MaxPreps record consistently; reconciliation with the team is pending.</p><ul>{seasonMetrics.map(metric => <li key={metric.id}>{metric.label}: {metric.note}</li>)}</ul><a href="https://www.dallasnews.com/high-school-sports/schools/anna/football/2026/stats-player/">Compare Dallas News record</a></details>
  </section>
  <section className={styles.signatures} aria-labelledby="signature-title"><header className={styles.sectionHeading}><div><p className={styles.kicker}>MOMENTS IN THE MAKING</p><h2 id="signature-title">SIGNATURE<br /><span>PERFORMANCES.</span></h2></div><p>Selected from the<br />verified game record.</p></header>
   {games.filter(game => game.signature).map((game, index) => <article className={styles.signature} key={game.id}><span className={styles.signatureIndex}>0{index + 1}</span><div><p className={styles.kicker}>{gameDate(game.date)} / VS {game.opponent.toUpperCase()}</p><h3>{game.signature}</h3><p className={styles.signatureOpponent}>{game.opponent}</p></div><div className={styles.signatureNumbers}><p><strong>{game.passingYards}</strong>PASS YDS</p><p><strong>{game.passingTouchdowns}</strong>PASS TD</p><a href={game.sourceUrl}>Game record · checked {game.verifiedAt}</a></div></article>)}
  </section>
  <section className={styles.gameLog} aria-labelledby="game-log-title"><div className={styles.sectionHeading}><div><p className={styles.kicker}>WEEK BY WEEK</p><h2 id="game-log-title">THE GAME<br /><span>LOG.</span></h2></div><p>2026 / ANNA COYOTES</p></div><div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Game-by-game statistics, scroll horizontally"><table><caption>MaxPreps-reported games · checked Nov. 3, 2026. A dash means unverified, not zero.</caption><thead><tr><th scope="col">DATE</th><th scope="col">OPPONENT</th><th scope="col">PASS YDS</th><th scope="col">PASS TD</th><th scope="col">RUSH YDS</th><th scope="col">RUSH TD</th><th scope="col">SOURCE</th></tr></thead><tbody>{games.map(game => <tr key={game.id}><td><time dateTime={game.date}>{gameDate(game.date)}</time></td><th scope="row">{game.opponent}</th><td>{game.passingYards ?? '—'}</td><td>{game.passingTouchdowns ?? '—'}</td><td>{game.rushingYards ?? '—'}</td><td>{game.rushingTouchdowns ?? '—'}</td><td><a href={game.sourceUrl} aria-label={`MaxPreps: ${game.opponent} game source, checked ${game.verifiedAt}`}>MaxPreps</a></td></tr>)}</tbody></table></div></section>
  <WorldFooter next="beyond" />
 </main></>;
}
