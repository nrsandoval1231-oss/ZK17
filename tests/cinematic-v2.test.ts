import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {media,publicMedia} from '../content/site';

test('approved full monochrome upload remains byte-identical and retains duration',()=>{
 const asset=publicMedia(media).find(item=>item.id==='zephyr-cinematic');
 assert.equal(asset?.src,'/media/zephyr-monochrome-full.mp4');
 const file=readFileSync('public/media/zephyr-monochrome-full.mp4');
 assert.equal(file.length,9147834);
 assert.equal(createHash('sha256').update(readFileSync('public/media/zephyr-cinematic.mp4')).digest('hex'),'a783dcb56f3a11684a3253ddc8c0768035bb8c9d390e0061a29935c20af8965f');
 assert.equal(createHash('sha256').update(file).digest('hex'),'0cee7e98ad6f9408c2a36d19377fa5aaff2540bc82e341bb412468d351cd257f');
});
