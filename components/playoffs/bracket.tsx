'use client';
import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {filterGames,rounds,regionNames,type PlayoffGame,type Tournament,type Region,type RoundIndex} from '@/lib/playoffs/tournament';
import TeamMark from './team-mark';
import StoryArrow from '@/components/story-arrow';
import {statusLabels} from './game-center';
import styles from './playoffs.module.css';
export type RegionFilter=Region|'all'|'state';
export function MatchupCard({game,tournament,onOpen,list=false}:{game:PlayoffGame;tournament:Tournament;onOpen:(game:PlayoffGame)=>void;list?:boolean}){
 const anna=game.homeTeamId==='anna'||game.awayTeamId==='anna';
 return <button data-game-card data-anna={anna||undefined} className={`${styles.matchupCard} ${list?styles.listCard:''}`} onClick={()=>onOpen(game)}>
  <span className="sr-only">Game details: {rounds[game.round].name}. </span><span className={styles.cardMeta}>{game.id.toUpperCase()} <span>{statusLabels[game.status]}</span></span>
  {[game.homeTeamId,game.awayTeamId].map((id,index)=>{const team=tournament.teams.find(team=>team.id===id);return <span className={styles.cardTeam} key={index} data-winner={id&&game.winnerTeamId===id||undefined}><span>{team?.id==='anna'&&team.logo?<TeamMark team={team}/>:null}{team?.name??(game.feederIds.length?`Winner of ${game.feederIds[index].toUpperCase()}`:game.seedLabels[index])}</span><strong>{['live','final'].includes(game.status)?(index===0?game.homeScore:game.awayScore)??'—':'—'}</strong></span>;})}
  <span className={styles.cardFooter}>{anna?'ANNA’S VERIFIED BRACKET POSITION':'OPEN GAME CENTER'} <StoryArrow/></span>
 </button>;
}
function Board({tournament,region,onOpen}:{tournament:Tournament;region:Region|'state';onOpen:(game:PlayoffGame)=>void}){
 const roundIds=region==='state'?[4,5]:[0,1,2,3];
 const height=region==='state'?340:1240;
 const gameY=(game:PlayoffGame)=>{const peers=filterGames(tournament,region,game.round);const index=peers.findIndex(g=>g.id===game.id);const level=region==='state'?game.round-4:game.round;return (index+.5)*144*Math.pow(2,level)-56+42;};
 const games=filterGames(tournament,region,null);
 return <section className={styles.boardSection} aria-label={region==='state'?'State championship bracket':`${regionNames[region-1]} bracket`}><h3 className={styles.boardTitle}>{region==='state'?'THE FINAL STAGE.':regionNames[region-1].toUpperCase()}</h3>
  <div className={styles.bracketCanvas} style={{height,width:roundIds.length*296-36}}>
   <svg className={styles.connectors} width="100%" height="100%" aria-hidden="true">{games.filter(game=>game.nextGameId&&games.some(g=>g.id===game.nextGameId)).map(game=>{const next=games.find(g=>g.id===game.nextGameId)!;const col=roundIds.indexOf(game.round);const x1=col*296+260;const y1=gameY(game)+56;const x2=(col+1)*296;const y2=gameY(next)+56;return <path key={game.id} d={`M${x1},${y1} H${x1+18} V${y2} H${x2}`} className={game.winnerTeamId==='anna'?styles.annaConnector:''}/>;})}</svg>
   {roundIds.map(round=><div key={round} className={styles.bracketColumn}><h4>{rounds[round].short}</h4>{games.filter(game=>game.round===round).map(game=><div className={styles.gameSlot} key={game.id} style={{top:gameY(game)}}><MatchupCard game={game} tournament={tournament} onOpen={onOpen}/></div>)}</div>)}
  </div>
 </section>;
}
export default function Bracket({tournament,region,round,list,onOpen}:{tournament:Tournament;region:RegionFilter;round:RoundIndex|null;list:boolean;onOpen:(game:PlayoffGame)=>void}){
 const rail=useRef<HTMLDivElement>(null);const motionRoot=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const context=gsap.context(()=>gsap.from('[data-game-card]',{y:7,duration:.3,stagger:{amount:.12},ease:'power2.out',clearProps:'transform'}),motionRoot);
   return()=>context.revert();
  });return()=>mm.revert();
 },[region,round,list]);
 const games=filterGames(tournament,region,round);
 if(list||round!==null)return <div ref={motionRoot} className={styles.matchupList} aria-live="polite">{games.length?games.map(game=><MatchupCard list key={game.id} game={game} tournament={tournament} onOpen={onOpen}/>):<p className={styles.pending}>This round belongs to {region==='state'?'a regional bracket':'the state stage'}. Choose All regions to see every game in this round.</p>}</div>;
 const boards: (Region|'state')[]=region==='all'?[1,2,3,4,'state']:[region];
 return <div ref={motionRoot}><div className={styles.scrollTools}><p>FOLLOW THE CONNECTORS <span aria-hidden="true">→</span> Swipe or use arrow keys to explore.</p><div><button onClick={()=>rail.current?.scrollBy({left:-296,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})} aria-label="Scroll bracket left">←</button><button onClick={()=>rail.current?.scrollBy({left:296,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})} aria-label="Scroll bracket right">→</button></div></div><div ref={rail} className={styles.bracketRail} role="region" aria-label="Interactive tournament bracket" tabIndex={0}>{boards.map(r=><Board key={r} tournament={tournament} region={r} onOpen={onOpen}/>)}</div></div>;
}
