import type {Metadata} from 'next';
import PlayoffsExperience from '@/components/playoffs/playoffs-experience';
import {getTournament,verification} from '@/content/playoffs';
import {media,scenePhotoAssignments,previewPhotos,publicScenePhotos} from '@/content/site';
import {resolveScenePhoto} from '@/content/scene-photo-selection';
export const metadata:Metadata={title:'Road to State | 2026 Anna Coyotes Playoffs | ZK17',description:'Follow Anna Coyotes football and the complete 2026 UIL 5A Division II playoff bracket. Official sources, verified results and every round on the road to state.',robots:{index:false,follow:false}};
export default function PlayoffsPage(){
 const photo=resolveScenePhoto('on-field',publicScenePhotos(scenePhotoAssignments,media),previewPhotos,process.env.PREVIEW_MEDIA_MODE!=='false');
 return <PlayoffsExperience tournament={getTournament()} checkedAt={verification.checkedAt} verificationScope={verification.scope} photo={photo??null}/>;
}
