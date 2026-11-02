import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {retrieveDocument} from './playoff-http.mjs';

const directory=resolve(process.argv[2]??'artifacts/playoffs/retrieval');
const sources=[
 ['uil-alignment','https://realignment.uiltexas.org/alignments/2026/5AD2FB2026.pdf','pdf'],
 ['uil-structure','https://realignment.uiltexas.org/alignments/2026/FB_BB_VB_Blank_Brackets.pdf','pdf'],
 ['uil-bracket','https://www.uiltexas.org/football/playoff-brackets/5AD2','html'],
 ['anna-athletics','https://www.gocoyoteu.com/sport/football/boys/','html'],
];
await mkdir(directory,{recursive:true});
const previous=JSON.parse(await readFile(join(directory,'report.json'),'utf8').catch(()=>'[]'));
const report=[];
for(const [id,url,extension] of sources){
 const retrievedAt=new Date().toISOString();const output=join(directory,`${id}.${extension}`);
 try{
  const metadata=await retrieveDocument(url,output,extension);
  const sha256=metadata.sha256;
  report.push({id,url,retrievedAt,...metadata,sha256,changed:previous.find(record=>record.id===id)?.sha256!==sha256,reviewRequired:true,automaticPublication:false});
 }catch(error){report.push({id,url,retrievedAt,error:error instanceof Error?error.message:'Retrieval failed',reviewRequired:true,automaticPublication:false});}
}
await writeFile(join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.map(({id,error,changed})=>({id,error,changed})),null,2));
if(report.some(record=>record.error))process.exitCode=1;
