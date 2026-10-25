import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const source = 'brand/arcade/player17-stadium-master.png';
const output = 'public/media/arcade';
await mkdir(output, { recursive: true });
const metadata = await sharp(source).metadata();
const assets = [];
for (const width of [768, 1280, 1536]) {
  for (const format of ['webp', 'avif']) {
    const destination = `${output}/player17-stadium-${width}.${format}`;
    const image = sharp(source).resize({width, withoutEnlargement:true});
    if (format === 'webp') await image.webp({quality:88, effort:5}).toFile(destination);
    else await image.avif({quality:65, effort:5}).toFile(destination);
    const buffer = await readFile(destination);
    const dimensions = await sharp(buffer).metadata();
    assets.push({src:destination.replace(/^public/,''),width:dimensions.width,height:dimensions.height,bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex')});
  }
}
await writeFile('docs/ARCADE_ART.json',JSON.stringify({kind:'decorative fictional stadium illustration',purpose:'Approved PLAYER17 Off Field arcade background, no athletes or likenesses',source,width:metadata.width,height:metadata.height,sourceSha256:createHash('sha256').update(await readFile(source)).digest('hex'),method:'Built-in image generation edit of owner-approved concept to remove CRT/UI and retain stadium illustration',approvedConcept:'public/concepts/player17/off-field-v1.png',disclosure:'Original illustrated environment, not a real stadium photograph. UI text and controls implemented separately.',assets},null,2)+'\n');
console.log(JSON.stringify({width:metadata.width,height:metadata.height,assets},null,2));
