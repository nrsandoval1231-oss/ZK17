import {applyObservation,createBracket,validateTournament,type Observation,type Source,type Team} from './tournament';
export type Artifact={schemaVersion:number;season:number;division:string;checkedAt:string;verificationScope:string;sources:Source[];teams:Team[];observations:Observation[]};
export function replayArtifact(artifact:Artifact){
 if(artifact.schemaVersion!==1||artifact.season!==2026||artifact.division!=='5A-DII')throw new Error('Wrong artifact schema/season/division');
 let tournament=createBracket();tournament.teams=structuredClone(artifact.teams);tournament.sources=structuredClone(artifact.sources);
 for(const observation of artifact.observations)tournament=applyObservation(tournament,observation);
 validateTournament(tournament);return tournament;
}
export function applyBatch(artifact:Artifact,observations:Observation[],teams=artifact.teams,sources=artifact.sources){
 const result=structuredClone(artifact);result.teams=structuredClone(teams);result.sources=structuredClone(sources);
 let tournament=replayArtifact(result);let added=0;
 for(const observation of observations){
  const updated=applyObservation(tournament,observation);
  if(updated.history.length!==tournament.history.length){result.observations.push(observation);added++;}
  tournament=updated;
 }
 if(!added)return {artifact:structuredClone(artifact),added};
 // Only sources referenced by journal entries survive; every retrieval has immutable attribution.
 const used=new Set(result.observations.map(o=>o.sourceId));
 result.sources=result.sources.filter(s=>artifact.sources.some(old=>old.id===s.id)||used.has(s.id));
 result.checkedAt=new Date(Math.max(Date.parse(artifact.checkedAt),...observations.map(o=>Date.parse(o.verifiedAt!)))).toISOString();
 result.verificationScope='Source-backed game updates, Anna alignment and UIL bracket structure; check individual game sources and timestamps.';
 replayArtifact(result);return {artifact:result,added};
}
