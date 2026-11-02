import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import AboutPage from '../app/about/page';
import TwoWorlds from '../components/two-worlds';
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

test('TwoWorlds omits missing photographs without visual or accessible original-pending labels',()=>{
 const absent=renderToStaticMarkup(TwoWorlds({jerseyNumber:'17'}));assert.equal(absent,'');
 const partial=renderToStaticMarkup(TwoWorlds({jerseyNumber:'17',onFieldPhoto:previewPhotos[0]}));
 assert.match(partial,/world-card-on/);assert.doesNotMatch(partial,/world-card-off|original.*pending|photo.*pending|PREVIEW CROP/i);
});
