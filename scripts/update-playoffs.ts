import {readFile,writeFile,rename} from 'node:fs/promises';
import {resolve} from 'node:path';
import {resolveTeam,type Observation} from '../lib/playoffs/tournament';
import {replayArtifact,applyBatch,type Artifact} from '../lib/playoffs/artifact';

async function main(){
const artifactPath=resolve('content/playoffs/verified.json');
const artifact:Artifact=JSON.parse(await readFile(artifactPath,'utf8'));
const tournament=replayArtifact(artifact);
const mode=process.argv[2]??'validate';
if(mode==='validate')console.log(`Validated ${tournament.games.length} games and ${artifact.observations.length} reviewed observations. No results inferred.`);
else if(mode==='apply'){
 const input=process.argv[3];if(!input)throw new Error('Usage: npm run playoffs:update -- apply path/to/reviewed-observation.json');
 const candidate=JSON.parse(await readFile(resolve(input),'utf8')) as Observation & {homeTeamName?:string;awayTeamName?:string};
 const identify=(name:string|undefined,id:string|null)=>{
  if(!name)return id;const team=resolveTeam(name,artifact.teams);
  if(!team)throw new Error(`Unknown team name: ${name}; review the team registry first`);
  if(id&&id!==team.id)throw new Error('Team name and ID conflict');return team.id;
 };
 const observation:Observation={gameId:candidate.gameId,homeTeamId:identify(candidate.homeTeamName,candidate.homeTeamId),awayTeamId:identify(candidate.awayTeamName,candidate.awayTeamId),homeScore:candidate.homeScore,awayScore:candidate.awayScore,status:candidate.status,kickoff:candidate.kickoff,venue:candidate.venue,winnerTeamId:candidate.winnerTeamId,sourceId:candidate.sourceId,verifiedAt:candidate.verifiedAt,reviewedBy:candidate.reviewedBy};
 const result=applyBatch(artifact,[observation]);
 if(!result.added)console.log('Identical observation already recorded. No write.');
 else{
  const temporary=artifactPath+'.tmp';await writeFile(temporary,JSON.stringify(result.artifact,null,2)+'\n');await rename(temporary,artifactPath);
  console.log(`Applied ${observation.gameId}; downstream slot updated only for an explicit verified final. Review git diff, run checks, then commit.`);
 }
}else throw new Error('Use validate or apply');

}
main().catch(error=>{console.error(error instanceof Error?error.message:error);process.exitCode=1;});
