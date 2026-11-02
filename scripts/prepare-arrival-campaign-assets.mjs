import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

// Original photographs are never generated, painted, reconstructed or retouched.
// AVIF only changes delivery encoding. SVG presentation clips original coordinates
// and makes interface-occluded pixels transparent; missing anatomy stays missing.
const sourceDirectory = resolve(process.argv[2] ?? '/workspace/arrival-source-photos');
const outputDirectory = resolve('public/media/arrival-campaign');
await mkdir(outputDirectory, {recursive:true});
const assets = [
 {id:'front',file:'source-01.jpg',sha:'138b330ea44f4e1b91121579feda7d25cdf6ca3fb466cab9e29f05d6596383df',box:[120,125,330,945],path:'M262 136 Q230 139 212 169 Q201 200 215 250 L237 277 232 287 185 291 152 313 146 361 131 535 129 577 128 633 135 690 155 702 174 697 178 670 168 635 175 585 187 548 186 625 182 670 188 722 207 770 198 848 196 926 200 983 196 1019 191 1056 202 1068 226 1070 259 1062 263 1046 263 997 269 938 286 813 301 741 306 699 322 754 314 813 308 934 306 980 298 1024 304 1034 335 1036 348 1020 348 988 355 954 369 879 373 795 374 724 370 643 368 580 376 535 Q431 516 438 476 L433 426 413 358 402 313 387 287 338 279 327 265 337 245 338 211 Q335 172 306 143 Z',holes:'<circle cx="146" cy="879" r="79"/><circle cx="285" cy="830" r="79"/><circle cx="341" cy="869" r="37"/>',note:'Existing repost circles obscure parts of the lower legs. Those regions are transparent, never reconstructed.'},
 {id:'rear',file:'source-08.jpg',sha:'ef495d62e509a4eadd6d8f0a1499315950fa9cf9edca619f26fa51a067fd6adc',box:[170,445,400,730],path:'M315 461 Q361 448 401 474 L427 508 428 560 410 598 419 618 468 630 510 649 532 691 539 754 548 817 532 861 505 880 487 916 485 1005 477 1177 223 1177 226 1064 233 991 227 937 226 884 206 864 184 824 181 789 199 749 211 694 233 648 278 628 296 601 276 568 271 512 284 479 Z',note:'Rear white #17 portrait. Screenshot UI falls outside the athlete silhouette.'},
 {id:'back',file:'source-03.jpg',sha:'dc785b292576d5a123405ed98174564f1a7f14b899ab8ecf842765e6e00b6b08',box:[375,335,270,875],path:'M492 350 Q535 339 561 364 L573 402 570 440 551 466 552 476 600 486 623 510 630 569 618 635 600 662 593 713 606 812 608 900 600 1025 609 1121 626 1155 629 1186 608 1200 576 1203 552 1180 550 1135 558 1040 553 929 538 870 525 818 516 817 505 898 493 1010 472 1128 477 1161 469 1187 438 1195 408 1181 407 1155 433 1125 443 1006 449 920 438 804 433 733 432 671 408 660 387 640 380 600 386 552 393 505 418 483 468 474 474 456 462 434 461 396 472 366 Z',note:'Original rear black #17 sideline photograph. No interface occlusion.'},
 {id:'profile',file:'source-10.jpg',sha:'6e6dfd72c70ad0f7ab694e14094f28e3f3c09edfc0779b6ab6540bec5595f3c8',box:[210,545,260,415],path:'M288 561 Q333 552 369 578 L390 616 402 653 392 690 369 711 381 740 382 815 430 832 438 867 415 890 372 909 354 952 260 950 232 916 218 845 222 780 226 749 251 720 267 700 255 676 250 628 260 591 Z',note:'Authentic black-uniform helmet profile. UI and surrounding players excluded.'},
 {id:'closeup',file:'source-02.jpg',sha:'5de6276caeeea218773811bb62a8e2400b00130fdae2cb4a13033799b233833e',box:[235,395,180,220],path:'M310 406 Q275 411 255 443 L247 477 244 513 254 551 280 575 311 595 347 591 376 575 392 541 395 493 382 453 357 422 Z',note:'Authentic close-up. Original source resolution is limited; no artificial face detail added.'},
];
const provenance=[];
for(const item of assets){
 const input=await readFile(resolve(sourceDirectory,item.file));
 const hash=createHash('sha256').update(input).digest('hex');
 if(hash!==item.sha)throw new Error(`Unexpected photograph bytes: ${item.file}`);
 const metadata=await sharp(input).metadata();
 const outputs=[];
 for(const [label,maxWidth] of [['320',420],['640',metadata.width]]){
  const bitmap=await sharp(input).rotate().resize({width:maxWidth,withoutEnlargement:true}).avif({quality:86,effort:5}).toBuffer();
  const [x,y,width,height]=item.box;
  const mask=`<mask id="subject" maskUnits="userSpaceOnUse" x="0" y="0" width="${metadata.width}" height="${metadata.height}"><path d="${item.path}" fill="white"/><g fill="black">${item.holes??''}</g></mask>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${width} ${height}"><defs>${mask}</defs><image width="${metadata.width}" height="${metadata.height}" href="data:image/avif;base64,${bitmap.toString('base64')}" mask="url(#subject)"/></svg>`;
  const filename=`${item.id}-${label}.svg`;
  await writeFile(resolve(outputDirectory,filename),svg);
  outputs.push(`/media/arrival-campaign/${filename}`);
 }
 provenance.push({id:item.id,sourceName:item.file,sourceSha256:hash,usage:'preview-only',rights:'pending',encoding:'AVIF in self-contained SVG with source-coordinate vector clipping',viewport:item.box,note:item.note,outputs});
}
await writeFile('docs/ARRIVAL_CAMPAIGN_MEDIA_MANIFEST.json',JSON.stringify(provenance,null,2)+'\n');
const current=JSON.parse(await readFile('docs/PREVIEW_MEDIA_MANIFEST.json','utf8'));
await writeFile('docs/PREVIEW_MEDIA_MANIFEST.json',JSON.stringify([...current.filter(row=>!row.campaign),...provenance.map(row=>({...row,campaign:'arrival-2026-11-02'}))],null,2)+'\n');
console.log(`Prepared ${provenance.length} source-preserving photographic presentations with two delivery sizes. Preview-only; no anatomy reconstruction.`);
