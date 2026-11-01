import {publicMedia,type MediaAsset,type Verification} from '../../content/site';
export type GameFilmAssignment=Verification & {gameId:string;assetId:string};
export type GameFilm={gameId:string;assetId:string;title:string};
/** A verified game-to-film relationship plus existing rights/publication eligibility. */
export function publicGameFilms(assignments:GameFilmAssignment[],assets:MediaAsset[],gameIds:Set<string>):GameFilm[]{
 const approved=new Map(publicMedia(assets).filter(asset=>asset.kind==='video').map(asset=>[asset.id,asset]));
 return assignments.flatMap(item=>{
  const asset=approved.get(item.assetId);
  return asset&&gameIds.has(item.gameId)&&item.verified&&item.published&&item.source?.trim()&&item.sourceDate&&Number.isFinite(Date.parse(item.sourceDate))&&Date.parse(item.sourceDate)<=Date.now()?[{gameId:item.gameId,assetId:asset.id,title:asset.title}]:[];
 });
}
