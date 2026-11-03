import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
const source='brand/anna-stadium/owner-original.png';
const outputs=[];
for(const width of [768,1500]){
 for(const kind of ['mono','color']){
  let image=sharp(source).resize({width,withoutEnlargement:true});
  image=kind==='mono'?image.grayscale().modulate({brightness:.68}):image.modulate({brightness:.68,saturation:.55});
  const path=`public/media/anna-stadium-${kind}-${width}.webp`;
  await image.webp({quality:83,effort:6}).toFile(path);
  outputs.push({path,bytes:readFileSync(path).length});
 }
}
writeFileSync('brand/anna-stadium/provenance.json',JSON.stringify({source,sha256:createHash('sha256').update(readFileSync(source)).digest('hex'),width:1500,height:1001,confirmation:'Owner confirmed this supplied PNG is a real photograph and authorized its use on 2026-11-02.',transform:'Resize without enlargement, modest fixed darkening, monochrome or muted-color grade; no synthesis or geometry edits.',outputs},null,2)+'\n');
console.log(outputs);
