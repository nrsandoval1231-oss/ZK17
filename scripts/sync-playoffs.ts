import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {normalizeSnapshot,discoverBracket,linkedGames,UIL_URL,CANONICAL_BRACKET_URL} from '../lib/playoffs/source-sync';
import {type Artifact} from '../lib/playoffs/artifact';
import {retrieveDocument} from './playoff-http.mjs';

async function main(){
 const args=process.argv.slice(2);const options=new Map<string,string>();let apply=false;
 for(let i=0;i<args.length;i++){
  if(args[i]==='--apply'){apply=true;continue;}
  if(!['--snapshot-dir','--artifact','--output-dir'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw new Error('Usage: playoffs:sync [--apply] [--snapshot-dir DIR] [--artifact FILE] [--output-dir DIR]');
  options.set(args[i],args[++i]);
 }
 const artifactPath=resolve(options.get('--artifact')??'content/playoffs/verified.json');
 const directory=resolve(options.get('--output-dir')??'artifacts/playoffs/sync');await mkdir(directory,{recursive:true});
 const original=await readFile(artifactPath,'utf8');const artifact=JSON.parse(original) as Artifact;
 const snapshotDirectory=options.get('--snapshot-dir');
 try{
  let snapshot:{uilHtml:string;bracketHtml:string;url:string;retrievedAt:string;details:Record<string,string>};
  const retrievals:unknown[]=[];const retrievalWarnings:string[]=[];
  if(snapshotDirectory){
   const manifest=JSON.parse(await readFile(join(snapshotDirectory,'snapshot.json'),'utf8'));
   // Offline mode is a controlled fixture/review tool; never accepted by the production workflow.
   snapshot={uilHtml:await readFile(join(snapshotDirectory,'uil.html'),'utf8'),bracketHtml:await readFile(join(snapshotDirectory,'bracket.html'),'utf8'),url:manifest.url,retrievedAt:manifest.retrievedAt,details:manifest.details??{}};
  }else{
   const uilPath=join(directory,'uil.html');retrievals.push(await retrieveDocument(UIL_URL,uilPath,'html'));
   const uilHtml=await readFile(uilPath,'utf8');const url=discoverBracket(uilHtml);
   const bracketPath=join(directory,'bracket.html');retrievals.push(await retrieveDocument(url,bracketPath,'html',[CANONICAL_BRACKET_URL]));
   const bracketHtml=await readFile(bracketPath,'utf8');const details:Record<string,string>={};
   // Validate graph and identities before following bounded, allowlisted game links.
   normalizeSnapshot(artifact,{uilHtml,bracketHtml,url,retrievedAt:new Date().toISOString(),details:{}});
   const links=linkedGames(bracketHtml);if(links.length>63)throw new Error('Unexpected number of game detail links');
   for(let offset=0;offset<links.length;offset+=4){
    await Promise.all(links.slice(offset,offset+4).map(async gameURL=>{
     const file=join(directory,`game-${createHash('sha256').update(gameURL).digest('hex').slice(0,16)}.html`);
     try{retrievals.push(await retrieveDocument(gameURL,file,'html'));details[gameURL]=await readFile(file,'utf8');}
     catch(error){retrievalWarnings.push(`${gameURL}: ${error instanceof Error?error.message:'Retrieval failed'}`);}
    }));
   }
   snapshot={uilHtml,bracketHtml,url,retrievedAt:new Date().toISOString(),details};
  }
  const result=normalizeSnapshot(artifact,snapshot);
  const report={...result.evidence,mode:apply?'apply':'dry-run',added:result.added,warnings:[...retrievalWarnings,...result.warnings],retrievals,details:Object.entries(snapshot.details).map(([url,html])=>({url,sha256:createHash('sha256').update(html).digest('hex')})),observations:result.artifact.observations.slice(artifact.observations.length),error:null};
  await writeFile(join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
  if(apply&&result.added){
   // Refuse concurrent edits, then atomically replace only after the whole journal replays.
   if(await readFile(artifactPath,'utf8')!==original)throw new Error('Artifact changed concurrently; retry from a fresh checkout');
   const temporary=artifactPath+'.tmp';await writeFile(temporary,JSON.stringify(result.artifact,null,2)+'\n');await rename(temporary,artifactPath);
  }
  console.log(JSON.stringify({mode:report.mode,added:report.added,warnings:report.warnings,artifactWritten:apply&&result.added>0}));
 }catch(error){
  await writeFile(join(directory,'report.json'),JSON.stringify({error:error instanceof Error?error.message:'Sync failed',artifactWritten:false},null,2)+'\n');throw error;
 }
}
main().catch(error=>{console.error(error instanceof Error?error.message:error);process.exitCode=1;});
