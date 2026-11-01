import {it} from 'node:test';
import assert from 'node:assert/strict';
import {validatePlayoffAssets} from '../scripts/validate-playoff-assets.mjs';
it('keeps the review usable but blocks public playoff release without exact original artwork',async()=>{
 assert.equal((await validatePlayoffAssets({publicRelease:false})).ready,false);
 await assert.rejects(()=>validatePlayoffAssets({publicRelease:true}),/exact owner-approved Anna logo/);
});
