import type {Metadata} from 'next';
import {preload} from 'react-dom';
import gameFilmAssignments from '@/content/playoffs/game-films.json';
import {publicGameFilms,type GameFilmAssignment} from '@/lib/playoffs/highlights';
import PlayoffsExperience from '@/components/playoffs/playoffs-experience';
import {getTournament,verification} from '@/content/playoffs';
import {media,scenePhotoAssignments,previewPhotos,publicScenePhotos} from '@/content/site';
import {resolveScenePhoto} from '@/content/scene-photo-selection';
const canonical=(()=>{try{const url=new URL(process.env.SITE_URL??'');return url.protocol==='https:'&&!/(example|localhost|127\.0\.0\.1)/i.test(url.hostname)?`${url.origin}/playoffs/`:undefined;}catch{return undefined;}})();
export const metadata:Metadata={title:'Road to State | 2026 Anna Coyotes Playoffs | ZK17',description:'Follow Anna Coyotes football and the complete 2026 UIL 5A Division II playoff bracket. Official sources, verified results and every round on the road to state.',robots:{index:false,follow:false},...(canonical?{alternates:{canonical}}:{})};
export default function PlayoffsPage(){
 const tournament=getTournament();
 const films=publicGameFilms(gameFilmAssignments as GameFilmAssignment[],media,new Set(tournament.games.map(game=>game.id)));
 const photo=resolveScenePhoto('on-field',publicScenePhotos(scenePhotoAssignments,media),previewPhotos,process.env.PREVIEW_MEDIA_MODE!=='false');
 if(photo?.kind==='preview'){
  const base=photo.src.replace(/-706\.webp$/,'');
  preload(`${base}-706.avif`,{as:'image',type:'image/avif',imageSrcSet:`${base}-360.avif 360w, ${base}-540.avif 540w, ${base}-706.avif 706w`,imageSizes:'(max-width:700px) 75vw, 50vw',fetchPriority:'high'});
 }else if(photo)preload(photo.src,{as:'image',fetchPriority:'high'});
 return <PlayoffsExperience tournament={tournament} films={films} checkedAt={verification.checkedAt} verificationScope={verification.scope} photo={photo??null}/>;
}
