export type Region = 1 | 2 | 3 | 4;
export type RoundIndex = 0 | 1 | 2 | 3 | 4 | 5;
export type GameStatus = 'pending' | 'scheduled' | 'live' | 'final' | 'postponed' | 'canceled';
export type Team = { id: string; name: string; aliases: string[]; district: number | null; region: Region | null; logo: string | null };
export type Source = { id: string; label: string; url: string; authority: 'uil' | 'school' | 'secondary'; season: number; retrievedAt: string };
export type PlayoffGame = {
 id: string; season: number; division: '5A-DII'; region: Region | null; round: RoundIndex;
 homeTeamId: string | null; awayTeamId: string | null; homeScore: number | null; awayScore: number | null;
 status: GameStatus; kickoff: string | null; venue: string | null; winnerTeamId: string | null;
 nextGameId: string | null; nextSlot: 'home' | 'away' | null; feederIds: string[]; seedLabels: [string,string];
 sourceId: string | null; verifiedAt: string | null;
};
export type Observation = Pick<PlayoffGame, 'homeTeamId'|'awayTeamId'|'homeScore'|'awayScore'|'status'|'kickoff'|'venue'|'winnerTeamId'|'verifiedAt'> & { gameId: string; sourceId: string; reviewedBy: string };
export type Tournament = { season: 2026; division: '5A-DII'; teams: Team[]; games: PlayoffGame[]; sources: Source[]; history: Observation[] };
export const rounds = [
 {id:'bi',name:'Bi-District',short:'BI-DISTRICT'}, {id:'area',name:'Area',short:'AREA'},
 {id:'regional',name:'Regional',short:'REGIONAL'}, {id:'quarter',name:'State Quarterfinal',short:'QUARTERFINAL'},
 {id:'semi',name:'State Semifinal',short:'SEMIFINAL'}, {id:'final',name:'State Championship',short:'CHAMPIONSHIP'},
] as const;
export const regionNames = ['Region I','Region II','Region III','Region IV'] as const;
const positions = ['1st','2nd','3rd','4th'];
const validDate = (value: unknown): value is string => typeof value === 'string' && /T.*(?:Z|[+-]\d\d:\d\d)$/.test(value) && Number.isFinite(Date.parse(value));

/** UIL's 2026 blank 2A–5A D1/D2 bracket: 16 districts × four qualifiers. */
export function createBracket(): Tournament {
 const games: PlayoffGame[]=[];
 const make = (id:string,region:Region|null,round:RoundIndex,feeders:string[],labels:[string,string]=['Qualifier pending','Qualifier pending']):PlayoffGame => ({id,season:2026,division:'5A-DII',region,round,feederIds:feeders,seedLabels:labels,homeTeamId:null,awayTeamId:null,homeScore:null,awayScore:null,status:'pending',kickoff:null,venue:null,winnerTeamId:null,nextGameId:null,nextSlot:null,sourceId:null,verifiedAt:null});
 for (const region of [1,2,3,4] as const) {
  const d=(region-1)*4;
  // W1/F2, R4/T3, W2/F1, R3/T4, W3/F4, R2/T1, W4/F3, R1/T2.
  const pairs=[[1,1,2,4],[4,2,3,3],[2,1,1,4],[3,2,4,3],[3,1,4,4],[2,2,1,3],[4,1,3,4],[1,2,2,3]];
  let previous=pairs.map(([a,ap,b,bp],index)=>{
   const game=make(`r${region}-bi-${index+1}`,region,0,[],[`District ${d+a} · ${positions[ap-1]}`,`District ${d+b} · ${positions[bp-1]}`]);games.push(game);return game;
  });
  for (const round of [1,2,3] as const) {
   const next:PlayoffGame[]=[];
   for (let i=0;i<previous.length;i+=2) {
    const game=make(`r${region}-${rounds[round].id}-${i/2+1}`,region,round,[previous[i].id,previous[i+1].id]);
    previous[i].nextGameId=game.id;previous[i].nextSlot='home';previous[i+1].nextGameId=game.id;previous[i+1].nextSlot='away';games.push(game);next.push(game);
   }
   previous=next;
  }
 }
 for(const [index,regions] of [[1,[1,2]],[2,[3,4]]] as const){
  const feeders=regions.map(region=>games.find(g=>g.id===`r${region}-quarter-1`)!);
  const game=make(`state-semi-${index}`,null,4,feeders.map(g=>g.id));feeders.forEach((g,i)=>{g.nextGameId=game.id;g.nextSlot=i===0?'home':'away';});games.push(game);
 }
 const final=make('state-final',null,5,['state-semi-1','state-semi-2']);
 games.filter(g=>g.round===4).forEach((g,i)=>{g.nextGameId=final.id;g.nextSlot=i===0?'home':'away';});games.push(final);
 return {season:2026,division:'5A-DII',teams:[],games,sources:[],history:[]};
}
export function normalizeTeamName(name:string):string { return name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim(); }
export function resolveTeam(name:string, teams:Team[]):Team|null {
 const needle=normalizeTeamName(name);const matches=teams.filter(team=>[team.name,...team.aliases].some(alias=>normalizeTeamName(alias)===needle));
 if(matches.length>1)throw new Error(`Ambiguous team alias: ${name}`);return matches[0]??null;
}
export function filterGames(t:Tournament,region:Region|'all'|'state',round:RoundIndex|null):PlayoffGame[]{return t.games.filter(g=>(region==='all'||(region==='state'?g.region===null:g.region===region))&&(round===null||g.round===round));}
function assert(condition:unknown,message:string):asserts condition {if(!condition)throw new Error(message);}
function validateSource(source:Source) {
 const url=new URL(source.url);assert(url.protocol==='https:','Sources must use HTTPS');
 if(source.authority==='uil')assert(['www.uiltexas.org','uiltexas.org','realignment.uiltexas.org'].includes(url.hostname),'UIL source must belong to UIL');
 assert(['uil','school','secondary'].includes(source.authority),'Invalid source authority');
 assert(source.season===2026&&validDate(source.retrievedAt)&&Date.parse(source.retrievedAt)<=Date.now(),'Source season/retrieval timestamp invalid');
}
function validateGame(t:Tournament,g:PlayoffGame){
 const teamIds=new Set(t.teams.map(team=>team.id));
 for(const team of [g.homeTeamId,g.awayTeamId])assert(team===null||teamIds.has(team),'Unknown team identity');
 assert(!g.homeTeamId||g.homeTeamId!==g.awayTeamId,'A team cannot play itself');
 assert(['pending','scheduled','live','final','postponed','canceled'].includes(g.status),'Invalid game status');
 for(const score of [g.homeScore,g.awayScore])assert(score===null||(Number.isInteger(score)&&score>=0&&score<=200),'Invalid football score');
 if(g.kickoff!==null)assert(validDate(g.kickoff),'Kickoff requires a timestamp with timezone');
 if(g.venue!==null)assert(typeof g.venue==='string'&&g.venue.trim().length>0,'Venue cannot be blank');
 if(g.status==='scheduled'||g.status==='live'||g.status==='final')assert(g.homeTeamId&&g.awayTeamId,'Confirmed game requires both opponents');
 if(g.status==='scheduled')assert(g.kickoff,'Scheduled game requires official kickoff');
 if(g.status==='final'){
  assert(g.homeScore!==null&&g.awayScore!==null&&g.homeScore!==g.awayScore,'Final requires complete non-tied scores');
  assert(g.winnerTeamId&&(g.winnerTeamId===g.homeTeamId||g.winnerTeamId===g.awayTeamId),'Final requires an explicit participating winner');
  assert(g.winnerTeamId===(g.homeScore>g.awayScore?g.homeTeamId:g.awayTeamId),'Winner conflicts with final score');
 }else assert(g.winnerTeamId===null,'Only a verified final can have a winner');
 if(!['live','final'].includes(g.status))assert(g.homeScore===null&&g.awayScore===null,'Scores only allowed for live or final games');
 const hasFacts=g.homeTeamId||g.awayTeamId||g.status!=='pending'||g.kickoff||g.venue;
 if((hasFacts&&g.feederIds.length===0)||g.status!=='pending'||g.kickoff||g.venue){
  assert(validDate(g.verifiedAt),'Published facts require verification');assert(t.sources.some(s=>s.id===g.sourceId),'Published facts require a known source');
 }
}
export function validateTournament(t:Tournament):void {
 assert(t.season===2026&&t.division==='5A-DII','Wrong tournament season/division');
 const template=createBracket();assert(t.games.length===63,'Tournament must contain all 63 games');
 assert(new Set(t.games.map(g=>g.id)).size===63,'Duplicate game ID');assert(new Set(t.teams.map(team=>team.id)).size===t.teams.length,'Duplicate team ID');
 assert(new Set(t.sources.map(source=>source.id)).size===t.sources.length,'Duplicate source ID');t.sources.forEach(validateSource);
 for(const g of t.games){
  const shape=template.games.find(item=>item.id===g.id);assert(shape,'Unknown bracket slot');
  assert(g.season===2026&&g.division==='5A-DII'&&g.round===shape.round&&g.region===shape.region,'Game does not match tournament');
  assert(g.nextGameId===shape.nextGameId&&g.nextSlot===shape.nextSlot&&JSON.stringify(g.feederIds)===JSON.stringify(shape.feederIds),'Invalid advancement relationship');
  assert(JSON.stringify(g.seedLabels)===JSON.stringify(shape.seedLabels),'Seed placement cannot be altered');
  validateGame(t,g);
  if(g.feederIds.length){
   for(const [index,id] of g.feederIds.entries()){
    const feeder=t.games.find(item=>item.id===id)!;const entrant=index===0?g.homeTeamId:g.awayTeamId;
    assert(entrant===null||(feeder.status==='final'&&feeder.winnerTeamId===entrant),'Entrant has not won its feeder game');
   }
  }
 }
 const firstRound=t.games.filter(g=>g.round===0).flatMap(g=>[g.homeTeamId,g.awayTeamId]).filter(Boolean);
 assert(new Set(firstRound).size===firstRound.length,'Team appears in multiple first-round slots');
}
/** Reviewed observations are applied transactionally. Conflicting evidence never overwrites a result. */
export function applyObservation(t:Tournament,input:Observation):Tournament {
 const source=t.sources.find(item=>item.id===input.sourceId);assert(source,'Unknown source');validateSource(source);
 assert(validDate(input.verifiedAt)&&Date.parse(input.verifiedAt)<=Date.now()&&input.reviewedBy?.trim(),'Observation requires non-future verification and reviewer');
 assert(Date.parse(input.verifiedAt)>=Date.parse(source.retrievedAt),'Verification predates retrieval');
 const next=structuredClone(t);const game=next.games.find(item=>item.id===input.gameId);assert(game,'Unknown game ID');
 const patch=input; // Only the explicit domain fields below are copied.
 assert(!game.verifiedAt||Date.parse(input.verifiedAt)>=Date.parse(game.verifiedAt),'Stale verification cannot replace newer evidence');
 const fields=['homeTeamId','awayTeamId','homeScore','awayScore','status','kickoff','venue','winnerTeamId','sourceId','verifiedAt'] as const;
 if(game.status==='final'){
  const same=fields.filter(key=>!['sourceId','verifiedAt'].includes(key)).every(key=>game[key]===patch[key]);
  assert(same,'Conflicting final result: explicit correction review required');
  return next;
 }
 if(game.sourceId&&game.sourceId!==source.id){
  const prior=next.sources.find(s=>s.id===game.sourceId)!;
  assert(!(prior.authority!=='secondary'&&source.authority==='secondary'),'Secondary source cannot replace official evidence');
 }
 if(game.homeTeamId&&input.homeTeamId!==game.homeTeamId||game.awayTeamId&&input.awayTeamId!==game.awayTeamId)throw new Error('Conflicting matchup identity');
 Object.assign(game,Object.fromEntries(fields.map(key=>[key,patch[key]])));
 validateGame(next,game);
 if(patch.status==='final'&&game.nextGameId){
  const target=next.games.find(item=>item.id===game.nextGameId)!;const slot=game.nextSlot==='home'?'homeTeamId':'awayTeamId';
  assert(target[slot]===null||target[slot]===game.winnerTeamId,'Conflicting advancement destination');target[slot]=game.winnerTeamId;
 }
 next.history.push(structuredClone(input));validateTournament(next);return next;
}
export type RoadStep={round:RoundIndex;gameId:string|null;state:'completed'|'current'|'upcoming'|'eliminated';outcome:'win'|'loss'|null};
export function annaRoad(t:Tournament,teamId:string):RoadStep[]{
 let eliminated=false;
 return rounds.map((_,index)=>{
  const round=index as RoundIndex;const game=t.games.find(g=>g.round===round&&(g.homeTeamId===teamId||g.awayTeamId===teamId));
  if(eliminated)return{round,gameId:null,state:'eliminated',outcome:null};
  if(!game)return{round,gameId:null,state:'upcoming',outcome:null};
  if(game.status==='final'){eliminated=game.winnerTeamId!==teamId;return{round,gameId:game.id,state:eliminated?'eliminated':'completed',outcome:eliminated?'loss':'win'};}
  return{round,gameId:game.id,state:'current',outcome:null};
 });
}
