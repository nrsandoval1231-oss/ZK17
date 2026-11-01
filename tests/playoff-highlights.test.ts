import {it} from 'node:test';
import assert from 'node:assert/strict';
import {publicGameFilms} from '../lib/playoffs/highlights';
import type {MediaAsset} from '../content/site';
it('shows only verified game relationships backed by rights-approved public film',()=>{
 const proof={verified:true,published:true,source:'Fixture evidence only',sourceDate:'2026-10-31'};
 const approved:MediaAsset={...proof,id:'fixture',kind:'video',title:'TEST FILM',src:'/media/test-fixture.mp4',alt:'Fixture',rights:'approved'};
 const relation={...proof,gameId:'r1-bi-1',assetId:'fixture'};
 assert.equal(publicGameFilms([relation],[approved],new Set(['r1-bi-1'])).length,1);
 assert.equal(publicGameFilms([relation],[{...approved,rights:'pending'}],new Set(['r1-bi-1'])).length,0);
 assert.equal(publicGameFilms([{...relation,verified:false}, {...relation,gameId:'unknown'}],[approved],new Set(['r1-bi-1'])).length,0);
});
