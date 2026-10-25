const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const origin=process.env.DEPLOYED_URL;
const candidate=process.env.SOURCE_CANDIDATE;
const evidenceDir=process.env.QA_EVIDENCE_DIR||'.agent/evidence/logo-01';
if(!origin||!candidate)throw new Error('DEPLOYED_URL and SOURCE_CANDIDATE required');
(async()=>{
  const paths=[];
  async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else paths.push(p);}}
  await walk('out');
  const files=paths.map(p=>p.replaceAll('\\','/').replace(/^out\//,''));
  const checked=files.filter(p=>p==='index.html'||/^(favicon[^/]*\.(svg|png)|apple-touch-icon[^/]*\.png|og-zk17\.png|robots\.txt|sitemap\.xml)$/.test(p)||/^(brand|media|_next\/static)\//.test(p));
  let index=0;const results=[];
  await Promise.all(Array.from({length:6},async()=>{while(index<checked.length){const p=checked[index++];const local=await fs.readFile(path.join('out',p));const response=await fetch(origin+(p==='index.html'?'/':'/'+p));const remote=Buffer.from(await response.arrayBuffer());const hash=b=>crypto.createHash('sha256').update(b).digest('hex');results.push({path:p,status:response.status,localSha256:hash(local),remoteSha256:hash(remote),matches:hash(local)===hash(remote),...(p==='index.html'?{robots:response.headers.get('x-robots-tag')}:{})});}}));
  const proof={origin,candidate,checkedUtc:new Date().toISOString(),checks:results.sort((a,b)=>a.path.localeCompare(b.path)),failed:results.filter(r=>r.status!==200||!r.matches)};
  await fs.mkdir(evidenceDir,{recursive:true});
  await fs.writeFile(path.join(evidenceDir,'deployed-assets.json'),JSON.stringify(proof,null,2)+'\n');
  console.log(JSON.stringify({origin,candidate,count:results.length,failed:proof.failed},null,2));
  if(proof.failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
