import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import AboutPage from '../app/about/page';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Node has no CSS loader; visual behavior is covered in browser tests.
require.extensions['.css'] = module => { module.exports = {}; };
const TwoWorlds = require('../components/two-worlds').default;
import {media,scenePhotoAssignments,previewPhotos,type MediaAsset} from '../content/site';

function renderAbout(){return renderToStaticMarkup(AboutPage().props.children[1]);}

test('About suppresses review-only photographs and an empty gallery when preview mode is disabled',()=>{
 const prior=process.env.PREVIEW_MEDIA_MODE;
 try{
  process.env.PREVIEW_MEDIA_MODE='false';const disabled=renderAbout();
  assert.doesNotMatch(disabled,/route-gallery|<img/);
  process.env.PREVIEW_MEDIA_MODE='true';const enabled=renderAbout();
  assert.match(enabled,/route-gallery/);assert.match(enabled,/arrival-706.webp/);
 }finally{if(prior===undefined)delete process.env.PREVIEW_MEDIA_MODE;else process.env.PREVIEW_MEDIA_MODE=prior;}
});

test('About uses source-backed approved scene photographs in either mode',()=>{
 const prior=process.env.PREVIEW_MEDIA_MODE;
 const approved:MediaAsset={id:'about-approved',kind:'photo',title:'Approved portrait',src:'/media/approved-about.jpg',alt:'Approved athlete portrait',width:900,height:1200,rights:'approved',verified:true,published:true,source:'Owner-approved test source',sourceDate:'2026-11-02'};
 media.push(approved);scenePhotoAssignments.push({scene:'arrival',assetId:approved.id},{scene:'closing',assetId:approved.id});
 try{for(const mode of ['true','false']){process.env.PREVIEW_MEDIA_MODE=mode;const html=renderAbout();assert.match(html,/approved-about.jpg/);assert.equal((html.match(/<img/g)??[]).length,1);assert.doesNotMatch(html,/arrival-706.webp/);}}
 finally{media.pop();scenePhotoAssignments.pop();scenePhotoAssignments.pop();if(prior===undefined)delete process.env.PREVIEW_MEDIA_MODE;else process.env.PREVIEW_MEDIA_MODE=prior;}
});

test('discovery keeps both route links when photographs are missing and never fabricates an image',()=>{
 const absent=renderToStaticMarkup(TwoWorlds({jerseyNumber:'17'}));assert.doesNotMatch(absent,/<img/);assert.match(absent,/href="\/on-the-field\/?"/);assert.match(absent,/href="\/beyond-17\/?"/);
 const partial=renderToStaticMarkup(TwoWorlds({jerseyNumber:'17',onFieldPhoto:previewPhotos[0]}));
 assert.equal((partial.match(/<img/g)??[]).length,1);assert.doesNotMatch(partial,/original.*pending|photo.*pending|PREVIEW CROP/i);
});
