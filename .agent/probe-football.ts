import {createGame,startGame,aimAt,throwBall,moveGame} from '../lib/football-game';
let game=startGame(createGame());
const results=[];
for(let snap=1;snap<=12;snap++){
 game=aimAt(game,52,68);game=throwBall(game);
 for(let tick=0;tick<600&&game.phase==='playing';tick++)game=moveGame(game,1/120);
 results.push({snap,phase:game.phase,message:game.message,ballY:game.ballY,down:game.down,distance:game.distance,touchdowns:game.touchdowns,score:game.score});
 if(game.phase==='ended')break;
 if(game.phase!=='result')throw new Error('Pass failed to resolve');
 game={...game,phase:'playing'};
}
console.log(JSON.stringify({kind:'Pure model probe using real default moving markers and fixed user-achievable aim; not browser proof',results},null,2));
