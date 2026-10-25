const fs=require('node:fs/promises');
const crypto=require('node:crypto');
const sharp=require('sharp');
const assert=require('node:assert/strict');
(async()=>{
 const sourcePath='brand/zk17-monogram-master.jpg';
 const fullPath='public/brand/zk17-monogram-1254.png';
 const original=await fs.readFile(sourcePath);
 const hash=crypto.createHash('sha256').update(original).digest('hex');
 assert.equal(hash,'6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736');
 const src=await sharp(original).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});
 const out=await sharp(fullPath).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.equal(out.info.width,src.info.width);assert.equal(out.info.height,src.info.height);
 let intersection=0,union=0,transparent=0,opaque=0,partial=0,halo=0;
 for(let n=0;n<out.info.width*out.info.height;n++){
  const foreground=(src.data[n*3]+src.data[n*3+1]+src.data[n*3+2])/3>=128;
  const a=out.data[n*4+3];const ink=a>=128;
  if(foreground&&ink)intersection++;if(foreground||ink)union++;
  if(a===0)transparent++;else if(a===255)opaque++;else partial++;
  if(a>0&&(out.data[n*4]<250||out.data[n*4+1]<250||out.data[n*4+2]<250))halo++;
 }
 const alphaAt=(x,y)=>out.data[(y*out.info.width+x)*4+3];
 const sample={corner:alphaAt(0,0),bladeSlot:alphaAt(628,600),whiteStroke:alphaAt(600,500)};
 assert.equal(sample.corner,0);assert.equal(sample.bladeSlot,0);assert.equal(sample.whiteStroke,255);
 assert.ok(intersection/union>=0.995,'canonical silhouette must match original');assert.equal(halo,0);assert.ok(partial>0);
 const variants=(await fs.readdir('public/brand')).filter(n=>/zk17-monogram.*\.png$/.test(n)).map(n=>'public/brand/'+n);
 variants.push(...(await fs.readdir('public')).filter(n=>/^(favicon|apple-touch-icon).*\.png$/.test(n)).map(n=>'public/'+n));
 const checks=[];
 for(const p of variants){const m=await sharp(p).metadata();const stats=await sharp(p).stats();assert.ok(m.hasAlpha,p);assert.equal(stats.channels.at(-1).min,0,p);checks.push({path:p,width:m.width,height:m.height,alpha:m.hasAlpha,minAlpha:stats.channels.at(-1).min,maxAlpha:stats.channels.at(-1).max});}
 const proof={checkedUtc:new Date().toISOString(),sourcePath,sourceSha256:hash,fullPath,width:out.info.width,height:out.info.height,silhouetteIoU:intersection/union,transparent,opaque,partial,halo,sample,variants:checks};
 await fs.mkdir('.agent/evidence/transparent-logo',{recursive:true});await fs.writeFile('.agent/evidence/transparent-logo/pixel-proof.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
