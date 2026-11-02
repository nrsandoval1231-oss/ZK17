import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {once} from 'node:events';

test('local static host supports video byte ranges for Safari playback and seeking',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'zk17-video-'));
 await mkdir(join(directory,'out'));await writeFile(join(directory,'out','film.mp4'),'0123456789');
 const server=spawn(process.execPath,[resolve('scripts/serve-static.mjs'),'--port','0'],{cwd:directory,env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
 try{
  const [message]=await once(server.stdout,'data');const port=/:(\d+)/.exec(String(message))?.[1];assert.ok(port);
  const url=`http://127.0.0.1:${port}/film.mp4`;
  const partial=await fetch(url,{headers:{Range:'bytes=2-5'}});assert.equal(partial.status,206);assert.equal(partial.headers.get('content-range'),'bytes 2-5/10');assert.equal(await partial.text(),'2345');
  const suffix=await fetch(url,{headers:{Range:'bytes=-3'}});assert.equal(suffix.status,206);assert.equal(await suffix.text(),'789');
  const invalid=await fetch(url,{headers:{Range:'bytes=20-'}});assert.equal(invalid.status,416);assert.equal(invalid.headers.get('content-range'),'bytes */10');
 }finally{server.kill();await once(server,'exit');await rm(directory,{recursive:true,force:true});}
});
