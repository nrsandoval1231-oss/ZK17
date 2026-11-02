import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createCLSAccumulator, captureSelection } from '../scripts/lib/arrival-evidence.mjs';
import { measureArrival } from '../scripts/measure-arrival-campaign.mjs';
import { captureArrival } from '../scripts/capture-arrival-campaign.mjs';

const score = (entries: {startTime:number;value:number;hadRecentInput?:boolean}[]) => {const cls=createCLSAccumulator();for(const e of entries)cls.observe(e);return cls.value();};
test('CLS uses the largest separated session, not the sum of all shifts',()=>{
 assert.equal(score([{startTime:0,value:.01},{startTime:1100,value:.02}]),.02);
 assert.equal(score([{startTime:0,value:.01},{startTime:999,value:.02}]),.03);
 assert.equal(score([{startTime:0,value:.01},{startTime:1000,value:.02}]),.02);
});
test('CLS splits at the strict five-second boundary and excludes recent input',()=>{
 const shifts=Array.from({length:6},(_,i)=>({startTime:i*900,value:.01}));
 assert.equal(score([...shifts,{startTime:4999,value:.1}]),.16);
 assert.equal(score([...shifts,{startTime:5000,value:.1}]),.1);
 assert.equal(score([{startTime:0,value:.02},{startTime:500,value:1,hadRecentInput:true},{startTime:1000,value:.03}]),.03);
});
test('filtered capture output is isolated, and unknown/unsafe cases fail',()=>{
 const cases=['desktop','mobile'];
 assert.deepEqual(captureSelection(cases,'mobile'),{names:['mobile'],output:'artifacts/arrival-directors-cut/filtered/mobile',canonical:false});
 assert.equal(captureSelection(cases).output,'artifacts/arrival-directors-cut/full');
 for(const name of ['../mobile','MOBILE','desktop/../../','unknown'])assert.throws(()=>captureSelection(cases,name),/Unknown capture case/);
});
test('metric collection rejects error/missing-hero pages without replacing prior evidence',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'arrival-metrics-'));
 const output=join(directory,'performance.json');
 const server=createServer((request,response)=>{const status=Number(request.url?.slice(1));response.writeHead(status===404||status===500?status:200,{'Content-Type':'text/html'});response.end((request.url==='/mobile-missing'||request.url==='/valid')?'<meta name="viewport" content="width=device-width,initial-scale=1"><section id="arrival" data-arrival-hero><h1 id="hero-title">Campaign</h1></section><script>if(location.pathname==="/mobile-missing"&&innerWidth<700)document.querySelector("#arrival").remove()</script>':'<!doctype html><title>Fixture</title><p>No campaign</p>');});
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const address=server.address() as {port:number};
 try {
  await writeFile(output,'prior evidence');
  for(const path of ['404','500','missing','mobile-missing']){
   await assert.rejects(measureArrival({baseURL:`http://127.0.0.1:${address.port}/${path}`,output,observationMs:10}),/Metrics rejected/);
   assert.equal(await readFile(output,'utf8'),'prior evidence');
  }
  const evidence=await measureArrival({baseURL:`http://127.0.0.1:${address.port}/valid`,output,observationMs:10});
  assert.equal(evidence.results.length,2);
  assert(evidence.results.every(result=>result.status===200&&Number.isFinite(result.metrics.cls)));
  assert.equal(JSON.parse(await readFile(output,'utf8')).results.length,2);
 }finally{server.close();await rm(directory,{recursive:true,force:true});}
});


test('unknown capture invocation preserves canonical JSON and images before browser launch',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'arrival-capture-'));
 const full=join(directory,'full');
 const { mkdir }=await import('node:fs/promises');
 await mkdir(full);
 await writeFile(join(full,'validation.json'),'canonical evidence');
 await writeFile(join(full,'desktop-final.png'),'canonical image');
 try {
  await assert.rejects(captureArrival({selected:'../desktop',root:directory}),/Unknown capture case/);
  await assert.rejects(captureArrival({selected:'nonexistent',root:directory}),/Unknown capture case/);
  assert.equal(await readFile(join(full,'validation.json'),'utf8'),'canonical evidence');
  assert.equal(await readFile(join(full,'desktop-final.png'),'utf8'),'canonical image');
 }finally{await rm(directory,{recursive:true,force:true});}
});
