const fs=require('node:fs/promises');
const crypto=require('node:crypto');
const origin='https://7b983368.zk17-review.pages.dev';
(async()=>{
 const manifest=JSON.parse(await fs.readFile('.agent/EXPORT_MANIFEST.json','utf8'));
 const paths=manifest.files.filter(f=>f.path==='index.html'||['robots.txt','sitemap.xml','og-zk17.png','favicon.svg'].includes(f.path)||f.path.startsWith('_next/static/')||f.path.startsWith('media/'));
 const checks=[];
 let next=0;
 await Promise.all(Array.from({length:6},async()=>{while(next<paths.length){const item=paths[next++];const target=item.path==='index.html'?'/':'/'+item.path;const response=await fetch(origin+target);const body=Buffer.from(await response.arrayBuffer());checks.push({path:item.path,status:response.status,sha256:crypto.createHash('sha256').update(body).digest('hex'),matches:crypto.createHash('sha256').update(body).digest('hex')===item.sha256,...(item.path==='index.html'?{headers:{robots:response.headers.get('x-robots-tag'),contentType:response.headers.get('content-type'),frame:response.headers.get('x-frame-options'),nosniff:response.headers.get('x-content-type-options')}}:{})});}}));
 const result={origin,candidate:manifest.candidate,checkedUtc:new Date().toISOString(),checks:checks.sort((a,b)=>a.path.localeCompare(b.path)),failed:checks.filter(c=>c.status!==200||!c.matches)};
 await fs.writeFile('.agent/DEPLOYED_ASSET_PROOF.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify({origin,checked:checks.length,failed:result.failed,index:checks.find(c=>c.path==='index.html')},null,2));
 if(result.failed.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
