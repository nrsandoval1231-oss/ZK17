import {it} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {normalizeSnapshot, BRACKET_URL, BRACKET_ID} from '../lib/playoffs/source-sync';
import {replayArtifact, type Artifact} from '../lib/playoffs/artifact';
const raw=readFileSync('tests/fixtures/playoffs/2026-placeholder.html','utf8');
const base=JSON.parse(readFileSync('tests/fixtures/playoffs/2026-empty.json','utf8')) as Artifact;
const when='2026-11-01T12:00:00Z';
const uil=`<a class="maxpreps-widget-link" href="${BRACKET_URL.replaceAll('&','&amp;')}">2026 Football Conference 5A D2</a>`;
const schoolA='11111111-1111-4111-8111-111111111111',schoolB='22222222-2222-4222-8222-222222222222';
function populated(options:{final?:boolean;partial?:boolean;score?:number}={}){
 const $=load(raw);const game=$('.matchup-container').eq(1);const teams=game.find('ul.teams > li');
 teams.eq(0).attr('data-school-id',schoolA).find('.name').html('<a href="/tx/anna/anna-coyotes/football/26-27/schedule/">Anna</a>');
 if(!options.partial)teams.eq(1).attr('data-school-id',schoolB).find('.name').html('<a href="/tx/fixture/fixture-b/football/26-27/schedule/">Fixture B</a>');
 if(options.final){game.attr('data-result-length','2').addClass('has-result');teams.eq(0).addClass('matchwinner').append(`<a class="result">${options.score??28}</a>`);teams.eq(1).addClass('matchloser').append('<a class="result">21</a>');}
 return $.html();
}
function run(html=raw,artifact=base,details:Record<string,string>={}){return normalizeSnapshot(artifact,{uilHtml:uil,bracketHtml:html,url:BRACKET_URL,retrievedAt:when,details});}
it('recognizes the captured 2026 placeholder page without publishing or touching timestamps',()=>{const r=run();assert.deepEqual(r.artifact,base);assert.equal(r.added,0);assert.equal(replayArtifact(r.artifact).games.filter(g=>g.homeTeamId||g.awayTeamId).length,0);});
it('imports explicit qualifiers including a one-sided pair and does not invent a kickoff',()=>{const r=run(populated({partial:true}));const game=replayArtifact(r.artifact).games.find(g=>g.id==='r1-bi-2')!;assert.equal(game.homeTeamId,'anna');assert.equal(game.awayTeamId,null);assert.equal(game.kickoff,null);assert.equal(game.status,'pending');assert.equal(r.artifact.sources.at(-1)?.authority,'secondary');assert.match(r.artifact.observations.at(-1)!.reviewedBy,/source-adapter/);});
it('uses stable school identities, imports explicit winners and advances through the existing graph',()=>{const r=run(populated({final:true}));assert.equal(r.added,1);const t=replayArtifact(r.artifact);assert.equal(t.games.find(g=>g.id==='r1-area-1')!.awayTeamId,'anna');assert.equal(t.teams.find(t=>t.name==='Fixture B')!.district,3);assert.equal(t.games.find(g=>g.id==='r1-bi-2')!.winnerTeamId,'anna');});
it('repeated pending or final polls are semantic no-ops',()=>{for(const html of [populated(),populated({final:true})]){const a=run(html);const b=normalizeSnapshot(a.artifact,{uilHtml:uil,bracketHtml:html,url:BRACKET_URL,retrievedAt:'2026-11-01T13:00:00Z',details:{}});assert.equal(b.added,0);assert.deepEqual(b.artifact,a.artifact);}});
it('rejects conflicting finals atomically and does not mutate its input',()=>{const a=run(populated({final:true}));const saved=structuredClone(a.artifact);assert.throws(()=>run(populated({final:true,score:35}),a.artifact),/Conflicting final/);assert.deepEqual(a.artifact,saved);});
it('rejects wrong season, division, missing nodes, changed seeds, broken edges and spoofed UIL link',()=>{
 for(const bad of [raw.replaceAll('2026 Football','2025 Football'),raw.replace('5A D2','5A D1'),raw.replace('matchup-container','removed'),raw.replace('>W1<','>W2<'),raw.replace('data-winners-next-matchup-id="3e80e8fe-8635-4807-865d-4e7e4d007ed1"','data-winners-next-matchup-id="wrong"')])assert.throws(()=>run(bad));
 assert.throws(()=>normalizeSnapshot(base,{uilHtml:uil.replaceAll('www.maxpreps.com','evil.example'),bracketHtml:raw,url:BRACKET_URL,retrievedAt:when,details:{}}));
 assert.ok(raw.includes(BRACKET_ID));
});
it('does not turn numeric scores without an explicit winner into finals',()=>{const $=load(populated({final:true}));$('.matchwinner').removeClass('matchwinner');assert.throws(()=>run($.html()),/winner/);});
it('rejects changed identity, unknown partial markup, and duplicate schools',()=>{
 const $=load(populated());$('.matchup-container').eq(1).find('.team').eq(1).attr('data-school-id',schoolA);assert.throws(()=>run($.html()));
 const a=run(populated());assert.throws(()=>run(populated().replace('>Anna<','>Other School<'),a.artifact),/identity|name/i);
 assert.throws(()=>run(populated().replace(`data-school-id="${schoolA}"`,'data-school-id="00000000-0000-0000-0000-000000000000"')));
});
it('accepts only linked game JSON-LD with matching identities and explicit timezone',()=>{
 const url='https://www.maxpreps.com/tx/football/game/anna-vs-fixture/11-13-2026/?c=fixture';
 const $=load(populated());$('.matchup-container').eq(1).find('.contest-header').append(`<a href="${url}">Game</a>`);
 const event={ '@type':'SportsEvent',sport:'Football',url,homeTeam:{url:'https://www.maxpreps.com/tx/fixture/fixture-b/football/26-27/schedule/'},awayTeam:{url:'https://www.maxpreps.com/tx/anna/anna-coyotes/football/26-27/schedule/'},startDate:'2026-11-14T01:30:00+00:00'};
 const detail=(e:object)=>`<script type="application/ld+json">${JSON.stringify(e)}</script>`;
 const pending=run($.html());assert.equal(replayArtifact(pending.artifact).games.find(g=>g.id==='r1-bi-2')!.kickoff,null);assert.ok(pending.warnings.length);
 const r=run($.html(),base,{[url]:detail(event)});const g=replayArtifact(r.artifact).games.find(g=>g.id==='r1-bi-2')!;assert.equal(g.kickoff,event.startDate);assert.equal(g.homeTeamId,'anna');assert.equal(g.status,'scheduled');assert.equal(r.artifact.sources.at(-1)?.url,url);assert.equal(r.artifact.sources.at(-1)?.evidence?.length,3);assert.ok(r.artifact.sources.at(-1)?.evidence?.some(e=>e.url===BRACKET_URL&&/^[a-f0-9]{64}$/.test(e.sha256)));
 for(const e of [{...event,startDate:'2026-11-13T19:30:00'},{...event,startDate:'2025-11-14T01:30:00Z'},{...event,startDate:'2026-11-31T01:30:00Z'},{...event,homeTeam:{url:'https://www.maxpreps.com/tx/wrong/football/26-27/schedule/'}}]){const r=run($.html(),base,{[url]:detail(e)});assert.equal(replayArtifact(r.artifact).games.find(g=>g.id==='r1-bi-2')!.kickoff,null);assert.ok(r.warnings.length);}
});

it('the CLI dry-run, atomic apply, replay, repeat and conflict path use isolated artifacts',async()=>{
 const {mkdtemp,writeFile,readFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {execFileSync}=await import('node:child_process');
 const dir=await mkdtemp(join(tmpdir(),'zk17-sync-'));
 try{
  const artifact=join(dir,'verified.json');await writeFile(artifact,JSON.stringify(base));await writeFile(join(dir,'uil.html'),uil);await writeFile(join(dir,'bracket.html'),populated({final:true}));await writeFile(join(dir,'snapshot.json'),JSON.stringify({url:BRACKET_URL,retrievedAt:when}));
  const args=['--import','tsx','scripts/sync-playoffs.ts','--snapshot-dir',dir,'--artifact',artifact,'--output-dir',join(dir,'report')];
  const cli=(apply=false)=>execFileSync(process.execPath,[...args,...(apply?['--apply']:[])],{encoding:'utf8',stdio:'pipe'});
  const original=await readFile(artifact,'utf8');assert.equal(JSON.parse(cli()).artifactWritten,false);assert.equal(await readFile(artifact,'utf8'),original);
  assert.equal(JSON.parse(cli(true)).added,1);const updated=await readFile(artifact,'utf8');assert.equal(replayArtifact(JSON.parse(updated)).games.find(g=>g.id==='r1-area-1')!.awayTeamId,'anna');assert.equal(JSON.parse(cli(true)).added,0);assert.equal(await readFile(artifact,'utf8'),updated);
  await writeFile(join(dir,'bracket.html'),populated({final:true,score:35}));assert.throws(()=>cli(true));assert.equal(await readFile(artifact,'utf8'),updated);assert.match(JSON.parse(await readFile(join(dir,'report/report.json'),'utf8')).error,/Conflicting final/);
 }finally{await rm(dir,{recursive:true,force:true});}
});

it('imports a controlled complete 64-team, 63-final fixture through the championship',()=>{
 const $=load(raw);const nodes=$('.matchup-container').toArray();const winners=new Map<string,{id:string;name:string;url:string}>();let serial=0;
 for(let pass=0;pass<6;pass++)for(const node of nodes){
  const el=$(node);const id=el.attr('id')!;if(winners.has(id))continue;const entries=el.find('ul.teams > li.team').toArray();
  const feeder=entries.map(e=>$(e).attr('data-source-matchup-id')!);
  if(feeder.some(f=>f!=='00000000-0000-0000-0000-000000000000'&&!winners.has('matchup_'+f)))continue;
  const players=entries.map((e,i)=>{
   const previous=winners.get('matchup_'+feeder[i]);const n=++serial;const player=previous??{id:`${n.toString(16).padStart(8,'0')}-1111-4111-8111-111111111111`,name:`Fixture ${n}`,url:`/tx/fixture-${n}/fixture-${n}/football/26-27/schedule/`};
   $(e).attr('data-school-id',player.id).addClass(i===0?'matchwinner':'matchloser').find('.name').html(`<a href="${player.url}">${player.name}</a>`);$(e).append(`<a class="result">${i===0?28:14}</a>`);return player;
  });el.addClass('has-result').attr('data-result-length','2');winners.set(id,players[0]);
 }
 assert.equal(winners.size,63);const r=run($.html());const t=replayArtifact(r.artifact);assert.equal(t.games.filter(g=>g.status==='final').length,63);assert.equal(t.teams.length,65);assert.ok(t.games.find(g=>g.id==='state-final')!.winnerTeamId);assert.equal(run($.html(),r.artifact).added,0);
});

it('retrieval permits only an explicitly inventoried same-host canonical redirect',async()=>{
 const {validateRedirect,retrieveDocument}=await import('../scripts/playoff-http.mjs');const {CANONICAL_BRACKET_URL}=await import('../lib/playoffs/source-sync');
 assert.equal(validateRedirect(BRACKET_URL,CANONICAL_BRACKET_URL,[CANONICAL_BRACKET_URL]),CANONICAL_BRACKET_URL);
 for(const url of ['https://evil.example/bracket','http://www.maxpreps.com/bracket','https://www.maxpreps.com/unrelated'])assert.throws(()=>validateRedirect(BRACKET_URL,url,[CANONICAL_BRACKET_URL]));
 await assert.rejects(()=>retrieveDocument('https://evil.example/bracket','/tmp/unused','html'),/Untrusted/);
});

it('rejects conflicting kickoff times from two linked game details in one source snapshot',()=>{
 const $=load(populated());const urls=['a','b'].map(id=>`https://www.maxpreps.com/tx/football/game/anna-vs-fixture/11-13-2026/?c=${id}`);const details:Record<string,string>={};
 for(const [i,url] of urls.entries()){
  $('.matchup-container').eq(1).find('.contest-header').append(`<a href="${url}">Game</a>`);
  details[url]=`<script type="application/ld+json">${JSON.stringify({'@type':'SportsEvent',sport:'Football',url,homeTeam:{url:'https://www.maxpreps.com/tx/anna/anna-coyotes/football/26-27/schedule/'},awayTeam:{url:'https://www.maxpreps.com/tx/fixture/fixture-b/football/26-27/schedule/'},startDate:`2026-11-14T0${i+1}:30:00Z`})}</script>`;
 }
 assert.throws(()=>run($.html(),base,details),/Conflicting kickoff/);
});

it('the existing manual retriever retains successful metadata and detects repeated snapshots',async()=>{
 const {mkdtemp,writeFile,readFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {execFileSync}=await import('node:child_process');
 const dir=await mkdtemp(join(tmpdir(),'zk17-retrieve-'));const output=join(dir,'output');
 try{
  // Isolate only the network boundary; execute the real retrieval CLI and real file/hash checks.
  await writeFile(join(dir,'curl'),`#!/usr/bin/env node
const fs=require('node:fs');const args=process.argv.slice(2);const output=args[args.indexOf('--output')+1];const pdf=args.at(-1).endsWith('.pdf');fs.writeFileSync(output,pdf?'%PDF-fixture':'<html>fixture</html>');process.stdout.write(JSON.stringify({httpStatus:200,contentType:pdf?'application/pdf':'text/html',redirectURL:''}));\n`,{mode:0o755});
  const cli=()=>execFileSync(process.execPath,['scripts/retrieve-playoff-sources.mjs',output],{encoding:'utf8',env:{...process.env,PATH:dir+':'+process.env.PATH},stdio:'pipe'});
  cli();let report=JSON.parse(await readFile(join(output,'report.json'),'utf8'));assert.equal(report.length,4);assert.ok(report.every((r:{sha256:string;bytes:number;changed:boolean;error?:string})=>/^[a-f0-9]{64}$/.test(r.sha256)&&r.bytes>0&&r.changed&&!r.error));
  cli();report=JSON.parse(await readFile(join(output,'report.json'),'utf8'));assert.ok(report.every((r:{changed:boolean})=>!r.changed));
 }finally{await rm(dir,{recursive:true,force:true});}
});

it('semantic duplicate detection still validates source and verification metadata',async()=>{
 const {applyBatch}=await import('../lib/playoffs/artifact');const a=run(populated());const observation=a.artifact.observations[0];
 for(const patch of [{sourceId:'unknown'},{reviewedBy:''},{verifiedAt:'2099-01-01T00:00:00Z'}])assert.throws(()=>applyBatch(a.artifact,[{...observation,...patch}]));
});

it('an identical secondary qualifier does not replace official evidence or block unrelated facts',()=>{
 const first=run(populated());const official=structuredClone(first.artifact);const prior=official.sources.find(s=>s.id===official.observations[0].sourceId)!;prior.authority='uil';prior.url='https://www.uiltexas.org/football/playoff-brackets/5AD2';
 const $=load(populated());const team=$('.matchup-container').eq(0).find('ul.teams > li.team').eq(0);team.attr('data-school-id','33333333-3333-4333-8333-333333333333').find('.name').html('<a href="/tx/fixture/fixture-c/football/26-27/schedule/">Fixture C</a>');
 const result=run($.html(),official);assert.equal(result.added,1);assert.deepEqual(result.artifact.observations[0],official.observations[0]);assert.equal(replayArtifact(result.artifact).games.find(g=>g.id==='r1-bi-1')!.homeTeamId,'mp-33333333-3333-4333-8333-333333333333');
});

it('preserves both winners advanced in a batch when the next matchup names only one participant',()=>{
 const $=load(populated({final:true}));const feeder=$('.matchup-container').eq(0);const players=feeder.find('ul.teams > li.team');
 const names=['Fixture C','Fixture D'];const uuids=['33333333-3333-4333-8333-333333333333','44444444-4444-4444-8444-444444444444'];
 players.each((i,e)=>{$(e).attr('data-school-id',uuids[i]).addClass(i===0?'matchwinner':'matchloser').find('.name').html(`<a href="/tx/fixture/fixture-${i}/football/26-27/schedule/">${names[i]}</a>`);$(e).append(`<a class="result">${i===0?28:14}</a>`);});feeder.addClass('has-result').attr('data-result-length','2');
 const parent=$(`#matchup_${feeder.attr('data-winners-next-matchup-id')}`).find('ul.teams > li.team');parent.eq(0).attr('data-school-id',uuids[0]).find('.name').html('<a href="/tx/fixture/fixture-0/football/26-27/schedule/">Fixture C</a>');
 const result=run($.html());const game=replayArtifact(result.artifact).games.find(g=>g.id==='r1-area-1')!;assert.equal(game.homeTeamId,'mp-'+uuids[0]);assert.equal(game.awayTeamId,'anna');assert.equal(result.added,2);
});

it('late game details preserve an immutable final and do not stall subsequent polls',()=>{
 const first=run(populated({final:true}));const $=load(populated({final:true}));const url='https://www.maxpreps.com/tx/football/game/anna-vs-fixture/11-13-2026/?c=fixture';$('.matchup-container').eq(1).find('.contest-header').append(`<a href="${url}">Game</a>`);
 const event={'@type':'SportsEvent',sport:'Football',url,homeTeam:{url:'https://www.maxpreps.com/tx/anna/anna-coyotes/football/26-27/schedule/'},awayTeam:{url:'https://www.maxpreps.com/tx/fixture/fixture-b/football/26-27/schedule/'},startDate:'2026-11-14T01:30:00Z'};
 const result=run($.html(),first.artifact,{[url]:`<script type="application/ld+json">${JSON.stringify(event)}</script>`});assert.equal(result.added,0);assert.deepEqual(result.artifact,first.artifact);
});

it('both workflow file guards reject unexpected paths and Git failures without external filters',async()=>{
 const {mkdtemp,writeFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {execFileSync}=await import('node:child_process');
 const workflow=readFileSync('.github/workflows/playoff-source-review.yml','utf8');const guards=workflow.match(/ +changed=\$\(git diff --name-only origin\/main\)[\s\S]*?done <<< "\$changed"/g)??[];assert.equal(guards.length,2);
 const dir=await mkdtemp(join(tmpdir(),'zk17-guard-'));
 try{
  await writeFile(join(dir,'git'),`#!/usr/bin/env node
if(process.env.ZK17_GIT_FAILURE==='true')process.exit(128);process.stdout.write(process.env.ZK17_CHANGED_PATHS??'');\n`,{mode:0o755});
  for(const guard of guards){
   const execute=(paths:string,fail=false)=>execFileSync('bash',['-e','-c',guard],{encoding:'utf8',stdio:'pipe',env:{...process.env,PATH:dir+':'+process.env.PATH,ZK17_CHANGED_PATHS:paths,ZK17_GIT_FAILURE:String(fail)}});
   execute('');execute('content/playoffs/verified.json\ncontent/playoffs/evidence/latest-sync.json\n');
   for(const paths of ['scripts/evil.ts\n','content/playoffs/verifiedXjson\n','content/playoffs/verified.json\nscripts/evil.ts\n'])assert.throws(()=>execute(paths));
   assert.throws(()=>execute('',true));
  }
 }finally{await rm(dir,{recursive:true,force:true});}
});
