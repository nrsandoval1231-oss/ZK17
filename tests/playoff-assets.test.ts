import {it} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {validatePlayoffAssets} from '../scripts/validate-playoff-assets.mjs';

it('uses the exact owner upload for Anna while preserving its dimensions and file bytes',async()=>{
 const manifest=JSON.parse(await readFile('content/playoffs/brand.json','utf8'));
 assert.equal(manifest.ownerApproved,true);
 assert.equal(manifest.width,256);assert.equal(manifest.height,276);
 const original=await readFile(manifest.originalPath);
 const web=await readFile('public'+manifest.logo);
 assert.equal(createHash('sha256').update(original).digest('hex'),'f9ade4c4c0d2207e27c29444da79da7a6d7fe457397d1e7b9a458e6faea0fac3');
 assert.ok(original.equals(web));
 assert.equal((await validatePlayoffAssets({publicRelease:false})).ready,true);
 await assert.rejects(()=>validatePlayoffAssets({publicRelease:true}),/canonical owner mockup/);
});
it('still blocks public release when the original logo is missing',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'zk-playoff-brand-'));
 try{
  const manifestPath=join(directory,'brand.json');await writeFile(manifestPath,JSON.stringify({ownerApproved:false,logo:null}));
  assert.equal((await validatePlayoffAssets({manifestPath,publicRelease:false})).ready,false);
  await assert.rejects(()=>validatePlayoffAssets({manifestPath,publicRelease:true}),/exact owner-approved Anna logo/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
