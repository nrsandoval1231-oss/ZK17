const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sourceRoot = 'C:/Users/nrsan/Downloads/Zpics';
const targetRoot = path.resolve('public/media');
const plans = [
  {slug:'arrival',time:'08_56_00',crop:{left:0,top:270,width:706,height:690},alt:'Zephyr Kreye wearing number 17 in a black uniform and helmet, photographed in black and white.',focal:'43% 32%'},
  {slug:'on-field',time:'08_55_49',crop:{left:0,top:300,width:706,height:750},alt:'Zephyr Kreye, number 17 in a black uniform, preparing to throw during a football game.',focal:'50% 53%'},
  {slug:'portrait',time:'08_55_58',crop:{left:0,top:300,width:706,height:740},alt:'Zephyr Kreye seated on the sideline in his number 17 black uniform.',focal:'51% 36%'},
  {slug:'throwing',time:'08_55_38',crop:{left:0,top:270,width:706,height:730},alt:'Zephyr Kreye viewed from behind, wearing a purple number 17 uniform and preparing to throw.',focal:'50% 40%'},
  {slug:'running',time:'08_56_03',crop:{left:0,top:280,width:706,height:620},alt:'Zephyr Kreye carrying the football in a purple uniform.',focal:'49% 62%'}
];
(async()=>{
  await fs.mkdir(targetRoot,{recursive:true});
  const manifest=[];
  for(const item of plans){
    const sourceName=`ChatGPT Image Oct 25, 2026, ${item.time} AM.jpg`;
    const input=await fs.readFile(path.join(sourceRoot,sourceName));
    const provenance=`Owner supplied Instagram screenshot ${sourceName}; owner authorized clean crops for REVIEW PREVIEW ONLY on 2026-10-25. Crop only, no AI or identity alteration. Original photo and rights pending.`;
    const xmp=`<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:source>${provenance}</dc:source><dc:rights>Preview only. Original rights pending.</dc:rights></rdf:Description></rdf:RDF></x:xmpmeta>`;
    const outputs=[];
    for(const width of [360,540,706]){
      for(const format of ['avif','webp']){
        const name=`${item.slug}-${width}.${format}`;
        let pipeline=sharp(input).extract(item.crop).resize({width,withoutEnlargement:true}).withXmp(xmp);
        pipeline=format==='avif'?pipeline.avif({quality:60,effort:6}):pipeline.webp({quality:86,effort:5});
        await pipeline.toFile(path.join(targetRoot,name));
        outputs.push(`/media/${name}`);
      }
    }
    manifest.push({...item,sourceName,sourceSha256:crypto.createHash('sha256').update(input).digest('hex'),usage:'preview-only',rights:'pending',outputs});
  }
  await fs.writeFile('docs/PREVIEW_MEDIA_MANIFEST.json',JSON.stringify(manifest,null,2));
  console.log(`Prepared ${manifest.length} preview crops / ${manifest.length*6} responsive files. Crop only; no AI reconstruction.`);
})().catch(err=>{console.error(err);process.exitCode=1;});

