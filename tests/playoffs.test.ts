import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createBracket, normalizeTeamName, resolveTeam, applyObservation, annaRoad, filterGames, validateTournament, type Tournament, type Observation } from '../lib/playoffs/tournament';

function fixture(): Tournament {
 const tournament = createBracket();
 tournament.teams = [{id:'anna',name:'Anna Coyotes',aliases:['Anna','Anna High School'],district:4,region:1,logo:null},{id:'fixture-a',name:'Fixture A',aliases:[],district:3,region:1,logo:null}];
 const game=tournament.games.find(g=>g.id==='r1-bi-2')!;
 game.homeTeamId='anna'; game.awayTeamId='fixture-a';
 tournament.sources=[{id:'test-uil',label:'Test official evidence',url:'https://www.uiltexas.org/football/playoff-brackets/5AD2',authority:'uil',season:2026,retrievedAt:'2026-11-14T10:00:00Z'}];
 return tournament;
}
const result: Observation={gameId:'r1-bi-2',homeTeamId:'anna',awayTeamId:'fixture-a',homeScore:28,awayScore:21,status:'final',winnerTeamId:'anna',kickoff:null,venue:null,sourceId:'test-uil',verifiedAt:'2026-11-14T11:00:00Z',reviewedBy:'test reviewer'};
describe('2026 UIL tournament',()=>{
 it('represents 64 slots and all 63 games in the exact six-round graph',()=>{
  const t=createBracket(); assert.equal(t.games.length,63); assert.deepEqual([0,1,2,3,4,5].map(r=>t.games.filter(g=>g.round===r).length),[32,16,8,4,2,1]);
  assert.equal(new Set(t.games.map(g=>g.id)).size,63); assert.equal(t.games.filter(g=>g.nextGameId===null).length,1);
  assert.deepEqual(t.games.find(g=>g.id==='r1-bi-1')?.seedLabels,['District 1 · 1st','District 2 · 4th']);
  assert.deepEqual(t.games.find(g=>g.id==='r1-bi-2')?.seedLabels,['District 4 · 2nd','District 3 · 3rd']);
  assert.equal(t.games.find(g=>g.id==='r1-quarter-1')?.nextGameId,'state-semi-1');
  assert.equal(t.games.find(g=>g.id==='r2-quarter-1')?.nextGameId,'state-semi-1');
  assert.equal(t.games.find(g=>g.id==='r3-quarter-1')?.nextGameId,'state-semi-2'); validateTournament(t);
 });
 it('normalizes known aliases without fuzzy merging other schools',()=>{
  const t=fixture();assert.equal(normalizeTeamName('  ÁNNA HIGH SCHOOL  '),'anna high school');assert.equal(resolveTeam('Anna High School',t.teams)?.id,'anna');assert.equal(resolveTeam('Anna Other School',t.teams),null);
 });
 it('advances only an explicitly verified final winner and leaves unrelated games untouched',()=>{
  const t=fixture();const updated=applyObservation(t,result);assert.equal(updated.games.find(g=>g.id==='r1-area-1')?.awayTeamId,'anna');
  assert.equal(t.games.find(g=>g.id==='r1-area-1')?.awayTeamId,null);assert.deepEqual(updated.games.find(g=>g.id==='r4-bi-1'),t.games.find(g=>g.id==='r4-bi-1'));
 });
 it('rejects tied, incomplete, negative or unverified finals and winners in live games',()=>{
  for(const patch of [{homeScore:21},{awayScore:null},{homeScore:-1},{winnerTeamId:null},{verifiedAt:null},{reviewedBy:''},{status:'live' as const}])assert.throws(()=>applyObservation(fixture(),{...result,...patch}));
 });
 it('rejects unknown or missing opponents and an invalid winner',()=>{
  for(const patch of [{awayTeamId:null},{awayTeamId:'unknown'},{winnerTeamId:'fixture-a'}])assert.throws(()=>applyObservation(fixture(),{...result,...patch}));
 });
 it('rejects conflicting evidence without silently replacing an official result',()=>{
  const t=applyObservation(fixture(),result);assert.throws(()=>applyObservation(t,{...result,homeScore:35}));
  t.sources.push({...t.sources[0],id:'secondary',authority:'secondary',url:'https://example.org/score'});assert.throws(()=>applyObservation(t,{...result,sourceId:'secondary',homeScore:35}));
 });
 it('does not seed Anna on alignment alone and never assumes later advancement',()=>{
  assert.ok(annaRoad(createBracket(),'anna').every(r=>r.gameId===null));
  const path=annaRoad(applyObservation(fixture(),result),'anna');assert.equal(path[0].state,'completed');assert.equal(path[1].state,'current');assert.equal(path[2].gameId,null);
  const lost=applyObservation(fixture(),{...result,homeScore:14,winnerTeamId:'fixture-a'});assert.equal(annaRoad(lost,'anna')[0].state,'eliminated');assert.equal(annaRoad(lost,'anna')[1].state,'eliminated');
 });
 it('filters complete regions and keeps state rounds accessible',()=>{
  const t=createBracket();assert.equal(filterGames(t,1,null).length,15);assert.equal(filterGames(t,'state',null).length,3);assert.equal(filterGames(t,'all',0).length,32);
 });
 it('rejects corrupted graph relationships and advancement conflicts',()=>{
  const t=fixture();t.games[0].nextGameId='state-final';assert.throws(()=>validateTournament(t));
  const occupied=fixture();occupied.games.find(g=>g.id==='r1-area-1')!.awayTeamId='fixture-a';assert.throws(()=>applyObservation(occupied,result));
 });
});
