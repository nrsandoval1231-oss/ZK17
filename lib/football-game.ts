export type Marker = { x: number; y: number; vx: number; vy: number };
export type GameState = { phase: 'ready' | 'playing' | 'paused' | 'result' | 'ended'; ballY: number; down: number; distance: number; snaps: number; touchdowns: number; score: number; clock: number; receivers: Marker[]; defenders: Marker[]; aim: { x: number; y: number }; projectile: { x: number; y: number; vx: number; vy: number } | null; message: string };
export const createGame = (): GameState => ({ phase:'ready', ballY:20, down:1, distance:10, snaps:0, touchdowns:0, score:0, clock:8, receivers:[{x:28,y:54,vx:13,vy:7},{x:52,y:68,vx:-9,vy:5},{x:76,y:47,vx:8,vy:9}], defenders:[{x:42,y:61,vx:-4,vy:6},{x:67,y:76,vx:5,vy:-5}], aim:{x:52,y:68}, projectile:null, message:'Ready for the snap.' });
export function startGame(s: GameState): GameState { return s.phase === 'ready' ? {...s,phase:'playing',message:'Snap! Lead the receiver.'} : s; }
export function moveGame(s: GameState, dt: number): GameState {
 if(s.phase!=='playing') return s;
 let remaining=Math.min(Math.max(dt,0),.1); const next={...s, receivers:s.receivers.map(m=>({...m})),defenders:s.defenders.map(m=>({...m}))};
 while(remaining>0&&next.phase==='playing') { const n=Math.min(remaining,1/120);remaining-=n;next.clock-=n;
  for(const m of [...next.receivers,...next.defenders]) { m.x+=m.vx*n; m.y+=m.vy*n; if(m.x<8||m.x>92)m.vx*=-1;if(m.y<28||m.y>86)m.vy*=-1; }
  if(next.projectile){ const p={...next.projectile}; p.x+=p.vx*n;p.y+=p.vy*n;next.projectile=p;
   if(next.defenders.some(d=>Math.hypot(d.x-p.x,d.y-p.y)<5)) return resolve(next,'INTERCEPTED — turnover.',0,true);
   if(next.receivers.some(r=>Math.hypot(r.x-p.x,r.y-p.y)<6)) return resolve(next,'COMPLETE!',Math.max(0,Math.round((p.y-20)*1.25)),false);
   if(p.y<5||p.y>100||p.x<0||p.x>100)return resolve(next,'INCOMPLETE.',0,false);
  }
  if(next.clock<=0&&!next.projectile)return resolve(next,'SACK — pocket closed.',0,false);
 }
 return next;
}
export function throwBall(s: GameState): GameState { if(s.phase!=='playing'||s.projectile)return s; const dx=s.aim.x-50,dy=s.aim.y-20;const len=Math.hypot(dx,dy)||1;return {...s,projectile:{x:50,y:20,vx:dx/len*95,vy:dy/len*95},message:'Pass in the air.'}; }
export function resolve(s: GameState, message: string, yards: number, turnover: boolean): GameState {
 const snaps=s.snaps+1, touchdown=!turnover&&yards>=100-s.ballY;
 if(turnover||(!touchdown&&s.down===4&&yards<s.distance)){ return {...s,phase:snaps>=12?'ended':'result',snaps,ballY:20,down:1,distance:10,clock:8,projectile:null,touchdowns:s.touchdowns+(touchdown?1:0),score:s.score+(touchdown?6:0),message:snaps>=12?'ROUND COMPLETE — ARCADE SCORE ONLY.':message}; }
 const gained=touchdown?80:yards, pos=touchdown?20:Math.min(100,s.ballY+gained), first=touchdown||gained>=s.distance, down=first?1:s.down+1;
 return {...s,phase:snaps>=12?'ended':'result',snaps,ballY:touchdown?20:pos,down:touchdown?1:down,distance:touchdown?10:first?Math.min(10,100-pos):Math.max(1,Math.min(s.distance-gained,100-pos)),clock:8,projectile:null,touchdowns:s.touchdowns+(touchdown?1:0),score:s.score+(touchdown?6:0),message:touchdown?'TOUCHDOWN! +6 ARCADE POINTS':snaps>=12?'ROUND COMPLETE — ARCADE SCORE ONLY.':message};
}
export function aimAt(s: GameState,x:number,y:number):GameState{return {...s,aim:{x:Math.max(2,Math.min(98,x)),y:Math.max(25,Math.min(99,y))}}}
export function togglePause(s:GameState):GameState{return s.phase==='playing'?{...s,phase:'paused'}:s.phase==='paused'?{...s,phase:'playing'}:s}
