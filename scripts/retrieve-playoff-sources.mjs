import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';

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
  // Fixed URLs only. No credentials, redirect following, script execution or result scraping.
  const metadata=JSON.parse(execFileSync('curl',['--fail','--silent','--show-error','--max-time','30','--max-filesize','10485760','--proto','=https','--output',output,'--write-out','{"httpStatus":%{http_code},"contentType":"%{content_type}"}',url],{encoding:'utf8',timeout:35000}));
  if(metadata.httpStatus!==200)throw new Error(`Unexpected HTTP status ${metadata.httpStatus}`);
  const bytes=await readFile(output);
  if(extension==='pdf'&&!bytes.subarray(0,5).equals(Buffer.from('%PDF-')))throw new Error('Expected PDF signature');
  if(extension==='html'&&!metadata.contentType.includes('text/html'))throw new Error('Expected HTML');
  const sha256=createHash('sha256').update(bytes).digest('hex');
  report.push({id,url,retrievedAt,...metadata,bytes:bytes.length,sha256,changed:previous.find(record=>record.id===id)?.sha256!==sha256,reviewRequired:true,automaticPublication:false});
 }catch(error){report.push({id,url,retrievedAt,error:error instanceof Error?error.message:'Retrieval failed',reviewRequired:true,automaticPublication:false});}
}
await writeFile(join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.map(({id,error,changed})=>({id,error,changed})),null,2));
if(report.some(record=>record.error))process.exitCode=1;
