// Server-side adapter only: never imported by the website bundle.
import {load} from 'cheerio';
import {createHash} from 'node:crypto';
import {applyBatch,replayArtifact,type Artifact} from './artifact';
import {applyObservation,createBracket,resolveTeam,normalizeTeamName,type Observation,type PlayoffGame} from './tournament';
export const BRACKET_ID='15f0b8b4-192d-4208-828c-4f26f39ce6a8';
export const BRACKET_URL=`https://www.maxpreps.com/tournament/view.aspx?tournamentid=7a33d24f-4de2-43eb-aa37-7987d5c334ab&ssid=2286cd80-c46d-4739-8dd1-92a67ca8daa7&bracketid=${BRACKET_ID}`;
export const CANONICAL_BRACKET_URL='https://www.maxpreps.com/tournament/T9IzeuJN60OqN3mH1cM0qw/tLjwFS0ZCEKCjE8m85zmqA/football-26/2026-uil-texas-football-state-championships-2026-football-conference-5a-d2.htm';
export const UIL_URL='https://www.uiltexas.org/football/playoff-brackets/5AD2';
const ZERO='00000000-0000-0000-0000-000000000000';
const guid=/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
const sha=(text:string)=>createHash('sha256').update(text).digest('hex');
function check(value:unknown,message:string):asserts value{if(!value)throw new Error(message);}
const clean=(s:string)=>s.replace(/\s+/g,' ').trim();
export function trustedURL(value:string,kind:'bracket'|'game'|'team'){
 const u=new URL(value,'https://www.maxpreps.com');
 check(u.protocol==='https:'&&u.hostname==='www.maxpreps.com'&&!u.username&&!u.password&&!u.port,'Untrusted MaxPreps URL');
 if(kind==='bracket'&&u.href!==CANONICAL_BRACKET_URL)check(u.pathname==='/tournament/view.aspx'&&u.searchParams.get('bracketid')===BRACKET_ID&&u.searchParams.get('tournamentid')==='7a33d24f-4de2-43eb-aa37-7987d5c334ab'&&u.searchParams.get('ssid')==='2286cd80-c46d-4739-8dd1-92a67ca8daa7','Wrong competition URL');
 if(kind==='game')check(/^\/tx\/football\/game\/[a-z\d-]+\/\d{2}-\d{2}-2026\/$/i.test(u.pathname)&&u.searchParams.has('c'),'Unrecognized 2026 game URL');
 if(kind==='team')check(/^\/tx\/[a-z\d-]+\/[a-z\d-]+\/football\/(?:26-27\/schedule\/)?$/i.test(u.pathname),'Unrecognized 2026 team URL');
 u.hash='';return u.href;
}
export function discoverBracket(uilHtml:string){
 const $=load(uilHtml);const links=$('a.maxpreps-widget-link').toArray().filter(a=>/^2026 (?:UIL Texas Football State Championships )?2026 Football Conference 5A D2$|^2026 Football Conference 5A D2$/.test(clean($(a).text())));
 check(links.length===1,'Missing or ambiguous UIL 2026 5A D2 competition link');
 return trustedURL($(links[0]).attr('href')??'','bracket');
}
export function linkedGames(html:string){
 const $=load(html);return [...new Set($(`#bracket_${BRACKET_ID} .matchup-container a[href]`).toArray().map(a=>$(a).attr('href')!).filter(h=>h.includes('/tx/football/game/')).map(h=>trustedURL(h,'game')))];
}
type Snapshot={uilHtml:string;bracketHtml:string;url:string;retrievedAt:string;details:Record<string,string>};
export function normalizeSnapshot(artifact:Artifact,snapshot:Snapshot){
 check(trustedURL(snapshot.url,'bracket')===discoverBracket(snapshot.uilHtml),'Bracket must be linked by the current UIL page');
 let current=replayArtifact(artifact);const teams=structuredClone(artifact.teams);const sources=structuredClone(artifact.sources);const warnings:string[]=[];
 const $=load(snapshot.bracketHtml);const bracket=$(`#bracket_${BRACKET_ID}`);
 check(bracket.length===1&&bracket.attr('data-size')==='64'&&clean(bracket.find('h2.bracket-name').text())==='2026 Football Conference 5A D2','Wrong season/division/bracket structure');
 const nodes=bracket.find('li.matchup-container').toArray();check(nodes.length===63,'Expected all 63 bracket nodes');
 const template=createBracket();const mapping=new Map<string,PlayoffGame>();
 const records=nodes.map(node=>{
  const el=$(node);const id=(el.attr('id')??'').replace(/^matchup_/,'');check(guid.test(id),'Missing stable matchup identity');
  const entrants=el.find('ul.teams > li.team');check(entrants.length===2,'Unrecognized team markup');
  return {el,id,entrants,feeders:entrants.toArray().map(e=>$(e).attr('data-source-matchup-id')),next:el.attr('data-winners-next-matchup-id')};
 });
 check(new Set(records.map(r=>r.id)).size===63,'Duplicate source matchup ID');
 const seed=(label:string)=>{const m=/^District (\d+) · (1st|2nd|3rd|4th)$/.exec(label);return m?`${({ '1st':'W','2nd':'R','3rd':'T','4th':'F' } as const)[m[2] as '1st']}${m[1]}`:'';};
 for(const r of records){
  if(r.feeders.every(f=>f===ZERO)){
   const labels=r.entrants.toArray().map(e=>clean($(e).find('.seed').text()));
   const game=template.games.find(g=>g.round===0&&g.seedLabels.every((l,i)=>seed(l)===labels[i]));
   check(game,'Unknown or changed first-round seeds');mapping.set(r.id,game);
  }
 }
 check(mapping.size===32,'Missing first-round seed structure');
 for(let round=1;round<=5;round++)for(const r of records){
  if(mapping.has(r.id))continue;
  const feeders=r.feeders.map(f=>mapping.get(f??''));if(feeders.some(f=>!f||f.round!==round-1))continue;
  const game=template.games.find(g=>g.round===round&&g.feederIds.every((id,i)=>id===feeders[i]?.id));
  check(game,'Changed source feeder relationship');mapping.set(r.id,game);
 }
 check(Number(mapping.size)===63&&new Set([...mapping.values()].map(g=>g.id)).size===63,'Ambiguous or incomplete tournament graph');
 for(const r of records){const g=mapping.get(r.id)!;check(g.nextGameId?mapping.get(r.next??'')?.id===g.nextGameId:r.next===ZERO,'Changed winner advancement edge');}
 const bracketHash=sha(snapshot.bracketHtml);const sourceId=`uil-linked-maxpreps-${bracketHash.slice(0,16)}`;
 const addSource=(id:string,url:string,label:string,extra:{url:string;sha256:string}[]=[])=>{if(!sources.some(s=>s.id===id))sources.push({id,url,label,authority:'secondary',season:2026,retrievedAt:snapshot.retrievedAt,evidence:[{url:UIL_URL,sha256:sha(snapshot.uilHtml)},{url:snapshot.url,sha256:bracketHash},...extra]});};
 addSource(sourceId,snapshot.url,'UIL-linked MaxPreps 2026 5A D2 bracket');
 const observations:Observation[]=[];
 const identity=new Map<string,string>();const teamURLs=new Map<string,string>();
 const ordered=records.sort((a,b)=>mapping.get(a.id)!.round-mapping.get(b.id)!.round);
 for(const r of ordered){
  const game=mapping.get(r.id)!;
  const ids=r.entrants.toArray().map((e,index)=>{
   const el=$(e);const school=el.attr('data-school-id');const name=clean(el.find('.name').text());
   if(school===ZERO){check(!name||/^Winner G\d+$/.test(name),'Named school without stable identity');return null;}
   check(school&&guid.test(school)&&name&&!/^Winner G\d+$/.test(name),'Unknown school identity markup');
   const href=el.find('.name a').attr('href');check(href,'Named team requires a team link');const teamURL=trustedURL(href,'team');
   let team=teams.find(t=>t.aliases.includes(`maxpreps:${school}`));
   if(team)check([team.name,...team.aliases].some(alias=>normalizeTeamName(alias)===normalizeTeamName(name)),'Stable school identity changed name; review required');
   if(!team&&game.round===0){
    team=resolveTeam(name,teams)??undefined;
    if(team)check(!team.aliases.some(a=>a.startsWith('maxpreps:')),'Conflicting school identity');
    else{const district=Number(game.seedLabels[index].match(/District (\d+)/)?.[1]);team={id:`mp-${school}`,name,aliases:[],district,region:game.region,logo:null};teams.push(team);}
    team.aliases.push(`maxpreps:${school}`);
   }
   check(team,'Later-round school not verified in a first-round position');
   check(!identity.has(school)||identity.get(school)===team.id,'Conflicting school binding');identity.set(school,team.id);
   check(!teamURLs.has(team.id)||teamURLs.get(team.id)===teamURL,'School URL changed within bracket');teamURLs.set(team.id,teamURL);
   return team.id;
  });
  const old=current.games.find(g=>g.id===game.id)!;
  // Disappearing participants are not silently erased by a temporarily incomplete source.
  check(!old.homeTeamId||!ids[0]||old.homeTeamId===ids[0],'Conflicting matchup identity');
  check(!old.awayTeamId||!ids[1]||old.awayTeamId===ids[1],'Conflicting matchup identity');
  const results=r.entrants.toArray().map(e=>clean($(e).find('.result').text()));
  const winners=r.entrants.toArray().map(e=>$(e).hasClass('matchwinner'));
  const hasScores=results.some(Boolean);const final=r.el.hasClass('has-result')&&r.el.attr('data-result-length')==='2';
  if(hasScores||final||winners.some(Boolean))check(final&&results.every(s=>/^\d+$/.test(s))&&winners.filter(Boolean).length===1,'Unrecognized result or missing explicit winner');
  if(!ids.some(Boolean)&&!hasScores)continue;
  // Later participants must be justified by finals in the same transaction, never by a placeholder alone.
  let kickoff=old.kickoff;const venue=old.venue;let observationSource=sourceId;
  const verifiedKickoffs=new Set<string>();
  for(const url of [...new Set(r.el.find('a[href]').toArray().map(a=>$(a).attr('href')!).filter(h=>h.includes('/tx/football/game/')).map(h=>trustedURL(h,'game')))]){
   if(!snapshot.details[url]){warnings.push(`${game.id}: linked schedule detail unavailable`);continue;}
   try{
    const detail=load(snapshot.details[url]);const events=detail('script[type="application/ld+json"]').toArray().flatMap(e=>{const x=JSON.parse(detail(e).text());return Array.isArray(x)?x:[x];}).filter(e=>e['@type']==='SportsEvent');
    check(events.length===1,'Expected one SportsEvent');const event=events[0];
    check(event.sport==='Football'&&event.url===url,'Mismatched game detail');
    check(!event.eventStatus||['https://schema.org/EventScheduled','https://schema.org/EventRescheduled'].includes(event.eventStatus),'Non-scheduled event requires review');
    const participants=[event.homeTeam?.url,event.awayTeam?.url].map(u=>trustedURL(u,'team')).sort();
    check(ids.every(Boolean)&&JSON.stringify(participants)===JSON.stringify(ids.map(id=>teamURLs.get(id!)).sort()),'Mismatched game detail participants');
    check(typeof event.startDate==='string'&&/^2026-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(event.startDate)&&Number.isFinite(Date.parse(event.startDate)),'Kickoff missing explicit 2026 timezone');
    const parts=/^2026-(\d\d)-(\d\d)T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,7})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(event.startDate);
    check(parts&&new Date(Date.UTC(2026,Number(parts[1])-1,Number(parts[2]))).getUTCMonth()===Number(parts[1])-1,'Invalid kickoff calendar date');
    const time=Date.parse(event.startDate);check(time>=Date.parse('2026-11-12T00:00:00Z')&&time<Date.parse('2026-12-21T00:00:00Z'),'Kickoff outside playoff season');
    verifiedKickoffs.add(new Date(time).toISOString());
    if(old.status!=='final')kickoff=event.startDate;
    else if(old.kickoff!==event.startDate)warnings.push(`${game.id}: final kickoff retained; late detail requires manual review`);
    // A school's postal address is not proof of the stadium; venue remains pending unless manually verified.
    const detailHash=sha(snapshot.details[url]);const detailId=`maxpreps-game-${sha(bracketHash+detailHash).slice(0,16)}`;addSource(detailId,url,'UIL-linked MaxPreps game detail and bracket',[{url,sha256:detailHash}]);observationSource=detailId;
   }catch(error){warnings.push(`${game.id}: ${error instanceof Error?error.message:'Invalid game detail'}`);}
  }
  check(verifiedKickoffs.size<=1,'Conflicting kickoff evidence; review required');
  const observation:Observation={gameId:game.id,homeTeamId:ids[0]??old.homeTeamId,awayTeamId:ids[1]??old.awayTeamId,homeScore:final?Number(results[0]):old.homeScore,awayScore:final?Number(results[1]):old.awayScore,status:final?'final':old.status==='pending'&&kickoff&&ids.every(Boolean)?'scheduled':old.status, winnerTeamId:final?ids[winners.indexOf(true)]:old.winnerTeamId,kickoff,venue,sourceId:observationSource,verifiedAt:snapshot.retrievedAt,reviewedBy:'source-adapter:maxpreps-v1 (UIL-linked; graph and identity validated)'};
  current.teams=teams;current.sources=sources;current=applyObservation(current,observation);
  observations.push(observation);
 }
 const result=applyBatch(artifact,observations,teams,sources);
 return {...result,warnings,evidence:{adapter:'maxpreps-v1',uilSha256:sha(snapshot.uilHtml),bracketSha256:bracketHash,bracketURL:snapshot.url,retrievedAt:snapshot.retrievedAt}};
}
