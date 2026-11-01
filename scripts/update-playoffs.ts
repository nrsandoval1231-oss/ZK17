import {readFile,writeFile,rename} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createBracket,applyObservation,validateTournament,type Observation,type Source,type Team} from '../lib/playoffs/tournament';

type Artifact={schemaVersion:number;season:number;division:string;checkedAt:string;verificationScope:string;sources:Source[];teams:Team[];observations:Observation[]};
async function main(){
const artifactPath=resolve('content/playoffs/verified.json');
const artifact:Artifact=JSON.parse(await readFile(artifactPath,'utf8'));
if(artifact.schemaVersion!==1||artifact.season!==2026||artifact.division!=='5A-DII')throw new Error('Wrong artifact schema/season/division');
let tournament=createBracket();tournament.teams=artifact.teams;tournament.sources=artifact.sources;
for(const observation of artifact.observations)tournament=applyObservation(tournament,observation);
validateTournament(tournament);
const mode=process.argv[2]??'validate';
if(mode==='validate')console.log(`Validated ${tournament.games.length} games and ${artifact.observations.length} reviewed observations. No results inferred.`);
else if(mode==='apply'){
 const input=process.argv[3];if(!input)throw new Error('Usage: npm run playoffs:update -- apply path/to/reviewed-observation.json');
 const observation:Observation=JSON.parse(await readFile(resolve(input),'utf8'));
 const updated=applyObservation(tournament,observation);
 if(updated.history.length===tournament.history.length){console.log('Identical final already recorded. No write.');}
 else{
  artifact.observations.push(observation);artifact.checkedAt=observation.verifiedAt!;artifact.verificationScope='Reviewed game updates, Anna alignment and UIL bracket structure; check individual game timestamps.';
  // Atomic replace only after the complete graph passes. Git retains the before/after audit trail.
  const temporary=artifactPath+'.tmp';await writeFile(temporary,JSON.stringify(artifact,null,2)+'\n');await rename(temporary,artifactPath);
  console.log(`Applied ${observation.gameId}; downstream slot updated only for an explicit verified final. Review git diff, run checks, then commit.`);
 }
}else throw new Error('Use validate or apply');

}
main().catch(error=>{console.error(error instanceof Error?error.message:error);process.exitCode=1;});
