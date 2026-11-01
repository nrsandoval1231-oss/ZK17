import {readFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,relative,sep} from 'node:path';
import sharp from 'sharp';

export async function validatePlayoffAssets({manifestPath=resolve('content/playoffs/brand.json'),publicRelease=process.env.PUBLIC_RELEASE==='true'}={}){
 const brand=JSON.parse(await readFile(manifestPath,'utf8'));
 if(!brand.ownerApproved||!brand.logo||!brand.originalPath||!brand.originalSha256||!brand.width||!brand.height){
  if(publicRelease)throw new Error('Playoffs release blocked: exact owner-approved Anna logo and source provenance are required.');
  return {ready:false,reason:'Exact owner logo unavailable; no substitute published.'};
 }
 const root=resolve('.');const original=resolve(brand.originalPath);const publicRoot=resolve('public');const output=resolve(publicRoot,'.'+brand.logo);
 const escapes=(base,path)=>{const rel=relative(base,path);return rel==='..'||rel.startsWith('..'+sep);};
 if(!brand.logo.startsWith('/brand/')||escapes(root,original)||escapes(publicRoot,output))throw new Error('Invalid logo asset path');
 const bytes=await readFile(original);if(createHash('sha256').update(bytes).digest('hex')!==brand.originalSha256)throw new Error('Anna original logo hash mismatch');
 const [source,web]=await Promise.all([sharp(bytes).metadata(),sharp(output).metadata()]);
 if(web.width!==brand.width||web.height!==brand.height||!source.width||!source.height||!web.width||!web.height)throw new Error('Anna logo dimensions do not match manifest');
 if(Math.abs(source.width/source.height-web.width/web.height)>.01||source.hasAlpha&&!web.hasAlpha)throw new Error('Anna logo aspect ratio or transparency changed');
 if(brand.transparent&&!web.hasAlpha)throw new Error('Anna logo requires a transparent web derivative');
 if(publicRelease&&!brand.mockupPath)throw new Error('Playoffs visual release blocked: canonical owner mockup is still missing.');
 if(brand.mockupPath)await access(resolve(brand.mockupPath));
 return {ready:true};
}
if(process.argv[1]&&resolve(process.argv[1])===new URL(import.meta.url).pathname){validatePlayoffAssets().then(result=>console.log(result.ready?'Playoff brand provenance verified.':result.reason)).catch(error=>{console.error(error.message);process.exitCode=1;});}
