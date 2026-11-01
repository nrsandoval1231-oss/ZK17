'use client';
import {useEffect,useRef,useState} from 'react';
import {rounds,type PlayoffGame,type Tournament} from '@/lib/playoffs/tournament';
import TeamMark from './team-mark';
import styles from './playoffs.module.css';
export const statusLabels={pending:'Pending official confirmation',scheduled:'Scheduled',live:'In progress',final:'Final',postponed:'Postponed',canceled:'Canceled'};
export function formatKickoff(value:string|null){return value?new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Chicago'}).format(new Date(value))+' CT':'Kickoff pending';}
export default function GameCenter({game,round,tournament,onClose}:{game:PlayoffGame|null;round:number;tournament:Tournament;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);const [copyMessage,setCopyMessage]=useState('');const [fallback,setFallback]=useState('');
 useEffect(()=>{const el=dialog.current;if(!el)return;const before=document.body.style.overflow;el.showModal();document.body.style.overflow='hidden';return()=>{el.close();document.body.style.overflow=before;};},[]);
 const source=tournament.sources.find(source=>source.id===game?.sourceId);
 const teams=[game?.homeTeamId,game?.awayTeamId].map(id=>tournament.teams.find(team=>team.id===id));
 async function share(){try{await navigator.clipboard.writeText(location.href);setCopyMessage('Game link copied.');}catch{setCopyMessage('Copy the game address below.');setFallback(location.href);}}
 return <dialog ref={dialog} className={styles.gameDialog} aria-label="Game center" onCancel={event=>{event.preventDefault();onClose();}}>
  <button className={styles.closeDialog} onClick={onClose} aria-label="Close game center">CLOSE <span aria-hidden="true">×</span></button>
  <p className={styles.eyebrow}>2026 / GAME CENTER</p><h2>{rounds[round].name}<span>.</span></h2>
  <p className={styles.gameStatus}>{statusLabels[game?.status??'pending']}</p>
  <div className={styles.dialogMatchup}>{teams.map((team,index)=><div key={index}><TeamMark team={team}/><h3>{team?.name??'Qualifier pending'}</h3><strong>{game?.status==='final'||game?.status==='live'?(index===0?game.homeScore:game.awayScore)??'—':'—'}</strong>{team&&game?.status==='final'&&game.winnerTeamId===team.id&&<span className={styles.winner}>VERIFIED WINNER</span>}</div>)}</div>
  {!game?.homeTeamId||!game?.awayTeamId?<p className={styles.pending}>Official matchup pending. No opponent or advancement is assumed.</p>:null}
  <dl className={styles.detailGrid}><div><dt>DATE & KICKOFF</dt><dd>{formatKickoff(game?.kickoff??null)}</dd></div><div><dt>VENUE</dt><dd>{game?.venue??'Venue pending'}</dd></div><div><dt>LAST VERIFIED</dt><dd>{game?.verifiedAt?formatKickoff(game.verifiedAt):'No game facts verified yet'}</dd></div><div><dt>HIGHLIGHTS</dt><dd>Approved game film pending</dd></div></dl>
  {game?.nextGameId&&<p className={styles.feedNote}>Winner advances to {rounds[Math.min(round+1,5)].name}. This describes the bracket relationship, not a confirmed result.</p>}
  <div className={styles.dialogActions}><a href={source?.url??'https://www.uiltexas.org/football/playoff-brackets/5AD2'} target="_blank" rel="noreferrer">{source?`${source.authority==='secondary'?'Secondary source':'Official source'}: ${source.label}`:'VIEW OFFICIAL UIL BRACKET'} <span aria-hidden="true">↗</span></a><button onClick={share}>COPY GAME LINK</button></div>
  <p role="status" className={styles.copyStatus}>{copyMessage}</p>{fallback&&<label className={styles.fallback}>Game address<input readOnly value={fallback} onFocus={event=>event.currentTarget.select()}/></label>}
 </dialog>;
}
